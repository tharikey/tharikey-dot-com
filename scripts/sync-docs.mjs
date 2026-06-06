#!/usr/bin/env node
/**
 * Aggregate each component repo's /docs into src/content/docs/{engine,macos,fonts}.
 * Source of truth = the component repos; this site only presents. Run in CI before `astro build`.
 *
 * Tracks `main` for now (versioned/release-pinned later — see workspace/docs/website.md).
 *
 * Strategy: sparse-ish clone each repo's docs via the GitHub tarball (no full history), copy the
 * markdown into the matching section. Frontmatter is assumed Starlight-compatible; the engine docs
 * still carry mkdocs-material syntax (admonitions, content tabs, mermaid) that needs converting —
 * tracked as a website-sprint task, NOT silently swallowed here.
 *
 * Env: GITHUB_TOKEN (optional, raises rate limits).
 */
import { mkdir, rm, cp, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ORG = process.env.THARIKEY_ORG ?? 'tharikey';
const BRANCH = process.env.DOCS_BRANCH ?? 'main';

// repo → section directory under src/content/docs
const SOURCES = [
  { repo: 'tharikey-engine', section: 'engine' },
  { repo: 'tharikey-macos', section: 'macos' },
  { repo: 'tharikey-fonts', section: 'fonts' },
];

const root = new URL('..', import.meta.url).pathname;
// Content nests one level deep so URLs carry the /docs prefix (Starlight 0.39 has no routeBasePath).
const docsRoot = join(root, 'src', 'content', 'docs', 'docs');

// Convert mkdocs-material syntax to Starlight equivalents (the engine docs use it):
//   !!! type "Title"  → :::aside[Title]   (note/tip/caution/danger)
//   ??? type "Title"  → <details>          (collapsible)
//   === "Tab"         → **Tab** + content  (Starlight tabs need MDX; degrade to labeled sections)
// (Mermaid is handled separately by a remark plugin at build time.)
function mkdocsToStarlight(text) {
  const ASIDE = {
    note: 'note', info: 'note', abstract: 'note', question: 'note', quote: 'note', example: 'note',
    tip: 'tip', hint: 'tip', success: 'tip',
    warning: 'caution', caution: 'caution', attention: 'caution',
    danger: 'danger', error: 'danger', bug: 'danger', failure: 'danger',
  };
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const adm = lines[i].match(/^(!!!|\?\?\?)\s+(\w+)(?:\s+"([^"]*)")?\s*$/);
    const tab = lines[i].match(/^===\s+"([^"]*)"\s*$/);
    if (!adm && !tab) {
      out.push(lines[i]);
      continue;
    }
    // gather the indented block that follows, dedented one level
    const block = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      if (lines[j].trim() === '') { block.push(''); continue; }
      if (/^( {4}|\t)/.test(lines[j])) { block.push(lines[j].replace(/^( {4}|\t)/, '')); continue; }
      break;
    }
    while (block.length && block[block.length - 1] === '') block.pop();
    if (tab) {
      out.push(`**${tab[1]}**`, '', ...block, '');
    } else if (adm[1] === '???') {
      out.push('<details>', `<summary>${adm[3] || adm[2]}</summary>`, '', ...block, '', '</details>', '');
    } else {
      const kind = ASIDE[adm[2].toLowerCase()] || 'note';
      out.push(adm[3] ? `:::${kind}[${adm[3]}]` : `:::${kind}`, ...block, ':::', '');
    }
    i = j - 1;
  }
  return out.join('\n');
}

// Synced docs are plain markdown (mkdocs-style — title from the h1). Starlight requires a `title` in
// frontmatter, so derive it from the first heading (and drop that heading so it isn't duplicated).
async function addFrontmatter(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      await addFrontmatter(p);
      continue;
    }
    if (!e.name.endsWith('.md')) continue;
    let text = await readFile(p, 'utf8');
    if (text.startsWith('---')) continue; // already has frontmatter
    text = mkdocsToStarlight(text);
    const m = text.match(/^\s*#\s+(.+?)\s*$/m);
    const title = (m ? m[1] : e.name.replace(/\.md$/, '')).replace(/`/g, '').replace(/"/g, '\\"');
    if (m) text = (text.slice(0, m.index) + text.slice(m.index + m[0].length)).replace(/^\s+/, '');
    await writeFile(p, `---\ntitle: "${title}"\n---\n\n${text}`);
  }
}

async function syncOne({ repo, section }) {
  const work = join(tmpdir(), `tharikey-docs-${repo}`);
  await rm(work, { recursive: true, force: true });
  // Shallow clone, just the docs tree.
  execFileSync('git', ['clone', '--depth', '1', '--branch', BRANCH,
    `https://github.com/${ORG}/${repo}.git`, work], { stdio: 'inherit' });

  const srcDocs = join(work, 'docs');
  if (!existsSync(srcDocs)) {
    console.warn(`! ${repo}: no docs/ — skipping`);
    return;
  }
  const dest = join(docsRoot, section);
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  await cp(srcDocs, dest, { recursive: true });
  await addFrontmatter(dest);
  const files = (await readdir(dest)).length;
  console.log(`✓ ${repo} → docs/${section} (${files} entries)`);
}

for (const s of SOURCES) {
  try {
    await syncOne(s);
  } catch (e) {
    // A repo that isn't public yet (e.g. macos) just keeps its placeholder — don't fail the build.
    console.warn(`! skipped ${s.repo} (${e.message.split('\n')[0]}) — keeping placeholder`);
  }
}
