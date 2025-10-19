export const siteData = {
  header: {
    brandText: 'D E L E O N',
    logoSrc: '/BrandAssets/Deleon_Logo_light.svg',
    nav: [
      { label: 'Home', href: '/' },
      { label: 'Our Team', href: '/team.html' },
      { label: 'For Teams', href: '/teams.html' },
      { label: 'Defense', href: '/tactical.html' },
      { label: 'Science', href: '/science.html' },
      { label: 'Request Demo', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com?subject=Request%20a%20Deleon%20Demo' },
      { label: 'Contact', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com' },
      { label: 'Sign in', href: 'https://deleon-full-stack.vercel.app/' },
    ],
  },
  sections: [
    { type: 'hero' },
    {
      type: 'platforms',
      headline: 'Turn human biochemistry tested daily into real‑time decisions—for performance, health, and operations.',
      emphasis: 'tested daily',
      items: [
        {
          name: 'Analysis',
          chip: 'Edge Testing',
          tag: 'Portable Device',
          title: 'Measure thousands of metabolites in minutes',
          description: 'Portable, on‑site biochemical testing with results in minutes.',
          long: 'Deleon’s compact analyzer captures metabolomic signals from a drop of urine and returns actionable markers in minutes—no lab queue, no shipping. Built for clinics, teams, and field operations.',
          effect: 'grid',
        },
        {
          name: 'Insights',
          chip: 'AI Recommendations',
          tag: 'AI Models',
          title: 'Translate biomarkers into individualized action',
          description: 'Personalized guidance on readiness, recovery, and nutrition.',
          long: 'Our models transform raw analytes into human‑readable recommendations—sleep, nutrition, training—tuned to each person’s profile and current state.',
          effect: 'orbits',
        },
        {
          name: 'Command',
          chip: 'Operations Dashboard',
          tag: 'Workflow',
          title: 'Operate with a common operating picture',
          description: 'A unified dashboard across performance, health, and operations.',
          long: 'Track trends, flag risks, and coordinate interventions—bringing biochemistry into the daily rhythm of planning and care.',
          effect: 'radar',
        },
      ],
    },
  ],
  footer: {
    logoSrc: '/BrandAssets/Deleon_Logo_light.svg',
    copyright: '© 2025 Deleon Technologies Inc. All rights reserved.',
    // Top call-to-action tiles modeled after Palantir
    ctas: [
      { label: 'Request a Demo', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com?subject=Request%20a%20Deleon%20Demo', theme: 'light' },
      { label: 'Join the Pilot', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com?subject=Join%20the%20Pilot', theme: 'dark' },
    ],
    // Footer right-side link columns
    columns: [
      {
        title: 'Offerings',
        links: [
          { label: 'Analysis', href: '#' },
          { label: 'Insights', href: '#' },
          { label: 'Command', href: '#' },
          { label: 'Data & Security', href: '#' },
          { label: 'API Docs', href: '#' },
        ],
      },
      {
        title: 'Solutions',
        links: [
          { label: 'Pro Teams', href: '/teams.html' },
          { label: 'Olympic Teams', href: '/teams.html' },
          { label: 'Collegiate', href: '/teams.html' },
          { label: 'Tactical & Military', href: '/tactical.html' },
          { label: 'Sports Labs', href: '#' },
          { label: 'Clinics', href: '#' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Case Studies', href: '#' },
          { label: 'Science', href: '/science.html' },
          { label: 'Blog', href: '#' },
          { label: 'Support', href: '#' },
          { label: 'Press Kit', href: '#' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '#' },
          { label: 'Careers', href: '#' },
          { label: 'Privacy Policy', href: '#' },
          { label: 'Terms of Use', href: '#' },
          { label: 'Contact', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com' },
        ],
      },
    ],
    regions: ['Engineered in Atlanta, GA'],
    social: [
      { label: 'LinkedIn', href: '#' },
      { label: 'X', href: '#' },
      { label: 'YouTube', href: '#' },
    ],
  },
};
