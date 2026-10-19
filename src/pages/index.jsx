import React from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';

export default function Home() {
  return (
    <Layout
      title="GitHub Actions Study Hub"
      description="Clear the GitHub Actions certification in your first attempt"
    >
      <main className="container margin-vert--xl">
        {/* Hero Section */}
        <section className="hero text-center margin-vert--lg">
          <div className="container">
            <h1 className="hero__title">⚡ GitHub Actions Study Hub</h1>
            <p className="hero__subtitle">
              Everything you need to clear the GitHub Actions certification in your
              first attempt. Clear notes, multiple YAML examples, real-world use cases,
              hands-on exercises, and flowcharts — built to study anywhere.
            </p>
            <div className="hero__buttons">
              <a
                href="/study/foundations"
                className={clsx('button primary margin-right--sm')}
              >
                Start with Foundations →
              </a>
              <a href="/exam" className="button secondary">
                Practice Exam →
              </a>
            </div>
          </div>
        </section>

        {/* Study Modules Grid */}
        <section className="margin-vert--lg">
          <div className="container">
            <h2 className="text--center margin-bottom--lg">Study Modules</h2>
            <div className="row">
              {[
                {
                  title: 'Foundations',
                  slug: 'foundations',
                  description:
                    'Workflows, events, jobs, steps, runners, and YAML syntax.',
                  icon: '🏗️',
                },
                {
                  title: 'Triggers & Scheduling',
                  slug: 'triggers',
                  description:
                    'push, pull_request, workflow_dispatch, schedule, repository_dispatch.',
                  icon: '⚡',
                },
                {
                  title: 'Job Control',
                  slug: 'job-control',
                  description:
                    'needs, if conditionals, matrix builds, and job outputs.',
                  icon: '🔀',
                },
                {
                  title: 'Environments & Deployment',
                  slug: 'environments',
                  description:
                    'Protection rules, required reviewers, deployment jobs.',
                  icon: '🚀',
                },
                {
                  title: 'Secrets & Variables',
                  slug: 'secrets-vars',
                  description:
                    'Repository, organization, and environment secrets and vars.',
                  icon: '🔐',
                },
                {
                  title: 'Reusable Workflows',
                  slug: 'reusable-workflows',
                  description:
                    'workflow_call, reusable workflows, composite actions.',
                  icon: '♻️',
                },
                {
                  title: 'Custom Actions',
                  slug: 'custom-actions',
                  description:
                    'Docker, JavaScript, and composite actions.',
                  icon: '🧩',
                },
                {
                  title: 'Self-Hosted Runners',
                  slug: 'self-hosted-runners',
                  description:
                    'Setup, labels, ephemeral vs persistent runners.',
                  icon: '🖥️',
                },
                {
                  title: 'Security & OIDC',
                  slug: 'security-oidc',
                  description:
                    'permissions, OIDC federation, artifact attestation.',
                  icon: '🛡️',
                },
                {
                  title: 'Caching & Artifacts',
                  slug: 'caching-artifacts',
                  description:
                    'actions/cache, upload-artifact, download-artifact.',
                  icon: '📦',
                },
                {
                  title: 'Debugging & ACT',
                  slug: 'debugging',
                  description:
                    'Debug logs, re-run failed jobs, local testing with ACT.',
                  icon: '🐛',
                },
                {
                  title: 'Practice Exams',
                  slug: 'practice-exams',
                  description:
                    'Timed quizzes with answer explanations.',
                  icon: '📝',
                },
              ].map((module) => (
                <div key={module.slug} className="col margin-bottom--lg">
                  <a
                    href={`/study/${module.slug}`}
                    className={clsx(
                      'module-card',
                      'display--block',
                      'padding--lg',
                      'border',
                      'rounded-lg',
                      'hover:border-primary',
                      'hover:bg-secondary-darker',
                      'transition-all'
                    )}
                  >
                    <div className="flex align--center gap-md margin-bottom--md">
                      <span className="text--xl">{module.icon}</span>
                      <h3 className="font--bold text--primary margin--0">
                        {module.title}
                      </h3>
                    </div>
                    <p className="text--secondary margin--0 text--sm">
                      {module.description}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="bg-secondary-darker margin-vert--lg padding--xl rounded-lg border">
          <div className="container">
            <h2 className="text--center margin-bottom--md">How to use this site</h2>
            <ol className="text--secondary margin-bottom--sm">
              <li className="margin-bottom--md">
                Work through each module in order — concepts build on each other.
              </li>
              <li className="margin-bottom--md">
                Copy the YAML examples into your own repository and run them.
              </li>
              <li className="margin-bottom--md">
                Complete the hands-on exercises at the end of every module.
              </li>
              <li className="margin-bottom--md">
                Take the practice quizzes to test your readiness.
              </li>
              <li className="margin-bottom--md">
                Review the flowcharts before the exam to visualize job flows.
              </li>
            </ol>
          </div>
        </section>
      </main>
    </Layout>
  );
}
