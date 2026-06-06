#!/usr/bin/env node
/**
 * Resolve the latest macOS release from the tharikey-macos repo into src/data/release.json,
 * which DownloadButton.astro and download.astro read at build time.
 *
 * The website hosts no binaries and no appcast — the appcast lives in the osx repo's Pages and
 * the artifact is a GitHub release asset. We only link it. Until a signed/notarized release
 * exists, this finds nothing and leaves the "coming soon" null state in place.
 *
 * Env: GITHUB_TOKEN (optional), THARIKEY_ORG (default 'tharikey').
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ORG = process.env.THARIKEY_ORG ?? 'tharikey';
const REPO = 'tharikey-macos';
const out = join(new URL('..', import.meta.url).pathname, 'src', 'data', 'release.json');

const NONE = {
  version: null, assetUrl: null, size: null, notes: null,
  _comment: 'No release found. Download shows "coming soon".',
};

function fmtSize(bytes) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

async function main() {
  const headers = { accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  let release = NONE;
  try {
    const res = await fetch(`https://api.github.com/repos/${ORG}/${REPO}/releases/latest`, { headers });
    if (res.ok) {
      const r = await res.json();
      // Prefer a .dmg, else .zip asset.
      const asset = (r.assets ?? []).find((a) => a.name.endsWith('.dmg'))
        ?? (r.assets ?? []).find((a) => a.name.endsWith('.zip'));
      if (asset) {
        release = {
          version: r.tag_name ?? r.name ?? null,
          assetUrl: asset.browser_download_url,
          size: fmtSize(asset.size),
          notes: r.body ?? null,
        };
      } else {
        console.warn('! latest release has no .dmg/.zip asset');
      }
    } else if (res.status === 404) {
      console.log('· no releases yet — leaving "coming soon" state');
    } else {
      console.warn(`! releases API ${res.status}`);
    }
  } catch (e) {
    console.warn(`! ${e.message} — leaving "coming soon" state`);
  }

  await writeFile(out, JSON.stringify(release, null, 2) + '\n');
  console.log(`wrote ${out}: ${release.version ?? 'none'}`);
}

main();
