/**
 * Fails the build if anything that must never be public ends up in dist/:
 * game project files, source art, secrets, source maps or internal docs.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

const FORBIDDEN_EXT = new Set([
  '.cs', '.unity', '.prefab', '.meta', '.asset', '.mat', '.anim', '.controller', '.shader',
  '.unitypackage', '.blend', '.blend1', '.fbx', '.obj', '.max', '.ma', '.mb', '.psd', '.psb',
  '.kra', '.xcf', '.ai', '.sai', '.exe', '.dll', '.pdb', '.apk', '.aab', '.zip', '.7z', '.rar',
  '.map', '.env', '.pem', '.key', '.md', '.log',
]);
const FORBIDDEN_NAME = /(^|\/)(\.env|\.git|Library|Temp|Logs|UserSettings|ProjectSettings|Packages|Assets)(\/|$)/;
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}/,
  /\bxox[abpors]-[A-Za-z0-9-]{10,}/,
];
const MAX_BYTES = 8 * 1024 * 1024;

const problems = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(DIST, full);
    const st = statSync(full);
    if (FORBIDDEN_NAME.test(rel)) problems.push(`forbidden path: ${rel}`);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    if (FORBIDDEN_EXT.has(extname(name).toLowerCase())) problems.push(`forbidden file type: ${rel}`);
    if (st.size > MAX_BYTES) problems.push(`file larger than 8 MB: ${rel}`);
    if (/\.(html|js|css|json|txt|webmanifest|svg)$/.test(name)) {
      const text = readFileSync(full, 'utf8');
      for (const p of SECRET_PATTERNS) if (p.test(text)) problems.push(`possible secret in ${rel}`);
    }
  }
};

walk(DIST);
if (problems.length) {
  console.error('\n✖ Public output check failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log('✔ Public output check passed: no game project files, source assets or secrets in dist/.');
