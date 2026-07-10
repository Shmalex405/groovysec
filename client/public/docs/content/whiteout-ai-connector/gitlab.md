# Connect GitLab

> **Availability: ⚙️ Requires operator setup.** GitLab needs its OAuth
> app configured for your Whiteout deployment (`GITLAB_CLIENT_ID/SECRET`,
> a one-time operator step). gitlab.com is supported; self-hosted GitLab
> is a scoped follow-up.

Expose GitLab projects, issues, merge requests, and code to AI
assistants through the Whiteout AI Connector. GitLab is a **live
source**: per-user only, classified **on demand at query time**.

- **Whiteout governs content** — file bodies are decoded and vetted
  before an AI sees them (never raw base64); code-search snippets,
  issue/MR titles, and project descriptions are vetted per item.
- **GitLab governs access** — each user connects their own account and
  sees exactly their project memberships.

## Prerequisites

- **Whiteout admin** access; operator has set `GITLAB_CLIENT_ID/SECRET`
- Each user connects their GitLab account from **Connect your sources**
  (scope: `read_api`)

## Expose it

1. **Integrations → Whiteout AI Connector** → toggle **GitLab** on.
2. Users connect their accounts; queries serve their own view, vetted.
