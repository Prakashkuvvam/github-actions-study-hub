---
id: self-hosted-runners
title: Self-Hosted Runners
description: Setup, labels, ephemeral vs persistent, scaling, runner groups, and security.
sidebar_position: 8
---

# Self-Hosted Runners

A self-hosted runner is a machine you own and manage that executes GitHub Actions jobs.

> **Certification tip:** Self-hosted runners are not automatically updated or patched by GitHub.

---

## 1. Adding a Runner

Repo Settings → Actions → Runners → New self-hosted runner

```bash
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
./config.sh --url https://github.com/OWNER/REPO --token TOKEN
./run.sh
```

---

## 2. `runs-on` for Self-Hosted

```yaml
jobs:
  build:
    runs-on: self-hosted

  build-arm:
    runs-on: [self-hosted, linux, arm64]
```

---

## 3. Ephemeral vs Persistent

| Type | Lifespan | Security | Best for |
|------|----------|----------|----------|
| Ephemeral | One job | High | Most CI/CD |
| Persistent | Until removed | Lower | Long-running builds |

```bash
./config.sh --ephemeral
```

---

## 4. Security

Never use self-hosted runners for pull requests from public forks.

**Next module:** [Security & OIDC →](/study/security-oidc)
