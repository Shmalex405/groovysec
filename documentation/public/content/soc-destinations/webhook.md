# Webhook Destination Setup Guide

This guide walks you through configuring a generic webhook destination in Whiteout AI, enabling real-time forwarding of audit events to any HTTP/HTTPS endpoint.

## Overview

The Webhook destination allows Whiteout AI to:
- Forward audit events to any HTTP/HTTPS endpoint in real time
- Feed events into custom data pipelines, SOAR platforms, or internal tools
- Deliver JSON-formatted event payloads with optional HMAC-SHA256 signature verification
- Provide a flexible integration point for systems not covered by built-in destinations

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- An HTTPS endpoint capable of receiving POST requests with JSON payloads
- Network connectivity between Whiteout AI and the target endpoint (firewall rules, allowlists, etc.)
- (Optional) A shared secret for HMAC-SHA256 payload signing

---

## Third-Party Setup

### Step 1: Prepare Your Receiving Endpoint

Set up an endpoint that can accept incoming webhook POST requests. The endpoint must:

1. Accept `POST` requests with `Content-Type: application/json`
2. Return an HTTP `2xx` status code within 10 seconds to acknowledge receipt
3. Support HTTPS with a valid TLS certificate (recommended)

If you are using a SOAR platform (e.g., Tines, Palo Alto XSOAR, Splunk SOAR):

1. Create a new **webhook trigger** or **inbound HTTP action** in your SOAR tool
2. Copy the generated endpoint URL
3. Note any authentication tokens or headers the platform requires

If you are building a custom receiver:

1. Deploy a service that listens for POST requests on a dedicated path, e.g., `/webhooks/whiteout-ai`
2. Parse the incoming JSON body to extract event data
3. Store or forward the events as needed for your pipeline

### Step 2: Configure TLS (If Using Self-Signed Certificates)

If your endpoint uses a self-signed or internal CA certificate:

1. Note that Whiteout AI verifies TLS certificates by default
2. You can disable TLS verification in the destination settings if necessary (not recommended for production)
3. Preferably, add your internal CA to the Whiteout AI trust store

### Step 3: Set Up Payload Signature Verification (Optional)

To verify that incoming payloads originate from Whiteout AI:

1. Generate a random signing secret (minimum 32 characters recommended):
   ```
   openssl rand -hex 32
   ```
2. Store this secret securely; you will enter it in both your application and Whiteout AI
3. On your receiver, validate the `X-Whiteout-Signature` header against the HMAC-SHA256 digest of the request body using the shared secret

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **SOC/SIEM Destinations**
3. Click **Add Destination** and select **Webhook**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **Endpoint URL** | The HTTPS URL to receive event payloads (`endpoint`) |
| **Signing Secret** | (Optional) HMAC-SHA256 signing secret for payload verification (`signing_secret`) |
| **Verify TLS** | Whether to verify the destination's TLS certificate (`verify_tls`) |

5. Click **Save & Test Connection**

---

## Verification

Test your webhook destination:

1. **Connection Test**: Click **Test Connection** in the destination settings. Whiteout AI will send a test event to your endpoint.
2. **Payload Inspection**: Verify that your endpoint received a JSON payload containing a `test` event type.
3. **Signature Validation**: If you configured a signing secret, verify the `X-Whiteout-Signature` header matches the expected HMAC-SHA256 digest.
4. **End-to-End Test**: Trigger an auditable action in Whiteout AI (e.g., submit a prompt) and confirm the event arrives at your endpoint within a few seconds.
5. **Response Code Check**: Ensure your endpoint returns HTTP `200` or `202`. Non-2xx responses will cause Whiteout AI to retry delivery.

---

## Troubleshooting

### Events Not Arriving

- Verify the endpoint URL is correct and publicly reachable from Whiteout AI
- Check firewall rules and network security groups to ensure inbound HTTPS traffic is allowed
- Confirm your endpoint returns a `2xx` status code within 10 seconds
- Review the Whiteout AI destination logs under **Settings** > **SOC/SIEM Destinations** > **Webhook** > **Delivery Logs**

### TLS Handshake Failures

- Ensure your endpoint has a valid, non-expired TLS certificate
- If using a self-signed certificate, set **Verify TLS** to `false` or add your CA to the trust store
- Check that your endpoint supports TLS 1.2 or higher

### Signature Mismatch

- Confirm the signing secret in Whiteout AI matches the one configured on your receiver exactly (no trailing whitespace or newlines)
- Ensure you are computing the HMAC-SHA256 over the raw request body bytes, not a parsed/re-serialized version
- Verify you are reading the `X-Whiteout-Signature` header, not a different header

### Duplicate Events

- Whiteout AI retries delivery on non-2xx responses or timeouts. Implement idempotency on your receiver using the `event_id` field in each payload.
- Return a `2xx` response promptly to prevent retries

### High Latency or Timeouts

- Offload heavy processing to a background queue; acknowledge the webhook immediately
- Increase server resources or horizontal scaling if your endpoint cannot keep up with event volume
- Consider batching or filtering events in Whiteout AI to reduce payload frequency

---

## Security Considerations

- **Always use HTTPS**: Transmitting audit events over unencrypted HTTP exposes sensitive data in transit. Use HTTPS endpoints exclusively.
- **Enable Signing Secrets**: Use the HMAC-SHA256 signing secret to authenticate that payloads originate from Whiteout AI and have not been tampered with.
- **Restrict Access**: Limit network access to your webhook endpoint. Use IP allowlisting or firewall rules to accept traffic only from Whiteout AI egress IPs.
- **Validate Payloads**: Always validate the structure and signature of incoming payloads before processing them.
- **Rotate Secrets**: Rotate your signing secret periodically. Update both Whiteout AI and your receiver simultaneously to avoid delivery failures.
- **Audit Delivery Logs**: Regularly review delivery logs in Whiteout AI to detect failed deliveries, unexpected errors, or anomalous patterns.
- **Avoid Logging Secrets**: Ensure your receiver does not log the signing secret, request headers containing secrets, or full payloads to insecure locations.
