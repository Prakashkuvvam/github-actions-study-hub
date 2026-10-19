import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/exam/',
    component: ComponentCreator('/exam/', '484'),
    exact: true
  },
  {
    path: '/quizzes/',
    component: ComponentCreator('/quizzes/', 'c02'),
    exact: true
  },
  {
    path: '/study/',
    component: ComponentCreator('/study/', '3f6'),
    routes: [
      {
        path: '/study/',
        component: ComponentCreator('/study/', 'bc0'),
        routes: [
          {
            path: '/study/',
            component: ComponentCreator('/study/', '529'),
            routes: [
              {
                path: '/study/caching-artifacts/',
                component: ComponentCreator('/study/caching-artifacts/', '910'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/custom-actions/',
                component: ComponentCreator('/study/custom-actions/', '8d7'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/debugging/',
                component: ComponentCreator('/study/debugging/', '034'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/environments/',
                component: ComponentCreator('/study/environments/', '206'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/foundations/',
                component: ComponentCreator('/study/foundations/', '077'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/job-control/',
                component: ComponentCreator('/study/job-control/', '3eb'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/practice-exams/',
                component: ComponentCreator('/study/practice-exams/', '6e0'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/reusable-workflows/',
                component: ComponentCreator('/study/reusable-workflows/', 'bc6'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/secrets-vars/',
                component: ComponentCreator('/study/secrets-vars/', '415'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/security-oidc/',
                component: ComponentCreator('/study/security-oidc/', 'bed'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/self-hosted-runners/',
                component: ComponentCreator('/study/self-hosted-runners/', 'a15'),
                exact: true,
                sidebar: "studySidebar"
              },
              {
                path: '/study/triggers/',
                component: ComponentCreator('/study/triggers/', '688'),
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
