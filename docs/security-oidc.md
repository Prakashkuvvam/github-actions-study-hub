---
id: security-oidc
title: Security & OIDC
description: permissions, OIDC federation, artifact attestation, secret scanning, and supply chain security.
sidebar_position: 9
---

# Security & OIDC

Security is one of the heaviest exam domains.

> **Certification tip:** Never store long-lived cloud credentials in GitHub secrets. Use OIDC instead.

---

## 1. `permissions`

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

## 2. OIDC (OpenID Connect)

Get short-lived cloud tokens without long-lived secrets.

### AWS Example

```yaml
jobs:
  deploy-aws:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole
          aws-region: us-east-1
      - run: aws s3 ls
```

> **Certification tip:** OIDC requires `id-token: write` permission.

---

## 3. Artifact Attestation

```yaml
jobs:
  build:
    permissions:
      contents: read
      actions: write
      id-token: write
    steps:
      - uses: actions/attest-build-provenance@v1
        with:
          subject-path: 'artifact.txt'
```

---

## 4. Secret Scanning & Push Protection

- Secret scanning: Automatically scans for leaked keys
- Push protection: Blocks pushes containing secrets

**Next module:** [Caching & Artifacts →](/study/caching-artifacts)
