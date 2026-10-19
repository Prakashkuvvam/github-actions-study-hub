import React from 'react';
import Layout from '@theme/Layout';
import PracticeExam from '@site/src/components/PracticeExam';

export default function ExamPage() {
  return (
    <Layout title="Practice Exam" description="Timed practice exam for GitHub Actions certification">
      <main className="container margin-vert--xl max-width--xl">
        <section className="text-center margin-bottom--lg">
          <h1 className="text--primary font--bold text--xl">Practice Exam ⏱️</h1>
          <p className="text--secondary margin-top--sm">
            Simulate the real certification exam. Select your question count and
            timer, then work through scenario-based questions.
          </p>
        </section>
        <PracticeExam />
      </main>
    </Layout>
  );
}
