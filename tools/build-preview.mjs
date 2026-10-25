/**
 * Builds a self-contained preview of the site (one HTML file per page, with scripts,
 * styles, fonts and images inlined) for sharing as a private Claude artifact.
 * Output: .preview/out/index.html plus <legal-page>/index.html. Not used for deployment.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import esbuild from 'esbuild';

const R = fileURLToPath(new URL('..', import.meta.url));
const TMP = R + '.preview/';
const OUT = TMP + 'out';
rmSync(TMP, { recursive: true, force: true });

// 1. Normal site build with relative asset paths.
process.env.BASE_PATH = './';
const { build } = await import('vite');
await build({ root: R, logLevel: 'warn', build: { outDir: TMP + 'rel', emptyOutDir: true } });

// 2. One bundle of the site code; Latin font subsets only; assets as data URIs.
const latinOnly = {
  name: 'latin-fonts',
  setup(b) {
    b.onLoad({ filter: /@fontsource-variable[\\/].*wght\.css$/ }, (a) => {
      const css = readFileSync(a.path, 'utf8');
      const blocks = css.split(/(?=\/\*)/).filter((x) => /-latin(-ext)?-wght/.test(x));
      return { contents: blocks.join('\n'), loader: 'css', resolveDir: a.path.replace(/[\\/][^\\/]+$/, '') };
    });
  },
};
await esbuild.build({
  entryPoints: [R + 'src/js/main.js'],
  bundle: true,
  format: 'iife',
  minify: true,
  target: 'es2020',
  outdir: TMP + 'bundle',
  loader: { '.woff2': 'dataurl', '.png': 'dataurl' },
  plugins: [latinOnly],
  logLevel: 'warning',
});
const js = readFileSync(TMP + 'bundle/main.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const css = readFileSync(TMP + 'bundle/main.css', 'utf8');

// 3. Inline everything into each page.
const pages = [
  { src: 'index.html', depth: 0, main: true },
  ...['privacy', 'terms', 'intellectual-property', 'cookies'].map((p) => ({ src: `${p}/index.html`, depth: 1 })),
];
for (const p of pages) {
  let html = readFileSync(TMP + 'rel/' + p.src, 'utf8')
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\n?/, '')
    .replace(/<script type="module"[^>]*><\/script>\n?/g, '')
    .replace(/<link rel="(modulepreload|stylesheet)"[^>]*>\n?/g, '')
    .replace(/<link rel="(icon|apple-touch-icon|manifest|canonical)"[^>]*>\n?/g, '')
    .replace(/<title>[^<]*<\/title>/, '<title>SoggyByte Games Website</title>')
    // Function replacements: the code contains "$&" etc., which a string replacement would expand.
    .replace('</head>', () => `<style>${css}</style>\n</head>`)
    .replace('</body>', () => `<script>${js}</script>\n</body>`);
  const up = p.depth ? '../' : '';
  html = html
    .replace(/href="(?:\.\.?\/)+(privacy|terms|intellectual-property|cookies)\/"/g, (_, s) => `href="${up}${s}/index.html"`)
    .replace(/href="\.\/(#[^"]*)?"/g, (_, h = '') => `href="${up}${h}"`)
    .replace(/src="(?:\.\.?\/)+(media\/[^"]+)"/g, (_, rel) => {
      const ext = rel.split('.').pop().toLowerCase();
      const mime = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', avif: 'image/avif' }[ext];
      return mime ? `src="data:${mime};base64,${readFileSync(R + 'public/' + rel).toString('base64')}"` : `src="${rel}"`;
    });
  if (p.main) {
    // The artifact host supplies the document skeleton for the main page.
    const head = html.match(/<head>([\s\S]*)<\/head>/)[1];
    const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
    html = head.trim() + '\n' + body.trim() + '\n';
  }
  for (const [, code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(code);
  if (!html.includes(js)) throw new Error('inlined bundle differs from the built bundle');
  const dest = `${OUT}/${p.src}`;
  mkdirSync(dest.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(dest, html);
  console.log(p.src, `${(html.length / 1024).toFixed(0)} KB`);
}
console.log(`Preview ready in .preview/out (publish index.html with the four legal pages as files).`);
