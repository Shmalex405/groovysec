# Splunk HEC Destination Setup Guide

This guide walks you through configuring Splunk as a SOC/SIEM destination in Whiteout AI, streaming audit events into Splunk via the HTTP Event Collector (HEC).

## Overview

The Splunk HEC destination allows Whiteout AI to:
- Stream audit events into Splunk via the HTTP Event Collector (HEC) for centralized log analysis, alerting, and dashboards
- Deliver events in near real time for visibility in Splunk Search and Splunk Enterprise Security
- Write to the Splunk index you choose, with a separate sourcetype per event type
- Correlate AI governance events with other enterprise security data in Splunk

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- **Splunk Enterprise** (8.x or later) or **Splunk Cloud** with HEC enabled
- **Splunk Admin** access to create HEC tokens and manage indexes
- Network connectivity from Whiteout AI to the Splunk HEC endpoint (port `8088` by default, `443` on Splunk Cloud)
- An HEC endpoint that presents a certificate from a publicly trusted CA (Splunk Cloud does; see [TLS Certificate Errors](#tls-certificate-errors))

---

## Third-Party Setup

### Step 1: Enable the HTTP Event Collector

If HEC is not already enabled in your Splunk instance:

1. Log in to Splunk Web as an administrator
2. Navigate to **Settings** > **Data Inputs**
3. Click **HTTP Event Collector**
4. Click **Global Settings** in the upper-right corner
5. Set **All Tokens** to **Enabled**
6. Configure the HTTP port (default: `8088`)
7. Enable SSL
8. Click **Save**

### Step 2: Create a Dedicated Index (Recommended)

Create a dedicated index to keep Whiteout AI events separated:

1. Navigate to **Settings** > **Indexes**
2. Click **New Index**
3. Configure the index:

| Field | Recommended Value |
|-------|-------------------|
| **Index Name** | `whiteout_ai` |
| **Index Data Type** | Events |
| **Max Size of Entire Index** | Based on your retention needs (e.g., `500 GB`) |
| **Retention Period** | Based on compliance requirements (e.g., `365 days`) |

4. Click **Save**

### Step 3: Create an HEC Token

1. Navigate to **Settings** > **Data Inputs** > **HTTP Event Collector**
2. Click **New Token**
3. On the **Select Source** page:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI Events` |
| **Description** | HEC token for Whiteout AI audit event ingestion |
| **Enable Indexer Acknowledgement** | Leave off. Whiteout AI doesn't send the acknowledgement channel header. |

4. Click **Next**
5. On the **Input Settings** page:

| Field | Value |
|-------|-------|
| **Source Type** | `Automatic`. Whiteout AI sets the sourcetype on every event (see [Events delivered](#events-delivered)). |
| **App Context** | `Search & Reporting` (or your preferred app) |
| **Allowed Indexes** | `whiteout_ai` (the index created in Step 2) |
| **Default Index** | `whiteout_ai` |

6. Click **Review** and then **Submit**
7. Copy the generated **Token Value** and store it securely

### Step 4: Verify HEC Endpoint Accessibility

Test that the HEC endpoint is reachable:

```bash
curl https://splunk.example.com:8088/services/collector/health \
  -H "Authorization: Splunk YOUR_HEC_TOKEN"
```

A healthy response returns:

```json
{"text":"HEC is healthy","code":17}
```

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Go to **Integrations** > **Security Ops Destinations** and click **Add Destination**
3. Fill in the dialog:

| Field | Description |
|-------|-------------|
| **Destination Type** | **Splunk HEC** |
| **Display Name** | A name for this destination, e.g. `Splunk` |
| **Privacy Profile** | Leave at **(None)**. See [Privacy settings](#privacy-settings). |
| **HEC URL** | The full event endpoint, including the path: `https://splunk.example.com:8088/services/collector/event` (Splunk Cloud: `https://http-inputs-<stack>.splunkcloud.com/services/collector/event`). Whiteout AI posts to this URL exactly as entered. |
| **HEC Token** | The token value from Step 3 |
| **Index** | The index to write to, e.g. `whiteout_ai`. The token must be allowed to write to it. |
| **Enabled** | On to start delivering as soon as the destination is saved |

4. Click **Test Connection**. Whiteout AI sends a test event to the HEC URL and shows the result.
5. Click **Create**

---

## Events delivered

Every event is written to your **Index**, with a sourcetype that depends on the event type. The full event object is the HEC `event`, so every field (for example `event_type`, `user.email`, `compliance.was_blocked`) is searchable.

| `event_type` | When it's sent | Sourcetype |
|--------------|----------------|------------|
| `prompt_log` | Each governed prompt: allowed, flagged or blocked | `whiteout:prompt_log` |
| `prompt_overridden` | A user overrides a block (the block was already sent as `prompt_log`) | `whiteout:prompt_log` |
| `coverage_gap` | Shadow-AI discovery opens a coverage-gap finding | `whiteout:coverage_gap` |
| `connector_vetting_action` | The [Whiteout AI Connector](./whiteout-ai-connector/overview.md) blocks or omits content | `whiteout:prompt_log` |
| `report` | A scheduled report run that lists this destination as a **SOC destination** | `whiteout:report` |
| `prompt_injection_detection` | A [Prompt Injection Defense](./injection-defense/overview.md) detection | `whiteout:prompt_injection` |
| `infra_agent_state_transition` | An [infrastructure agent](./infrastructure/agent-quickstart.md) changes state | `whiteout:infra_agent` |

`prompt_overridden` and `connector_vetting_action` events share the `whiteout:prompt_log` sourcetype, so filter on `event_type` to separate them. The event fields are described in [Webhook → Events delivered](./soc-destinations/webhook.md#events-delivered).

Delivery behaviour is the same as for every HTTP destination: prompt events are batched (500 events or 5 seconds by default), other events are sent as they occur, transient failures (connection errors, timeouts, `5xx`) are retried, and after 10 consecutive failed deliveries the destination is disabled and admins get a Notification Center alert. Infrastructure agent alerts are sent once, without retries.

---

## Privacy settings

Each destination applies two privacy settings to every event it receives:

| Setting | Value | Effect |
|---------|-------|--------|
| `prompt_visibility` | `full` (default) | Prompt and response text are sent as captured |
| | `hash_only` | Prompt text, response text and injection excerpts become `sha256:<hash>` |
| | `redacted` | Policy-matched parts of the prompt are masked; the response becomes `[RESPONSE_REDACTED]` when the prompt was blocked; injection excerpts become `[CONTENT_REDACTED]`. Prompts with no findings are sent unchanged. |
| `pii_mode` | `allow` (default) | `user.email` is sent as is |
| | `strip` | `user.email` is removed (`null`) from every event |
| | `tokenize` | `user.email` becomes a stable token, `[USER_<hash>]`, in every event |

Set them in the destination's configuration through the API (see [Configuring through the API](#configuring-through-the-api)). The **Privacy Profile** list in the dialog doesn't set them, so leave it at **(None)**.

---

## Verification

1. **Connection Test**: Click **Test Connection** in the dialog, or **Send Test** on the destination card. Whiteout AI sends one test event with sourcetype `whiteout:audit`.
2. **Splunk Search**: Confirm the test event arrived:
   ```
   index=whiteout_ai sourcetype=whiteout:audit
   | head 10
   ```
3. **End-to-End Test**: Submit a prompt through a governed AI tool, then search:
   ```
   index=whiteout_ai sourcetype=whiteout:prompt_log
   | table _time event_type user.email source.ai_tool compliance.was_blocked
   ```
4. **Destination card**: **Last Delivery** shows the time of the last successful delivery and **Last Error** the most recent failure.

---

## Prompt injection detection events

[Prompt Injection Defense](./injection-defense/overview.md) detections arrive with the sourcetype **`whiteout:prompt_injection`**, separate from prompt-log events, in the same index as your other Whiteout events. Each event is one detection with `event_type` `prompt_injection_detection`:

```
index=whiteout_ai sourcetype=whiteout:prompt_injection
| table _time severity detection.action detection.categories{} source.surface user.email url
```

Make sure your HEC token is allowed to write to that index; no other Splunk setup is needed. The fields, severity mapping and privacy settings are described in [Webhook → Prompt injection detection events](./soc-destinations/webhook.md#prompt-injection-detection-events).

---

## Configuring through the API

If you manage destinations through the Whiteout AI API rather than the dialog, use `type` `splunk` and these `config` keys:

| Dialog field | `config` key |
|--------------|--------------|
| **HEC URL** | `hec_url` |
| **HEC Token** | `token` |
| **Index** | `index` (optional through the API; without it, events go to the token's default index) |
| (API only) | `prompt_visibility`, `pii_mode` (see [Privacy settings](#privacy-settings)) |

Batching is set with the top-level `batching_max_events` (default `500`) and `batching_max_seconds` (default `5`). The token is returned masked as `****`; sending `****` back leaves it unchanged.

---

## Troubleshooting

### "Invalid Token" Error

- Verify the HEC token is correct and has not been disabled or deleted in Splunk
- Check that the token has not been rotated since it was configured in Whiteout AI

### Test Connection Fails with 404

- The **HEC URL** must include the path, e.g. `/services/collector/event`. Whiteout AI doesn't add it.

### Events Not Appearing in Splunk

- Verify the HEC URL is correct, including `https://`, the port and the path
- Check that HEC is globally enabled in Splunk (**Settings** > **Data Inputs** > **HTTP Event Collector** > **Global Settings**)
- Confirm network connectivity from Whiteout AI to the Splunk HEC endpoint
- Check **Last Error** on the destination card, and whether the destination has been disabled after repeated failures
- Review the Splunk internal logs: `index=_internal source=*http_event_collector*`

### TLS Certificate Errors

- Whiteout AI verifies the HEC certificate, and the destination has no option to turn verification off or add a private CA
- Splunk Enterprise ships HEC with a self-signed certificate. Replace it with a certificate from a publicly trusted CA, or put HEC behind a load balancer that presents one.
- Verify the certificate matches the host name in the **HEC URL** and has not expired

### Index Errors

- Confirm the index exists in Splunk and is not disabled
- Verify the HEC token's **Allowed Indexes** include the index you entered

### Ingestion Latency

- Check Splunk indexer health and queue sizes
- Review Splunk's `metrics.log` for indexing throughput metrics

---

## Security Considerations

- **Use HTTPS**: Always serve HEC over TLS with a trusted certificate. Never use plain HTTP for production.
- **Restrict Token Permissions**: Limit the HEC token to the Whiteout AI index. Avoid tokens with broad write access.
- **Network Segmentation**: Restrict access to the HEC endpoint using firewall rules. Only allow traffic from Whiteout AI.
- **Rotate Tokens**: Periodically rotate HEC tokens. Update the Whiteout AI destination immediately after rotation.
- **Limit Content**: Use `prompt_visibility` and `pii_mode` to send only what your Splunk environment is cleared to hold.
- **Monitor Token Usage**: Use Splunk's internal logs to monitor HEC token usage for anomalies.
- **Audit Access**: Regularly review which users and systems have access to the HEC token and the target index.
