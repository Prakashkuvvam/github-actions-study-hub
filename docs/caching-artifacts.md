---
id: caching-artifacts
title: Caching & Artifacts
description: actions/cache, upload-artifact, download-artifact, cache keys, restore-keys, and artifact retention.
sidebar_position: 10
---

# Caching & Artifacts

Caching speeds up workflows by reusing dependencies. Artifacts pass files between jobs and preserve build outputs.

> **Certification tip:** Cache is for dependencies. Artifacts are for build outputs.

---

## 1. `actions/cache`

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
      ${{ runner.os }}-
```

| Parameter | Purpose |
|-----------|---------|
| `path` | Directory to cache |
| `key` | Exact cache key |
| `restore-keys` | Fallback prefix matches |

---

## 2. Language Examples

**Python:**
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
```

**Go:**
```yaml
- uses: actions/cache@v4
  with:
    path: ~/go/pkg/mod
    key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}
```

---

## 3. Artifacts

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/
    retention-days: 7
```

```yaml
- uses: actions/download-artifact@v4
  with:
    name: dist
```

---

## 4. Cache vs Artifacts

| | Cache | Artifacts |
|---|-------|-----------|
| Purpose | Speed up builds | Save outputs |
| Retention | 7 days | 90 days default |
| Key-based | Yes | No |

**Next module:** [Debugging & ACT →](/study/debugging)
