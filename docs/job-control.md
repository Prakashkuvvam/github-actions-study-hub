---
id: job-control
title: Job Control
description: needs, if conditionals, matrix builds, job outputs, permissions, continue-on-error, and concurrency.
sidebar_position: 3
---

# Job Control

Jobs are the workhorses of GitHub Actions. By default they run in parallel, but you can chain them, gate them with conditions, run them in parallel variations (matrix), and pass data between them.

> **Certification tip:** Jobs run in parallel unless you explicitly use `needs`. Steps within a job always run sequentially.

---

## 1. The `needs` Key

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
      - run: echo "Testing..."

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
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
    needs: [lint, test]
    runs-on: ubuntu-latest
```

### Job outputs via `needs`

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build-id: ${{ steps.set-id.outputs.build-id }}
    steps:
      - id: set-id
        run: echo "build-id=${{ github.run_id }}" >> $GITHUB_OUTPUT

  notify:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Build was ${{ needs.build.result }}"
      - run: echo "Build ID: ${{ needs.build.outputs.build-id }}"
```

---

## 2. The `if` Conditional

`if` can be used at the **job** level or **step** level.

### Job-level `if`

```yaml
jobs:
  deploy-prod:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
```

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

### Expression functions

```yaml
if: ${{ success() }}
if: ${{ failure() }}
if: ${{ always() }}
if: ${{ cancelled() }}
if: ${{ contains(github.ref, 'feature/') }}
```

---

## 3. Matrix Builds

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

### Two-dimensional matrix

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [18.x, 20.x]
```

Creates 4 jobs running in parallel.

### `include` and `exclude`

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [18.x, 20.x]
    include:
      - os: macos-latest
        node-version: 20.x
    exclude:
      - os: windows-latest
        node-version: 18.x
```

### `fail-fast` and `max-parallel`

```yaml
strategy:
  fail-fast: true
  max-parallel: 2
  matrix:
    node-version: [18.x, 20.x]
```

---

## 4. `continue-on-error`

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      - if: ${{ always() }}
        run: echo "Runs even if npm test failed"
```

---

## 5. `permissions`

```yaml
permissions:
  contents: read
  pull-requests: write

jobs:
  deploy:
    permissions:
      contents: write
      id-token: write
    runs-on: ubuntu-latest
```

---

## 6. `concurrency`

```yaml
jobs:
  deploy:
    concurrency:
      group: production-deploy
      cancel-in-progress: true
    runs-on: ubuntu-latest
```

---

## 7. Visual: Job Execution Flow

```mermaid
flowchart TD
    A[Workflow triggered] --> B{Evaluate jobs}
    B --> C[Job A - no needs]
    B --> D[Job B - needs: A]
    B --> E[Job C - needs: [A, B]]
    C --> F{Job A if?}
    F -->|false| G[Job A skipped]
    F -->|true| H[Run steps]
    D --> I{Job B if?}
    I -->|false| J[Job B skipped]
    I -->|true| K[Wait for A]
    K -->|A success| L[Run Job B]
    K -->|A failed| M[Job B skipped]
    style A fill:#bbf,stroke:#333
    style G fill:#ddd,stroke:#999
    style M fill:#fbb,stroke:#333
    style L fill:#bfb,stroke:#333
```

**Next module:** [Environments & Deployment →](/study/environments)
