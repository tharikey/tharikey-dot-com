// Canonical top-level navigation — the single source of truth for the global nav.
// Consumed by the marketing header (Nav.astro) and the Starlight header override,
// so docs and marketing always show the same links. Order matches the locked IA.
//
// The nav is flat. NavLinks still supports `children` (dropdown) and `newWindow` — kept for when
// we need them again — but we don't use them here.
export interface NavLink {
  href: string;
  label: string;
  newWindow?: boolean;
  children?: NavLink[];
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/download/', label: 'Download' },
  { href: '/guides/', label: 'Guides' },
  { href: '/developers/', label: 'Developers' },
  { href: '/news/', label: 'News' },
  { href: '/about/', label: 'About' },
];
