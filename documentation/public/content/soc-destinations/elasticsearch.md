# Elasticsearch Destination Setup Guide

This guide walks you through configuring Elasticsearch as a SOC/SIEM destination in Whiteout AI, shipping audit events for full-text search, visualization, and alerting.

## Overview

The Elasticsearch destination allows Whiteout AI to:
- Ship audit events to Elasticsearch for search, Kibana visualization, and custom alerting
- Index events in near real time through the `_bulk` API
- Run events through an ingest pipeline for enrichment or transformation before indexing
- Integrate AI governance data with existing Elastic Security or observability workflows

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- An **Elasticsearch** cluster (version 7.x or 8.x) or **Elastic Cloud** deployment
- Permissions to create indices, index templates, API keys and ingest pipelines
- An HTTPS endpoint that Whiteout AI can write to **without credentials** (see [Step 2](#step-2-provide-an-endpoint-whiteout-ai-can-write-to))
- (Optional) Kibana access for dashboards and visualizations

---

## Third-Party Setup

### Step 1: Create an Index Template and Index

Whiteout AI writes every event to the one **Index** you name in the destination. Create a template for it so fields are mapped the way you want:

1. Open **Kibana** and navigate to **Stack Management** > **Index Management** > **Index Templates**
2. Click **Create template**
3. Configure the template:

| Field | Recommended Value |
|-------|-------------------|
| **Name** | `whiteout-ai-events` |
| **Index patterns** | `whiteout-ai-events*` |
| **Data stream** | Off. Whiteout AI uses `index` bulk operations, which data streams don't accept. |
| **Priority** | `100` |

4. On the **Mappings** step, use the JSON editor. Events are nested objects, and the event time is in `timestamp`:
   ```json
   {
     "properties": {
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
6. Create the index itself (for example in **Dev Tools**):
   ```
   PUT whiteout-ai-events
   ```

Fields not in the template are mapped dynamically.

### Step 2: Provide an Endpoint Whiteout AI Can Write To

Whiteout AI doesn't send Elasticsearch credentials: it posts to `<Endpoint URL>/_bulk` without an `Authorization` header, and **Test Connection** reads `<Endpoint URL>/_cluster/health` the same way. The **Endpoint URL** therefore has to accept those requests without authentication. Clusters that require authentication, including every Elastic Cloud deployment, need an ingest gateway in front of them:

1. Create an API key limited to the Whiteout AI index. In Kibana, go to **Stack Management** > **Security** > **API keys** > **Create API key**, name it `whiteout-ai-ingestion`, and restrict it:
   ```json
   {
     "whiteout_ai_writer": {
       "cluster": ["monitor"],
       "indices": [
         {
           "names": ["whiteout-ai-events"],
           "privileges": ["create_doc", "index"]
         }
       ]
     }
   }
   ```
2. Run a reverse proxy or API gateway you control that:
   - serves HTTPS with a certificate from a publicly trusted CA,
   - forwards `POST /_bulk` and `GET /_cluster/health` to your cluster, adding `Authorization: ApiKey <encoded key>`,
   - rejects every other path, and
   - accepts traffic only from Whiteout AI.
3. Use the proxy's URL as the **Endpoint URL**

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
   - **Date processor**: copy `timestamp` into `@timestamp`
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
| **Privacy Profile** | Leave at **(None)**. See [Privacy settings](#privacy-settings). |
| **Endpoint URL** | The HTTPS base URL from Step 2, e.g. `https://elastic-ingest.example.com`, without `/_bulk` |
| **Index** | The index to write to, e.g. `whiteout-ai-events` |
| **Ingest Pipeline (optional)** | The pipeline name from Step 3 |
| **Enabled** | On to start delivering as soon as the destination is saved |

4. Click **Test Connection**. Whiteout AI requests `<Endpoint URL>/_cluster/health` and shows the result. The test doesn't write a document.
5. Click **Create**

> **Destinations created before this release.** Elasticsearch destinations saved from an earlier version of the dialog didn't deliver or pass Test Connection. They now work as saved, without being re-entered.

---

## Events delivered

Every event is indexed into your **Index** as one document. Filter on `event_type`:

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

> **Per-document errors aren't reported.** A `_bulk` request that Elasticsearch accepts counts as delivered even if individual documents were rejected (for example a mapping conflict or an authorization error on the index). Check your cluster logs if documents are missing.

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
3. **Kibana**: Create a data view for `whiteout-ai-events` with `timestamp` as the time field, and check the event in **Discover**.
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
| (API only) | `prompt_visibility`, `pii_mode` (see [Privacy settings](#privacy-settings)) |

If `index` is omitted, each event type goes to its own index: `whiteout-prompt-logs` (prompt, override and connector events), `whiteout-coverage-gaps`, `whiteout-reports` and `whiteout-prompt-injection`. Setting `index` is simpler.

Batching is set with the top-level `batching_max_events` (default `500`) and `batching_max_seconds` (default `5`).

---

## Troubleshooting

### Test Connection Returns 401 or 403

- Whiteout AI doesn't send credentials. Point the **Endpoint URL** at an ingest gateway that adds them (see [Step 2](#step-2-provide-an-endpoint-whiteout-ai-can-write-to)).

### Documents Not Appearing

- Confirm the **Endpoint URL** is the base URL (no `/_bulk`), including `https://` and the port
- Check that the gateway forwards `POST /_bulk` and that its API key can write to the index
- Make sure the index isn't a data stream
- Look for rejected documents in your cluster or gateway logs (see [Per-document errors](#events-delivered))
- Check **Last Error** on the destination card, and whether the destination has been disabled after repeated failures

### Mapping Errors

- Ensure the index template matches your **Index** name and has no higher-priority conflicting template
- `timestamp` values are ISO 8601; keep that field mapped as `date`

### TLS Certificate Errors

- Whiteout AI verifies the endpoint's certificate, and this destination has no option to turn verification off or add a private CA. Serve the endpoint with a certificate from a publicly trusted CA.

### Pipeline Processing Errors

- Test the pipeline in **Stack Management** > **Ingest Pipelines**
- Temporarily clear **Ingest Pipeline** in the destination to isolate the issue

---

## Security Considerations

- **Use HTTPS**: Always connect over HTTPS to encrypt events in transit.
- **Lock Down the Gateway**: The ingest gateway accepts unauthenticated requests, so restrict it to Whiteout AI traffic and to the `_bulk` and `_cluster/health` paths only.
- **Scoped API Keys**: Give the gateway's API key write access to the Whiteout AI index only. Never use the `elastic` superuser for ingestion.
- **Rotate API Keys**: Set expiration dates on API keys and rotate them before they expire.
- **Limit Content**: Use `prompt_visibility` and `pii_mode` to send only what your cluster is cleared to hold.
- **Enable Audit Logging**: Turn on Elasticsearch audit logging to track API key usage and index operations.
- **Index Lifecycle Management**: Use ILM policies (with a rollover alias if needed) to enforce your retention requirements.
- **Encrypt at Rest**: Enable encryption at rest on your cluster to protect stored audit events.
