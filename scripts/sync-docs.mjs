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
