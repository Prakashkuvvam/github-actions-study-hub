import React from 'react';
import Layout from '@theme/Layout';

export default function Quizzes() {
  return (
    <Layout title="Practice Quizzes" description="Quiz content for GitHub Actions certification">
      <main className="container margin-vert--xl max-width--xl">
        <section className="margin-bottom--lg">
          <h1 className="text--primary font--bold text--xl margin-bottom--md">
            📝 Practice Quizzes
          </h1>
          <p className="text--secondary margin-bottom--lg">
            Quiz content will be added module-by-module. Each quiz includes answer
            explanations tied to the certification syllabus.
          </p>
          <div className="bg-secondary-darker padding--lg rounded-lg border">
            <h2 className="text--primary font--bold margin-bottom--md">Coming Soon</h2>
            <ul className="text--secondary">
              <li className="margin-bottom--sm">✅ Foundations Quiz</li>
              <li className="margin-bottom--sm">⏳ Triggers & Scheduling Quiz</li>
              <li className="margin-bottom--sm">⏳ Job Control Quiz</li>
              <li className="margin-bottom--sm">⏳ Full Practice Exam (timed)</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}
