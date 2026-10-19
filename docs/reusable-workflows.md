---
id: reusable-workflows
title: Reusable Workflows
description: workflow_call, reusable workflows, inputs, outputs, secrets, and calling workflows across repos.
sidebar_position: 6
---

# Reusable Workflows

Reusable workflows let you extract common CI/CD logic into a single workflow file that other workflows can call.

> **Certification tip:** A reusable workflow must start with `on: workflow_call`.

---

## 1. The Reusable Workflow (Callee)

`.github/workflows/reusable-ci.yml`:

```yaml
name: Reusable CI

on:
  workflow_call:
    inputs:
      node-version:
        description: 'Node.js version'
        required: false
        type: string
        default: '20.x'
    outputs:
      build-id:
        description: 'Unique build identifier'
        value: ${{ jobs.build.outputs.build-id }}
    secrets:
      DEPLOY_TOKEN:
        description: 'Deployment token'
        required: true

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build-id: ${{ steps.set-id.outputs.build-id }}
    steps:
      - uses: actions/checkout@v4
      - id: set-id
        run: echo "build-id=${{ github.run_id }}" >> $GITHUB_OUTPUT
```

---

## 2. Calling a Reusable Workflow

```yaml
jobs:
  ci:
    uses: octocat/ops/.github/workflows/reusable-ci.yml@main
    with:
      node-version: '18.x'
    secrets:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Accessing outputs

```yaml
jobs:
  ci:
    uses: org/ci/.github/workflows/reusable.yml@main

  deploy:
    needs: ci
    runs-on: ubuntu-latest
    steps:
      - run: echo "Build ID: ${{ needs.ci.outputs.build-id }}"
```

---

## 3. Local Reuse

```yaml
uses: ./.github/workflows/reusable-greeting.yml
```

> **Certification tip:** Always pin to a SHA or tag, never `@main` in production.

**Next module:** [Custom Actions →](/study/custom-actions)
