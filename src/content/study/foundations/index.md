---
title: Foundations
description: Core concepts — workflows, events, jobs, steps, runners, and YAML syntax.
module: Foundations
order: 1
draft: false
---

# Foundations

Everything in GitHub Actions starts with a **workflow** — an automated process you define in a YAML file that lives in your repository at `.github/workflows/`.

> **Certification tip:** The exam tests your ability to read and write workflow YAML quickly. Know the top-level keys by heart.

---

## 1. Workflow Anatomy

A workflow file uses these top-level keys:

| Key | Required | Purpose |
|-----|----------|---------|
| `name` | No | Human-readable name shown in the Actions tab |
| `on` | Yes | Event(s) that trigger the workflow |
| `jobs` | Yes | One or more jobs that run in parallel by default |
| `env` | No | Variables available to all jobs/steps |
| `defaults` | No | Default settings for all steps (e.g. `run` working-directory) |
| `permissions` | No | Token permissions for the whole workflow |

### Minimal valid workflow

```yaml
name: CI

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "Hello, GitHub Actions!"
```

---

## 2. Events (`on`)

Events tell GitHub when to run the workflow.

### Common triggers

```yaml
on:
  # Runs on every push to any branch
  push:
    branches: ["main", "feature/*"]
    tags: ["v*"]

  # Runs on pull requests
  pull_request:
    branches: ["main"]

  # Manual trigger from the Actions tab
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

  # Scheduled (cron syntax, UTC)
  schedule:
    - cron: "0 2 * * *"   # Every day at 02:00 UTC

  # Triggered by another workflow
  repository_dispatch:
    types: [build-requested]

  # Run when a workflow completes
  workflow_run:
    workflows: ["CI"]
    types: [completed]
```

> **Certification tip:** `workflow_dispatch` lets you pass inputs manually — great for on-demand deployments. `schedule` uses POSIX cron and is always UTC.

---

## 3. Jobs

Jobs run in **parallel** by default. Each job runs on a fresh runner instance.

### Job structure

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    needs: lint          # Wait for "lint" to finish first
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

| Key | Purpose |
|-----|---------|
| `runs-on` | The runner type (GitHub-hosted or self-hosted label) |
| `needs` | Dependency — this job waits for listed jobs to complete |
| `if` | Conditional — skip the job unless expression is true |
| `outputs` | Pass data to downstream jobs |
| `permissions` | Scope the `GITHUB_TOKEN` for this job |

---

## 4. Steps

Steps run **sequentially** inside a job. Each step is either:

- `uses:` — calls an action from the Marketplace or a local path
- `run:` — executes a shell command

### Step example

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
```

> **Certification tip:** Always pin actions to a specific version tag (e.g. `@v4`) — never `@main`. The exam tests supply-chain security awareness.

---

## 5. Runners

### GitHub-hosted runners

| Label | OS | Use case |
|-------|-----|----------|
| `ubuntu-latest` | Ubuntu | Most common, cheapest |
| `windows-latest` | Windows | .NET, Windows-specific builds |
| `macos-latest` | macOS | iOS/macOS builds, Xcode |

### Self-hosted runners

```yaml
runs-on: self-hosted
# or with labels
runs-on: [self-hosted, linux, x64]
```

> **Certification tip:** Self-hosted runners give you control but you manage patching, security, and capacity yourself.

---

## 6. Contexts & Expressions

GitHub Actions exposes runtime data through **contexts**.

### Common contexts

```yaml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running on ${{ github.ref }}"
      - run: echo "Actor: ${{ github.actor }}"
      - run: echo "Job status: ${{ job.status }}"
      - run: echo "Step output: ${{ steps.step1.outputs.result }}"
```

| Context | Example value |
|---------|---------------|
| `github.event_name` | `push` |
| `github.ref` | `refs/heads/main` |
| `github.sha` | `a1b2c3d4...` |
| `github.actor` | `octocat` |
| `github.repository` | `owner/repo` |
| `jobs.<job_id>.result` | `success`, `failure`, `cancelled` |
| `steps.<step_id>.outputs.<name>` | Custom output from a step |

### Expression functions

```yaml
if: ${{ github.ref == 'refs/heads/main' && success() }}
if: ${{ contains(github.ref, 'feature/') }}
if: ${{ always() }}          # Run even if previous step failed
if: ${{ cancelled() }}
```

---

## 7. Visual: How a Workflow Runs

```mermaid
flowchart TD
    A[Event occurs<br/>push / PR / schedule] --> B[GitHub parses<br/>.github/workflows/*.yml]
    B --> C{Jobs}
    C --> D[Job 1: lint<br/>runs-on: ubuntu-latest]
    C --> E[Job 2: test<br/>needs: lint]
    D --> F[Steps run sequentially]
    E --> F
    F --> G{Job result?}
    G -->|success| H[Next dependent job starts]
    G -->|failure| I[Job marked failed<br/>dependents skipped]
    G -->|cancelled| J[Cancelled]
    style A fill:#f9f,stroke:#333
    style C fill:#bbf,stroke:#333
    style H fill:#bfb,stroke:#333
    style I fill:#fbb,stroke:#333
```

---

## 8. Real-World Use Case: Node.js CI

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

**What this does:**
1. Triggers on push/PR to `main`
2. Runs tests against Node 18 and 20 **in parallel** (matrix)
3. Caches `node_modules` to speed up subsequent runs
4. Fails fast if any matrix combination fails

---

## 9. Hands-On Exercise: Your First Workflow

Create this file in your own test repository: `.github/workflows/hello.yml`

```yaml
name: Hello World

on:
  workflow_dispatch:
    inputs:
      name:
        description: "Your name"
        required: true
        default: "Learner"

jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - name: Greet the user
        run: echo "Hello, ${{ github.event.inputs.name }}!"
      - name: Show environment
        run: |
          echo "Runner: ${{ runner.os }}"
          echo "Workflow: ${{ github.workflow }}"
          echo "Event: ${{ github.event_name }}"
```

**Verification checklist:**
- [ ] The workflow appears in the Actions tab
- [ ] You can trigger it manually with a custom name
- [ ] The output shows your name, runner OS, workflow name, and event type

> **Exam connection:** This exercise covers `workflow_dispatch`, `github.event.inputs`, `run` with multi-line shell scripts, and `runner.os` — all common exam topics.

---

## 10. Quick Reference Cheat Sheet

```yaml
# Top-level structure
name: <workflow name>
on: <event> | [events]
env:
  KEY: value
jobs:
  <job_id>:
    name: <display name>
    needs: [<job_id>]
    if: <expression>
    runs-on: ubuntu-latest | windows-latest | macos-latest | self-hosted
    permissions:
      contents: read
      pull-requests: write
    steps:
      - id: <step-id>           # referenced by steps.<id>.outputs
        name: <display name>
        uses: <owner/repo>@<ref>
        with:
          key: value
        run: |
          multi-line
          shell script
        env:
          KEY: value
        if: <expression>
        continue-on-error: true
        timeout-minutes: 30
        working-directory: ./path
```

---

**Next module:** [Triggers & Scheduling →](/study/triggers/)
