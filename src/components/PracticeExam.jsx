import React, { useState, useEffect, useCallback } from 'react';

const QUESTIONS = [
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
    explanation: 'A valid workflow requires `on:` (trigger) and `jobs:` with at least one job containing `runs-on` and `steps`.',
  },
  {
    id: 2,
    module: 'Foundations',
    question: 'Which runner label executes jobs on GitHub-hosted Ubuntu?',
    options: ['self-hosted', 'ubuntu-latest', 'ubuntu-22.04', 'ubuntu'],
    correctIndex: 1,
    explanation: '`ubuntu-latest` is the standard GitHub-hosted runner label.',
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
    explanation: '`actions/checkout` clones your repository into the runner.',
  },
  {
    id: 4,
    module: 'Triggers & Scheduling',
    question: 'Which event fires when a pull request is merged into `main`?',
    options: [
      'push to `main`',
      'pull_request with `types: [closed]` and `merged == true`',
      'pull_request with `types: [opened]`',
      'workflow_run',
    ],
    correctIndex: 1,
    explanation: '`pull_request` closed with `merged == true` precisely detects merges.',
  },
  {
    id: 5,
    module: 'Triggers & Scheduling',
    question: 'What is the minimum interval for a `schedule` trigger?',
    options: ['1 minute', '5 minutes', '15 minutes', '1 hour'],
    correctIndex: 2,
    explanation: 'Scheduled workflows can run at most once every 15 minutes.',
  },
  {
    id: 6,
    module: 'Job Control',
    question: 'Jobs run in parallel unless:',
    options: [
      'They use `continue-on-error`',
      'They use `needs:`',
      'They use `if:`',
      'They use `matrix:`',
    ],
    correctIndex: 1,
    explanation: '`needs:` creates a dependency — without it, all jobs run in parallel.',
  },
  {
    id: 7,
    module: 'Job Control',
    question: 'A matrix with `os: [ubuntu-latest, windows-latest]` and `node-version: [18.x, 20.x]` creates how many jobs?',
    options: ['2', '3', '4', '8'],
    correctIndex: 2,
    explanation: '2 OS × 2 Node versions = 4 jobs running in parallel.',
  },
  {
    id: 8,
    module: 'Environments & Deployment',
    question: 'When can a job with `environment: production` start running?',
    options: [
      'Immediately when the workflow starts',
      'After all protection rules pass (reviewers, wait timer, branch policy)',
      'After the previous job succeeds',
      'When the environment is created in settings',
    ],
    correctIndex: 1,
    explanation: 'Environment protection rules must clear before the job starts.',
  },
  {
    id: 9,
    module: 'Secrets & Variables',
    question: 'Which is the best practice for passing a secret to a step?',
    options: [
      'run: echo ${{ secrets.MY_TOKEN }}',
      'env: TOKEN: ${{ secrets.MY_TOKEN }} then run: echo $TOKEN',
      'Store it in a variable (`vars.`)',
      'Hardcode it in the YAML',
    ],
    correctIndex: 1,
    explanation: 'Passing secrets via `env:` ensures proper masking and avoids shell interpolation.',
  },
  {
    id: 10,
    module: 'Secrets & Variables',
    question: 'To use OIDC with AWS, which permission is required?',
    options: ['contents: write', 'id-token: write', 'deployments: write', 'packages: write'],
    correctIndex: 1,
    explanation: '`id-token: write` is required to request an OIDC token.',
  },
  {
    id: 11,
    module: 'Reusable Workflows',
    question: 'A reusable workflow must declare which trigger?',
    options: ['on: push', 'on: workflow_call', 'on: workflow_dispatch', 'on: repository_dispatch'],
    correctIndex: 1,
    explanation: '`on: workflow_call` is required for reusable workflows.',
  },
  {
    id: 12,
    module: 'Custom Actions',
    question: 'Which action type uses `using: composite`?',
    options: ['Docker container', 'JavaScript', 'Composite', 'Reusable workflow'],
    correctIndex: 2,
    explanation: 'Composite actions use `using: composite`.',
  },
  {
    id: 13,
    module: 'Self-Hosted Runners',
    question: 'You should NOT use self-hosted runners for:',
    options: [
      'Internal network access',
      'Pull requests from public forks',
      'Specialized hardware',
      'Cost savings',
    ],
    correctIndex: 1,
    explanation: 'Running untrusted code from public forks on self-hosted runners is a security risk.',
  },
  {
    id: 14,
    module: 'Security & OIDC',
    question: 'Which is NOT a valid way to handle secrets?',
    options: [
      'Repository secrets',
      'Organization secrets',
      'Environment secrets',
      'Plain text in the workflow YAML',
    ],
    correctIndex: 3,
    explanation: 'Never hardcode secrets in workflow YAML.',
  },
  {
    id: 15,
    module: 'Caching & Artifacts',
    question: 'How long are GitHub Actions artifacts retained by default?',
    options: ['7 days', '30 days', '90 days', '1 year'],
    correctIndex: 2,
    explanation: 'Artifacts are retained for 90 days by default.',
  },
  {
    id: 16,
    module: 'Debugging & ACT',
    question: 'ACT is used for:',
    options: [
      'Running workflows locally with Docker',
      'Measuring workflow performance',
      'Validating YAML syntax',
      'Creating GitHub repositories',
    ],
    correctIndex: 0,
    explanation: 'ACT runs GitHub Actions workflows locally using Docker containers.',
  },
];

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PracticeExam() {
  const [phase, setPhase] = useState('setup'); // setup | exam | results | review
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [examCompleted, setExamCompleted] = useState(false);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  const startExam = useCallback(() => {
    const count = Math.min(questionCount, QUESTIONS.length);
    const shuffled = shuffle(QUESTIONS).slice(0, count);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(timerMinutes * 60);
    setExamCompleted(false);
    setPhase('exam');

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  }, [questionCount, timerMinutes]);

  const submitExam = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    setPhase('results');
    setExamCompleted(true);
  }, [timerInterval]);

  const selectOption = useCallback((index) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: index }));
  }, [currentIndex]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitExam();
    }
  }, [currentIndex, questions.length, submitExam]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const retakeExam = useCallback(() => {
    setPhase('setup');
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(0);
    setExamCompleted(false);
  }, []);

  const correctCount = questions.reduce((acc, q, i) => {
    return answers[i] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (phase === 'setup') {
    return (
      <div className="text-center margin-vert--xl">
        <div className="bg-secondary-darker padding--xl rounded-lg border display--inline-block margin-bottom--lg">
          <h2 className="text--primary font--bold margin-bottom--md">Start Exam</h2>
          <div className="flex justify--center gap-md margin-bottom--lg">
            <div className="flex align--center gap-sm">
              <label className="text--secondary">Questions</label>
              <input
                type="number"
                min="5"
                max={QUESTIONS.length}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
                className="bg-secondary border border-gray-600 rounded padding--sm text--primary text--sm width--sm"
              />
            </div>
            <div className="flex align--center gap-sm">
              <label className="text--secondary">Minutes</label>
              <input
                type="number"
                min="1"
                max="60"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 15)}
                className="bg-secondary border border-gray-600 rounded padding--sm text--primary text--sm width--sm"
              />
            </div>
          </div>
          <button
            onClick={startExam}
            className="button primary padding--md"
          >
            Start Exam →
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'exam') {
    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const isTimeCritical = timeLeft <= 60;

    return (
      <div className="margin-vert--lg">
        <div className="flex justify--between items--center margin-bottom--lg padding--md bg-secondary-darker rounded-lg border">
          <div className="flex align--center gap-sm">
            <span className="text--secondary text--sm">Question</span>
            <span className="text--primary font--bold text--monospace">{currentIndex + 1}</span>
            <span className="text--secondary text--sm">of</span>
            <span className="text--primary font--bold text--monospace">{questions.length}</span>
          </div>
          <div className="flex align--center gap-sm">
            <span className="text--secondary text--sm">Time Left</span>
            <span
              className={clsx(
                'text--font-bold text--monospace',
                isTimeCritical ? 'text--error' : 'text--primary'
              )}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="width--full height--2 bg-secondary margin-bottom--xl rounded-full overflow--hidden">
          <div
            className="height--full bg-primary"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="bg-card padding--xl rounded-lg border margin-bottom--xl min-height--300px flex flex--column justify--center">
          <div
            className="flex align--center justify--center padding--vert--xl"
            style={{ visibility: 'hidden' }}
          >
            <span className="text--secondary">Loading question...</span>
          </div>
          <div className="margin-vert--lg">
            <h2 className="text--primary font--bold text--lg margin-bottom--xl line-height--normal">
              {q.question}
            </h2>
            <div className="flex flex--column gap-sm">
              {q.options.map((opt, i) => {
                const isSelected = answers[currentIndex] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={clsx(
                      'width--full text--left padding--md rounded-md border transition-all',
                      isSelected
                        ? 'bg-primary border-primary text--white'
                        : 'bg-secondary border-gray-600 text--secondary hover:border-primary hover:bg-tertiary'
                    )}
                  >
                    <span className="text--primary font--monospace margin-right--sm">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify--between margin-bottom--xl">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className={clsx(
              'padding--md rounded-md border transition-all',
              currentIndex === 0
                ? 'bg-secondary border-gray-600 text--muted cursor--not-allowed'
                : 'bg-secondary border-gray-600 text--primary hover:border-primary'
            )}
          >
            ← Previous
          </button>
          <button
            onClick={nextQuestion}
            className="button primary padding--md"
          >
            {currentIndex === questions.length - 1 ? 'Submit Exam' : 'Next →'}
          </button>
        </div>

        {isTimeCritical && (
          <div className="text-center margin-bottom--md">
            <span className="text--error font--bold text--sm">⚠️ Time is running out!</span>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'results') {
    const scoreColor = percent >= 80 ? 'text--success' : percent >= 60 ? 'text--warning' : 'text--error';

    return (
      <div className="text-center margin-vert--xl">
        <div className="bg-secondary-darker padding--xl rounded-lg border display--inline-block margin-bottom--lg">
          <h2 className="text--primary font--bold margin-bottom--md">Exam Complete!</h2>
          <div className={clsx('text--6xl font--bold margin-bottom--md', scoreColor)}>
            {percent}%
          </div>
          <p className="text--secondary margin-bottom--lg">
            {correctCount} out of {questions.length} correct
          </p>
          <div className="flex justify--center gap-md">
            <button
              onClick={() => setPhase('review')}
              className="button secondary padding--md"
            >
              Review Answers
            </button>
            <button
              onClick={retakeExam}
              className="button primary padding--md"
            >
              Retake Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'review') {
    return (
      <div className="margin-vert--lg">
        <h2 className="text--primary font--bold text--xl margin-bottom--xl text--center">Answer Review</h2>
        <div className="flex flex--column gap-md">
          {questions.map((q, i) => {
            const userAnswer = answers[i] !== undefined ? answers[i] : null;
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={i} className={clsx('padding--md rounded-lg border', isCorrect ? 'border-success bg-success-dark' : 'border-error bg-error-dark')}>
                <div className="flex justify--between items--start margin-bottom--sm">
                  <span className="text--primary font--bold">{i + 1}. {q.question}</span>
                  <span className={clsx('text--xs font--monospace', isCorrect ? 'text--success' : 'text--error')}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <div className="text--secondary text--sm margin-bottom--md">
                  Your answer:{' '}
                  {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                  <br />
                  Correct answer: {q.options[q.correctIndex]}
                </div>
                <div className="bg-secondary padding--md rounded-md text--secondary text--sm">
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center margin-top--xl">
          <button onClick={() => setPhase('results')} className="button primary padding--md">
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return null;
}
