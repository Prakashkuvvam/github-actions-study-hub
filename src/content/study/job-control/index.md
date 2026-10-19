---
title: Job Control
description: needs, if conditionals, matrix builds, job outputs, permissions, continue-on-error, and concurrency.
module: Job Control
order: 3
draft: false
---

# Job Control

Jobs are the workhorses of GitHub Actions. By default they run in parallel, but you can chain them, gate them with conditions, run them in parallel variations (matrix), and pass data between them. The exam tests these patterns heavily.

> **Certification tip:** Jobs run in parallel unless you explicitly use `needs`. Steps within a job always run sequentially. Know when to use `if` at the job level vs. the step level.

---

## 1. The `needs` Key — Job Dependencies

`needs` makes a job wait for other jobs to complete. If a needed job fails or is cancelled, dependent jobs are **skipped** by default (unless you use `if: always()`).

### Sequential chain

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing after build..."

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying after tests pass..."
```

**Execution order:** `build` → `test` → `deploy`

### Multiple dependencies

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest

  test:
    runs-on: ubuntu-latest

  build:
    needs: [lint, test]   # Waits for BOTH to finish
    runs-on: ubuntu-latest
```

### Passing `needs` context

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "build result: ${job.status}"   # not valid here — job context only inside the job

  notify:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Build was ${{ needs.build.result }}"
```

| Context | Value |
|---------|-------|
| `needs.<job_id>.result` | `success`, `failure`, `cancelled`, `skipped` |
| `needs.<job_id>.outputs` | Outputs from that job |

---

## 2. The `if` Conditional — Job & Step Level

`if` can be used at the **job** level or **step** level. It uses GitHub Actions expressions.

### Job-level `if`

```yaml
jobs:
  deploy-prod:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production..."
```

This job is **skipped** unless the branch is `main`.

### Step-level `if`

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Always runs"
      - if: github.event_name == 'pull_request'
        run: echo "Only on PRs"
      - if: github.event_name == 'push'
        run: echo "Only on pushes"
```

### Common expression functions

```yaml
if: ${{ success() }}           # Previous step(s) succeeded
if: ${{ failure() }}           # Previous step failed
if: ${{ always() }}            # Run regardless of previous result
if: ${{ cancelled() }}         # Run if cancelled
if: ${{ success() || failure() }}  # Success OR failure
if: ${{ contains(github.ref, 'feature/') }}
if: ${{ startsWith(github.ref, 'refs/tags/v') }}
if: ${{ endsWith(github.ref, '-beta') }}
```

> **Certification tip:** `if` at the job level skips the **entire job**. `if` at the step level skips only that step — subsequent steps in the same job still run.

### `if` + `needs` combination

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

  notify-on-failure:
    needs: build
    if: ${{ needs.build.result == 'failure' }}
    runs-on: ubuntu-latest
    steps:
      - run: echo "Build failed — sending alert..."
```

---

## 3. Job Outputs — Passing Data Between Jobs

Jobs can produce outputs that downstream jobs consume via `needs.<job_id>.outputs.<name>`.

### Defining job outputs

```yaml
jobs:
  get-version:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.set-version.outputs.version }}
    steps:
      - id: set-version
        run: echo "version=1.2.3" >> $GITHUB_OUTPUT

  deploy:
    needs: get-version
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying version ${{ needs.get-version.outputs.version }}"
```

### Key points

- The step that sets the output needs an `id` (here: `set-version`).
- Use `$GITHUB_OUTPUT` (modern) or `::set-output::` (deprecated).
- Job outputs are accessed via `needs.<job_id>.outputs.<name>`.
- You **must** declare `outputs` at the job level to expose them.

### Multi-output example

```yaml
jobs:
  build-info:
    runs-on: ubuntu-latest
    outputs:
      build-id: ${{ steps.info.outputs.build-id }}
      timestamp: ${{ steps.info.outputs.timestamp }}
    steps:
      - id: info
        run: |
          echo "build-id=${{ github.run_id }}" >> $GITHUB_OUTPUT
          echo "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $GITHUB_OUTPUT

  deploy:
    needs: build-info
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Build ID: ${{ needs.build-info.outputs.build-id }}"
          echo "Timestamp: ${{ needs.build-info.outputs.timestamp }}"
```

---

## 4. Matrix Builds — Parallel Variations

Matrix runs multiple copies of a job with different variables. Great for testing across OS/language versions.

### Basic matrix

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

This creates **2 jobs** running in parallel: one with Node 18, one with Node 20.

### Two-dimensional matrix

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [18.x, 20.x]
```

This creates **4 jobs** (2 OS × 2 Node versions), all running in parallel.

### `include` — add specific combinations

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [18.x, 20.x]
    include:
      - os: macos-latest
        node-version: 20.x
        experimental: true
```

### `exclude` — remove combinations

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [18.x, 20.x]
    exclude:
      - os: windows-latest
        node-version: 18.x   # Skip this combo
```

### `fail-fast` and `max-parallel`

```yaml
strategy:
  fail-fast: true          # Cancel all matrix jobs if one fails (default: true)
  max-parallel: 2          # Run only 2 at a time
  matrix:
    node-version: [18.x, 20.x]
```

> **Certification tip:** `fail-fast: true` (default) cancels in-flight matrix jobs when one fails. Set to `false` if you want all combinations to report independently.

### Matrix outputs

Each matrix job can produce outputs, but accessing them across matrix variations requires a job ID that includes the matrix context:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        config: [debug, release]
    outputs:
      result: ${{ steps.build.outputs.result }}
    steps:
      - id: build
        run: echo "result=built-${{ matrix.config }}" >> $GITHUB_OUTPUT
```

---

## 5. `continue-on-error` — Don't Stop the Job

By default, if a step fails, the job stops and is marked `failed`. `continue-on-error` lets subsequent steps run.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      - if: ${{ always() }}
        run: echo "This runs even if npm test failed"
      - run: echo "This step does NOT run if previous failed (default)"
```

At the job level:

```yaml
jobs:
  optional-scan:
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - run: echo "This might fail but won't stop the workflow"
```

> **Certification tip:** Combine `continue-on-error: true` with `if: always()` to guarantee cleanup or notification steps run regardless of earlier failures.

---

## 6. `permissions` — Scope the GITHUB_TOKEN

Control what the automatic `GITHUB_TOKEN` can do. Principle of least privilege — critical for security questions.

### Workflow-level permissions

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

### Job-level permissions (overrides workflow)

```yaml
jobs:
  deploy:
    permissions:
      contents: write      # Allow pushing tags/releases
      id-token: write      # Allow OIDC token requests
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying with scoped permissions..."
```

### Common permission values

| Permission | Values |
|------------|--------|
| `actions` | read, write |
| `checks` | read, write |
| `contents` | read, write |
| `deployments` | read, write |
| `issues` | read, write |
| `packages` | read, write |
| `pull-requests` | read, write |
| `security-events` | read, write |
| `id-token` | write (for OIDC) |

> **Certification tip:** Default `GITHUB_TOKEN` has `contents: read` for `pull_request` events from forks. For `push` events, it's usually broader. Always use the minimum needed.

---

## 7. `concurrency` — Prevent Conflicting Runs

Queue or cancel in-progress workflows/jobs for the same key.

```yaml
concurrency:
  group: ${{ github.ref }}
  cancel-in-progress: true
```

| Setting | Behavior |
|---------|----------|
| `group` | Concurrency key — same group = mutually exclusive |
| `cancel-in-progress` | Cancel previous run when a new one starts |

### Job-level concurrency

```yaml
jobs:
  deploy:
    concurrency:
      group: production-deploy
      cancel-in-progress: true
    runs-on: ubuntu-latest
```

> **Certification tip:** Use concurrency on deployment jobs so only one deploy to production runs at a time.

---

## 8. Visual: Job Execution Flow

```mermaid
flowchart TD
    A[Workflow triggered] --> B{Evaluate jobs}
    
    B --> C[Job A<br/>no needs]
    B --> D[Job B<br/>needs: A]
    B --> E[Job C<br/>needs: [A, B]]
    
    C --> F{Job A if?}
    F -->|false| G[Job A skipped]
    F -->|true| H[Run steps sequentially]
    
    D --> I{Job B if?}
    I -->|false| J[Job B skipped]
    I -->|true| K{Wait for A}
    K -->|A success| L[Run Job B]
    K -->|A failed| M[Job B skipped]
    
    E --> N{Job C if?}
    N -->|true| O{Wait for A & B}
    O -->|Both success| P[Run Job C]
    O -->|Any failed| Q[Job C skipped]
    
    style A fill:#bbf,stroke:#333
    style G fill:#ddd,stroke:#999,stroke-dasharray: 5 5
    style M fill:#fbb,stroke:#333
    style Q fill:#fbb,stroke:#333
    style P fill:#bfb,stroke:#333
```

---

## 9. Real-World Use Case: CI/CD Pipeline with Job Control

Scenario: Lint and test in parallel. Build only if both pass. Deploy to staging only on main. Notify on failure regardless of outcome.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pull-requests: read

jobs:
  # Parallel jobs
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test

  # Depends on lint AND test (all matrix variants)
  build:
    needs: [lint, test]
    if: |
      always() &&
      needs.lint.result == 'success' &&
      needs.test.result == 'success'
    runs-on: ubuntu-latest
    outputs:
      build-id: ${{ steps.set-id.outputs.build-id }}
    steps:
      - id: set-id
        run: echo "build-id=${{ github.run_id }}" >> $GITHUB_OUTPUT
      - uses: actions/checkout@v4
      - run: echo "Building version ${{ needs.get-version.outputs.version }}..."

  # Deploy only on main push
  deploy-staging:
    needs: build
    if: |
      github.ref == 'refs/heads/main' &&
      github.event_name == 'push'
    runs-on: ubuntu-latest
    concurrency:
      group: staging-deploy
      cancel-in-progress: true
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploying build ${{ needs.build.outputs.build-id }} to staging..."

  # Always notify (even on failure)
  notify:
    needs: [lint, test, build, deploy-staging]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Lint: ${{ needs.lint.result }}"
          echo "Test: ${{ needs.test.result }}"
          echo "Build: ${{ needs.build.result }}"
          echo "Deploy: ${{ needs.deploy-staging.result }}"
```

### What this demonstrates

| Feature | Where |
|---------|-------|
| Parallel jobs | `lint` and `test` run simultaneously |
| Matrix builds | `test` runs on Node 18 and 20 |
| Multiple `needs` | `build` waits for both `lint` and `test` |
| `if` with `always()` | `notify` runs regardless of results |
| `concurrency` | `deploy-staging` prevents overlapping deploys |
| Job-level `permissions` | `deploy-staging` gets `contents: write` |
| Job outputs | `build-id` passed from `build` to `deploy-staging` |

---

## 10. Hands-On Exercise: Job Dependency Chain

Create `.github/workflows/job-control.yml`:

```yaml
name: Job Control Exercise

on:
  workflow_dispatch:
    inputs:
      fail_build:
        description: "Make build step fail?"
        required: false
        default: "false"
        type: boolean

jobs:
  step-one:
    runs-on: ubuntu-latest
    outputs:
      seed: ${{ steps.gen.outputs.seed }}
    steps:
      - id: gen
        run: |
          SEED=$((RANDOM % 100))
          echo "seed=$SEED" >> $GITHUB_OUTPUT
          echo "Generated seed: $SEED"

  step-two:
    needs: step-one
    if: ${{ needs.step-one.result == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - run: echo "Step two received seed: ${{ needs.step-one.outputs.seed }}"
      - if: ${{ github.event.inputs.fail_build == 'true' }}
        run: exit 1

  step-three:
    needs: [step-one, step-two]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Step one: ${{ needs.step-one.result }}"
          echo "Step two: ${{ needs.step-two.result }}"
```

### Verification checklist
- [ ] Run with `fail_build = false` — all three steps complete; step-three sees both results
- [ ] Run with `fail_build = true` — step-two fails, step-three still runs (because `if: always()`)
- [ ] Confirm `step-three` receives the seed output from `step-one`

> **Exam connection:** This covers `needs`, job `outputs`, `if: always()`, boolean inputs, and `needs.<job>.result` — a classic exam combination.

---

## 11. Quick Decision Guide

| You want to… | Use this |
|--------------|----------|
| Run jobs one after another | `needs: [previous-job]` |
| Run jobs at the same time | Omit `needs` (default parallel) |
| Skip a job unless condition met | Job-level `if:` |
| Skip only one step | Step-level `if:` |
| Pass data from Job A to Job B | Job `outputs` + `needs.A.outputs.x` |
| Test multiple OS/versions | `strategy.matrix` |
| Stop other matrix jobs if one fails | `fail-fast: true` (default) |
| Run all matrix jobs regardless | `fail-fast: false` |
| Let a step fail without stopping | `continue-on-error: true` |
| Guarantee a step runs regardless | `continue-on-error: true` + `if: always()` |
| Limit token permissions | `permissions:` at job or workflow level |
| Prevent overlapping deploys | `concurrency:` |

---

**Next module:** [Environments & Deployment →](/study/environments/)
