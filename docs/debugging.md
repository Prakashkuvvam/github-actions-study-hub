---
id: debugging
title: Debugging & ACT
description: Debug logging, step checksums, re-run failed jobs, ACT for local testing, and troubleshooting workflows.
sidebar_position: 11
---

# Debugging & ACT

---

## 1. Debug Logging

Repo Settings → Actions → General → Workflow debugging

Or set repository secret: `ACTIONS_STEP_DEBUG=true`

---

## 2. `step-summary`

```yaml
steps:
  - name: Write summary
    run: |
      echo "## Test Results" >> $GITHUB_STEP_SUMMARY
      echo "Passed: 40" >> $GITHUB_STEP_SUMMARY
```

---

## 3. Re-Run Options

| Option | Behavior |
|--------|----------|
| Re-run all jobs | Re-runs every job |
| Re-run failed jobs | Re-runs only failed/cancelled |
| Re-run with debug | Enables `ACTIONS_STEP_DEBUG` |

---

## 4. `continue-on-error` vs `if: always()`

| Approach | Behavior |
|----------|----------|
| `continue-on-error: true` | Step can fail, job continues |
| `if: always()` | Step runs regardless of previous result |

---

## 5. ACT — Local Testing

```bash
brew install act          # macOS
act -l                    # List workflows
act -j build              # Run specific job
act --secret-file .secrets # Run with secrets
```

**Next module:** [Practice Exams →](/study/practice-exams)
