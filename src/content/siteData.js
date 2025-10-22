export const siteData = {
  header: {
    brandText: 'DELEON',
    logoSrc: '/BrandAssets/Deleon_Logo_light.svg',
    nav: [
      { label: 'Home', href: '/' },
      { label: 'Who We Are', href: '/about-us.html' },
      { label: "Why We're Different", href: '/science.html' },
      { label: 'Contact/Updates', href: '/#updates' },
    ],
  },
  sections: [
    { type: 'hero' },
    {
      type: 'platforms',
      headline: 'Turn human biochemistry into real‑time decisions—for performance, wellness, and operations.',
      emphasis: 'real‑time decisions',
      items: [
        {
          name: 'Analysis',
          tag: 'Portable Device',
          title: 'Measure key metabolites in minutes',
          description: 'Portable, on‑site biochemical testing with results in minutes.',
          long: 'Deleon’s compact analyzer captures metabolomic signals from a drop of urine and returns actionable markers in minutes—no lab queue, no shipping. Built for clinics, teams, and field operations.',
          effect: 'grid',
        },
        {
          name: 'Insights',
          tag: 'AI Models',
          title: 'Translate biomarkers into individualized action',
          description: 'Personalized guidance on readiness, recovery, and nutrition.',
          long: 'Our models transform raw analytes into human‑readable recommendations—sleep, nutrition, training—tuned to each person’s profile and current state.',
          effect: 'orbits',
        },
        {
          name: 'Command',
          tag: 'Workflow',
          title: 'View your metrics at a glance',
          description: 'A unified dashboard across performance and wellness.',
          long: 'Track trends, flag risks, and coordinate interventions—bringing biochemistry into the daily rhythm of planning and care.',
          effect: 'radar',
        },
      ],
    },
  ],
  footer: {
    // White logo (named "*_light") is for DARK theme by design.
    logoSrc: '/BrandAssets/Deleon_Logo_light.svg',
    copyright: '© 2025 Deleon Technologies Inc. All rights reserved.',
    ctas: [
      { label: 'Request a Demo', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com?subject=Request%20a%20Deleon%20Demo', theme: 'light' },
      { label: 'Join the Pilot', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com?subject=Join%20the%20Pilot', theme: 'dark' },
    ],
    columns: [
      {
        title: 'Solutions',
        links: [
          { label: 'For Athletes', href: '/for-athletes.html' },
          { label: 'For Military', href: '/tactical.html' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'News', href: '/news.html' },
          { label: 'Science', href: '/science.html' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Who We Are', href: '/about-us.html' },
          { label: 'Contact', href: 'mailto:chad@deleon-omics.com,jose@deleon-omics.com' },
        ],
      },
    ],
    regions: ['Engineered in Atlanta, GA 🇺🇸'],
    social: [
      { label: 'LinkedIn', href: '#' },
      { label: 'X', href: '#' },
    ],
  },
};
