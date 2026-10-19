// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GitHub Actions Study Hub',
  tagline: 'Clear the GitHub Actions certification in your first attempt',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://github-actions-study-hub.pages.dev/',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',
  trailingSlash: true,

  // GitHub pages deployment config.
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-CN".
  onBrokenAnchors: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/your-username/github-actions-study-hub/edit/main/',
          routeBasePath: '/study',
        },
        pages: {
          path: 'src/pages',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'GA Study Hub',
        logo: {
          alt: 'GitHub Actions Study Hub Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'studySidebar',
            position: 'left',
            label: 'Study Modules',
          },
          {
            href: '/exam',
            label: 'Practice Exam',
            position: 'right',
            className: 'header-exam-link',
          },
          {
            href: '/quizzes',
            label: 'Quizzes',
            position: 'right',
          },
          {
            href: 'https://github.com/your-username/github-actions-study-hub',
            label: 'GitHub',
            position: 'right',
            className: 'header-github-link',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Study Modules',
            items: [
              {
                label: 'Foundations',
                to: '/study/foundations',
              },
              {
                label: 'Triggers & Scheduling',
                to: '/study/triggers',
              },
              {
                label: 'Job Control',
                to: '/study/job-control',
              },
              {
                label: 'Environments & Deployment',
                to: '/study/environments',
              },
              {
                label: 'Secrets & Variables',
                to: '/study/secrets-vars',
              },
              {
                label: 'Reusable Workflows',
                to: '/study/reusable-workflows',
              },
              {
                label: 'Custom Actions',
                to: '/study/custom-actions',
              },
              {
                label: 'Self-Hosted Runners',
                to: '/study/self-hosted-runners',
              },
              {
                label: 'Security & OIDC',
                to: '/study/security-oidc',
              },
              {
                label: 'Caching & Artifacts',
                to: '/study/caching-artifacts',
              },
              {
                label: 'Debugging & ACT',
                to: '/study/debugging',
              },
              {
                label: 'Practice Exams',
                to: '/study/practice-exams',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Actions Docs',
                href: 'https://docs.github.com/en/actions',
              },
              {
                label: 'GitHub Certification',
                href: 'https://github.com/certification',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} GitHub Actions Study Hub. Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: ['bash', 'yaml', 'json', 'docker'],
      },
    }),
};

module.exports = config;
