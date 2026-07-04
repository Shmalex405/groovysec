# AWS Bedrock Integration Setup Guide

This guide walks you through connecting AWS Bedrock to Whiteout AI, enabling governance, policy enforcement, and audit for your Bedrock model and agent workloads.

## Overview

The AWS Bedrock integration allows Whiteout AI to:
- Evaluate prompts against your policy library **before** they reach Bedrock, blocking violations inline
- Audit every prompt and response from Bedrock Agents, with retrospective policy detection
- Author and manage AWS Bedrock Guardrails from your Whiteout AI policy library, enforced natively by AWS
- Surface all Bedrock activity in the Whiteout AI dashboard with per-call flagging

### Coverage Options

Whiteout AI covers Bedrock through three independent paths. Enable the ones that match your workloads — you do not have to enable all of them.

| You have… | Enable | What you get |
|-----------|--------|--------------|
| Lambda / EC2 / ECS / EKS code that calls `boto3.client('bedrock-runtime')` | **SDK Inline Enforcement** | Pre-call policy evaluation; blocked prompts never reach Bedrock |
| Bedrock Agents (managed runtime — `InvokeAgent`) | **Invocation Log Ingest** | Full audit and retrospective detection of every prompt and response |
| Bedrock Agents, plus you want Whiteout-managed inline enforcement | **Whiteout-Managed Guardrails** (additive to Log Ingest) | Whiteout AI authors Bedrock Guardrails from your policy library; AWS enforces them inline |

**Note:** Whiteout-Managed Guardrails requires the Invocation Log Ingest setup to be completed first, because the two share the same cross-account trust configuration.

### Deployment Shapes (Log Ingest and Guardrails)

The Whiteout ingest worker that reads your Bedrock invocation logs can run in one of two places. Choose once per AWS account/region:

| Shape | Worker runs in | When to choose |
|-------|----------------|----------------|
| **Centralized** | Whiteout's governance AWS account | Default. Lowest operational burden. Whiteout reads your Bedrock logs via cross-account `AssumeRole` |
| **Customer-VPC** | Your own AWS account | EU / data-residency requirements. Prompt content never crosses an AWS account boundary; you operate the worker container |

Both shapes use the same Terraform stack and the same worker binary — the only difference is where the worker runs and which account ID goes into the trust policy.

## Prerequisites

Before you begin, ensure you have:
- **AWS account** containing the Bedrock workloads to govern, with administrative access
- **Bedrock model access enabled** in the target region (Bedrock console > **Model access** — a one-time action; IAM policy alone does not grant model access)
- **Terraform 1.5+** and **AWS provider 5.0+** (for Log Ingest and Guardrails)
- **A 16+ character external ID** of your choosing, used as the `sts:ExternalId` guard for cross-account role assumption — generate one with `openssl rand -hex 16` and store it securely
- **Whiteout AI Admin** privileges

---

## Option 1: SDK Inline Enforcement

This is the highest-value path because Whiteout AI is directly in the request path: prompts are evaluated by the policy engine **before** they reach Bedrock, so blocked calls never execute.

### Step 1: Attach the Whiteout Lambda Layer

Whiteout AI publishes a Lambda layer per region. Get the layer ARN for your region from your Whiteout AI representative, then attach it to each Lambda function that calls Bedrock:

```hcl
resource "aws_lambda_function" "my_bedrock_caller" {
  function_name = "my-bedrock-caller"
  runtime       = "python3.11"
  # ...

  layers = [
    "arn:aws:lambda:us-east-1:<WHITEOUT_ACCOUNT_ID>:layer:whiteout-ai:<VERSION>"
  ]
}
```

The layer supports Python 3.11 and 3.12 runtimes. Functions pinned to an older layer version continue to work; upgrade when ready.

### Step 2: Set Environment Variables

| Variable | Value |
|----------|-------|
| `WHITEOUT_TOKEN` | Enrollment token from the Whiteout AI admin console |
| `WHITEOUT_BACKEND_URL` | Your Whiteout AI backend URL, e.g. `https://your-org.api.whiteout.groovysec.com` |
| `WHITEOUT_FAIL_OPEN` | `true` (default) or `false` — when the backend is unreachable, allow or block? |

### Step 3: Wrap Your Bedrock Client

In your Lambda handler:

```python
import boto3
from whiteout_ai_lambda import guard

# One-time at module scope — amortizes cold-start across warm invocations
bedrock = guard.wrap_boto3_bedrock(boto3.client("bedrock-runtime"))

def lambda_handler(event, context):
    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-haiku-20240307-v1:0",
        body=...,
    )
    return response
```

`wrap_boto3_bedrock` validates that the client is `bedrock-runtime` (not the `bedrock` control plane) and governs all four invocation methods automatically: `invoke_model`, `invoke_model_with_response_stream`, `converse`, and `converse_stream`.

### Other Compute (EC2 / ECS / EKS / Batch)

For non-Lambda compute, install the SDK directly:

```sh
pip install whiteout-ai
```

```python
from whiteout_ai import WhiteoutGuard

guard = WhiteoutGuard(
    token="whiteout_enroll_...",
    backend_url="https://your-org.api.whiteout.groovysec.com",
)
bedrock = guard.wrap_boto3_bedrock(boto3.client("bedrock-runtime"))
```

---

## Option 2: Invocation Log Ingest (Bedrock Agents)

This option governs `InvokeAgent` traffic, where AWS's managed agent runtime calls models on your behalf. Because your code is not in the request path, these calls cannot be blocked inline — instead, Whiteout AI provides full audit, retrospective policy detection, and SOC delivery. For inline enforcement of agent traffic, add Whiteout-Managed Guardrails (Option 3).

### Step 1: Generate an External ID

```sh
openssl rand -hex 16
```

Save this value — you will hand it to Whiteout AI in Step 4, and it must match what you configure in Terraform.

### Step 2: Apply the Whiteout Terraform Module

Whiteout AI provides a Terraform module for the customer-side stack. Get the module source URL from your Whiteout AI representative, then apply:

```hcl
module "whiteout_bedrock" {
  source = "<MODULE_SOURCE_URL>"   # provided by Whiteout AI

  region              = "us-east-1"
  deployment_id       = "acme"                # short identifier; lowercase + hyphens
  whiteout_account_id = "<WHITEOUT_ACCOUNT_ID>"  # provided by Whiteout AI (Centralized)
                                                 # or your own account ID (Customer-VPC)
  external_id         = "a3f9b2c8d1e4f7a6..."    # from Step 1

  # Optional: CloudTrail data events for full agent envelope correlation
  # (adds ~$0.10 per 100k events)
  enable_cloudtrail_data_events = false

  # Optional: enable Whiteout-Managed Guardrails (Option 3).
  # Provisions a second IAM role for guardrail authoring.
  enable_guardrail_authoring = false
}

output "whiteout_summary" {
  value     = module.whiteout_bedrock.summary
  sensitive = true
}
```

```sh
terraform init
terraform apply
```

The module provisions:
- An S3 bucket for Bedrock invocation logs (versioned, AES256-encrypted, public access blocked, lifecycle expiry per `log_retention_days`, default 30)
- An SQS queue plus dead-letter queue (5 redelivery attempts before DLQ)
- An S3-to-SQS `ObjectCreated` notification
- Bedrock model invocation logging in the target region (text bodies only — embeddings, images, and video are excluded)
- A cross-account IAM role for the Whiteout ingest worker, gated on `sts:ExternalId`
- Optional: CloudTrail data events for Bedrock agent aliases, knowledge bases, and flow aliases
- Optional: a second IAM role for guardrail authoring

### Step 3: Understand the Cross-Account Trust

The IAM role created by the module trusts **only** the Whiteout governance account, and **only** when the request presents your external ID. The trust policy is equivalent to:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::<WHITEOUT_ACCOUNT_ID>:root" },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": { "sts:ExternalId": "<your external_id>" }
      }
    }
  ]
}
```

The role's permissions are read-only and scoped to the log pipeline (see [Security Considerations](#security-considerations)). It has no Bedrock permissions and no access to any other resource in your account (`123456789012`).

### Step 4: Send Connection Details to Whiteout AI

```sh
terraform output -raw whiteout_summary
```

Send these values to your Whiteout AI contact:

| Value | Notes |
|-------|-------|
| `ingest_role_arn` | e.g. `arn:aws:iam::123456789012:role/whiteout-bedrock-acme-ingest` |
| `sqs_queue_url` | e.g. `https://sqs.us-east-1.amazonaws.com/123456789012/whiteout-bedrock-acme-queue` |
| `region` | The region you deployed to |
| `external_id` | **Deliver via a secure channel** (password manager share or the Whiteout AI admin console) — it is intentionally excluded from the Terraform output |
| `cloudtrail_bucket` | Only if `enable_cloudtrail_data_events = true` |
| `guardrail_author_role_arn` | Only if `enable_guardrail_authoring = true` |

Whiteout AI then deploys and operates the ingest worker (Centralized shape). It registers in your dashboard under **Infrastructure** > **Agents** as `bedrock_agent_ingest`.

### Customer-VPC Deployment

If you chose the Customer-VPC shape, you run the same worker container in your own account:

1. Set `whiteout_account_id` in the Terraform module to **your own** account ID (`123456789012`), so the role trusts your account
2. Run the Whiteout-provided worker container in your VPC using ambient AWS credentials (instance role, IRSA, etc.)
3. Configure the worker environment:

| Variable | Required | Value |
|----------|----------|-------|
| `WHITEOUT_TOKEN` | Yes | Enrollment token from the Whiteout AI admin console |
| `WHITEOUT_BACKEND_URL` | Yes | Your Whiteout AI backend URL |
| `WHITEOUT_BEDROCK_REGION` | Yes | Region from the Terraform output |
| `WHITEOUT_BEDROCK_SQS_QUEUE_URL` | Yes | `sqs_queue_url` from the Terraform output |
| `WHITEOUT_BEDROCK_CLOUDTRAIL_BUCKET` | Optional | Only if CloudTrail data events are enabled |

In this shape, prompt content never leaves your AWS account except via the standard HTTPS activity submission to your Whiteout AI backend.

---

## Option 3: Whiteout-Managed Bedrock Guardrails

This option is additive to Invocation Log Ingest. Whiteout AI translates your policy library into native AWS Bedrock Guardrails and attaches them to your agents, so AWS enforces policies **inline** — replacing the model output with a block message before it reaches your application. Rules that do not map cleanly to Bedrock primitives (for example, semantic PHI rules) continue to be enforced by the Whiteout retrospective evaluator, giving you defense in depth.

### Step 1: Enable Guardrail Authoring in Terraform

Re-apply the module from Option 2 with the flag enabled:

```hcl
module "whiteout_bedrock" {
  # ...existing arguments...
  enable_guardrail_authoring = true
}
```

```sh
terraform apply
terraform output -raw whiteout_summary
```

This provisions a second, separate IAM role for guardrail authoring. Note the new `guardrail_author_role_arn` in the summary. The same external ID covers both roles — you manage one secret.

### Step 2: Register the Guardrail in Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Infrastructure** > **Bedrock Guardrails**
3. Click **Register guardrail** and fill in:

| Field | Value |
|-------|-------|
| **AWS account ID** | Your 12-digit account ID (e.g. `123456789012`) |
| **Region** | Select from the dropdown |
| **Author role ARN** | The `guardrail_author_role_arn` from your Terraform output |
| **External ID** | Your external ID (encrypted at rest; never displayed again after registration) |
| **Policy categories** | Check the categories to push. Each shows `(X/Y inline)` — how many rules map cleanly to Bedrock primitives out of the category total |
| **Strict mode** | Leave on (recommended). Off auto-translates semantic rules into Bedrock denied topics, which may increase false positives |
| **Sync immediately** | Leave on for the first registration |

4. Click **Register + sync**. Whiteout AI translates the selected policies into a Bedrock guardrail configuration, creates (or updates) the guardrail in your account, and snapshots it as a numbered version
5. The sync-result dialog shows the guardrail ID and version, how many rules are enforced inline at Bedrock versus retrospectively, and the full list of unmapped rules (which remain covered by the retrospective evaluator)

### Step 3: Attach to Agents

1. On the guardrail card, click **Attach agent**
2. The dialog lists agents discovered in your account, each with its name, ID, status, and a warning chip if a different guardrail is currently attached
3. Pick an agent, and optionally an alias:
   - **With an alias**: Whiteout AI re-points the alias to the new agent version so live traffic immediately picks up the guardrail
   - **Without an alias**: Whiteout AI snapshots a new agent version without changing live routing
4. Click **Attach**. Bedrock's `PrepareAgent` takes 10–60 seconds; Whiteout AI polls until the agent status is `PREPARED`

### Ongoing Sync

When your policy library changes, click **Sync** on the guardrail card to publish a new guardrail version. Attached agents continue running their previously attached version — you choose when to re-attach with the new version, making updates rollback-safe by default.

---

## Verification

### SDK Inline Enforcement

1. Send a known-benign prompt (e.g., `"What is 2+2?"`) — the model response should return normally
2. Send a known-violating prompt (e.g., one containing an SSN) — expect a `WhiteoutBlockedError` raised **before** Bedrock is called
3. Check **Infrastructure** > **Activity** in the Whiteout AI dashboard — both calls appear with `ai_provider=bedrock`, the blocked one with the **"Whiteout flagged"** chip

### Invocation Log Ingest

1. Fire a test `InvokeAgent` against your Bedrock Agent
2. Wait 30–60 seconds for Bedrock to write the invocation log and for the queue to deliver it
3. Check **Infrastructure** > **Hosted Agents** > **Bedrock** — the row should show the agent alias, model, and prompt text
4. If CloudTrail data events are enabled, a separate row represents the `InvokeAgent` envelope itself (no prompt content, model labeled `(agent)`)

### Whiteout-Managed Guardrails

1. Send a prompt through the attached agent that violates a selected category (e.g., contains an SSN) — the caller receives the configured block message instead of the model response
2. Within 30–60 seconds, the row appears in **Infrastructure** > **Hosted Agents** > **Bedrock** with the **"Bedrock blocked"** chip (filled red)
3. Send a prompt that violates a rule **not** translated to Bedrock primitives — Bedrock allows it inline, and it appears shortly after with the outlined **"Whiteout flagged"** chip, confirming both layers of defense are working

---

## Troubleshooting

### "wrap_boto3_bedrock requires a bedrock-runtime client" Error

- You wrapped `boto3.client('bedrock')` (control plane) instead of `boto3.client('bedrock-runtime')` (invocation plane) — wrap the latter

### SDK Prompts Not Appearing in the Dashboard

- Confirm `WHITEOUT_TOKEN` and `WHITEOUT_BACKEND_URL` are set and the layer is attached
- Check CloudWatch logs for the Lambda — registration errors surface there

### Increased Lambda Cold-Start Latency

- The SDK performs one registration HTTP call on cold start; warm invocations reuse it
- Consider provisioned concurrency or keep-warm if cold starts matter

### No Rows in Hosted Agents > Bedrock

1. Confirm Bedrock model invocation logging is enabled in the target region (Bedrock console > **Settings** > **Model invocation logging**)
2. Check the S3 bucket — invocation log objects under the `bedrock-invocation-logs/` prefix should appear within seconds of each Bedrock call
3. Check the SQS queue depth (`aws sqs get-queue-attributes`) — a growing backlog means events are arriving but not being processed
4. Check the dead-letter queue — messages there indicate persistent processing failures; contact Whiteout AI support

### AssumeRole Errors

- Verify the external ID you delivered to Whiteout AI matches the `external_id` you set in Terraform
- Verify the role's trust policy includes the correct `whiteout_account_id`

### Unknown Model Family Warnings

- If AWS releases a new model family before decoding support lands, activity is still recorded with `provider=bedrock` and prompt extraction falls back to common fields — contact Whiteout AI support to request the family-specific mapping

### Guardrail Sync Fails with "AssumeRole denied"

- Confirm `enable_guardrail_authoring = true` was applied and the author role exists in IAM
- Re-check the external ID and account ID entered at registration

### Guardrail Sync Fails with "ServiceQuotaExceededException"

- Bedrock enforces limits of 30 denied topics and 10,000 words per guardrail
- Strict mode (the default) avoids this; if you disabled it, reduce the selected policy categories

### Agent Not Picking Up the Guardrail

- `PrepareAgent` runs asynchronously; Whiteout AI polls for up to 120 seconds by default
- Verify `bedrock:GetAgent` shows `agentStatus=PREPARED` and the alias routing points to the new agent version

---

## Security Considerations

### Cross-Account Access

- Both IAM roles trust only the Whiteout governance account, and only when the request presents your `sts:ExternalId`
- The two roles follow least privilege per concern: the ingest role has **no Bedrock write permissions**, and the guardrail-author role has **no S3 or SQS access**

### Permissions Granted

The **ingest role** (always provisioned) can only:
- Receive, delete, and inspect messages on the invocation-log queue (`sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueAttributes`)
- Read objects in the invocation-log bucket (`s3:GetObject`, `s3:ListBucket`), plus the CloudTrail bucket if enabled

The **guardrail-author role** (only with `enable_guardrail_authoring = true`) can:
- Create, update, version, delete, and list guardrails in your account
- Read agents and aliases (`bedrock:GetAgent`, `ListAgents`, `GetAgentAlias`, `ListAgentAliases`)
- Update and prepare agents and aliases to attach guardrails
- Pass roles only to `bedrock.amazonaws.com` (`iam:PassRole` gated by `iam:PassedToService`, required because updating an agent re-specifies its execution role)

### External ID Handling

- Treat the external ID as a secret — deliver it to Whiteout AI via a secure channel, never in plain email or the Terraform output
- Whiteout AI encrypts it at rest and never displays it again after registration

### Data Handling

- Invocation logging captures **text bodies only** — embeddings, images, and video are excluded
- Log objects expire from S3 per `log_retention_days` (default 30 days)
- For data-residency requirements, use the Customer-VPC deployment shape so prompt content never crosses an AWS account boundary

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Infrastructure** > **Bedrock Guardrails** > **Detach** each agent listed on the guardrail card
   - Click **Delete** on the guardrail card (this removes Whiteout AI's tracking record but does not delete the AWS-side guardrail)
   - Ask your Whiteout AI contact to stop the ingest worker (Centralized), or stop your own worker (Customer-VPC)

2. **In AWS:**
   - (Optional) Delete the leftover Bedrock guardrail in the console or via `aws bedrock delete-guardrail`
   - Run `terraform destroy` on the customer stack — the S3 buckets are versioned, so empty them (including noncurrent versions) first if `force_destroy_bucket` is off, which is the production default

3. **Clean up:**
   - Rotate the external ID if you plan to re-enable the integration later
   - Remove the Whiteout Lambda layer and environment variables from any functions using SDK inline enforcement
