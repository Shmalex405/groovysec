# Deployment Models Overview

Whiteout AI runs wherever your security and compliance requirements need it to. The platform ships in three deployment models — all running the same application code, with the same per-organization isolation and encryption guarantees. The difference is where the infrastructure lives and who operates it.

This page gives you a high-level view of each model so you can decide which one fits your organization. Detailed setup guides are linked where available.

## The Three Models

### 1. Whiteout-Hosted SaaS

**Generally available.** The default deployment model. Whiteout operates all infrastructure in Whiteout's own AWS environment, and your team gets a fully managed service with nothing to install or maintain on the infrastructure side.

Despite being a managed service, this is not a typical shared-everything SaaS. Every organization receives its own isolated resource stack:

- **A dedicated organization endpoint** — your organization's traffic is served at its own subdomain (for example, `yourorg.api.whiteout.groovysec.com`), and requests are routed only to your organization's resources.
- **Isolated data stores** — your organization's database and file storage are dedicated to you. There are no shared databases or shared storage between customers.
- **Per-organization encryption keys** — all of your data at rest is encrypted with a key unique to your organization (see [Encryption Posture](#encryption-posture) below).
- **Dedicated policy evaluation** — compliance evaluation for your prompts runs on compute dedicated to your organization; it is not pooled with other tenants.

Whiteout handles provisioning, scaling, patching, monitoring, and updates. This is the fastest path to production and the right choice for most organizations.

### 2. Self-Hosted (Your AWS Account)

**Available.** The full platform runs inside your own AWS account, in your own VPC, under your control. Whiteout provides the application as container images pulled from Whiteout's private registry, and your team (or ours, working with you) deploys them into your environment.

What you control:

- **Your AWS account and region** — all customer data stays in infrastructure you own, in the region you choose.
- **Your network** — the platform runs inside your VPC under your network policies.
- **Your encryption keys** — resources are encrypted with KMS keys in your account.

What Whiteout provides:

- Container images and release updates from Whiteout's registry — updates can be pulled automatically or applied on your own schedule.
- License validation against Whiteout's licensing API.
- Deployment tooling and support throughout setup.

For the full walkthrough — prerequisites, IAM setup, provisioning, and update configuration — see the [Self-Hosted AWS Deployment guide](./deployment/self-hosted-aws.md).

### 3. LAN-Hosted (Air-Gapped On-Premises)

For regulated environments that cannot use cloud infrastructure at all, Whiteout AI can be deployed entirely on your premises — including fully air-gapped networks with no cloud dependency. Policy evaluation, including the platform's dedicated 27B-parameter compliance model, runs locally on your hardware.

LAN-Hosted deployments are scoped individually because hardware, network, and update logistics vary by environment. If you operate in a classified, air-gapped, or otherwise disconnected environment, [contact us](https://groovysec.com/demo) to discuss requirements and scoping.

## Comparison at a Glance

| | Whiteout-Hosted SaaS | Self-Hosted (Your AWS) | LAN-Hosted (On-Prem) |
|---|---|---|---|
| **Data residency** | Whiteout's AWS environment, isolated per organization | Your AWS account, your region | Your data center |
| **Who operates it** | Whiteout | Your team (with Whiteout support) | Your team (with Whiteout support) |
| **Network posture** | Internet-facing dedicated org endpoint over TLS 1.3 | Inside your VPC, under your network policies | Fully isolated LAN; air-gap supported |
| **Update mechanism** | Managed continuously by Whiteout | Pulled from Whiteout's registry — automatic or on your schedule | Coordinated releases, defined during scoping |

All three models run the same application code and enforce the same per-organization encryption guarantees.

## What Stays the Same Across Models

Choosing a more isolated deployment model does not mean giving up product capability. Across all three models you get:

- **The same policy library and enforcement engine** — policies behave identically whether evaluation happens in Whiteout's cloud, your AWS account, or your data center.
- **The same admin dashboard** — policy management, user administration, and reporting work the same way everywhere.
- **The same integrations** — data-source connectors, SSO providers, SOC/SIEM destinations, and MDM-based agent deployment are available in every model (in air-gapped environments, integrations are naturally limited to what your network can reach).
- **The same encryption guarantees** — TLS 1.3 in transit, KMS-backed encryption at rest, and application-layer envelope encryption for sensitive fields apply in every model.
- **The same audit trail** — every enforcement decision is logged, and audit events can stream to your SIEM regardless of where the platform runs.

## Per-Organization Isolation

Isolation in Whiteout AI is structural, not just logical. In the Whiteout-Hosted model, each organization is provisioned as its own resource stack rather than as rows in a shared database:

- **Dedicated endpoints.** Each organization gets its own API subdomain. Traffic for your organization is routed exclusively to your organization's stack.
- **Isolated data stores.** Databases and file storage are provisioned per organization. One customer's data never resides alongside another's.
- **Per-organization encryption keys.** Every organization's data is encrypted under its own key. Revoking a single organization's key renders that organization's data — and only that organization's data — unreadable, which also enables clean, verifiable offboarding.
- **Dedicated evaluation compute.** Prompt and content evaluation runs on compute assigned to your organization.

In Self-Hosted and LAN-Hosted models, isolation is even stronger by construction: the entire platform lives in infrastructure only you control.

## Encryption Posture

Whiteout AI applies encryption in layers, and the same guarantees hold across all three deployment models.

### In transit

All client and API traffic is encrypted with **TLS 1.3**. There are no unencrypted listeners.

### At rest

All stored data — databases, file storage, logs, and secrets — is encrypted with **KMS-backed encryption**, using a key unique to your organization. Keys support automatic rotation, and key usage is auditable.

### Application-layer envelope encryption

Sensitive fields — integration credentials such as OAuth tokens, API keys, and webhook secrets — are additionally encrypted at the application layer with an organization-specific key **before** they are ever written to the database. Even a hypothetical actor with direct database access would see only ciphertext for these fields.

### Bring Your Own Key (BYOK)

Organizations that need direct control over their encryption keys can supply a KMS key from their own AWS account. When BYOK is enabled, all of your organization's resources are encrypted under your key — you control rotation, access grants, and revocation, and you can audit every use of the key from your own account. See the [BYOK guide](./security/byok.md) for setup details.

## Choosing a Model

| If you need... | Choose |
|---|---|
| Fastest time to production, fully managed | Whiteout-Hosted SaaS |
| Managed service, but with your own encryption keys | Whiteout-Hosted SaaS + [BYOK](./security/byok.md) |
| Data residency in your own cloud account and region | [Self-Hosted AWS](./deployment/self-hosted-aws.md) |
| No cloud dependency at all / air-gapped operation | LAN-Hosted — [contact us](https://groovysec.com/demo) |

## Common Evaluation Questions

**Can we start on SaaS and move to Self-Hosted later?**
Yes. Because all models run the same application code, organizations commonly evaluate on Whiteout-Hosted SaaS and move to a Self-Hosted deployment for production. Talk to your account team about migration planning.

**Is our data used to train models?**
No. Customer prompts and content are used only for policy evaluation and your own audit trail. They are not used to train models.

**Who can access our data in the SaaS model?**
Your data is encrypted with keys unique to your organization, and access is limited to what is required to operate the service. With [BYOK](./security/byok.md), you hold the key: you can audit every use from your own AWS account and revoke access at any time.

## Next Steps

- Deploying into your own AWS account? Start with the [Self-Hosted AWS Deployment guide](./deployment/self-hosted-aws.md).
- Bringing your own encryption keys? See the [BYOK guide](./security/byok.md).
- Evaluating LAN-Hosted or air-gapped deployment? [Contact us](https://groovysec.com/demo) for scoping.

If you have questions about which model fits your compliance requirements, contact Whiteout AI support or your account team.
