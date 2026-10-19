---
id: secrets-vars
title: Secrets & Variables
description: Repository, organization, and environment secrets, GitHub Actions variables, and secure handling.
sidebar_position: 5
---

# Secrets & Variables

Secrets and variables let you store sensitive and configuration data outside your workflow code.

> **Certification tip:** Secrets are never shown in logs (masked with `***`). Variables are visible in logs — never store sensitive data in variables.

---

## 1. The Three Secret Scopes

| Scope | Where configured | Accessible to |
|-------|-----------------|---------------|
| Repository secrets | Repo Settings → Secrets | Workflows in that repo |
| Organization secrets | Org Settings → Secrets | Selected repos in org |
| Environment secrets | Repo Settings → Environments | Jobs referencing that environment |

---

## 2. Using Secrets

### Best practice: via `env`

```yaml
steps:
  - run: echo "Using API key"
    env:
      API_KEY: ${{ secrets.API_KEY }}
```

### Passing to actions

```yaml
steps:
  - uses: some-action@v1
    with:
      api-key: ${{ secrets.MY_API_KEY }}
```

---

## 3. Variables (`vars.`)

Non-sensitive configuration values, visible in logs.

```yaml
jobs:
  build:
    steps:
      - run: echo "Building for ${{ vars.DEPLOY_REGION }}"
```

### Variable precedence (highest to lowest)

1. Job-level `env`
2. Step-level `env`
3. Repository variables
4. Organization variables
5. Environment variables

---

## 4. Environment Secrets

Scoped to a specific environment. A job must use `environment: <name>` to access them.

```yaml
jobs:
  deploy-production:
    environment: production
    steps:
      - run: echo "${{ secrets.PRODUCTION_DB_PASSWORD }}"
```

---

## 5. `GITHUB_TOKEN`

Automatically created for each workflow run.

```yaml
jobs:
  deploy:
    permissions:
      contents: read
      deployments: write
    steps:
      - run: echo "${{ secrets.GITHUB_TOKEN }}"
```

---

## 6. Secret Masking

```yaml
steps:
  - run: echo "The secret is ${{ secrets.MY_SECRET }}"
```

Output: `The secret is ***`

**Next module:** [Reusable Workflows →](/study/reusable-workflows)
