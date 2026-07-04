# Self-Hosted AWS Deployment

Whiteout AI can be deployed entirely inside your own AWS account. This page gives evaluators and deployment engineers an overview of what a self-hosted deployment looks like, what you need before you start, and what running it costs — so you can assess fit before requesting a license.

## Overview

In a self-hosted deployment, the entire Whiteout AI platform — API, database, object storage, and the on-instance compliance LLM — runs inside your AWS account, in your VPC. Groovy Security has no access to your data, your database, or your users.

The deployment is delivered as a Terraform module included with your license. You run `terraform apply` with your own credentials; every resource is created in your account and owned by you.

Only three narrow interactions cross the account boundary, all read-only or cryptographically signed:

- **Container image pull** — your deployment pulls the Whiteout AI backend image from Groovy Security's private container registry using a read-only, cross-account pull policy scoped to your AWS account.
- **License validation** — your deployment sends only its license key and receives back a signed token. A cached token allows continued offline validation if the license service is briefly unreachable.
- **Client discovery** — Whiteout AI's desktop app, browser extension, and IDE extensions look up which backend serves your users based on their email domain. The central service stores only that domain-to-URL mapping — never user records, passwords, or session data.

---

## Architecture at a Glance

| Property | Value |
|----------|-------|
| **Resources created** | Roughly 50–60 AWS resources |
| **Typical apply time** | 15–25 minutes end to end |
| **Supported regions** | `us-west-2` and `eu-north-1` (others on request, subject to GPU availability) |
| **Compliance LLM** | Runs on a `g6e.xlarge` GPU instance in your VPC — inference never leaves your account |
| **Availability zones** | Auto-selected across every GPU-capable AZ in your region; no AZ configuration required |

The module provisions a standard, well-understood AWS stack:

- **VPC** with public and private subnets, NAT gateway, and internet gateway
- **Application Load Balancer** terminating TLS with an ACM certificate issued in your account
- **ECS Fargate** running the Whiteout AI backend (horizontally scalable)
- **RDS PostgreSQL** with Multi-AZ support
- **S3** for uploads, encrypted with **KMS** (customer-managed keys supported — see [BYOK](./security/byok.md))
- **GPU Auto Scaling Group** hosting the on-instance compliance LLM
- **Route53** DNS records under a hosted zone you control

Everything that touches your data lives in your private subnets.

---

## Prerequisites

Before deploying, make sure you have:

| Requirement | Notes |
|-------------|-------|
| **AWS account** | With administrator-level credentials for the initial apply (you can scope down afterward) |
| **Terraform** | Version 1.5 or later |
| **AWS provider** | `~> 5.55` |
| **AWS CLI** | Version 2 |
| **GPU vCPU quota** | See below — request this early |
| **Route53 hosted zone** | A domain (or subdomain) you control, hosted in Route53 |
| **Transactional email account** | A [Resend](https://resend.com) account with a verified sending domain — your deployment sends its own invites, password resets, and MFA emails; email never touches Groovy Security's infrastructure |
| **License key** | Issued by Groovy Security with your deployment package |

### GPU quota

The compliance LLM runs on a `g6e.xlarge` instance (4 vCPUs). New AWS accounts often have a **vCPU quota of 0** for the G instance family, and quota increases can take anywhere from a few hours to a few days — so check and request early:

```bash
aws service-quotas get-service-quota \
  --service-code ec2 \
  --quota-code L-DB2E81BA \
  --region us-west-2 \
  --query 'Quota.Value'
```

Request a quota of at least **4 vCPUs** for "Running On-Demand G and VT instances" in your deployment region.

If you want to validate the rest of the stack while the quota request is pending, the module supports deploying with the GPU subsystem disabled and enabling it later (compliance LLM features stay dark until then).

---

## What Deployment Involves

At a high level, the licensed deployment process is:

1. Unpack the Terraform module delivered with your license and verify its checksum
2. Configure your variables (region, domain, sizing, license key, email settings)
3. Run `terraform apply` — expect 15–25 minutes
4. Run database migrations as a one-shot task
5. Bootstrap your first admin user (email setup link or break-glass password)
6. Verify health, sign in, and onboard users manually or via SSO/SCIM

The full step-by-step guide covers each of these with exact commands, verification checks, and troubleshooting.

---

## Day-2 Operations

### Automatic updates

The module deploys an updater that runs daily. It fetches Groovy Security's **signed release manifest**, verifies the signature against a public key embedded in the module, and — only if the published image digest differs from your running one — registers a new task definition, runs database migrations, and rolls the service. Failed rollouts are automatically rolled back to the previous version, and every outcome is published to an SNS topic you can subscribe your pager or email to.

Major-version bumps are never applied automatically — the updater blocks and notifies you so you can review breaking changes first. You can also pin your version entirely and apply updates manually on your own schedule.

### Backups and recovery

- **RDS**: automated backups with 7-day retention, deletion protection enabled, performance insights on
- **S3**: versioning enabled on the uploads bucket
- **Secrets Manager**: 7-day recovery window on deleted secrets

You can take manual RDS snapshots at any time before risky changes.

### Bring Your Own Key (BYOK)

If your security team requires a customer-managed KMS key with a restricted key policy, the module supports supplying your own key ARN for encryption at rest across the stack. See the [BYOK guide](./security/byok.md) for the key policy requirements.

---

## Cost Estimate

A baseline production deployment in `us-west-2`, before request volume:

| Component | Approximate monthly cost |
|-----------|--------------------------|
| GPU instance (1 × `g6e.xlarge`, 24×7) | ~$1,350 |
| RDS PostgreSQL (`db.t4g.medium`, Multi-AZ, 50 GB) | ~$120 |
| Networking (NAT gateways, ALB) | ~$85 |
| ECS Fargate (2 tasks × 1 vCPU × 2 GB) | ~$60 |
| KMS, Secrets Manager, CloudWatch Logs, S3 | ~$30 |
| **Baseline total** | **~$1,650 / month** |

The GPU instance dominates. For pilots and non-production environments, the GPU Auto Scaling Group can scale to zero between uses (trading always-on inference for a roughly 3-minute cold start), or the GPU subsystem can be disabled entirely, which reduces the baseline to a few hundred dollars per month.

---

## Offboarding

Offboarding is a clean, single-command exit. Because your data lives only in your account, you can capture a final RDS snapshot and copy any S3 contents you want to retain, then run `terraform destroy` to remove the deployment (only the small Terraform state backend you created is deleted separately). Groovy Security then revokes your license and registry access — nothing of yours remains on Groovy Security's side to delete.

---

## Getting Started

The complete deployment package is provided with your license and includes:

- The **Terraform module** and a versioned, checksummed release archive
- The **full step-by-step deployment guide** with exact commands, verification steps, and troubleshooting
- Your **license key** and the backend image tag validated for your deployment
- **Hands-on support** from your account manager during the deploy

To evaluate Whiteout AI self-hosted:

- **Request a demo** at [groovysec.com/demo](https://www.groovysec.com/demo)
- **Contact sales** to discuss licensing and receive the deployment package
- **Existing customers**: email **support@groovysec.com** or reach your account manager directly
