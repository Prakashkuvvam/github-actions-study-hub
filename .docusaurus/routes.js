import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/exam',
    component: ComponentCreator('/exam', '7d8'),
    exact: true
  },
  {
    path: '/quizzes',
    component: ComponentCreator('/quizzes', 'c0c'),
    exact: true
  },
  {
    path: '/study',
    component: ComponentCreator('/study', '01f'),
    routes: [
      {
        path: '/study',
        component: ComponentCreator('/study', '823'),
        routes: [
          {
            path: '/study',
            component: ComponentCreator('/study', 'cd6'),
            routes: [
              {
                path: '/study/caching-artifacts',
                component: ComponentCreator('/study/caching-artifacts', '76c'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/custom-actions',
                component: ComponentCreator('/study/custom-actions', '701'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/debugging',
                component: ComponentCreator('/study/debugging', '284'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/environments',
                component: ComponentCreator('/study/environments', 'f15'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/foundations',
                component: ComponentCreator('/study/foundations', 'fa6'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/job-control',
                component: ComponentCreator('/study/job-control', '6d5'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/practice-exams',
                component: ComponentCreator('/study/practice-exams', 'c4a'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/reusable-workflows',
                component: ComponentCreator('/study/reusable-workflows', 'a95'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/secrets-vars',
                component: ComponentCreator('/study/secrets-vars', '792'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/security-oidc',
                component: ComponentCreator('/study/security-oidc', 'ae0'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/self-hosted-runners',
                component: ComponentCreator('/study/self-hosted-runners', '2d9'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/triggers',
                component: ComponentCreator('/study/triggers', 'fa1'),
                exact: true,
                sidebar: "studySidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '070'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
