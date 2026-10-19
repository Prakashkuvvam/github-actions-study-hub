/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  studySidebar: [
    {
      type: 'category',
      label: 'Certification Study Path',
      collapsible: false,
      items: [
        'foundations',
        'triggers',
        'job-control',
        'environments',
        'secrets-vars',
        'reusable-workflows',
        'custom-actions',
        'self-hosted-runners',
        'security-oidc',
        'caching-artifacts',
        'debugging',
        'practice-exams',
      ],
    },
  ],
};

module.exports = sidebars;
