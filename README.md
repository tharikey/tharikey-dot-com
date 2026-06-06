<h1 align="center">tharikey.com</h1>

<p align="center">
  The website for <strong>ThariKey</strong> — bringing sanity to Thaana input across the board.
</p>

<p align="center">
  Built with <a href="https://astro.build">Astro</a> &amp; <a href="https://starlight.astro.build">Starlight</a>
</p>

---

The home page, downloads, guides, and developer docs for ThariKey — a Thaana input method, a curated
font library, and the engine behind them.

The site is presentation and glue: it hosts no binaries and stores no release notes of its own. Its
content is pulled together at build time from the component repositories, GitHub releases, and the
font manifest.

## Highlights

- **Live playground** — type and watch the engine transliterate, right in the browser (WebAssembly).
- **Fonts catalog** — the Thaana font library, rendered from the live manifest.
- **Guides & News** — Markdown content collections, open to contributions.
- **Docs** — Starlight, themed to match the rest of the site.

## Development

```sh
pnpm install
pnpm dev       # Start the dev server
pnpm build     # Build the production site
pnpm preview   # Preview the production build
```

Optional during development:

```sh
pnpm wasm      # Build the engine playground from a sibling tharikey-engine checkout
```

## Structure

```
src/
  pages/             Marketing pages (home, download, fonts, guides, news, about, developers)
  content/           Markdown collections: docs, guides, news
  components/         Reusable UI (playground, nav, footer, …)
  styles/theme.css   Design tokens — the single source for the palette, type, and shape
  config/            Site config + navigation
```

## Contributing

Guides and news are Markdown — to add one, drop a file in `src/content/guides/` or
`src/content/news/` and open a pull request.

## License

© ThariKey.
