---
title: Practice Exams
description: Timed quizzes with answer explanations tied to the GitHub Actions certification syllabus.
module: Practice Exams
order: 12
draft: false
---

# Practice Exams

This module simulates the GitHub Actions certification exam. Work through the question sets, check your answers, and review the explanations for anything you miss.

> **Certification tip:** The real exam is scenario-based — you'll read a workflow snippet and determine what happens. Practice reading YAML quickly and spotting the one thing that's wrong.

---

## How to Use This Module

1. **Attempt each quiz** without looking at notes.
2. **Check answers** and read every explanation — even for questions you got right.
3. **Review weak modules** — go back to the relevant study module and re-read.
4. **Time yourself** — the exam has a time limit; practice pacing.

---

## Quiz 1: Foundations

### Q1. What is the minimum valid GitHub Actions workflow?

**A.**
```yaml
name: CI
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo hi
```

**B.**
```yaml
on: push
jobs:
  build:
    runs-on: ubuntu-latest
```

**C.**
```yaml
name: CI
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

**D.**
```yaml
name: CI
on: push
steps:
  - run: echo hi
```

<details>
<summary>Answer</summary>

**Answer: C**

A valid workflow requires `on:` (trigger) and `jobs:` with at least one job that has `runs-on` and `steps`. Option B is missing `steps`. Option D is missing `jobs`. Option A is actually also valid — but C is the most complete minimal example with a real action. On the exam, choose the option that is both valid and follows best practices (using a pinned action version).

</details>

### Q2. Which runner label runs on GitHub-hosted Ubuntu?

**A.** `self-hosted`
**B.** `ubuntu-latest`
**C.** `ubuntu-22.04`
**D.** `ubuntu`

<details>
<summary>Answer</summary>

**Answer: B**

`ubuntu-latest` is the standard GitHub-hosted runner label. `self-hosted` is your own machine. `ubuntu-22.04` may work but `ubuntu-latest` is the documented label. `ubuntu` alone is not valid.

</details>

### Q3. What does `actions/checkout@v4` do?

**A.** Installs Node.js
**B.** Checks out your repository code into the runner
**C.** Runs your test suite
**D.** Deploys to production

<details>
<summary>Answer</summary>

**Answer: B**

`actions/checkout` clones your repository into the runner so subsequent steps can access your code. It's almost always the first step in a job.

</details>

---

## Quiz 2: Triggers & Scheduling

### Q4. You want a workflow to run only when a pull request is merged into `main`. Which configuration is correct?

**A.**
```yaml
on:
  pull_request:
    branches: [main]
```

**B.**
```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]
```

**C.**
```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]
jobs:
  deploy:
    if: github.event.pull_request.merged == true
```

**D.**
```yaml
on:
  push:
    branches: [main]
```

<details>
<summary>Answer</summary>

**Answer: C**

`pull_request` with `types: [closed]` fires when a PR is closed. But you must also check `github.event.pull_request.merged == true` because a PR can be closed without being merged. Option B alone would also run on declined PRs. Option A runs on any PR activity to main, not just merges. Option D runs on push, not PR merge.

</details>

### Q5. What is the minimum interval for a `schedule` trigger?

**A.** 1 minute
**B.** 5 minutes
**C.** 15 minutes
**D.** 1 hour

<details>
<summary>Answer</summary>

**Answer: C**

Scheduled workflows can run at most once every 15 minutes. A cron like `* * * * *` (every minute) will be rejected or throttled.

</details>

### Q6. `workflow_dispatch` inputs of type `boolean` are passed as:

**A.** JavaScript booleans (`true`/`false`)
**B. Strings (`"true"`/`"false"`)
**C.** Integers (`1`/`0`)
**D.** Not supported

<details>
<summary>Answer</summary>

**Answer: B**

Boolean inputs from `workflow_dispatch` are passed as strings `"true"` or `"false"`. Compare them with quotes: `github.event.inputs.debug == 'true'`.

</details>

---

## Quiz 3: Job Control

### Q7. Jobs run in parallel unless:

**A.** They use `continue-on-error`
**B.** They use `needs:`
**C.** They use `if:`
**D.** They use `matrix:`

<details>
<summary>Answer</summary>

**Answer: B**

`needs:` creates a dependency — the job waits for listed jobs to complete. Without `needs`, all jobs in a workflow run in parallel.

</details>

### Q8. A matrix with `os: [ubuntu-latest, windows-latest]` and `node-version: [18.x, 20.x]` creates how many jobs?

**A.** 2
**B.** 3
**C.** 4
**D.** 8

<details>
<summary>Answer</summary>

**Answer: C**

2 OS × 2 Node versions = 4 jobs, all running in parallel (unless `fail-fast` or `max-parallel` limits them).

</details>

### Q9. How do you access a job output from a downstream job?

**A.** `${{ steps.step-id.outputs.name }}`
**B.** `${{ needs.job-id.outputs.name }}`
**C.** `${{ jobs.job-id.outputs.name }}`
**D.** `${{ matrix.outputs.name }}`

<details>
<summary>Answer</summary>

**Answer: B**

Job outputs are accessed via `needs.<job-id>.outputs.<name>`. Step outputs use `steps.<step-id>.outputs.<name>` but only within the same job.

</details>

---

## Quiz 4: Environments & Deployment

### Q10. When can a job with `environment: production` start running?

**A.** Immediately when the workflow starts
**B.** After all protection rules pass (reviewers, wait timer, branch policy)
**C.** After the previous job succeeds
**D.** When the environment is created in settings

<details>
<summary>Answer</summary>

**Answer: B**

Environment protection rules (required reviewers, wait timers, branch policies) must clear before the job starts. The job pauses at the environment gate.

</details>

### Q11. Environment secrets are accessible to:

**A.** All jobs in the workflow
**B.** Only jobs referencing that environment
**C.** Only the job that created the secret
**D.** No jobs — they're just for display

<details>
<summary>Answer</summary>

**Answer: B**

Environment secrets are scoped. A job must use `environment: <name>` to access that environment's secrets.

</details>

---

## Quiz 5: Secrets & Variables

### Q12. Which is the best practice for passing a secret to a step?

**A.** `run: echo ${{ secrets.MY_TOKEN }}`
**B.** `env: TOKEN: ${{ secrets.MY_TOKEN }}` then `run: echo $TOKEN`
**C.** `run: curl -H "token: ${{ secrets.MY_TOKEN }}" ...`
**D.** Store it in a variable (`vars.`)

<details>
<summary>Answer</summary>

**Answer: B**

Passing secrets via `env:` is the recommended best practice. It ensures proper masking and avoids shell interpolation issues. Variables (`vars.`) are visible in logs — never for secrets.

</details>

### Q13. `secrets.GITHUB_TOKEN` is:

**A.** A secret you must create manually
**B.** Automatically provided by GitHub for each workflow run
**C.** Only available in public repositories
**D.** The same as a personal access token

<details>
<summary>Answer</summary>

**Answer: B**

`GITHUB_TOKEN` is automatically created by GitHub for each workflow run. It expires when the run finishes. You don't need to configure it.

</details>

---

## Quiz 6: Reusable Workflows & Custom Actions

### Q14. A reusable workflow must declare which trigger?

**A.** `on: push`
**B.** `on: workflow_call`
**C.** `on: workflow_dispatch`
**D.** `on: repository_dispatch`

<details>
<summary>Answer</summary>

**Answer: B**

`on: workflow_call` is the required trigger for a workflow that can be called by another workflow.

</details>

### Q15. Which action type runs inside a Docker container?

**A.** Composite
**B.** JavaScript
**C.** Docker container
**D.** Reusable

<details>
<summary>Answer</summary>

**Answer: C**

Docker container actions use `using: docker` and run inside a container defined by a Dockerfile.

</details>

---

## Quiz 7: Self-Hosted Runners

### Q16. You should NOT use self-hosted runners for:

**A.** Internal network access
**B.** Pull requests from public forks
**C.** Specialized hardware
**D.** Cost savings

<details>
<summary>Answer</summary>

**Answer: B**

Self-hosted runners run code from your repository with access to your environment. Running untrusted code from public forks is a security risk. Use GitHub-hosted runners for fork PRs.

</details>

### Q17. `--ephemeral` means the runner:

**A.** Runs only one job then is removed
**B.** Is deleted after the workflow finishes
**C.** Runs in the cloud only
**D.** Cannot use labels

<details>
<summary>Answer</summary>

**Answer: A**

Ephemeral runners are removed after a single job completes, ensuring a clean state and better security.

</details>

---

## Quiz 8: Security & OIDC

### Q18. To use OIDC with AWS, which permission is required?

**A.** `contents: write`
**B.** `id-token: write`
**C.** `deployments: write`
**D.** `packages: write`

<details>
<summary>Answer</summary>

**Answer: B**

`id-token: write` is required to request an OIDC token from GitHub's OIDC provider.

</details>

### Q19. Which is NOT a valid way to handle secrets?

**A.** Repository secrets
**B.** Organization secrets
**C.** Environment secrets
**D.** Plain text in the workflow YAML

<details>
<summary>Answer</summary>

**Answer: D**

Never hardcode secrets in workflow YAML. Use repository, organization, or environment secrets instead.

</details>

---

## Quiz 9: Caching & Artifacts

### Q20. What's the difference between `key` and `restore-keys` in `actions/cache`?

**A.** `key` is required, `restore-keys` is optional fallback keys
**B.** `key` restores, `restore-keys` saves
**C.** They're the same thing
**D.** `restore-keys` is required, `key` is optional

<details>
<summary>Answer</summary>

**Answer: A**

`key` is the exact cache key to save/restore. `restore-keys` are fallback prefix matches used when `key` doesn't match.

</details>

### Q21. How long are GitHub Actions artifacts retained by default?

**A.** 7 days
**B.** 30 days
**C.** 90 days
**D.** 1 year

<details>
<summary>Answer</summary>

**Answer: C**

Artifacts are retained for 90 days by default (configurable via `retention-days` in `upload-artifact`).

</details>

---

## Quiz 10: Debugging & ACT

### Q22. Which runs a step regardless of whether the previous step failed?

**A.** `continue-on-error: true`
**B.** `if: always()`
**C.** Both A and B
**D.** Neither

<details>
<summary>Answer</summary>

**Answer: C**

`continue-on-error: true` lets the job continue after a step failure. `if: always()` runs the step regardless of the previous result. They serve different but complementary purposes.

</details>

### Q23. ACT is used for:

**A.** Running workflows locally with Docker
**B.** Measuring workflow performance
**C.** Validating YAML syntax
**D.** Creating GitHub repositories

<details>
<summary>Answer</summary>

**Answer: A**

ACT (by nektos) runs GitHub Actions workflows locally using Docker containers as runners.

</details>

---

## Full Practice Exam (10 Questions, Timed)

Simulate the real exam: 10 questions, ~15 minutes, no notes.

<details>
<summary>Start Practice Exam</summary>

### P1. A workflow has two jobs: `lint` and `test`. `test` has `needs: lint`. If `lint` fails, what happens to `test`?

**A.** Runs anyway
**B.** Skipped
**C.** Runs with `continue-on-error`
**D.** Runs after `lint` is fixed manually

<details>
<summary>Answer</summary>

**Answer: B.** Without `if: always()` on `test`, a failed `lint` causes `test` to be skipped.

</details>

### P2. Which event fires when a PR is merged into `main`?

**A.** `push` to `main`
**B.** `pull_request` with `types: [closed]` + `merged == true`
**C.** `pull_request` with `types: [opened]`
**D.** `workflow_run`

<details>
<summary>Answer</summary>

**Answer: B.** `pull_request` closed with `merged == true` precisely detects merges.

</details>

### P3. You need to run a job on a machine with access to your internal Docker registry. What should you use?

**A.** `ubuntu-latest`
**B.** `self-hosted` with a label for registry access
**C.** `macos-latest`
**D.** `windows-latest`

<details>
<summary>Answer</summary>

**Answer: B.** Self-hosted runners run in your infrastructure and can reach internal networks.

</details>

### P4. You want to deploy to AWS without storing AWS keys in GitHub. What should you use?

**A.** Repository secrets with `AWS_ACCESS_KEY_ID`
**B.** OIDC with `id-token: write`
**C.** Environment secrets
**D.** `GITHUB_TOKEN`

<details>
<summary>Answer</summary>

**Answer: B.** OIDC provides short-lived credentials without long-lived secrets.

</details>

### P5. A matrix has `node-version: [18.x, 20.x]` with `fail-fast: true`. If the Node 18 job fails, what happens to the Node 20 job?

**A.** Continues running
**B.** Is cancelled
**C.** Runs after Node 18 is fixed
**D.** Runs only if Node 18 passes

<details>
<summary>Answer</summary>

**Answer: B.** `fail-fast: true` (default) cancels in-flight matrix jobs when one fails.

</details>

### P6. Which action type uses `using: composite`?

**A.** Docker container
**B.** JavaScript
**C.** Composite
**D.** Reusable workflow

<details>
<summary>Answer</summary>

**Answer: C.** Composite actions use `using: composite`.

</details>

### P7. Where are environment secrets configured?

**A.** Repo Settings → Secrets → Actions
**B.** Repo Settings → Environments → [env name]
**C.** Org Settings → Secrets → Actions
**D.** Workflow YAML `env:` key

<details>
<summary>Answer</summary>

**Answer: B.** Environment secrets are configured per-environment in Settings → Environments.

</details>

### P8. What does `actions/upload-artifact@v4` do?

**A.** Caches dependencies between runs
**B.** Uploads files to keep after the workflow ends
**C.** Deploys to a server
**D.** Runs tests

<details>
<summary>Answer</summary>

**Answer: B.** Artifacts preserve files (build outputs, test reports) after the workflow finishes.

</details>

### P9. You see `resource not accessible by integration` in a job log. What's the likely cause?

**A.** Cache key doesn't match
**B.** `GITHUB_TOKEN` lacks required permissions
**C.** Wrong runner label
**D.** Missing `needs:` dependency

<details>
<summary>Answer</summary>

**Answer: B.** The `GITHUB_TOKEN` needs broader `permissions:` to access the resource.

</details>

### P10. How do you enable debug logging for a workflow re-run?

**A.** Add `debug: true` to the workflow YAML
**B.** Set `ACTIONS_STEP_DEBUG=true` repo secret, then re-run with debug logging
**C.** It's always on
**D.** Not possible

<details>
<summary>Answer</summary>

**Answer: B.** Set the `ACTIONS_STEP_DEBUG=true` secret, then choose "Re-run jobs" with debug logging enabled.

</details>

</details>

---

## Answer Key Summary

| Question | Answer | Module to Review |
|----------|--------|------------------|
| Q1 | C | Foundations |
| Q2 | B | Foundations |
| Q3 | B | Foundations |
| Q4 | C | Triggers |
| Q5 | C | Triggers |
| Q6 | B | Triggers |
| Q7 | B | Job Control |
| Q8 | C | Job Control |
| Q9 | B | Job Control |
| Q10 | B | Environments |
| Q11 | B | Secrets |
| Q12 | B | Secrets |
| Q13 | B | Secrets |
| Q14 | B | Reusable Workflows |
| Q15 | C | Custom Actions |
| Q16 | B | Self-Hosted Runners |
| Q17 | A | Self-Hosted Runners |
| Q18 | B | Security & OIDC |
| Q19 | D | Security & OIDC |
| Q20 | A | Caching & Artifacts |
| Q21 | C | Caching & Artifacts |
| Q22 | C | Debugging |
| Q23 | A | Debugging |
| P1-P10 | See explanations | All modules |

---

## Final Exam Readiness Checklist

- [ ] I can write a minimal valid workflow from memory
- [ ] I know when `pull_request` vs `push` fires
- [ ] I understand `needs` vs parallel jobs
- [ ] I can configure matrix builds with `include`/`exclude`
- [ ] I know environment protection rules and secrets scoping
- [ ] I understand OIDC and `id-token: write`
- [ ] I can distinguish cache vs artifacts
- [ ] I know how to debug with `ACTIONS_STEP_DEBUG` and ACT
- [ ] I've taken the timed practice exam and reviewed all explanations

---

**You're ready.** Go clear the certification! 🚀
