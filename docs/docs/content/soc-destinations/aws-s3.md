# AWS S3 Destination Setup Guide

This guide walks you through configuring Amazon S3 as a SOC/SIEM destination in Whiteout AI, batch-exporting audit events for long-term archival and data lake integration.

## Overview

The AWS S3 destination allows Whiteout AI to:
- Batch-export audit events to Amazon S3 for long-term archival, data lake integration, and compliance retention
- Deliver events in JSONL or Parquet format on an hourly or daily cadence
- Organize events with configurable key prefixes for structured storage
- Enable downstream analytics using Athena, Redshift Spectrum, Glue, or third-party tools

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- An **AWS account** with permissions to create S3 buckets, IAM policies, and IAM roles or users
- **AWS CLI** or **AWS Management Console** access
- A target AWS region for the S3 bucket
- (Optional) AWS KMS key for server-side encryption

---

## Third-Party Setup

### Step 1: Create an S3 Bucket

Create a dedicated bucket to store Whiteout AI audit events:

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/s3)
2. Click **Create bucket**
3. Configure the bucket:

| Field | Recommended Value |
|-------|-------------------|
| **Bucket name** | `your-org-whiteout-ai-events` |
| **AWS Region** | Select the region closest to your Whiteout AI deployment |
| **Object Ownership** | ACLs disabled (recommended) |
| **Block Public Access** | Block all public access (all four options checked) |
| **Bucket Versioning** | Enable (recommended for audit trails) |
| **Default encryption** | SSE-S3 or SSE-KMS (recommended) |

4. Click **Create bucket**

### Step 2: Configure a Bucket Policy (Optional)

If you want to restrict access to the bucket to only the Whiteout AI IAM role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowWhiteoutAIWrite",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:role/WhiteoutAI-S3-Writer"
      },
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-org-whiteout-ai-events/*"
    }
  ]
}
```

### Step 3: Create an IAM Policy

Create an IAM policy granting the minimum required permissions:

1. Navigate to **IAM** > **Policies** > **Create policy**
2. Use the JSON editor and enter:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "WhiteoutAIS3Write",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetBucketLocation",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-org-whiteout-ai-events",
        "arn:aws:s3:::your-org-whiteout-ai-events/*"
      ]
    }
  ]
}
```

3. If using SSE-KMS, add the following statement:

```json
{
  "Sid": "WhiteoutAIKMSAccess",
  "Effect": "Allow",
  "Action": [
    "kms:GenerateDataKey",
    "kms:Decrypt"
  ],
  "Resource": "arn:aws:kms:REGION:ACCOUNT_ID:key/KEY_ID"
}
```

4. Name the policy `WhiteoutAI-S3-Writer-Policy` and click **Create policy**

### Step 4: Create an IAM Role or User

**Option A: IAM Role (Recommended for cross-account or OIDC)**

1. Navigate to **IAM** > **Roles** > **Create role**
2. Select **Custom trust policy** and define the trust relationship for your Whiteout AI deployment (e.g., cross-account assume-role or OIDC federation)
3. Attach the `WhiteoutAI-S3-Writer-Policy` policy
4. Name the role `WhiteoutAI-S3-Writer`
5. Note the **Role ARN** for configuration

**Option B: IAM User (Simpler setup)**

1. Navigate to **IAM** > **Users** > **Create user**
2. User name: `whiteout-ai-s3-writer`
3. Select **Programmatic access** (Access key)
4. Attach the `WhiteoutAI-S3-Writer-Policy` policy
5. Click **Create user**
6. Copy the **Access Key ID** and **Secret Access Key** and store them securely

### Step 5: Configure Lifecycle Rules (Recommended)

Set up lifecycle policies for cost optimization and retention compliance:

1. Open your bucket in the S3 console
2. Go to the **Management** tab
3. Click **Create lifecycle rule**
4. Configure:

| Rule | Action | Timeframe |
|------|--------|-----------|
| **Transition to Glacier** | Transition to S3 Glacier Flexible Retrieval | After 90 days |
| **Transition to Deep Archive** | Transition to S3 Glacier Deep Archive | After 365 days |
| **Expiration** | Permanently delete objects | After 2555 days (7 years) or per compliance policy |

5. Click **Create rule**

### Step 6: Set Up Event Notifications (Optional)

Configure S3 event notifications to trigger downstream processing:

1. In the bucket settings, go to **Properties** > **Event notifications**
2. Click **Create event notification**
3. Configure to send notifications to an SNS topic, SQS queue, or Lambda function when new objects are created
4. This enables automated processing (e.g., loading events into Athena, Redshift, or a SIEM)

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **SOC/SIEM Destinations**
3. Click **Add Destination** and select **AWS S3**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **Bucket** | S3 bucket name for event storage (`bucket`) |
| **Prefix** | (Optional) Object key prefix, e.g. `whiteout-ai/events/` (`prefix`) |
| **Format** | Export file format: `jsonl` (default) or `parquet` (`format`) |
| **Cadence** | Delivery frequency: `hourly` (default) or `daily` (`cadence`) |

5. Click **Save & Test Connection**

---

## Verification

Test your AWS S3 destination:

1. **Connection Test**: Click **Test Connection** in the destination settings. Whiteout AI will verify bucket access by writing a small test object.
2. **Bucket Check**: In the AWS S3 console, navigate to your bucket and verify the test object exists under the configured prefix.
3. **Wait for First Batch**: After the first cadence interval (hourly or daily), verify that a batch file has been written:
   ```
   s3://your-org-whiteout-ai-events/whiteout-ai/events/2025/01/15/12/events-2025-01-15T12-00-00.jsonl
   ```
4. **Content Verification**: Download a batch file and inspect its contents to confirm events are present and correctly formatted.
5. **Format Check**: If using Parquet format, verify the file can be read by Athena or a Parquet-compatible tool:
   ```sql
   -- Example Athena query
   SELECT * FROM whiteout_ai_events LIMIT 10;
   ```

---

## Troubleshooting

### "Access Denied" Errors

- Verify the IAM user or role has the `s3:PutObject` and `s3:GetBucketLocation` permissions on the target bucket
- Check that the bucket policy does not explicitly deny access from the Whiteout AI principal
- If using SSE-KMS, confirm the IAM policy includes `kms:GenerateDataKey` permissions on the KMS key
- Verify the bucket name is correct (S3 bucket names are globally unique)

### No Files Appearing in the Bucket

- Check that the configured cadence has elapsed (hourly or daily)
- Verify there are auditable events in Whiteout AI to export (no events means no batch file)
- Review the delivery logs in **Settings** > **SOC/SIEM Destinations** > **AWS S3** > **Delivery Logs**
- Confirm the prefix path is correct and does not contain leading slashes

### Incorrect File Format

- Verify the format setting matches your expectation (`jsonl` or `parquet`)
- If you changed the format after initial setup, new files will use the updated format but existing files remain unchanged
- Ensure your downstream tools support the selected format

### Cross-Region Issues

- Ensure the S3 bucket region matches what Whiteout AI expects
- Cross-region writes may introduce latency; use a bucket in the same region as your Whiteout AI deployment
- Check for any S3 VPC endpoint policies that may restrict cross-region access

### Large File Sizes

- If batch files are very large, consider switching from `daily` to `hourly` cadence to produce smaller, more frequent files
- Enable S3 Intelligent-Tiering to optimize storage costs for varying access patterns

---

## Security Considerations

- **Block Public Access**: Always keep all public access settings blocked on the S3 bucket. Audit events contain sensitive information and must never be publicly accessible.
- **Enable Encryption**: Use SSE-S3 or SSE-KMS for server-side encryption at rest. SSE-KMS provides key rotation and audit trail via AWS CloudTrail.
- **Least Privilege IAM**: Grant only `s3:PutObject`, `s3:GetBucketLocation`, and `s3:ListBucket` permissions. Do not grant `s3:GetObject` or `s3:DeleteObject` to the writer role.
- **Enable Bucket Versioning**: Protect against accidental or malicious deletion of audit events by enabling versioning.
- **Enable Access Logging**: Turn on S3 server access logging or AWS CloudTrail data events to maintain an audit trail of all bucket operations.
- **Rotate Access Keys**: If using IAM user access keys, rotate them every 90 days. Update the Whiteout AI configuration immediately after rotation.
- **MFA Delete**: Consider enabling MFA Delete on the bucket to prevent unauthorized deletion of audit event files.
- **VPC Endpoints**: Use S3 VPC endpoints to keep traffic between Whiteout AI and S3 on the AWS private network, avoiding the public internet.
- **Retention Lock**: For strict compliance requirements, consider using S3 Object Lock in Governance or Compliance mode to enforce immutable retention periods.
