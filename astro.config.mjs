// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// Turn ```mermaid fences into <pre class="mermaid"> (raw HTML) so they bypass the syntax highlighter
// and mermaid.js can render them client-side. Hand-rolled walk to avoid a unist-util-visit dep.
function remarkMermaid() {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const walk = (node) => {
    if (!node || !Array.isArray(node.children)) return;
    for (const child of node.children) {
      if (child.type === 'code' && child.lang === 'mermaid') {
        child.type = 'html';
        child.value = `<pre class="mermaid">${esc(child.value)}</pre>`;
        delete child.lang;
      } else {
        walk(child);
      }
    }
  };
  return (tree) => walk(tree);
}

// Lazily render any mermaid diagrams on the page (only loads mermaid.js when one is present).
const MERMAID_SCRIPT = `
  const nodes = document.querySelectorAll('pre.mermaid');
  if (nodes.length) {
    const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
    const dark = document.documentElement.dataset.theme === 'dark';
    mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default', fontFamily: 'inherit' });
    await mermaid.run({ nodes });
  }
`;

// https://astro.build/config
export default defineConfig({
  site: 'https://tharikey.com',
  // The engine ships as @tharikey/engine — wasm-pack's *bundler* target, which ESM-imports its .wasm
  // and uses top-level await to instantiate. Vite needs both plugins to consume that (the playground
  // dynamic-imports the package). vite-plugin-wasm must precede top-level-await.
  vite: { plugins: [wasm(), topLevelAwait()] },
  markdown: { remarkPlugins: [remarkMermaid] },
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
        // Render mermaid diagrams (lazy — only fetches mermaid.js on pages that have one).
        { tag: 'script', attrs: { type: 'module' }, content: MERMAID_SCRIPT },
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
