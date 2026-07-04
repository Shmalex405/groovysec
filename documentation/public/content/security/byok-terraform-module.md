# BYOK Terraform Module

This Terraform module creates a KMS key in your AWS account configured for use with Whiteout AI. It handles all key policy configuration automatically, so you don't have to hand-edit JSON policy statements.

The module source is available on GitHub at [groovysec/whiteout-byok-terraform](https://github.com/groovysec/whiteout-byok-terraform.git).

For background on what BYOK covers and the manual setup alternative, see [Bring Your Own Key (BYOK) Encryption](./security/byok.md).

## What the Module Creates

1. **KMS Key** — a symmetric customer managed key (CMK) with:
   - Automatic annual key rotation enabled
   - A 30-day deletion waiting period
   - The complete key policy required by Whiteout

2. **Key Policy** with statements for:
   - Your account's full admin access (you retain control)
   - Whiteout's encryption/decryption operations
   - AWS service principals (S3, RDS, EC2, Secrets Manager)
   - CloudWatch Logs encryption

3. **Key Alias** — `alias/whiteout/<org_slug>` for easy identification

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.0
- Whiteout's **AWS account ID** (provided by your account manager)
- Your **organization slug** (assigned during Whiteout onboarding)

## Usage

```bash
# 1. Get the module
git clone https://github.com/groovysec/whiteout-byok-terraform.git
cd whiteout-byok-terraform

# 2. Create your configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# 3. Deploy
terraform init
terraform plan
terraform apply

# 4. Send the key_arn output to Whiteout
```

### Example Configuration

```hcl
# terraform.tfvars
whiteout_account_id = "123456789012"   # From your Whiteout account manager
org_slug            = "acme-corp"
region              = "us-west-2"

key_administrators = [
  "arn:aws:iam::111122223333:role/SecurityAdmin"
]

tags = {
  Environment = "production"
  CostCenter  = "security-ops"
}
```

## Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `whiteout_account_id` | Yes | Whiteout's AWS account ID (12 digits) |
| `org_slug` | Yes | Your organization identifier in Whiteout |
| `region` | Yes | AWS region matching your Whiteout deployment (default: `us-west-2`) |
| `key_administrators` | No | Additional IAM ARNs granted key administration |
| `enable_key_rotation` | No | Enable automatic annual rotation (default: `true`) |
| `deletion_window_in_days` | No | Key deletion waiting period (default: `30`) |
| `tags` | No | Additional resource tags |

The `region` must match your Whiteout deployment region — `us-west-2` for US Production, `eu-west-1` for EU Production.

## Outputs

After `terraform apply`, you'll see:

| Output | Description |
|--------|-------------|
| `key_arn` | **Send this to Whiteout** — the KMS key ARN |
| `key_id` | The KMS key ID |
| `key_alias` | Friendly alias (`alias/whiteout/<org_slug>`) |
| `next_steps` | Instructions for completing setup |

## What Gets Encrypted

Once Whiteout configures your organization, this key encrypts all your organization's data in Whiteout:

| Resource | Description |
|----------|-------------|
| S3 Uploads | Documents, images, attachments |
| RDS Database | PostgreSQL storage at rest |
| EBS Volumes | GPU instance disks |
| CloudWatch Logs | Application logs |
| Secrets Manager | Per-organization encryption keys |

## Verification

After Whiteout configures your BYOK:

1. **Check CloudTrail** for KMS events from Whiteout's account
2. **Upload a test file** in Whiteout
3. **Verify the event** shows `GenerateDataKey` from your key

## Revoking Access

To revoke Whiteout's access, remove the `AllowWhiteout*` policy statements or destroy the key:

```bash
# WARNING: This makes all encrypted data unrecoverable!
# Export data from Whiteout BEFORE revoking

# Option 1: Destroy the key entirely
terraform destroy

# Option 2: Modify the policy (edit main.tf to remove the Whiteout statements)
terraform apply
```

`terraform destroy` schedules the key for deletion after the 30-day waiting period, during which you can still cancel. See [Revoking Access](./security/byok.md#revoking-access) in the BYOK guide for the full consequences before proceeding.

## Support

- **Whiteout Support**: support@groovysec.com
- **Documentation**: [BYOK Encryption Guide](./security/byok.md)
