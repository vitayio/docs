// Swaps screenshot placeholders for captured images, and checks that articles
// and the manifest agree.
//
//   node apply.mjs           replace ![SCREENSHOT(id): alt](/images/placeholder.png)
//                            with ![alt](/images/screens/id.png) where the file exists
//   node apply.mjs --check   report problems only; exits 1 if there are any
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SCREENS = join(ROOT, 'images', 'screens');
const SKIP = new Set(['node_modules', 'screenshots', '.worktrees', '.git']);
const PLACEHOLDER = /!\[SCREENSHOT\(([a-z0-9-]+)\):\s*([^\]]*)\]\(\/images\/placeholder\.png\)/g;
const CAPTURED = /!\[[^\]]*\]\(\/images\/screens\/([a-z0-9-]+)\.png\)/g;
const check = process.argv.includes('--check');

function mdxFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return mdxFiles(path);
    return name.endsWith('.mdx') ? [path] : [];
  });
}

const manifest = readdirSync(join(import.meta.dirname, 'manifest'))
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => JSON.parse(readFileSync(join(import.meta.dirname, 'manifest', f), 'utf8')));
const manifestIds = new Map();
const problems = [];
for (const e of manifest) {
  if (manifestIds.has(e.id)) problems.push(`duplicate manifest id ${e.id}`);
  manifestIds.set(e.id, e);
}

const used = new Set();
let applied = 0;
let pending = 0;
for (const file of mdxFiles(ROOT)) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(CAPTURED)) used.add(m[1]);
  const next = text.replace(PLACEHOLDER, (whole, id, alt) => {
    used.add(id);
    if (!manifestIds.has(id)) problems.push(`${rel}: placeholder ${id} has no manifest entry`);
    if (!existsSync(join(SCREENS, `${id}.png`))) {
      pending++;
      return whole;
    }
    applied++;
    return `![${alt.trim()}](/images/screens/${id}.png)`;
  });
  if (!check && next !== text) writeFileSync(file, next);
  if (/!\[SCREENSHOT:/.test(text)) problems.push(`${rel}: old-style SCREENSHOT marker without an id`);
}
for (const id of manifestIds.keys()) {
  if (!used.has(id)) problems.push(`manifest entry ${id} is not used by any article`);
}

console.log(`${check ? 'ready to apply' : 'applied'}: ${applied}, waiting for capture: ${pending}`);
for (const p of problems) console.log(`  ! ${p}`);
if (check && problems.length) process.exit(1);
