# Elasticsearch Destination Setup Guide

This guide walks you through configuring Elasticsearch as a SOC/SIEM destination in Whiteout AI, shipping audit events for full-text search, visualization, and alerting.

## Overview

The Elasticsearch destination allows Whiteout AI to:
- Ship audit events to Elasticsearch for full-text search, visualization in Kibana, and custom alerting
- Index events in real time for immediate querying and analysis
- Leverage ingest pipelines for pre-processing, enrichment, and transformation of events before indexing
- Integrate AI governance data with existing Elastic Security or observability workflows

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- **Elasticsearch** cluster (version 7.x or 8.x) or **Elastic Cloud** deployment
- Cluster-level permissions to create indices, index templates, and ingest pipelines
- Network connectivity from Whiteout AI to the Elasticsearch cluster endpoint (typically port `9200`)
- (Optional) Kibana access for building dashboards and visualizations

---

## Third-Party Setup

### Step 1: Create a Dedicated Index Template

Set up an index template to define mappings and settings for Whiteout AI events:

1. Open **Kibana** and navigate to **Stack Management** > **Index Management** > **Index Templates**
2. Click **Create template**
3. Configure the template:

| Field | Recommended Value |
|-------|-------------------|
| **Name** | `whiteout-ai-events` |
| **Index patterns** | `whiteout-ai-events-*` |
| **Priority** | `100` |

4. On the **Component templates** step, optionally attach any existing component templates for common settings
5. On the **Index settings** step, configure:
   ```json
   {
     "number_of_shards": 1,
     "number_of_replicas": 1,
     "refresh_interval": "5s"
   }
   ```
6. On the **Mappings** step, define the field mappings:
   ```json
   {
     "properties": {
       "@timestamp": { "type": "date" },
       "event_type": { "type": "keyword" },
       "user_email": { "type": "keyword" },
       "user_name": { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
       "action": { "type": "keyword" },
       "policy_name": { "type": "keyword" },
       "risk_level": { "type": "keyword" },
       "source_platform": { "type": "keyword" },
       "prompt_snippet": { "type": "text" },
       "details": { "type": "object", "dynamic": true }
     }
   }
   ```
7. Click **Create template**

Alternatively, create the template via the Elasticsearch API:

```bash
curl -X PUT "https://elastic.example.com:9200/_index_template/whiteout-ai-events" \
  -H "Content-Type: application/json" \
  -u "elastic:YOUR_PASSWORD" \
  -d '{
    "index_patterns": ["whiteout-ai-events-*"],
    "priority": 100,
    "template": {
      "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1
      },
      "mappings": {
        "properties": {
          "@timestamp": { "type": "date" },
          "event_type": { "type": "keyword" },
          "user_email": { "type": "keyword" },
          "action": { "type": "keyword" },
          "policy_name": { "type": "keyword" },
          "risk_level": { "type": "keyword" },
          "details": { "type": "object", "dynamic": true }
        }
      }
    }
  }'
```

### Step 2: Create an API Key for Ingestion

Generate a scoped API key for Whiteout AI to authenticate:

1. In Kibana, go to **Stack Management** > **Security** > **API keys**
2. Click **Create API key**
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `whiteout-ai-ingestion` |
| **Expiration** | Set per your security policy (e.g., 365 days) |

4. Restrict the key's permissions to the Whiteout AI index pattern:
   ```json
   {
     "whiteout_ai_writer": {
       "indices": [
         {
           "names": ["whiteout-ai-events-*"],
           "privileges": ["create_index", "index", "write"]
         }
       ]
     }
   }
   ```
5. Click **Create API key**
6. Copy the **Encoded** API key value and store it securely

Alternatively, create the API key via the REST API:

```bash
curl -X POST "https://elastic.example.com:9200/_security/api_key" \
  -H "Content-Type: application/json" \
  -u "elastic:YOUR_PASSWORD" \
  -d '{
    "name": "whiteout-ai-ingestion",
    "role_descriptors": {
      "whiteout_ai_writer": {
        "indices": [
          { "names": ["whiteout-ai-events-*"], "privileges": ["create_index", "index", "write"] }
        ]
      }
    }
  }'
```

### Step 3: Create an Ingest Pipeline (Optional)

If you want to enrich or transform events before indexing:

1. In Kibana, go to **Stack Management** > **Ingest Pipelines**
2. Click **Create pipeline**
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `whiteout-ai-pipeline` |
| **Description** | Pre-processing pipeline for Whiteout AI events |

4. Add processors as needed, for example:
   - **Date processor**: Parse timestamps into `@timestamp`
   - **Set processor**: Add a static field like `data_source: "whiteout_ai"`
   - **Grok processor**: Extract patterns from prompt snippets
   - **Remove processor**: Strip unnecessary fields to reduce storage
5. Click **Create pipeline**

### Step 4: Verify Cluster Health

Before configuring Whiteout AI, verify your cluster is healthy:

```bash
curl -u "elastic:YOUR_PASSWORD" "https://elastic.example.com:9200/_cluster/health?pretty"
```

Ensure the status is `green` or `yellow` (not `red`).

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **SOC/SIEM Destinations**
3. Click **Add Destination** and select **Elasticsearch**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **Endpoint** | Elasticsearch cluster URL, e.g. `https://elastic.example.com:9200` (`endpoint`) |
| **Pipeline** | (Optional) Ingest pipeline name for pre-processing events (`pipeline`) |

5. Click **Save & Test Connection**

---

## Verification

Test your Elasticsearch destination:

1. **Connection Test**: Click **Test Connection** in the destination settings. Whiteout AI will attempt to index a test event.
2. **Index Verification**: In Kibana, navigate to **Stack Management** > **Index Management** and verify that a `whiteout-ai-events-*` index has been created.
3. **Search Test**: In Kibana **Discover**, select the `whiteout-ai-events-*` index pattern and verify the test event appears.
4. **Pipeline Verification**: If you configured an ingest pipeline, confirm that enrichment fields (e.g., `data_source`) are present on the indexed document.
5. **End-to-End Test**: Trigger an auditable action in Whiteout AI and verify it appears in Elasticsearch within a few seconds.

---

## Troubleshooting

### Authentication Errors

- Verify the API key is correct and has not expired
- Confirm the API key has write permissions to the `whiteout-ai-events-*` index pattern
- If using basic authentication, verify username and password

### "Index Not Found" or Mapping Errors

- Ensure the index template was created successfully and matches the index pattern used by Whiteout AI
- Check for conflicting index templates with higher priority
- Verify the mapping types match the event payload (e.g., date fields must be in ISO 8601 format)

### Events Not Appearing

- Confirm the Elasticsearch endpoint URL is correct, including protocol and port
- Check network connectivity and firewall rules between Whiteout AI and the cluster
- Verify the cluster status is not `red` (indicating unallocated primary shards)
- Review Elasticsearch logs for ingestion errors: check `_nodes/stats` or Kibana **Stack Monitoring**

### Pipeline Processing Errors

- Check the pipeline for processor errors in **Stack Management** > **Ingest Pipelines** > **Test**
- Review the `_ingest.on_failure` metadata on documents that failed pipeline processing
- Temporarily remove the pipeline from the Whiteout AI configuration to isolate the issue

### High Ingestion Latency

- Check cluster load and indexing queue sizes via `_nodes/stats`
- Consider increasing the `refresh_interval` if near-real-time search is not required
- Scale up the cluster with additional data nodes if indexing throughput is a bottleneck

---

## Security Considerations

- **Use HTTPS**: Always connect to Elasticsearch over HTTPS to encrypt events in transit. Avoid plain HTTP in production.
- **Scoped API Keys**: Use API keys with the minimum required privileges (write access to the specific index pattern only). Avoid using the `elastic` superuser for ingestion.
- **Network Isolation**: Place the Elasticsearch cluster behind a VPN or private network. Use firewall rules to restrict access to Whiteout AI egress IPs.
- **Rotate API Keys**: Set expiration dates on API keys and rotate them before they expire. Update the Whiteout AI configuration immediately after rotation.
- **Enable Audit Logging**: Turn on Elasticsearch audit logging to track all API key usage and index operations for compliance.
- **Index Lifecycle Management**: Configure ILM policies to automatically roll over, shrink, and delete old Whiteout AI indices based on your retention requirements.
- **Encrypt at Rest**: Enable encryption at rest on your Elasticsearch cluster to protect stored audit events.
