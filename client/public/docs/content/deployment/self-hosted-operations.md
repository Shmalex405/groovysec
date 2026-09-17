# Managing Your Self-Hosted Deployment

Day-two operations for Whiteout running in your own AWS account: scaling the
compliance engine, tuning capacity, handling updates, and the settings that
look adjustable but are not.

This assumes you are already deployed. For the initial deployment see
[Self-Hosted AWS](/admin-guides/deployment/self-hosted-aws).

Everything here is a Terraform variable in the module you were shipped. Change
the value, `terraform plan`, read the diff, `terraform apply`.

---

## Read this before changing the engine

The compliance engine is a **tier**, not a set of independent knobs. The GPU
card, the model, the reasoning parser and the reasoning settings are chosen to
work together, and moving one without the others produces an engine that
starts, answers, and is wrong — or does not start at all.

The standard tier, which is what you are running unless you asked otherwise:

| | |
|---|---|
| `gpu_instance_type` | `g5.xlarge` — A10G, 24 GB |
| `vllm_model` | `openai/gpt-oss-safeguard-20b` |
| `vllm_max_num_seqs` | `24` |

This is the identical configuration Whiteout runs in its own accounts. A
client-hosted deployment and a Whiteout-hosted one differ only by AWS account.

> **The specific trap.** A larger model on the same card does not work. Qwen
> 3.5-27B-GPTQ-Int4 is hybrid Mamba/attention, and its Mamba layers stay bf16
> under Int4 quantisation — roughly 22 GB of weights alone, before any KV
> cache, on a 24 GB card. It also needs the inverse reasoning settings. If you
> want a larger model you need the larger card *and* the matching reasoning
> configuration, which is why we treat it as one unit.
>
> **A bigger card buys latency and concurrency, not accuracy.** Corpus-weighted
> accuracy is equivalent across tiers. If your engine is keeping up, there is
> nothing to gain.

**Talk to us before changing the tier.** It is a supported change; it is not a
single-variable change.

---

## Scaling the engine

This is the safe, common adjustment: how many engine nodes run.

| Variable | Default | What it does |
|---|---|---|
| `gpu_desired_capacity` | `1` | Engine nodes running now |
| `gpu_min_size` | `1` | Floor. `0` means no engine at all |
| `gpu_max_size` | `3` | Ceiling for autoscaling |

**When to add a node.** Prompts queueing and timing out is the signal. Users
experience it as slow or failed checks under load, typically at the start of
the working day.

> **A saturated engine does not fail open.** Exceeding `engine_queue_wait_secs`
> is an error, not a pass. Prompts are never silently allowed through because
> the engine was busy — which is the correct behaviour for a governance
> product, and it means queueing shows up as visible failures rather than
> silent gaps in coverage.

**Setting `gpu_min_size = 0`** switches the deployment to audit-only in
practice: with no engine, prompt evaluation cannot run. That is a legitimate
configuration for discovery-only deployments, but do not set it while
expecting enforcement.

### GPU quota, which is the usual blocker

`g5.xlarge` is 4 vCPU against the **Running On-Demand G and VT instances**
quota (`L-DB2E81BA`) in your deploy region. A fresh AWS account often has 0.

Check before scaling:

```bash
aws service-quotas get-service-quota \
  --service-code ec2 --quota-code L-DB2E81BA --region <your-region>
```

You need 4 vCPU per engine node. Increases are a support request to AWS and
can take a day or two, so raise it before you need the capacity.

---

## Capacity beyond the engine

### API tasks

| Variable | Default | Notes |
|---|---|---|
| `ecs_desired_count` | `1` | Backend tasks |
| `ecs_cpu` | `1024` | CPU units per task |
| `ecs_memory` | `2048` | MB per task |

Scaling the API out has a consequence worth knowing:

> **`max_concurrent_engine_calls` is per backend process, not per cluster.** At
> `ecs_desired_count = 1` the value is exact. Raise the task count to 3 and the
> effective cap on the engine becomes three times that number — which can
> saturate an engine that was comfortable before. If you scale the API, revisit
> this together with `vllm_max_num_seqs`.

### Concurrency

| Variable | Default | Notes |
|---|---|---|
| `vllm_max_num_seqs` | `24` | Engine burst capacity. Card-dependent — part of the tier |
| `max_concurrent_engine_calls` | — | Backend admission control. Should track the above |
| `engine_queue_wait_secs` | — | How long a prompt may wait for a slot |

`max_concurrent_engine_calls` should track `vllm_max_num_seqs`. Admitting more
does not increase throughput; it moves the queue inside vLLM, where it has no
deadline and no visibility. You lose the ability to see the backlog.

`engine_queue_wait_secs` is bounded above by your load balancer's idle timeout.
The whole request has to finish inside that or the client gets a 504 regardless
of what this is set to.

### Database

| Variable | Default | Notes |
|---|---|---|
| `db_instance_class` | `db.t4g.small` | Comfortable well past a few hundred users |
| `db_multi_az` | — | Enable for production resilience |
| `db_allocated_storage` / `db_max_allocated_storage` | — | Autoscaling storage bounds |

---

## The connector scanner GPU

Separate from the compliance engine, and off unless you use the Whiteout AI
Connector.

| Variable | Notes |
|---|---|
| `connector_scanner_gpu_enabled` | Opt-in |
| `connector_scanner_gpu_desired_capacity` | `0` normally — raise to `1` to start a backfill |
| `connector_scanner_gpu_min_size` / `_max_size` | Bounds |

This one is **ephemeral by design**. The initial scan of a large document store
is the expensive part — roughly two days for a 500,000-document drive — and the
scanner scales back to zero afterwards. Steady-state vetting uses the main
engine.

Raise `connector_scanner_gpu_desired_capacity` to `1` when starting a backfill,
and return it to `0` when it completes. Leaving it at `1` is a standing GPU bill
for an idle node.

---

## Updates

| Variable | Notes |
|---|---|
| `auto_update_enabled` | Whether updates apply automatically |
| `update_schedule` | When the updater runs |
| `update_channel` | Which release stream |
| `image_tag` / `image_tag_pattern` | Pin an exact version, or follow a pattern |

Auto-update pulls the new backend image from Whiteout's registry into your
account on the schedule you set. Nothing leaves your environment.

**Pinning `image_tag`** holds you on a specific version — useful during a
change freeze. Remember to unpin afterwards; a pinned deployment silently stops
receiving fixes, including security ones.

---

## A change you should not make

**Do not edit resources in the AWS console.** The stack is Terraform-managed,
so a console change is either reverted on the next apply or causes the apply to
fail with a state mismatch. Change the variable and apply.

If something has already drifted, `terraform plan` shows it. Tell us rather
than forcing it — the fix depends on what drifted.

---

## Getting help

When raising anything about capacity or the engine, send:

- `terraform output` from your deployment
- the variable values you have changed from their defaults
- what you are seeing, and when it started

The generated support diagnostics bundle contains this. Your Groovy contact can
tell you how to produce one.
