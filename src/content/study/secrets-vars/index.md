---
title: Secrets & Variables
description: Repository, organization, and environment secrets, GitHub Actions variables, and secure handling.
module: Secrets & Variables
order: 5
draft: false
---

# Secrets & Variables

Secrets and variables let you store sensitive and configuration data outside your workflow code. The exam tests the three secret scopes, variable precedence, masking behavior, and how to pass secrets to actions securely.

> **Certification tip:** Secrets are never shown in logs (they're masked with `***`). Variables are visible in logs — never store sensitive data in variables.

---

## 1. The Three Secret Scopes

| Scope | Where configured | Accessible to |
|-------|-----------------|---------------|
| Repository secrets | Repo Settings → Secrets and variables → Actions | Workflows in that repo |
| Organization secrets | Org Settings → Secrets and variables → Actions | Selected repos in the org |
| Environment secrets | Repo Settings → Environments → [env name] | Jobs referencing that environment |

### Repository secret example

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "Using token: ${{ secrets.DEPLOY_TOKEN }}"
```

The value of `secrets.DEPLOY_TOKEN` is masked in logs as `***`.

---

## 2. Using Secrets in Workflows

### Referencing a secret

```yaml
steps:
  - run: echo "API key is set"
    env:
      API_KEY: ${{ secrets.API_KEY }}
```

> **Best practice:** Pass secrets via `env` rather than interpolating directly into `run` commands. This avoids accidental shell exposure and ensures proper masking.

### Passing secrets to actions

```yaml
steps:
  - uses: some-action@v1
    with:
      api-key: ${{ secrets.MY_API_KEY }}
```

### Never hardcode secrets

❌ Bad:
```yaml
- run: curl -H "Authorization: token ghp_abc123" ...
```

✅ Good:
```yaml
- run: curl -H "Authorization: token ${{ secrets.MY_TOKEN }}" ...
```

---

## 3. GitHub Actions Variables

Variables are non-sensitive configuration values. Unlike secrets, **variables are visible in logs**.

### Repository variables

Repo Settings → Secrets and variables → Actions → Variables tab.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building for ${{ vars.DEPLOY_REGION }}"
```

### Variable precedence (highest to lowest)

1. **Job-level `env`** (workflow file)
2. **Step-level `env`** (workflow file)
3. **Repository variables**
4. **Organization variables**
5. **Environment variables** (when `environment:` is set)

### Example: environment variables override repo variables

```yaml
env:
  REGION: us-east-1    # workflow-level env

jobs:
  deploy:
    environment: production   # production env vars take precedence
    env:
      REGION: eu-west-1       # job-level env overrides workflow-level
    steps:
      - run: echo "${{ vars.REGION }}"   # variable value
      - run: echo "${{ env.REGION }}"     # env context value
```

| Context | Source | Visible in logs? |
|---------|--------|------------------|
| `secrets.<name>` | Secret | No (`***`) |
| `vars.<name>` | Variable | Yes |
| `env.<name>` | `env:` key | Yes |

---

## 4. Environment Secrets

Environment secrets are scoped to a specific environment. A job must reference `environment: <name>` to access them.

```yaml
jobs:
  deploy-production:
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: echo "Using ${{ secrets.PRODUCTION_DB_PASSWORD }}"
```

A job with `environment: staging` **cannot** access `secrets.PRODUCTION_DB_PASSWORD`. This is the principle of least privilege.

### Combined with protection rules

If `production` environment has required reviewers, the job pauses for approval **before** accessing environment secrets.

---

## 5. Organization Secrets

Org secrets are shared across repositories. Configured at Org Settings → Secrets and variables → Actions.

### Repository access

When creating an org secret, choose which repositories can access it:
- All repositories
- Selected repositories (private/internal only, depending on plan)

### Example

```yaml
# Works in any repo that has access to the org secret
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ secrets.ORG_WIDE_API_KEY }}"
```

> **Certification tip:** Org secrets cannot be used in forks of public repositories unless explicitly approved. Secret scanning may block leaked secrets.

---

## 6. Passing Secrets Between Jobs

Secrets are available in every job by default (unless permissions restrict them). You don't need to pass them explicitly.

```yaml
jobs:
  job-a:
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ secrets.TOKEN }}" >> /tmp/token.txt
      - uses: actions/upload-artifact@v4
        with:
          name: token
          path: /tmp/token.txt

  job-b:
    needs: job-a
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: token
      # Better: just use secrets directly in job-b
      - run: echo "${{ secrets.TOKEN }}"
```

> **Certification tip:** Don't upload secrets as artifacts unless absolutely necessary. Use `secrets.TOKEN` directly in any job that needs it.

---

## 7. `GITHUB_TOKEN` — The Automatic Token

GitHub automatically creates a `GITHUB_TOKEN` for each workflow run. It's unique to the run and expires when the run finishes.

### Default permissions

| Event | Default token permissions |
|-------|--------------------------|
| `push` | Broad (read/write contents, etc.) |
| `pull_request` (from fork) | Read-only |
| `pull_request` (same repo) | Broad |
| `schedule`, `workflow_dispatch` | Broad |

### Scoping `GITHUB_TOKEN`

```yaml
permissions:
  contents: read
  pull-requests: write

jobs:
  deploy:
    permissions:
      contents: write    # Override for this job only
    steps:
      - run: echo "Using scoped token"
```

Pass it to actions:

```yaml
steps:
  - uses: some-action@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
```

> **Certification tip:** `secrets.GITHUB_TOKEN` is automatically available — you don't need to create it. Always scope it to minimum needed permissions.

---

## 8. Secret Masking & Logging

GitHub masks secrets in logs automatically:

```yaml
steps:
  - run: echo "The secret is ${{ secrets.MY_SECRET }}"
```

Output:
```
The secret is ***
```

### Masking rules

- Secrets are masked if they appear in step output
- Masking works for secrets used in `env` or `run` contexts
- Variables (`vars.`) are **not** masked

### Debug logging warning

If you enable debug logging (`ACTIONS_STEP_DEBUG=true`), secret values may appear in logs. Never enable debug logging in production workflows that handle secrets.

---

## 9. Real-World Use Case: Secure Deployment Pipeline

Scenario: Deploy to staging and production using scoped secrets and environment protection.

```yaml
name: Secure Deploy

on:
  push:
    branches: [main]
    tags: [v*]

env:
  APP_NAME: myapp

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  deploy-staging:
    needs: test
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "Deploying ${{ env.APP_NAME }} to staging"
          echo "Using ${{ secrets.STAGING_API_KEY }}"  # masked

  deploy-production:
    needs: deploy-staging
    if: startsWith(github.ref, 'refs/tags/v')
    environment:
      name: production
      url: https://app.example.com
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "Deploying production release"
          # ${{ secrets.PRODUCTION_API_KEY }} only accessible here
```

### Secret setup required

| Secret | Scope | Environment |
|--------|-------|-------------|
| `STAGING_API_KEY` | Repository | staging |
| `PRODUCTION_API_KEY` | Repository | production |
| `ORG_REGISTRY_TOKEN` | Organization | all repos |

---

## 10. Hands-On Exercise: Secret Scopes

1. Create a repository secret: `MY_REPO_SECRET` = `repo-value`
2. Create an environment called `test-env` with an environment secret: `MY_ENV_SECRET` = `env-value`
3. Create `.github/workflows/secrets.yml`:

```yaml
name: Secrets Exercise

on:
  workflow_dispatch:

jobs:
  job-a:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Repo secret: ${{ secrets.MY_REPO_SECRET }}"
          echo "Env secret: ${{ secrets.MY_ENV_SECRET }}"

  job-b:
    environment: test-env
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Repo secret: ${{ secrets.MY_REPO_SECRET }}"
          echo "Env secret: ${{ secrets.MY_ENV_SECRET }}"
```

### Verification checklist
- [ ] `job-a` shows `MY_REPO_SECRET` but `MY_ENV_SECRET` is empty (no environment referenced)
- [ ] `job-b` shows both secrets (environment reference grants access)
- [ ] Both secrets appear as `***` in logs, not plain text

> **Exam connection:** This covers secret scoping (repository vs environment), `environment:` access control, and masking — all common exam questions.

---

## 11. Quick Decision Guide

| You want to… | Use this |
|--------------|----------|
| Store a secret for one repo | Repository secret |
| Share a secret across multiple repos | Organization secret |
| Scope a secret to a deployment target | Environment secret |
| Store non-sensitive config | Variables (`vars.`) |
| Pass secret to a step | `env: KEY: ${{ secrets.NAME }}` |
| Auto-provision a per-run token | `secrets.GITHUB_TOKEN` |
| Hide a value from logs | Use `secrets.`, never `vars.` |
| Gate secret access behind approval | Environment secret + required reviewers |

---

**Next module:** [Reusable Workflows →](/study/reusable-workflows/)
