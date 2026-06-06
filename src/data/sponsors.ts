// Tiered sponsors + credits, modeled on Keyman's pattern. This is the single source — the About
// page renders the tiers, and the home "Supported by" strip flattens them. Add tiers/sponsors here.
export interface Sponsor {
  name: string;
  url?: string;
  note?: string;
  logo?: string; // path under /public; falls back to the name until branding lands
}

export interface SponsorTier {
  id: string;
  label: string;
  description?: string;
  sponsors: Sponsor[];
}

export const sponsorTiers: SponsorTier[] = [
  {
    id: 'financial',
    label: 'Financial sponsors',
    description: 'Funding the project directly.',
    sponsors: [{ name: 'Intellea', note: 'Project sponsor.' }],
  },
  {
    id: 'service',
    label: 'Service sponsors',
    description: 'Contributing services, tooling, and design in kind.',
    sponsors: [
      { name: 'Akuru Type', note: 'Type foundry — fonts and design.' },
      { name: 'thaana.com', url: 'https://thaana.com', note: 'Lets their OFL fonts be listed in the library.' },
    ],
  },
];

// Credited with thanks (not sponsors). Empty for now.
export const credits: Sponsor[] = [];

// Flattened names for compact strips (home "Supported by").
export const allSupporters: Sponsor[] = [
  ...sponsorTiers.flatMap((t) => t.sponsors),
  ...credits,
];
