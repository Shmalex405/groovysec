# Azure Sentinel Destination Setup Guide

This guide walks you through configuring Microsoft Sentinel as a SOC/SIEM destination in Whiteout AI, ingesting audit events into Azure Log Analytics for threat detection, investigation, and automated response.

## Overview

The Azure Sentinel destination allows Whiteout AI to:
- Ingest audit events into Microsoft Sentinel (formerly Azure Sentinel) through the Azure Monitor Logs Ingestion API
- Use a Data Collection Endpoint (DCE) and Data Collection Rule (DCR) to land events in a custom Log Analytics table
- Correlate AI governance events with other security signals in Sentinel
- Power analytics rules, workbooks, and automated playbooks with Whiteout AI event data

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- An **Azure subscription** with Microsoft Sentinel enabled on a Log Analytics workspace
- **Microsoft Entra ID** permissions to create app registrations (Application Administrator or Global Administrator role)
- Permission to create Data Collection Endpoints and Rules and to assign roles on them (for example **Contributor** plus **User Access Administrator** on the resource group)

---

## Third-Party Setup

### Step 1: Create a Data Collection Endpoint (DCE)

1. In the [Azure Portal](https://portal.azure.com), search for **Data Collection Endpoints**
2. Click **Create**
3. Configure the endpoint:

| Field | Value |
|-------|-------|
| **Name** | `whiteout-ai-dce` |
| **Subscription** | Your subscription |
| **Resource Group** | Your resource group |
| **Region** | Same region as your Log Analytics workspace |

4. Click **Review + Create**, then **Create**
5. Open the DCE and copy the **Logs ingestion** endpoint URL (e.g., `https://whiteout-ai-dce-xxxx.eastus-1.ingest.monitor.azure.com`)

### Step 2: Create the Custom Table and Data Collection Rule

Whiteout AI sends each event as a JSON object whose top-level fields depend on the event type (see [Events delivered](#events-delivered)). The table needs a column for each top-level field you want to keep; fields not declared in the DCR are dropped.

1. Save the following sample as `whiteout-sample.json`. It lists every top-level field Whiteout AI sends:

```json
[
  {
    "event_type": "prompt_log",
    "timestamp": "2026-09-28T12:00:00",
    "event_id": "0b7e6a52-3c1d-4f0e-9a6b-2d8f1e4c7a90",
    "severity": "high",
    "subtype": "shadow_ai",
    "finding_type": "",
    "recommended_action": "",
    "url": "https://app.example.com/",
    "organization": { "id": "" },
    "group": { "id": "", "name": "" },
    "user": { "id": "", "email": "" },
    "source": { "type": "", "ai_tool": "", "model": "" },
    "prompt": { "text": "", "chat_id": "" },
    "response": { "text": "", "id": "" },
    "compliance": { "was_blocked": false, "was_overridden": false, "risk_findings": [], "policy_violation_reason": "" },
    "connector": { "tool": "", "integration_id": "" },
    "vetting": { "blocked_count": 0 },
    "report": { "name": "", "status": "" },
    "detection": { "action": "", "categories": [] },
    "ai_tool": { "catalog_key": "", "category": "" },
    "observation": { "days_observed": 0 },
    "evidence": {}
  }
]
```

2. Navigate to your **Log Analytics workspace** > **Settings** > **Tables**
3. Click **Create** > **New custom log (DCR-based)**
4. Configure the table:

| Field | Value |
|-------|-------|
| **Table name** | `WhiteoutAI` (Azure adds the suffix, giving `WhiteoutAI_CL`) |
| **Data collection rule** | **Create a new data collection rule**, e.g. `whiteout-ai-dcr` |
| **Data collection endpoint** | `whiteout-ai-dce` from Step 1 |

5. On the **Schema and transformation** page, upload `whiteout-sample.json`
6. Open the **Transformation editor** and enter:
   ```kql
   source
   | extend TimeGenerated = todatetime(timestamp)
   ```
7. Click **Run**, then **Apply**, then **Next** and **Create**
8. Open the new Data Collection Rule and copy the **Immutable ID** from its **Overview** page (e.g., `dcr-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

The wizard creates a stream named `Custom-WhiteoutAI_CL` in the DCR. Whiteout AI always sends to the stream `Custom-<Custom Table>`, so the table name you enter in Whiteout AI must match it exactly. If you build the DCR another way (ARM template, Bicep, CLI), declare a stream with that name.

### Step 3: Register a Microsoft Entra Application

Create a service principal for Whiteout AI to authenticate:

1. Navigate to **Microsoft Entra ID** > **App registrations**
2. Click **New registration**
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI Event Ingestion` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI** | Leave blank |

4. Click **Register**
5. On the app's **Overview** page, copy:
   - **Application (client) ID**
   - **Directory (tenant) ID**

### Step 4: Create a Client Secret

1. In the app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Configure:

| Field | Value |
|-------|-------|
| **Description** | `Whiteout AI DCR ingestion` |
| **Expires** | 24 months (or per your security policy) |

4. Click **Add**
5. Copy the **Secret Value** immediately (it will not be shown again)

### Step 5: Assign Permissions on the DCR

Grant the service principal permission to send data through the DCR:

1. Open the Data Collection Rule created in Step 2
2. Go to **Access control (IAM)**
3. Click **Add** > **Add role assignment**
4. Select the role **Monitoring Metrics Publisher**
5. Under **Members**, select **User, group, or service principal**
6. Search for and select `Whiteout AI Event Ingestion` (the app from Step 3)
7. Click **Review + assign**

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Go to **Integrations** > **Security Ops Destinations** and click **Add Destination**
3. Fill in the dialog:

| Field | Description |
|-------|-------------|
| **Destination Type** | **Microsoft Sentinel (DCR)** |
| **Display Name** | A name for this destination, e.g. `Sentinel` |
| **Prompt content** | **Full text** (default), **Hash only** or **Redacted**. See [Privacy settings](#privacy-settings). |
| **User identity** | **Include email** (default), **Remove email** or **Tokenize**. See [Privacy settings](#privacy-settings). |
| **DCE Endpoint URL** | The Logs ingestion endpoint from Step 1, without a trailing slash |
| **DCR Immutable ID** | The DCR's Immutable ID from Step 2 (starts with `dcr-`; not the resource ID) |
| **Client ID** | Application (client) ID from Step 3 |
| **Client Secret** | Secret value from Step 4 |
| **Azure Tenant ID** | Directory (tenant) ID from Step 3 |
| **Custom Table (e.g., WhiteoutAI_CL)** | The custom table name including `_CL`, e.g. `WhiteoutAI_CL`. Events are sent to the stream `Custom-WhiteoutAI_CL`. |
| **Enabled** | On to start delivering as soon as the destination is saved |

4. Click **Test Connection**. Whiteout AI checks that it can get a token for your app registration. The test doesn't send an event, so it doesn't check the DCE, DCR, stream or role assignment; use the end-to-end test in [Verification](#verification) for those.
5. Click **Create**

When you edit a saved destination, the **Client Secret** shows `****`. **Test Connection** then uses the saved secret, so you only need to re-enter it to change it.

> **Destinations created before this release.** Sentinel destinations saved from an earlier version of the dialog now deliver without being re-entered. Open one with **Edit** to confirm the **Custom Table** matches your DCR stream.

---

## Events delivered

Every event goes to your **Custom Table**, one row per event, whatever its type. Filter on the `event_type` column:

| `event_type` | When it's sent |
|--------------|----------------|
| `prompt_log` | Each governed prompt: allowed, flagged or blocked |
| `prompt_overridden` | A user overrides a block (the block was already sent as `prompt_log`) |
| `coverage_gap` | Shadow-AI discovery opens a coverage-gap finding |
| `connector_vetting_action` | The [Whiteout AI Connector](./whiteout-ai-connector/overview.md) blocks or omits content |
| `report` | A scheduled report run that lists this destination as a **SOC destination** |
| `prompt_injection_detection` | A [Prompt Injection Defense](./injection-defense/overview.md) detection |

Infrastructure agent state alerts are not sent to Sentinel. The event fields are described in [Webhook → Events delivered](./soc-destinations/webhook.md#events-delivered), and the labels on every destination in [Event type labels](./soc-destinations/webhook.md#event-type-labels).

Prompt events are batched (500 events or 5 seconds by default); other events are sent as they occur. Transient failures (connection errors, timeouts, `5xx`) are retried, and after 10 consecutive failed deliveries the destination is disabled and admins get a Notification Center alert.

---

## Privacy settings

Every destination has two privacy settings, under **Privacy** in the destination dialog. They apply to every event of every type, before it's sent:

| Setting | Option (`config` value) | Effect |
|---------|-------------------------|--------|
| **Prompt content** (`prompt_visibility`) | **Full text** (`full`, default) | Prompt and response text are sent as captured |
| | **Hash only** (`hash_only`) | Prompt text, response text and injection excerpts become `sha256:<hash>`. Identical prompts can be matched, but not read. |
| | **Redacted** (`redacted`) | Only masked text is sent. A prompt with policy findings is sent with the policy-matched parts masked and the rest of the prompt unchanged. A prompt with no findings, or one that couldn't be masked, is sent as `[CONTENT_REDACTED]`. Response text is always sent as `[RESPONSE_REDACTED]`, and injection excerpts as `[CONTENT_REDACTED]`. |
| **User identity** (`pii_mode`) | **Include email** (`allow`, default) | `user.email` is sent as is |
| | **Remove email** (`strip`) | `user.email` is removed (`null`) from every event |
| | **Tokenize** (`tokenize`) | `user.email` becomes a stable token, `[USER_<hash>]`, in every event, so one user's events can be correlated without revealing who they are |

Masking is done by the Whiteout AI compliance engine and is best-effort. If no prompt text at all may leave Whiteout AI, choose **Hash only**.

The destination card shows the active settings, for example **Privacy: Full text prompts · include email**.

---

## Verification

1. **Connection Test**: Click **Test Connection** in the dialog, or **Send Test** on the destination card, to confirm authentication.
2. **End-to-End Test**: Submit a prompt through a governed AI tool.
3. **Log Analytics Query**: Allow a few minutes for ingestion, then run in your workspace:
   ```kql
   WhiteoutAI_CL
   | where TimeGenerated > ago(1h)
   | project TimeGenerated, event_type, user, source, compliance
   | order by TimeGenerated desc
   ```
4. **Destination card**: **Last Delivery** shows the time of the last successful delivery and **Last Error** the most recent failure (for example a `403` from a missing role assignment or a `404` for a stream name that doesn't exist in the DCR).
5. **Sentinel Incidents**: If you have analytics rules configured, verify that matching events trigger incidents.

---

## Prompt injection detection events

[Prompt Injection Defense](./injection-defense/overview.md) detections are sent as `prompt_injection_detection` events to your **Custom Table**, with your other Whiteout events:

```kql
WhiteoutAI_CL
| where TimeGenerated > ago(24h)
| where event_type == "prompt_injection_detection"
| project TimeGenerated, severity, detection, source, user, url
| order by TimeGenerated desc
```

Keep the `severity`, `detection` and `url` columns in your table (they're in the sample in Step 2). The fields, severity mapping and privacy settings are described in [Webhook → Prompt injection detection events](./soc-destinations/webhook.md#prompt-injection-detection-events).

---

## Configuring through the API

If you manage destinations through the Whiteout AI API rather than the dialog, use `type` `sentinel` and these `config` keys:

| Dialog field | `config` key |
|--------------|--------------|
| **DCE Endpoint URL** | `dce_endpoint` |
| **DCR Immutable ID** | `dcr_id` (the older name `dcr_immutable_id` is also accepted) |
| **Client ID** | `client_id` |
| **Client Secret** | `client_secret` |
| **Azure Tenant ID** | `tenant_id` |
| **Custom Table** | `table_name` (the older name `table` is also accepted) |
| **Prompt content** | `prompt_visibility`: `full` (default), `hash_only` or `redacted` |
| **User identity** | `pii_mode`: `allow` (default), `strip` or `tokenize` |

The dialog always sets a **Custom Table**, and every event type goes to it. If `table_name` is omitted through the API, each event type goes to its own table and stream (see [Event type labels](./soc-destinations/webhook.md#event-type-labels)), each needing a matching `Custom-<table>` stream in the DCR:

| `event_type` | Table | DCR stream |
|--------------|-------|------------|
| `prompt_log` | `WhiteoutAI_PromptLogs_CL` | `Custom-WhiteoutAI_PromptLogs_CL` |
| `prompt_overridden` | `WhiteoutAI_PromptOverrides_CL` | `Custom-WhiteoutAI_PromptOverrides_CL` |
| `connector_vetting_action` | `WhiteoutAI_ConnectorVetting_CL` | `Custom-WhiteoutAI_ConnectorVetting_CL` |
| `coverage_gap` | `WhiteoutAI_CoverageGap_CL` | `Custom-WhiteoutAI_CoverageGap_CL` |
| `report` | `WhiteoutAI_Reports_CL` | `Custom-WhiteoutAI_Reports_CL` |
| `prompt_injection_detection` | `WhiteoutAI_PromptInjection_CL` | `Custom-WhiteoutAI_PromptInjection_CL` |
| Any new event type | `WhiteoutAI_<EventType>_CL` | `Custom-WhiteoutAI_<EventType>_CL` |

> **Changed in this release.** Overrides and connector vetting actions used to go to `WhiteoutAI_PromptLogs_CL`. A destination created through the API without a `table_name` now needs the `Custom-WhiteoutAI_PromptOverrides_CL` and `Custom-WhiteoutAI_ConnectorVetting_CL` streams (and their tables) in its DCR, or those events fail to deliver. Setting `table_name` avoids this.

Batching is set with the top-level `batching_max_events` (default `500`) and `batching_max_seconds` (default `5`). The client secret is returned masked as `****`; sending `****` back leaves it unchanged. The older top-level `privacy_profile_id` field is ignored if sent.

---

## Troubleshooting

### Authentication Errors

- Verify the **Client ID**, **Client Secret**, and **Azure Tenant ID** are correct
- Confirm the client secret has not expired
- Ensure the app registration is in the correct Microsoft Entra tenant

### "Forbidden" or "Authorization" Errors

- Verify the service principal has the **Monitoring Metrics Publisher** role on the DCR
- Allow up to 30 minutes for a new role assignment to take effect
- Check that the **DCR Immutable ID** is correct (not the resource ID)

### Events Not Appearing in Log Analytics

- Confirm the DCE endpoint URL is correct and reachable
- Verify the DCR has a stream named `Custom-<Custom Table>` exactly, e.g. `Custom-WhiteoutAI_CL`
- Check that the DCR's transformation sets `TimeGenerated`
- Review **Azure Monitor** > **Data Collection Rules** > **Metrics** for ingestion errors
- Check **Last Error** on the destination card, and whether the destination has been disabled after repeated failures
- Without a **Custom Table** (API only), check the DCR has a stream for every event type (see [Configuring through the API](#configuring-through-the-api))

### Destination Stopped Delivering After an Edit

- If a destination stopped delivering after you edited and saved it (before this release), its saved client secret was damaged by the edit. Open it with **Edit**, re-enter the **Client Secret**, and save. Editing no longer affects a secret you leave as `****`.

### Missing Columns

- Fields that aren't declared in the DCR stream are dropped. Add the missing top-level field (for example `detection` or `severity`) to the table and the DCR stream declaration.

### Network Connectivity Issues

- Verify that Whiteout AI can reach the DCE endpoint over HTTPS (port 443)
- If the DCE uses private endpoints, it must still be reachable from Whiteout AI

---

## Security Considerations

- **Use Short-Lived Secrets**: Set client secret expiry to the shortest acceptable duration and rotate before expiration.
- **Principle of Least Privilege**: Assign only the **Monitoring Metrics Publisher** role to the service principal, scoped to the specific DCR, not the subscription or resource group.
- **Limit Content**: Use **Prompt content** and **User identity** to send only what your workspace is cleared to hold.
- **Monitor Service Principal Activity**: Enable Microsoft Entra sign-in and audit logs to watch the service principal for anomalies.
- **Protect Credentials**: Store the client secret securely. Never commit it to version control or share it in plain text.
- **Audit Role Assignments**: Periodically review IAM role assignments on the DCR to ensure no unauthorized principals have access.
- **Enable Sentinel Analytics**: Create analytics rules on the `WhiteoutAI_CL` table to detect suspicious AI usage patterns, policy violations, and potential data exfiltration attempts.
