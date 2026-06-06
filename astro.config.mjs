// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://tharikey.com',
  integrations: [
    // Docs are an isolated portal reached via the /developers landing — they use Starlight's own
    // header (no marketing-nav injection); we only share the theme + fonts for visual cohesion.
    // Starlight serves docs via a root [...slug] catch-all (it dropped `routeBasePath` in 0.39).
    // To keep our /docs/* IA, content lives one level deep at src/content/docs/docs/* so the slug
    // carries the /docs prefix; plain Astro pages (/, /download, /news, /about, /guides) take
    // precedence over the catch-all.
    starlight({
      title: 'ThariKey Docs',
      description: 'Technical documentation for the ThariKey engine, the macOS IME, and the font manifest.',
      // We own the 404 in the marketing chrome (src/pages/404.astro) — turn Starlight's off
      // so there's one consistent not-found page and no route conflict with the catch-all.
      disable404Route: true,
      // Shared design tokens + Starlight theme mapping (one palette, no jump).
      customCss: ['./src/styles/theme.css'],
      // Same web fonts as the marketing chrome so docs typography matches.
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Hanken+Grotesk:wght@400..700&display=swap',
          },
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/tharikey' },
      ],
      // Sidebar splits by audience/component. Content under src/content/docs/docs/{engine,macos,fonts}
      // is CI-synced from each repo's /docs (gitignored — see scripts/sync-docs.mjs).
      sidebar: [
        { label: 'Overview', link: '/docs/' },
        { label: 'Engine', items: [{ autogenerate: { directory: 'docs/engine' } }] },
        { label: 'macOS', items: [{ autogenerate: { directory: 'docs/macos' } }] },
        { label: 'Fonts', items: [{ autogenerate: { directory: 'docs/fonts' } }] },
      ],
    }),
  ],
});
