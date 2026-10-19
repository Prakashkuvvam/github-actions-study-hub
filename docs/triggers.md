---
id: triggers
title: Triggers & Scheduling
description: Deep dive on events — push, pull_request, workflow_dispatch, schedule, repository_dispatch, workflow_run.
sidebar_position: 2
---

# Triggers & Scheduling

The `on:` key is the heartbeat of your workflow. It tells GitHub exactly when to start the automation.

> **Certification tip:** Know the difference between `branches`, `branches-ignore`, `paths`, and `paths-ignore`. You cannot use `branches` and `branches-ignore` together in the same `on.push` block.

---

## 1. The `on` Key — Three Styles

### Style A: Single event

```yaml
on: push
```

### Style B: List of events

```yaml
on:
  - push
  - pull_request
  - workflow_dispatch
```

### Style C: Object with configuration

```yaml
on:
  push:
    branches: ["main", "release/*"]
    tags: ["v1.*"]
    paths:
      - "src/**"
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

```yaml
on:
  push:
    branches:
      - main
      - "releases/v*"
    branches-ignore:
      - "dependabot/**"
    tags:
      - "v*"
    paths:
      - "src/**"
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

---

## 3. Pull Request Event

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
| `synchronize` | New commits pushed |
| `closed` | PR is closed (merged or declined) |

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
```

---

## 4. Workflow Dispatch

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
        description: "App version"
        required: true
        type: string
      force_rebuild:
        description: "Force rebuild?"
        required: false
        type: boolean
```

Access via `github.event.inputs.<name>`.

| Type | Description |
|------|-------------|
| `string` | Free text |
| `choice` | Dropdown |
| `boolean` | Checkbox (`"true"`/`"false"` as string) |
| `environment` | Deployment environment dropdown |

---

## 5. Schedule (Cron)

All times are **UTC**. Minimum interval: **15 minutes**.

```yaml
on:
  schedule:
    - cron: "0 0 * * *"     # Daily at midnight UTC
    - cron: "0 9 * * 1"     # Every Monday at 9:00 AM UTC
    - cron: "*/15 * * * *"  # Every 15 minutes
    - cron: "30 2 1 * *"    # 2:30 AM on 1st of month
```

---

## 6. Repository Dispatch

Triggered via the GitHub REST API:

```bash
curl -X POST https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type": "build-requested", "client_payload": {"version": "1.2.3"}}'
```

```yaml
on:
  repository_dispatch:
    types: [build-requested]

jobs:
  build:
    steps:
      - run: echo "Event: ${{ github.event.action }}"
      - run: echo "Version: ${{ github.event.client_payload.version }}"
```

---

## 7. Workflow Run

Triggered when another workflow completes:

```yaml
on:
  workflow_run:
    workflows: ["CI Pipeline"]
    types: [completed]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
```

---

## 8. Real-World Use Case

```yaml
name: Full Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:
    inputs:
      environment:
        required: true
        type: choice
        options: [staging, production]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy-staging:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to staging..."

  security-scan:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running nightly security scan..."
```

**Next module:** [Job Control →](/study/job-control)
