# Splunk HEC Destination Setup Guide

This guide walks you through configuring Splunk as a SOC/SIEM destination in Whiteout AI, streaming audit events into Splunk via the HTTP Event Collector (HEC).

## Overview

The Splunk HEC destination allows Whiteout AI to:
- Stream audit events into Splunk via the HTTP Event Collector (HEC) for centralized log analysis, alerting, and dashboards
- Deliver events in real time for immediate visibility in Splunk Search and Splunk Enterprise Security
- Target specific Splunk indexes for organized data management
- Enable correlation of AI governance events with other enterprise security data in Splunk

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- **Splunk Enterprise** (8.x or later) or **Splunk Cloud** with HEC enabled
- **Splunk Admin** access to create HEC tokens and manage indexes
- Network connectivity from Whiteout AI to the Splunk HEC endpoint (typically port `8088`)

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
7. Optionally enable SSL (strongly recommended for production)
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
| **Enable Indexer Acknowledgement** | Optional (enable for guaranteed delivery) |

4. Click **Next**
5. On the **Input Settings** page:

| Field | Value |
|-------|-------|
| **Source Type** | `_json` or create a custom source type `whiteout:ai:events` |
| **App Context** | `Search & Reporting` (or your preferred app) |
| **Index** | Select `whiteout_ai` (the index created in Step 2) |

6. Click **Review** and then **Submit**
7. Copy the generated **Token Value** and store it securely

### Step 4: Verify HEC Endpoint Accessibility

Test that the HEC endpoint is reachable:

```bash
curl -k https://splunk.example.com:8088/services/collector/health \
  -H "Authorization: Splunk YOUR_HEC_TOKEN"
```

A healthy response returns:

```json
{"text":"HEC is healthy","code":17}
```

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **SOC/SIEM Destinations**
3. Click **Add Destination** and select **Splunk HEC**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **HEC URL** | The Splunk HTTP Event Collector endpoint, e.g. `https://splunk.example.com:8088` (`hec_url`) |
| **Token** | The HEC token generated in Splunk (`token`) |
| **Index** | (Optional) Target Splunk index; defaults to the token's assigned index (`index`) |

5. Click **Save & Test Connection**

---

## Verification

Test your Splunk HEC destination:

1. **Connection Test**: Click **Test Connection** in the destination settings. Whiteout AI will send a test event to Splunk.
2. **Splunk Search**: In Splunk, run the following search to verify the test event arrived:
   ```
   index=whiteout_ai sourcetype=whiteout:ai:events
   | head 10
   ```
3. **Field Extraction**: Confirm that event fields (e.g., `event_type`, `user`, `timestamp`, `action`) are correctly parsed.
4. **End-to-End Test**: Trigger an auditable action in Whiteout AI and verify it appears in Splunk within seconds.
5. **Token Validation**: If indexer acknowledgement is enabled, verify the acknowledgement response is received by checking delivery logs.

---

## Troubleshooting

### "Invalid Token" Error

- Verify the HEC token is correct and has not been disabled or deleted in Splunk
- Check that the token has not been rotated since it was configured in Whiteout AI
- Confirm the token is associated with the correct index

### Events Not Appearing in Splunk

- Verify the HEC URL is correct, including the protocol (`https://`) and port (`:8088`)
- Check that HEC is globally enabled in Splunk (**Settings** > **Data Inputs** > **HTTP Event Collector** > **Global Settings**)
- Confirm network connectivity from Whiteout AI to the Splunk HEC endpoint
- Review the Splunk internal logs: `index=_internal source=*http_event_collector*`

### TLS Certificate Errors

- Ensure the Splunk HEC endpoint has a valid TLS certificate
- If using a self-signed certificate, add the CA to the Whiteout AI trust store
- Verify the certificate has not expired

### Index Errors

- Confirm the specified index exists in Splunk and is not frozen or disabled
- Verify the HEC token has write access to the target index
- If no index is specified in Whiteout AI, check the token's default index assignment

### Ingestion Latency

- Check Splunk indexer health and queue sizes
- Verify there are no ingestion pipeline bottlenecks
- Review Splunk's `metrics.log` for indexing throughput metrics

---

## Security Considerations

- **Use HTTPS**: Always configure the HEC endpoint with SSL/TLS enabled to encrypt events in transit. Never use plain HTTP for production.
- **Restrict Token Permissions**: Assign the HEC token to a specific index and source type. Avoid using tokens with broad write access.
- **Network Segmentation**: Restrict access to the HEC endpoint using firewall rules. Only allow traffic from Whiteout AI egress IPs.
- **Rotate Tokens**: Periodically rotate HEC tokens. Update the Whiteout AI configuration immediately after rotation.
- **Enable Indexer Acknowledgement**: For guaranteed delivery, enable indexer acknowledgement on the HEC token to ensure events are confirmed as indexed.
- **Monitor Token Usage**: Use Splunk's internal logs to monitor HEC token usage for anomalies or unauthorized access attempts.
- **Audit Access**: Regularly review which users and systems have access to the HEC token and the target index.
