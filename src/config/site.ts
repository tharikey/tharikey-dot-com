// Site-wide constants — the single source for things repeated across pages.
import releaseData from '../data/release.json';

export const site = {
  name: 'ThariKey',
  tagline: 'Bringing sanity to Thaana input.',
  domain: 'tharikey.com',
  url: 'https://tharikey.com',
  github: 'https://github.com/tharikey',
};

// Resolved at build time by scripts/fetch-release.mjs (null until a release exists).
export interface Release {
  version: string | null;
  assetUrl: string | null;
  size: string | null;
  notes: string | null;
}
export const release = releaseData as Release;

export interface Platform {
  os: string;
  status: 'available' | 'soon';
  note: string;
}
export const platforms: Platform[] = [
  { os: 'macOS', status: 'available', note: 'Apple Silicon & Intel · macOS 13+' },
  { os: 'Windows', status: 'soon', note: 'On the roadmap' },
  { os: 'Linux', status: 'soon', note: 'On the roadmap' },
];
