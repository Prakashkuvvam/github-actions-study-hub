---
id: custom-actions
title: Custom Actions
description: Docker container actions, JavaScript actions, composite actions, action inputs/outputs.
sidebar_position: 7
---

# Custom Actions

Three action types: **Docker container**, **JavaScript**, and **Composite**.

| Type | Best for | Runs in | Startup |
|------|----------|---------|---------|
| Composite | Combining steps | Runner shell | Fast |
| Docker | Language-specific tools | Container | Slower |
| JavaScript | Fast Node.js logic | Runner (Node) | Fastest |

---

## 1. Composite Actions

`.github/actions/my-action/action.yml`:

```yaml
name: 'My Composite Action'
description: 'Runs install and test'
inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20.x'
runs:
  using: composite
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    - run: npm ci
    - run: npm test
```

Usage:

```yaml
steps:
  - uses: ./.github/actions/my-action
    with:
      node-version: '18.x'
```

---

## 2. Docker Container Actions

```yaml
# action.yml
runs:
  using: docker
  image: Dockerfile
```

Requires a `Dockerfile` and `entrypoint.sh`.

---

## 3. JavaScript Actions

```yaml
# action.yml
runs:
  using: node20
  main: index.js
```

```javascript
// index.js
const core = require('@actions/core');
core.setOutput('time', new Date().toISOString());
```

Bundle with `@vercel/ncc` for production.

**Next module:** [Self-Hosted Runners →](/study/self-hosted-runners)
