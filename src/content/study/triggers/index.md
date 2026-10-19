---
title: Triggers & Scheduling
description: Deep dive on events — push, pull_request, workflow_dispatch, schedule, repository_dispatch, workflow_run.
module: Triggers & Scheduling
order: 2
draft: false
---

# Triggers & Scheduling

The `on:` key is the heartbeat of your workflow. It tells GitHub exactly when to start the automation. The certification exam heavily tests your ability to pick the right event, configure filters correctly, and understand event payloads.

> **Certification tip:** Know the difference between `branches`, `branches-ignore`, `paths`, and `paths-ignore`. You cannot use `branches` and `branches-ignore` together in the same `on.push` block — same for `paths`/`paths-ignore`.

---

## 1. The `on` Key — Three Shorthand Styles

GitHub Actions lets you express triggers three ways. All are valid; choose based on how much filtering you need.

### Style A: Single event (string)

```yaml
on: push
```

Runs on every push to any branch or tag. No filtering.

### Style B: List of events

```yaml
on:
  - push
  - pull_request
  - workflow_dispatch
```

Multiple independent triggers. Any one can start the workflow.

### Style C: Object with configuration (recommended for exams)

```yaml
on:
  push:
    branches: ["main", "release/*"]
    tags: ["v1.*"]
    paths:
      - "src/**"
      - "package.json"

  pull_request:
    branches: ["main"]
    types: [opened, synchronize, reopened]

  schedule:
    - cron: "0 0 * * 0"

  workflow_dispatch:
    inputs:
      environment:
        description: "Deploy target"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production
```

---

## 2. Push Event

Triggered on branch or tag pushes.

### Full configuration reference

```yaml
on:
  push:
    branches:
      - main               # exact match
      - "releases/v*"      # glob pattern
      - "feature/**"       # double-star matches subdirectories
    branches-ignore:
      - "dependabot/**"    # skip dependabot PRs
    tags:
      - "v*"               # semantic version tags
    paths:
      - "src/**"
      - "README.md"
    paths-ignore:
      - "docs/**"
```

| Filter | Behavior |
|--------|----------|
| `branches` | Only run for these branches |
| `branches-ignore` | Skip these branches |
| `tags` | Only run for these tag patterns |
| `paths` | Only run if changed files match |
| `paths-ignore` | Skip if only these files changed |

### Rules to remember

- You **cannot** use both `branches` and `branches-ignore` in the same event block.
- You **cannot** use both `paths` and `paths-ignore` in the same event block.
- If you don't specify any filter, the workflow runs on **all** pushes.

### Example: Only deploy when production files change

```yaml
on:
  push:
    branches: [main]
    paths:
      - "infrastructure/**"
      - "deploy.yml"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploying infrastructure changes..."
```

---

## 3. Pull Request Event

Triggered on PR activity. Critical for understanding `types`.

### `types` — which PR actions trigger the run

```yaml
on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
      - closed
    branches: [main]
```

| `types` value | When it fires |
|---------------|---------------|
| `opened` | A PR is opened |
| `reopened` | A closed PR is reopened |
| `synchronize` | New commits pushed to the PR branch |
| `closed` | PR is closed (merged or declined) |
| `assigned` | PR is assigned to someone |
| `unassigned` | Assignment removed |
| `review_requested` | Review requested |
| `ready_for_review` | Draft PR marked ready |
| `labeled` | Label added |
| `unlabeled` | Label removed |

### `closed` + merged check

```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  deploy:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "PR was merged — deploying..."
```

> **Certification tip:** `pull_request` runs on the **merge commit** (head merged into base), not the head branch commit. `pull_request_target` runs in the context of the **base** branch and can write secrets — dangerous with fork PRs.

---

## 4. Workflow Dispatch (Manual Trigger)

Run workflows on demand from the Actions tab or API, with inputs.

### Full input type reference

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Deployment environment"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production
      version:
        description: "App version to deploy"
        required: true
        default: "1.0.0"
        type: string
      force_rebuild:
        description: "Force rebuild from scratch?"
        required: false
        default: "false"
        type: boolean
      debug:
        description: "Enable debug logging?"
        required: false
        default: "false"
        type: boolean
```

Access inputs via `github.event.inputs.<name>`:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ github.event.inputs.version }} to ${{ github.event.inputs.environment }}"
      - if: ${{ github.event.inputs.debug == 'true' }}
        run: echo "Debug mode enabled"
```

### Input types

| Type | Description | Example value |
|------|-------------|---------------|
| `string` | Free text | `1.0.0` |
| `choice` | Dropdown | `staging` |
| `boolean` | Checkbox | `true` / `false` |
| `environment` | Deployment environment dropdown | `production` |

> **Certification tip:** Boolean inputs are passed as strings `"true"`/`"false"` — always compare with quotes in expressions.

---

## 5. Schedule (Cron)

Run workflows on a fixed interval. All times are **UTC**.

### Cron syntax

```text
┌───────────── minute (0 - 59)
┌───────────── hour (0 - 23)
┌───────────── day of month (1 - 31)
┌───────────── month (1 - 12)
┌───────────── day of week (0 - 6, Sunday = 0)
```

### Examples

```yaml
on:
  schedule:
    # Every day at midnight UTC
    - cron: "0 0 * * *"

    # Every Monday at 9:00 AM UTC
    - cron: "0 9 * * 1"

    # Every 15 minutes (minimum interval)
    - cron: "*/15 * * * *"

    # At 2:30 AM on the 1st of every month
    - cron: "30 2 1 * *"

    # Weekdays at 6 PM UTC
    - cron: "0 18 * * 1-5"
```

### Schedule constraints

- **Minimum interval:** Once every 15 minutes
- **Timezone:** UTC only
- **Forked repos:** Scheduled workflows are disabled by default on forks

### Example: Daily cleanup

```yaml
on:
  schedule:
    - cron: "0 3 * * *"   # 03:00 UTC daily

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "Running nightly cleanup..."
          # delete old artifacts, rotate logs, etc.
```

---

## 6. Repository Dispatch (External Trigger)

Triggered when a `repository_dispatch` event is sent via the GitHub REST API. Great for integrating external systems.

### External system sends the event

```bash
curl -X POST https://api.github.com/repos/OWNER/REPO/dispatches \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <token>" \
  -d '{"event_type": "build-requested", "client_payload": {"version": "1.2.3"}}'
```

### Workflow listens for it

```yaml
on:
  repository_dispatch:
    types: [build-requested, deploy-triggered]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Event: ${{ github.event.action }}"
      - run: echo "Version: ${{ github.event.client_payload.version }}"
```

> **Certification tip:** `github.event.action` holds the `event_type` string. `client_payload` carries custom data from the external caller.

---

## 7. Workflow Run (Workflow Chaining)

Triggered when another workflow completes. Use this for multi-stage pipelines (e.g., CI → Deploy).

```yaml
on:
  workflow_run:
    workflows: ["CI Pipeline"]
    types:
      - completed

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download CI artifacts
        uses: actions/github-script@v7
        with:
          script: |
            // download artifacts from the triggering workflow run
      - run: echo "CI passed — deploying to production"
```

| `types` value | Meaning |
|---------------|---------|
| `completed` | The referenced workflow finished (success, failure, or cancelled) |
| `requested` | The referenced workflow was queued |

> **Certification tip:** Use `github.event.workflow_run.conclusion` to gate your job on the upstream result. `workflow_run` cannot trigger itself (no infinite loops).

---

## 8. Event Comparison — Visual Flow

```mermaid
flowchart TD
    A[Developer pushes code] --> B[push event]
    C[Opens pull request] --> D[pull_request event]
    E[Cron time reached] --> F[schedule event]
    G[Clicks "Run workflow"] --> H[workflow_dispatch]
    I[External API call] --> J[repository_dispatch]
    K[Upstream workflow finishes] --> L[workflow_run event]

    B --> M{GitHub Actions}
    D --> M
    F --> M
    H --> M
    J --> M
    L --> M

    M --> N[Workflow YAML parsed]
    N --> O[Jobs evaluated]
    O --> P[Runner executes steps]

    style M fill:#bbf,stroke:#333
    style O fill:#f9f,stroke:#333
    style P fill:#bfb,stroke:#333
```

---

## 9. Real-World Use Case: PR Validation + Auto-Deploy

Scenario: Every PR runs tests. When merged to `main`, deploy to staging. Nightly at 2 AM, run security scan.

```yaml
name: Full Pipeline

on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

  push:
    branches: [main]

  schedule:
    - cron: "0 2 * * *"

  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        default: "staging"
        type: choice
        options: [staging, production]

jobs:
  # 1. Runs on PRs AND pushes to main
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  # 2. Runs only on push to main OR manual dispatch
  deploy-staging:
    needs: test
    if: |
      github.event_name == 'push' ||
      (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'staging')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploying to staging..."

  # 3. Nightly security scan
  security-scan:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Running nightly security scan..."
```

---

## 10. Hands-On Exercise: Event Playground

Create `.github/workflows/events.yml` in your test repo:

```yaml
name: Event Playground

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      message:
        description: "Custom message"
        required: true
        default: "Hello from dispatch"
  schedule:
    - cron: "*/15 * * * *"

jobs:
  log-event:
    runs-on: ubuntu-latest
    steps:
      - name: Log the triggering event
        run: |
          echo "=== Event Details ==="
          echo "Event name: ${{ github.event_name }}"
          echo "Workflow: ${{ github.workflow }}"
          echo "Actor: ${{ github.actor }}"
          echo "Ref: ${{ github.ref }}"
          echo "SHA: ${{ github.sha }}"
          echo "Repository: ${{ github.repository }}"
      - name: Log dispatch input (if applicable)
        if: github.event_name == 'workflow_dispatch'
        run: echo "Message: ${{ github.event.inputs.message }}"
      - name: Log PR number (if applicable)
        if: github.event_name == 'pull_request'
        run: echo "PR #${{ github.event.number }} - ${{ github.event.pull_request.title }}"
```

### Verification checklist
- [ ] Trigger it via a push to `main` — check the Actions tab shows `push`
- [ ] Open a PR against `main` — confirm it runs with `pull_request`
- [ ] Run it manually from the Actions tab with a custom message — confirm `workflow_dispatch` input appears
- [ ] Wait ~15 minutes — confirm the scheduled run appears (or force it via the Actions tab "Run workflow" button)

> **Exam connection:** This exercise covers `github.event_name`, `github.event.inputs`, `github.event.number`, and distinguishing events by name — all common exam questions.

---

## 11. Quick Decision Guide

| You want to… | Use this event |
|--------------|---------------|
| Run on every code push | `push` |
| Run before merging PRs | `pull_request` |
| Run after PR is merged | `pull_request` + `types: [closed]` + `merged == true` |
| Run manually with options | `workflow_dispatch` |
| Run on a timer (UTC) | `schedule` |
| Trigger from external system | `repository_dispatch` |
| Start after another workflow finishes | `workflow_run` |

---

**Next module:** [Job Control →](/study/job-control/)
