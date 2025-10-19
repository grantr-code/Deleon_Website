export const siteData = {
  header: {
    brandText: 'DELEON',
    logoSrc: '/BrandAssets/Deleon_Logo_light.svg',
    // Reduced IA: Home, Founders, Why We're Different, Contact/Updates
    nav: [
      { label: 'Home', href: '/' },
      { label: 'Founders', href: '/team.html' },
      { label: "Why We’re Different", href: '/science.html' },
      { label: 'Contact/Updates', href: '/#updates' },
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
        title: 'Solutions',
        links: [
          { label: 'For Athletes', href: '/teams.html' },
          { label: 'For Military', href: '/tactical.html' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Science', href: '/science.html' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Contact', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com' },
        ],
      },
    ],
    regions: ['Engineered in Atlanta, GA'],
    social: [
      { label: 'LinkedIn', href: '#' },
      { label: 'X', href: '#' },
    ],
  },
};
