# Bring Your Own Key (BYOK) Encryption

This guide walks you through setting up customer-managed encryption keys (BYOK) for your Whiteout AI deployment.

## Overview

Whiteout AI supports customer-managed encryption keys for organizations that require full control over their encryption key lifecycle. With BYOK, your organization's data is encrypted using an AWS KMS customer managed key (CMK) that you create and control in your own AWS account.

BYOK provides:

- **Full key control**: You own and manage the key lifecycle
- **Audit visibility**: All key usage appears in your CloudTrail logs
- **Revocation capability**: You can revoke Whiteout's access at any time
- **Compliance**: Meet regulatory requirements for key management

## What Gets Encrypted With Your Key

| Resource | Description |
|----------|-------------|
| **S3 Uploads** | All files uploaded through Whiteout (documents, images, attachments) |
| **RDS Database** | Database storage encryption at rest |
| **EBS Volumes** | GPU instance disk encryption for the compliance LLM |
| **CloudWatch Logs** | Application log encryption |
| **Secrets Manager** | Per-organization encryption keys |

## How It Works

1. You create a symmetric KMS key in your own AWS account
2. You add key policy statements granting Whiteout's AWS account permission to use (but not administer) the key
3. You provide the key ARN to your Whiteout account manager
4. Whiteout validates the key and configures your organization to encrypt with it
5. Every encryption and decryption operation is logged in your CloudTrail, and you can revoke access at any time

You retain full administrative control of the key at all times — Whiteout is only granted the cryptographic operations needed to encrypt and decrypt your data.

## Prerequisites

Before you begin, ensure you have:

- An AWS account with KMS access
- IAM permissions to create and modify KMS keys
- Your Whiteout deployment region (see table below)
- Your Whiteout **organization slug** (provided by your account manager)
- Whiteout's **AWS account ID** (provided by your account manager)

### Deployment Regions

| Deployment | Region | Notes |
|------------|--------|-------|
| US Production (default) | `us-west-2` | Oregon |
| EU Production | `eu-west-1` | Ireland |

Your KMS key **must be in the same region** as your Whiteout deployment.

---

## Option A: Terraform Module (Recommended)

The fastest way to set up BYOK is with our Terraform module, which creates the key and configures the full key policy automatically. See the [BYOK Terraform Module](./security/byok-terraform-module.md) guide for complete documentation.

```bash
# 1. Get the module
git clone https://github.com/groovysec/whiteout-byok-terraform.git
cd whiteout-byok-terraform

# 2. Create your configuration
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
# Required: Get these from your Whiteout account manager
whiteout_account_id = "123456789012"
org_slug            = "your-org-slug"

# Must match your Whiteout deployment region
region = "us-west-2"  # or "eu-west-1" for EU
```

```bash
# 3. Deploy
terraform init
terraform plan    # Review what will be created
terraform apply

# 4. Note the key_arn output — provide this to Whiteout
```

The module creates a KMS key with automatic annual rotation, the complete key policy, a key alias (`alias/whiteout/<your-org-slug>`), and 30-day deletion protection.

---

## Option B: Manual Setup

If you prefer to create the key manually or integrate with existing infrastructure:

### Step 1: Create Your KMS Key

Create a **symmetric** KMS key in your AWS account in the **same region** as your Whiteout deployment.

#### Using the AWS Console

1. Navigate to **KMS** > **Customer managed keys**
2. Ensure you're in the correct region (top-right dropdown)
3. Click **Create key**
4. Select **Symmetric** key type
5. Select **Encrypt and decrypt** key usage
6. Add tags for tracking
7. Complete the wizard

#### Using the AWS CLI

```bash
# Set your region (must match your Whiteout deployment)
export REGION=us-west-2  # or eu-west-1 for EU

# Create the key
aws kms create-key \
  --description "Whiteout AI encryption key for [YOUR_ORG]" \
  --region $REGION \
  --tags TagKey=Purpose,TagValue=WhiteoutAI TagKey=Environment,TagValue=Production

# Note the KeyId from the output, e.g., "12345678-1234-1234-1234-123456789012"
```

#### Enable Key Rotation (Recommended)

```bash
aws kms enable-key-rotation --key-id <YOUR_KEY_ID> --region $REGION
```

### Step 2: Add the Required Key Policy

Your KMS key policy must grant Whiteout's AWS account permission to use the key for encryption operations.

Contact your Whiteout account manager to obtain:

- **Whiteout's AWS account ID** (e.g., `123456789012`)
- **Your organization slug** (e.g., `acme-corp`)
- **Deployment region** (e.g., `us-west-2` or `eu-west-1`)

#### Key Policy Template

Add the following statements to your KMS key policy. Replace the placeholder values:

- `WHITEOUT_ACCOUNT_ID` → Whiteout's AWS account ID
- `YOUR_ORG_SLUG` → Your organization slug
- `REGION` → Your deployment region (e.g., `us-west-2`)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowWhiteoutAccountAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::WHITEOUT_ACCOUNT_ID:root"
      },
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey",
        "kms:CreateGrant"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowWhiteoutServicesViaService",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:CreateGrant",
        "kms:DescribeKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:CallerAccount": "WHITEOUT_ACCOUNT_ID"
        },
        "StringLike": {
          "kms:ViaService": [
            "s3.REGION.amazonaws.com",
            "rds.REGION.amazonaws.com",
            "ec2.REGION.amazonaws.com",
            "secretsmanager.REGION.amazonaws.com"
          ]
        }
      }
    },
    {
      "Sid": "AllowCloudWatchLogs",
      "Effect": "Allow",
      "Principal": {
        "Service": "logs.REGION.amazonaws.com"
      },
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ],
      "Resource": "*",
      "Condition": {
        "ArnLike": {
          "kms:EncryptionContext:aws:logs:arn": "arn:aws:logs:REGION:WHITEOUT_ACCOUNT_ID:log-group:/ecs/*YOUR_ORG_SLUG*"
        }
      }
    }
  ]
}
```

#### Apply the Policy

```bash
# First, get the current policy
aws kms get-key-policy --key-id <YOUR_KEY_ID> --policy-name default --output text > current-policy.json

# Edit current-policy.json to add the statements above
# Then apply the updated policy

aws kms put-key-policy \
  --key-id <YOUR_KEY_ID> \
  --policy-name default \
  --policy file://updated-policy.json
```

**Important**: Add the Whiteout statements to your existing policy. Do not replace your entire policy, as this would remove your own admin access.

---

## Step 3: Provide Your Key ARN to Whiteout

Send your KMS key ARN to your Whiteout account manager:

```
arn:aws:kms:REGION:YOUR_ACCOUNT_ID:key/YOUR_KEY_ID
```

Example:

```
arn:aws:kms:us-west-2:111122223333:key/12345678-1234-1234-1234-123456789012
```

Whiteout will:

1. Validate the key is accessible, enabled, symmetric, and correctly configured
2. Configure your organization to use the key
3. Notify you when setup is complete

---

## Verification

After Whiteout configures your BYOK:

### Check CloudTrail

1. Navigate to **CloudTrail** > **Event history** in your AWS Console
2. Filter by **Event source**: `kms.amazonaws.com`
3. Look for events from Whiteout's account ID

You should see events like:

| Event | Meaning |
|-------|---------|
| `GenerateDataKey` | S3/RDS envelope encryption |
| `Decrypt` | Reading encrypted data |
| `Encrypt` | Writing encrypted data |

### Test Upload

1. Upload a file in Whiteout
2. Verify the corresponding KMS event appears in your CloudTrail within a few minutes

---

## Key Rotation

### Automatic Rotation

If enabled, AWS automatically rotates the key material annually:

- Your key ID and ARN remain the same
- No Whiteout configuration changes are needed
- Old data remains accessible (AWS maintains previous key versions)

### Manual Rotation

For manual rotation, contact Whiteout support **before** making any changes:

1. Email support@groovysec.com with your rotation plan
2. Whiteout will coordinate the migration
3. Do not disable or delete the old key until the migration is confirmed

---

## Revoking Access

**WARNING**: Revoking Whiteout's access to your key immediately makes all of your encrypted data in Whiteout unrecoverable — uploads, database contents, and logs. This action cannot be undone. This is by design: it is the guarantee BYOK provides, but it means revocation is destructive, not a pause button.

### Before Revoking

1. Export any data you need from Whiteout
2. Contact support@groovysec.com to coordinate
3. Ensure you have backups of critical information

### To Revoke Access

If you used the Terraform module:

```bash
cd whiteout-byok-terraform
terraform destroy
```

If you created the key manually, remove the Whiteout statements from your key policy:

```bash
# Get the current policy
aws kms get-key-policy --key-id <YOUR_KEY_ID> --policy-name default --output text > current-policy.json

# Edit to remove the Whiteout statements (AllowWhiteout*, AllowCloudWatchLogs)
# Apply the updated policy

aws kms put-key-policy \
  --key-id <YOUR_KEY_ID> \
  --policy-name default \
  --policy file://updated-policy.json
```

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `AccessDeniedException` during setup | Key policy missing or incorrect | Verify all three policy statements are present |
| `KMSKeyNotAccessibleException` | Key is disabled or pending deletion | Re-enable the key in the AWS Console |
| S3 upload fails with a KMS error | Missing service in `kms:ViaService` | Ensure s3, rds, ec2, and secretsmanager are all listed |
| RDS creation fails | Missing `CreateGrant` permission | Add `kms:CreateGrant` to `AllowWhiteoutAccountAccess` |
| CloudWatch logs not appearing | Incorrect encryption context condition | Verify your org slug in the CloudWatch policy statement |
| Region mismatch | Key in a different region than your deployment | Create the key in the correct region |

If you're stuck, contact support@groovysec.com — Whiteout runs an automated validation against your key ARN during onboarding that checks accessibility, key state, key type, and required permissions.

---

## Security Best Practices

1. **Enable CloudTrail logging** for KMS events
2. **Enable automatic key rotation**
3. **Use AWS IAM policies** to restrict who can modify the key
4. **Set up CloudWatch alarms** for unexpected KMS usage
5. **Document your key policy** and review it quarterly
6. **Test key rotation** in a staging environment first

---

## FAQ

### Can I use an existing KMS key?

Yes, as long as:

- The key is symmetric (`SYMMETRIC_DEFAULT`)
- The key is in the same region as your Whiteout deployment
- You can add the required policy statements

### What happens if I disable my key?

All Whiteout operations that require encryption or decryption fail immediately. This includes:

- Uploading files
- Reading stored data
- Writing to the database
- Viewing logs

Re-enable the key to restore functionality. Unlike revocation, disabling a key is reversible — data becomes accessible again once the key is re-enabled.

### Can I use a multi-region key?

Currently, Whiteout requires a single-region key in the deployment region. Multi-region key support is planned for a future release.

### How do I audit key usage?

Use AWS CloudTrail to monitor all KMS API calls. You can:

- Filter by your key ID
- Filter by Whiteout's account ID as the invoking principal
- Set up CloudWatch alarms for unusual patterns

### What does BYOK cost?

Standard AWS KMS pricing applies, billed to your AWS account:

- ~$1/month per customer-managed key
- $0.03 per 10,000 API requests

Typical Whiteout usage results in minimal KMS costs ($1–5/month).

### Should I use the Terraform module or manual setup?

**Use the [Terraform module](./security/byok-terraform-module.md)** if:

- You want the fastest setup
- You use Terraform for infrastructure
- You want automatic policy configuration

**Use manual setup** if:

- You have existing key management processes
- You need to integrate with a shared key
- Your security team requires manual review of all policies

---

## Support

For BYOK setup assistance:

- Email: support@groovysec.com
- Include your organization slug and key ARN (never key material)
