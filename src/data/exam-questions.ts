export interface ExamQuestion {
  id: number;
  module: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // --- Foundations ---
  {
    id: 1,
    module: 'Foundations',
    question: 'Which of the following is the minimum valid GitHub Actions workflow structure?',
    options: [
      'name: CI\non: push\nsteps:\n  - run: echo hi',
      'name: CI\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest',
      'name: CI\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4',
      'on: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hi',
    ],
    correctIndex: 2,
    explanation: 'A valid workflow requires `on:` (trigger) and `jobs:` with at least one job containing `runs-on` and `steps`. Options A and D are missing required keys. Option B is missing `steps`.',
  },
  {
    id: 2,
    module: 'Foundations',
    question: 'Which runner label executes jobs on GitHub-hosted Ubuntu?',
    options: ['self-hosted', 'ubuntu-latest', 'ubuntu-22.04', 'ubuntu'],
    correctIndex: 1,
    explanation: '`ubuntu-latest` is the standard GitHub-hosted runner label. `self-hosted` is your own machine. `ubuntu` alone is not a valid label.',
  },
  {
    id: 3,
    module: 'Foundations',
    question: 'What does `actions/checkout@v4` do?',
    options: [
      'Installs Node.js on the runner',
      'Checks out your repository code into the runner',
      'Runs your test suite',
      'Deploys to production',
    ],
    correctIndex: 1,
    explanation: '`actions/checkout` clones your repository into the runner so subsequent steps can access your code.',
  },
  {
    id: 4,
    module: 'Foundations',
    question: 'Which context contains information about the current workflow run, such as `run_id` and `run_attempt`?',
    options: ['github', 'jobs', 'steps', 'runner'],
    correctIndex: 0,
    explanation: 'The `github` context contains information about the workflow run, event, repository, and runner. `github.run_id` and `github.run_attempt` are available here.',
  },
  {
    id: 5,
    module: 'Foundations',
    question: 'Which file path is the standard location for a GitHub Actions workflow file?',
    options: [
      '.github/actions/workflow.yml',
      '.github/workflows/ci.yml',
      '.github/workflow/main.yml',
      'actions/ci.yml',
    ],
    correctIndex: 1,
    explanation: 'Workflow files live in `.github/workflows/` directory with `.yml` or `.yaml` extension.',
  },

  // --- Triggers & Scheduling ---
  {
    id: 6,
    module: 'Triggers & Scheduling',
    question: 'Which event fires when a pull request is merged into `main`?',
    options: [
      'push to `main`',
      'pull_request with `types: [closed]` and `github.event.pull_request.merged == true`',
      'pull_request with `types: [opened]`',
      'workflow_run',
    ],
    correctIndex: 1,
    explanation: '`pull_request` with `types: [closed]` fires when a PR is closed, but you must check `merged == true` because a PR can be closed without being merged.',
  },
  {
    id: 7,
    module: 'Triggers & Scheduling',
    question: 'What is the minimum interval for a `schedule` trigger?',
    options: ['1 minute', '5 minutes', '15 minutes', '1 hour'],
    correctIndex: 2,
    explanation: 'Scheduled workflows can run at most once every 15 minutes.',
  },
  {
    id: 8,
    module: 'Triggers & Scheduling',
    question: '`workflow_dispatch` boolean inputs are passed to the workflow as:',
    options: [
      'JavaScript booleans (`true`/`false`)',
      'Strings (`"true"`/`"false"`)',
      'Integers (`1`/`0`)',
      'Not supported',
    ],
    correctIndex: 1,
    explanation: 'Boolean inputs from `workflow_dispatch` are passed as strings. Compare them with quotes: `github.event.inputs.debug == "true"`.',
  },
  {
    id: 9,
    module: 'Triggers & Scheduling',
    question: 'You cannot use both `branches` and `branches-ignore` in the same `on.push` block. True or false?',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True. You must choose either inclusive (`branches`) or exclusive (`branches-ignore`) filtering, not both.',
  },
  {
    id: 10,
    module: 'Triggers & Scheduling',
    question: 'Which cron expression runs a workflow every day at 02:00 UTC?',
    options: ['0 2 * * *', '2 0 * * *', '0 0 * * 2', '*/2 * * * *'],
    correctIndex: 0,
    explanation: 'Cron format is `minute hour day month weekday`. `0 2 * * *` means minute 0, hour 2, every day.',
  },

  // --- Job Control ---
  {
    id: 11,
    module: 'Job Control',
    question: 'Jobs run in parallel unless:',
    options: [
      'They use `continue-on-error`',
      'They use `needs:`',
      'They use `if:`',
      'They use `matrix:`',
    ],
    correctIndex: 1,
    explanation: '`needs:` creates a dependency — the job waits for listed jobs to complete. Without `needs`, all jobs run in parallel.',
  },
  {
    id: 12,
    module: 'Job Control',
    question: 'A matrix with `os: [ubuntu-latest, windows-latest]` and `node-version: [18.x, 20.x]` creates how many jobs?',
    options: ['2', '3', '4', '8'],
    correctIndex: 2,
    explanation: '2 OS × 2 Node versions = 4 jobs running in parallel.',
  },
  {
    id: 13,
    module: 'Job Control',
    question: 'How do you access a job output from a downstream job?',
    options: [
      '${{ steps.step-id.outputs.name }}',
      '${{ needs.job-id.outputs.name }}',
      '${{ jobs.job-id.outputs.name }}',
      '${{ matrix.outputs.name }}',
    ],
    correctIndex: 1,
    explanation: 'Job outputs are accessed via `needs.<job-id>.outputs.<name>`. Step outputs use `steps.<id>.outputs.<name>` but only within the same job.',
  },
  {
    id: 14,
    module: 'Job Control',
    question: 'With `fail-fast: true` (default), if one matrix job fails, what happens to the others?',
    options: [
      'They continue running',
      'They are cancelled',
      'They wait for the failed job to be fixed',
      'They run sequentially after',
    ],
    correctIndex: 1,
    explanation: '`fail-fast: true` cancels all in-flight matrix jobs when one fails. Set to `false` if you want all combinations to report independently.',
  },
  {
    id: 15,
    module: 'Job Control',
    question: 'Which expression runs a step regardless of whether the previous step failed?',
    options: [
      'if: success()',
      'if: always()',
      'if: failure()',
      'if: cancelled()',
    ],
    correctIndex: 1,
    explanation: '`always()` runs the step regardless of previous results. `success()` only runs if previous steps succeeded.',
  },

  // --- Environments & Deployment ---
  {
    id: 16,
    module: 'Environments & Deployment',
    question: 'When can a job with `environment: production` start running?',
    options: [
      'Immediately when the workflow starts',
      'After all protection rules pass (reviewers, wait timer, branch policy)',
      'After the previous job succeeds',
      'When the environment is created in settings',
    ],
    correctIndex: 1,
    explanation: 'Environment protection rules must clear before the job starts. The job pauses at the environment gate.',
  },
  {
    id: 17,
    module: 'Environments & Deployment',
    question: 'Environment secrets are accessible to:',
    options: [
      'All jobs in the workflow',
      'Only jobs referencing that environment',
      'Only the job that created the secret',
      'No jobs',
    ],
    correctIndex: 1,
    explanation: 'Environment secrets are scoped — a job must use `environment: <name>` to access that environment\'s secrets.',
  },
  {
    id: 18,
    module: 'Environments & Deployment',
    question: 'Which event is triggered when a deployment status changes?',
    options: ['deployment', 'deployment_status', 'environment', 'release'],
    correctIndex: 1,
    explanation: '`deployment_status` fires when a deployment\'s status changes (pending, success, failure, inactive).',
  },

  // --- Secrets & Variables ---
  {
    id: 19,
    module: 'Secrets & Variables',
    question: 'Which is the best practice for passing a secret to a step?',
    options: [
      'run: echo ${{ secrets.MY_TOKEN }}',
      'env: TOKEN: ${{ secrets.MY_TOKEN }} then run: echo $TOKEN',
      'Store it in a variable (`vars.`)',
      'Hardcode it in the YAML',
    ],
    correctIndex: 1,
    explanation: 'Passing secrets via `env:` is the recommended best practice. Variables (`vars.`) are visible in logs — never for secrets.',
  },
  {
    id: 20,
    module: 'Secrets & Variables',
    question: '`secrets.GITHUB_TOKEN` is:',
    options: [
      'A secret you must create manually',
      'Automatically provided by GitHub for each workflow run',
      'Only available in public repositories',
      'The same as a personal access token',
    ],
    correctIndex: 1,
    explanation: '`GITHUB_TOKEN` is automatically created by GitHub for each workflow run and expires when the run finishes.',
  },
  {
    id: 21,
    module: 'Secrets & Variables',
    question: 'To use OIDC with AWS, which permission is required?',
    options: [
      'contents: write',
      'id-token: write',
      'deployments: write',
      'packages: write',
    ],
    correctIndex: 1,
    explanation: '`id-token: write` is required to request an OIDC token from GitHub\'s OIDC provider.',
  },

  // --- Reusable Workflows & Custom Actions ---
  {
    id: 22,
    module: 'Reusable Workflows',
    question: 'A reusable workflow must declare which trigger?',
    options: ['on: push', 'on: workflow_call', 'on: workflow_dispatch', 'on: repository_dispatch'],
    correctIndex: 1,
    explanation: '`on: workflow_call` is the required trigger for a workflow that can be called by another workflow.',
  },
  {
    id: 23,
    module: 'Reusable Workflows',
    question: 'How do you pass all caller secrets to a reusable workflow?',
    options: ['secrets: inherit', 'secrets: all', 'secrets: true', 'secrets: copy'],
    correctIndex: 0,
    explanation: '`secrets: inherit` passes all caller secrets to the reusable workflow. Individual mapping is preferred for least privilege.',
  },
  {
    id: 24,
    module: 'Custom Actions',
    question: 'Which action type uses `using: composite`?',
    options: ['Docker container', 'JavaScript', 'Composite', 'Reusable workflow'],
    correctIndex: 2,
    explanation: 'Composite actions use `using: composite` and group multiple steps into one reusable unit.',
  },
  {
    id: 25,
    module: 'Custom Actions',
    question: 'Which action type runs inside a Docker container?',
    options: ['Composite', 'JavaScript', 'Docker container', 'Reusable'],
    correctIndex: 2,
    explanation: 'Docker container actions use `using: docker` and run inside a container defined by a Dockerfile.',
  },

  // --- Self-Hosted Runners ---
  {
    id: 26,
    module: 'Self-Hosted Runners',
    question: 'You should NOT use self-hosted runners for:',
    options: [
      'Internal network access',
      'Pull requests from public forks',
      'Specialized hardware',
      'Cost savings',
    ],
    correctIndex: 1,
    explanation: 'Self-hosted runners run code with access to your environment. Running untrusted code from public forks is a security risk.',
  },
  {
    id: 27,
    module: 'Self-Hosted Runners',
    question: '`--ephemeral` means the runner:',
    options: [
      'Runs only one job then is removed',
      'Is deleted after the workflow finishes',
      'Runs in the cloud only',
      'Cannot use labels',
    ],
    correctIndex: 0,
    explanation: 'Ephemeral runners are removed after a single job completes, ensuring a clean state.',
  },

  // --- Security & OIDC ---
  {
    id: 28,
    module: 'Security & OIDC',
    question: 'Which is NOT a valid way to handle secrets?',
    options: [
      'Repository secrets',
      'Organization secrets',
      'Environment secrets',
      'Plain text in the workflow YAML',
    ],
    correctIndex: 3,
    explanation: 'Never hardcode secrets in workflow YAML. Use repository, organization, or environment secrets instead.',
  },
  {
    id: 29,
    module: 'Security & OIDC',
    question: 'Artifact attestation requires which permissions?',
    options: [
      'contents: read',
      'actions: write and id-token: write',
      'deployments: write',
      'packages: write',
    ],
    correctIndex: 1,
    explanation: 'Attestation via `actions/attest-build-provenance` requires `actions: write` and `id-token: write`.',
  },
  {
    id: 30,
    module: 'Security & OIDC',
    question: 'What does secret scanning with push protection do?',
    options: [
      'Deletes the repository',
      'Blocks pushes containing secrets',
      'Encrypts all secrets',
      'Rotates secrets automatically',
    ],
    correctIndex: 1,
    explanation: 'Push protection scans pushes for secrets and blocks them from entering the repository.',
  },

  // --- Caching & Artifacts ---
  {
    id: 31,
    module: 'Caching & Artifacts',
    question: 'What is the difference between `key` and `restore-keys` in `actions/cache`?',
    options: [
      '`key` is required, `restore-keys` is optional fallback keys',
      '`key` restores, `restore-keys` saves',
      'They are the same thing',
      '`restore-keys` is required, `key` is optional',
    ],
    correctIndex: 0,
    explanation: '`key` is the exact cache key to save/restore. `restore-keys` are fallback prefix matches used when `key` doesn\'t match.',
  },
  {
    id: 32,
    module: 'Caching & Artifacts',
    question: 'How long are GitHub Actions artifacts retained by default?',
    options: ['7 days', '30 days', '90 days', '1 year'],
    correctIndex: 2,
    explanation: 'Artifacts are retained for 90 days by default (configurable via `retention-days`).',
  },
  {
    id: 33,
    module: 'Caching & Artifacts',
    question: 'Caches are evicted after how many days of inactivity?',
    options: ['7 days', '14 days', '30 days', '90 days'],
    correctIndex: 0,
    explanation: 'GitHub cache entries are evicted after 7 days of not being accessed.',
  },

  // --- Debugging & ACT ---
  {
    id: 34,
    module: 'Debugging & ACT',
    question: 'Which runs a step regardless of whether the previous step failed?',
    options: [
      'continue-on-error: true',
      'if: always()',
      'Both',
      'Neither',
    ],
    correctIndex: 2,
    explanation: '`continue-on-error: true` lets the job continue after a step failure. `if: always()` runs the step regardless of previous results. They serve complementary purposes.',
  },
  {
    id: 35,
    module: 'Debugging & ACT',
    question: 'ACT is used for:',
    options: [
      'Running workflows locally with Docker',
      'Measuring workflow performance',
      'Validating YAML syntax',
      'Creating GitHub repositories',
    ],
    correctIndex: 0,
    explanation: 'ACT (by nektos) runs GitHub Actions workflows locally using Docker containers as runners.',
  },
  {
    id: 36,
    module: 'Debugging & ACT',
    question: 'You see `resource not accessible by integration` in a job log. What is the likely cause?',
    options: [
      'Cache key doesn\'t match',
      '`GITHUB_TOKEN` lacks required permissions',
      'Wrong runner label',
      'Missing `needs:` dependency',
    ],
    correctIndex: 1,
    explanation: 'The `GITHUB_TOKEN` needs broader `permissions:` to access the requested resource.',
  },
];

export function getQuestionsForModule(module: string): ExamQuestion[] {
  return EXAM_QUESTIONS.filter((q) => q.module === module);
}

export function getRandomQuestions(count: number): ExamQuestion[] {
  const shuffled = [...EXAM_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
