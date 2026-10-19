---
id: environments
title: Environments & Deployment
description: Protection rules, required reviewers, deployment jobs, environment key, deployment status.
sidebar_position: 4
---

# Environments & Deployment

Environments let you gate deployments behind protection rules — required reviewers, wait timers, and branch restrictions.

> **Certification tip:** Environment secrets are only accessible to jobs that reference that environment.

---

## 1. The `environment` Key

```yaml
jobs:
  deploy-staging:
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to staging..."

  deploy-production:
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production..."
```

### Environment URL

```yaml
jobs:
  deploy:
    environment:
      name: production
      url: https://myapp.example.com
    runs-on: ubuntu-latest
```

---

## 2. Deployment Protection Rules

Configured in repo **Settings → Environments**:

| Rule | Behavior |
|------|----------|
| Required reviewers | Specific people must approve |
| Wait timer | Delay before deployment (up to 6 hours) |
| Branch policy | Restrict which branches can deploy |

---

## 3. `deployment_status` Event

```yaml
on:
  deployment_status:
    types: [completed]

jobs:
  notify:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deployment succeeded!"
```

| `state` | Meaning |
|---------|---------|
| `pending` | Deployment started |
| `success` | Completed successfully |
| `failure` | Deployment failed |
| `inactive` | Environment deleted |

---

## 4. Real-World Use Case

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches: [main]
    tags: [v*]

jobs:
  preview:
    if: github.event_name == 'pull_request'
    environment: preview
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying PR preview..."

  staging:
    if: github.ref == 'refs/heads/main'
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to staging..."

  production:
    if: startsWith(github.ref, 'refs/tags/v')
    environment:
      name: production
      url: https://app.example.com
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying production release..."
```

**Next module:** [Secrets & Variables →](/study/secrets-vars)
