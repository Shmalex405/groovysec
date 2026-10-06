# Elasticsearch Destination Setup Guide

This guide walks you through configuring Elasticsearch as a SOC/SIEM destination in Whiteout AI, shipping audit events for full-text search, visualization, and alerting.

## Overview

The Elasticsearch destination allows Whiteout AI to:
- Ship audit events to Elasticsearch for search, Kibana visualization, and custom alerting
- Index events in near real time through the `_bulk` API
- Run events through an ingest pipeline for enrichment or transformation before indexing
- Authenticate with a least-privilege API key (or a username and password), over TLS with an optional private CA
- Integrate AI governance data with existing Elastic Security or observability workflows

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- An **Elasticsearch** cluster (version 7.x or 8.x) or **Elastic Cloud** deployment
- Permissions to create indices, index templates, API keys and ingest pipelines
- An Elasticsearch **API key** that can write to the Whiteout AI index (see [Step 2](#step-2-create-an-api-key)), or a user that can. Clusters without security enabled need no credential.
- Network connectivity from Whiteout AI to your cluster's HTTPS endpoint
- (Optional) Kibana access for dashboards and visualizations

---

## Third-Party Setup

### Step 1: Create an Index Template and Index

Whiteout AI writes every event to the one **Index** you name in the destination. It can be a regular index or a data stream. Create a template for it so fields are mapped the way you want:

1. Open **Kibana** and navigate to **Stack Management** > **Index Management** > **Index Templates**
2. Click **Create template**
3. Configure the template:

| Field | Recommended Value |
|-------|-------------------|
| **Name** | `whiteout-ai-events` |
| **Index patterns** | `whiteout-ai-events*` |
| **Data stream** | Optional. Whiteout AI adds documents with `create` operations and sets `@timestamp`, so both a regular index and a data stream work. |
| **Priority** | `100` |

4. On the **Mappings** step, use the JSON editor. Events are nested objects. The event time is in both `@timestamp` (added by Whiteout AI, UTC) and `timestamp`:
   ```json
   {
     "properties": {
       "@timestamp": { "type": "date" },
       "timestamp": { "type": "date" },
       "event_type": { "type": "keyword" },
       "event_id": { "type": "keyword" },
       "severity": { "type": "keyword" },
       "url": { "type": "keyword" },
       "organization": { "properties": { "id": { "type": "keyword" } } },
       "group": { "properties": { "id": { "type": "keyword" }, "name": { "type": "keyword" } } },
       "user": { "properties": { "id": { "type": "keyword" }, "email": { "type": "keyword" } } },
       "source": {
         "properties": {
           "type": { "type": "keyword" },
           "ai_tool": { "type": "keyword" },
           "model": { "type": "keyword" },
           "surface": { "type": "keyword" }
         }
       },
       "prompt": { "properties": { "text": { "type": "text" } } },
       "response": { "properties": { "text": { "type": "text" } } },
       "compliance": {
         "properties": {
           "was_blocked": { "type": "boolean" },
           "was_overridden": { "type": "boolean" }
         }
       },
       "detection": {
         "properties": {
           "categories": { "type": "keyword" },
           "rule_ids": { "type": "keyword" },
           "score": { "type": "float" },
           "excerpt": { "type": "text" }
         }
       }
     }
   }
   ```
5. Click **Create template**
6. For a regular index, create the index itself (for example in **Dev Tools**). A data stream is created automatically on the first write.
   ```
   PUT whiteout-ai-events
   ```

Fields not in the template are mapped dynamically.

### Step 2: Create an API Key

Create an API key that can only add documents to the Whiteout AI index:

1. In Kibana, go to **Stack Management** > **Security** > **API keys** > **Create API key**
2. Name it `whiteout-ai-ingestion`, set an expiration if your policy requires one, and turn on **Control security privileges**
3. Enter this role descriptor, with your index or data stream name:
   ```json
   {
     "whiteout_ai_writer": {
       "indices": [
         {
           "names": ["whiteout-ai-events"],
           "privileges": ["create_doc"]
         }
       ]
     }
   }
   ```
4. Click **Create API key** and copy the **Encoded** value. It's shown only once.

`create_doc` is the only privilege Whiteout AI needs: it only adds documents, and **Test Connection** checks the key without any cluster privilege, so the key needs no `monitor` or other cluster access. `index` or `write` on the index also work.

If you'd rather use a user, give it a role with the same index privilege and choose **Username and password** in Whiteout AI. **None** is only for clusters that run without security.

### Step 3: Create an Ingest Pipeline (Optional)

To enrich or transform events before indexing:

1. In Kibana, go to **Stack Management** > **Ingest Pipelines**
2. Click **Create pipeline**
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `whiteout-ai-pipeline` |
| **Description** | Pre-processing pipeline for Whiteout AI events |

4. Add processors as needed, for example:
   - **Rename processor**: rename fields to match your schema (for example ECS field names)
   - **Set processor**: add a static field like `data_source: "whiteout_ai"`
   - **Remove processor**: drop fields you don't want to store
5. Click **Create pipeline**

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Go to **Integrations** > **Security Ops Destinations** and click **Add Destination**
3. Fill in the dialog:

| Field | Description |
|-------|-------------|
| **Destination Type** | **Elastic HTTP Ingest** |
| **Display Name** | A name for this destination, e.g. `Elastic` |
| **Prompt content** | **Full text** (default), **Hash only** or **Redacted**. See [Privacy settings](#privacy-settings). |
| **User identity** | **Include email** (default), **Remove email** or **Tokenize**. See [Privacy settings](#privacy-settings). |
| **Endpoint URL** | Your Elasticsearch URL, e.g. `https://my-deployment.es.us-east-1.aws.elastic.cloud:443`, without `/_bulk` |
| **Index** | The index or data stream to write to, e.g. `whiteout-ai-events` |
| **Ingest Pipeline (optional)** | The pipeline name from Step 3 |
| **Authentication** | **API key** (recommended; the key only needs the `create_doc` privilege on the index), **Username and password**, or **None** (only for clusters without security enabled) |
| **API Key** | Shown for **API key**. The **Encoded** value from Step 2 (base64 of `id:key`). An `id:key` pair is also accepted. |
| **Username** / **Password** | Shown for **Username and password**. A user that can write to the index. |
| **Verify TLS certificate** | On by default. Leave it on in production. |
| **CA Certificate (PEM, optional)** | Only needed if the cluster uses a certificate from a private CA. See [TLS Certificate Errors](#tls-certificate-errors). |
| **Enabled** | On to start delivering as soon as the destination is saved |

4. Click **Test Connection**. It checks the credential and that it can write to the index, and doesn't write any data:
   - With **API key** or **Username and password**, Whiteout AI calls `<Endpoint URL>/_security/_authenticate`, then `_security/user/_has_privileges` for `create_doc` on the **Index**. On success it shows **Authenticated as `<key or user>`; can write to `<index>`**. A credential that authenticates but can't write fails the test and names the index.
   - With **None**, it requests `<Endpoint URL>/`. A cluster that requires authentication answers `401`, and the test asks you to choose API key or Basic authentication.
5. Click **Create**

When you edit a saved destination, the **API Key** and **Password** show `****`. **Test Connection** then uses the saved value, so you only need to re-enter it to change it.

> **Destinations created before this release.** Elasticsearch destinations saved from an earlier version of the dialog didn't deliver or pass Test Connection. They now work as saved, without being re-entered. A destination that points at an ingest gateway adding credentials for Whiteout AI keeps working with **Authentication** set to **None**; you can now point it straight at the cluster with an API key instead.

---

## Events delivered

Every event is indexed into your **Index** as one document, with `@timestamp` set to the event time (UTC). Filter on `event_type`:

| `event_type` | When it's sent |
|--------------|----------------|
| `prompt_log` | Each governed prompt: allowed, flagged or blocked |
| `prompt_overridden` | A user overrides a block (the block was already sent as `prompt_log`) |
| `coverage_gap` | Shadow-AI discovery opens a coverage-gap finding |
| `connector_vetting_action` | The [Whiteout AI Connector](./whiteout-ai-connector/overview.md) blocks or omits content |
| `report` | A scheduled report run that lists this destination as a **SOC destination** |
| `prompt_injection_detection` | A [Prompt Injection Defense](./injection-defense/overview.md) detection |

Infrastructure agent state alerts are not sent to Elasticsearch. The event fields are described in [Webhook → Events delivered](./soc-destinations/webhook.md#events-delivered).

Prompt events are batched (500 events or 5 seconds by default); other events are sent as they occur. Transient failures (connection errors, timeouts, `5xx`) are retried, and after 10 consecutive failed deliveries the destination is disabled and admins get a Notification Center alert.

- **Create operations with stable IDs.** Each document is added with a `create` operation and an `_id` derived from the event, so data streams and `create_doc`-only keys work, and retries are safe: if an event is sent again, Elasticsearch answers `409` for the copy it already has, and Whiteout AI counts that event as delivered instead of indexing it twice.
- **Rejected documents are a failed delivery.** If the `_bulk` response reports `errors: true`, the delivery fails and **Last Error** on the destination card shows the first rejection, for example `Elasticsearch bulk rejected 3/50 events; first error (status 400, index whiteout-ai-events): mapper_parsing_exception: …`. It's retried only when every rejection is a `429` or `5xx`; a mapping or permission rejection needs a fix on your side and counts toward auto-disable.

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

1. **Connection Test**: Click **Test Connection** in the dialog, or **Send Test** on the destination card.
2. **End-to-End Test**: Submit a prompt through a governed AI tool, then search the index:
   ```
   GET whiteout-ai-events/_search
   {
     "query": { "term": { "event_type": "prompt_log" } },
     "sort": [ { "timestamp": "desc" } ],
     "size": 5
   }
   ```
3. **Kibana**: Create a data view for `whiteout-ai-events` with `@timestamp` as the time field, and check the event in **Discover**.
4. **Pipeline Verification**: If you configured an ingest pipeline, confirm its enrichment fields are present.
5. **Destination card**: **Last Delivery** shows the time of the last successful delivery and **Last Error** the most recent failure.

---

## Prompt injection detection events

[Prompt Injection Defense](./injection-defense/overview.md) detections are indexed into your **Index** with your other Whiteout events, one document per detection with `event_type` `prompt_injection_detection`. If you configured an ingest pipeline, it applies to these documents too.

```
GET whiteout-ai-events/_search
{
  "query": { "term": { "event_type": "prompt_injection_detection" } },
  "sort": [ { "timestamp": "desc" } ]
}
```

The template in Step 1 already maps `detection.categories` and `detection.rule_ids` as `keyword` and `detection.score` as `float`. The fields, severity mapping and privacy settings are described in [Webhook → Prompt injection detection events](./soc-destinations/webhook.md#prompt-injection-detection-events).

---

## Configuring through the API

If you manage destinations through the Whiteout AI API rather than the dialog, use `type` `elastic` and these `config` keys:

| Dialog field | `config` key |
|--------------|--------------|
| **Endpoint URL** | `endpoint` (the older name `endpoint_url` is also accepted) |
| **Index** | `index` |
| **Ingest Pipeline** | `pipeline` |
| **Authentication** | `auth_type`: `api_key`, `basic` or `none`. When omitted, it's inferred: `api_key` if `api_key` is set, `basic` if `username` is set, otherwise `none`. |
| **API Key** | `api_key` |
| **Username** / **Password** | `username` / `password` |
| **Verify TLS certificate** | `verify_tls` (default `true`) |
| **CA Certificate** | `ca_cert` (PEM; a value that isn't a PEM certificate is rejected with a `400`) |
| **Prompt content** | `prompt_visibility`: `full` (default), `hash_only` or `redacted` |
| **User identity** | `pii_mode`: `allow` (default), `strip` or `tokenize` |

If `index` is omitted, each event type goes to its own index (see [Event type labels](./soc-destinations/webhook.md#event-type-labels)): `whiteout-prompt-logs`, `whiteout-prompt-overrides`, `whiteout-connector-vetting`, `whiteout-coverage-gaps`, `whiteout-reports` and `whiteout-prompt-injection`, and any new event type to `whiteout-<event-type>`. Test Connection then checks write access to every one of them, so the key needs `create_doc` on all of them (for example on `whiteout-*`). Setting `index` is simpler. Before this release, overrides and connector vetting actions went to `whiteout-prompt-logs`.

Batching is set with the top-level `batching_max_events` (default `500`) and `batching_max_seconds` (default `5`). `api_key` and `password` are stored encrypted and returned masked as `****`; sending `****` back leaves them unchanged. The older top-level `privacy_profile_id` field is ignored if sent.

---

## Troubleshooting

### Test Connection: "Authentication failed"

- For **API key**, paste the **Encoded** value (or `id:key`), and check the key hasn't expired or been invalidated
- For **Username and password**, check both values
- If an edit left the field showing `****`, the saved value is used; re-enter it if it changed in Elasticsearch

### Test Connection: "The cluster requires authentication"

- **Authentication** is set to **None**, but the cluster has security enabled. Choose **API key** or **Username and password**.

### Test Connection: "… cannot write to …"

- The credential works but lacks write access. Give it `create_doc` (or `index` or `write`) on the index or data stream named in the message.
- If the message says write access **could not be checked**, the test passed authentication only. Save the destination and confirm with the end-to-end test in [Verification](#verification).

### Documents Not Appearing

- Confirm the **Endpoint URL** is the base URL (no `/_bulk`), including `https://` and the port
- Check **Last Error** on the destination card: rejected documents are reported there with the first error's status, index and reason
- Check whether the destination has been disabled after repeated failures

### Mapping Errors

- Ensure the index template matches your **Index** name and has no higher-priority conflicting template
- `@timestamp` and `timestamp` values are ISO 8601; keep both mapped as `date`

### TLS Certificate Errors

- Whiteout AI verifies the cluster's certificate against the public trusted CAs by default. Test Connection reports a verification failure as `TLS error: …`.
- If the cluster uses a certificate from a private CA (common for self-managed clusters), paste the issuing CA certificate (PEM, starting `-----BEGIN CERTIFICATE-----`) into **CA Certificate**. It is added to the public trusted CAs, so a publicly trusted certificate keeps working too. For a self-signed certificate, the certificate itself is the CA.
- Check the certificate matches the host name in the **Endpoint URL** and hasn't expired
- Turning off **Verify TLS certificate** skips the check (and ignores **CA Certificate**). Use it only for testing.

### Pipeline Processing Errors

- Test the pipeline in **Stack Management** > **Ingest Pipelines**
- Temporarily clear **Ingest Pipeline** in the destination to isolate the issue

---

## Security Considerations

- **Use HTTPS**: Always connect over HTTPS to encrypt events in transit.
- **Keep Certificate Verification On**: Turn off **Verify TLS certificate** only for testing. Use **CA Certificate** for a private CA instead.
- **Scoped API Keys**: Give Whiteout AI an API key with `create_doc` on the Whiteout AI index only. Never use the `elastic` superuser for ingestion.
- **Rotate API Keys**: Set expiration dates on API keys and rotate them before they expire.
- **Limit Content**: Use **Prompt content** and **User identity** to send only what your cluster is cleared to hold.
- **Enable Audit Logging**: Turn on Elasticsearch audit logging to track API key usage and index operations.
- **Index Lifecycle Management**: Use ILM policies (with a rollover alias if needed) to enforce your retention requirements.
- **Encrypt at Rest**: Enable encryption at rest on your cluster to protect stored audit events.
