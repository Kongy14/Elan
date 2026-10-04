// Construit index.html (appli installable) à partir de src/app.html, et génère les icônes.
// Usage : node build.mjs
import fs from 'node:fs';
import zlib from 'node:zlib';

const body = fs.readFileSync('src/app.html', 'utf8');
const head = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#2346d8">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Élan">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<link rel="icon" href="icons/icon-192.png">
<style>:root{padding-top:env(safe-area-inset-top,0px)}</style>
</head>
<body>
`;
fs.writeFileSync('index.html', head + body + '\n</body>\n</html>\n');

// Icône : fond bleu, anneau de minuteur et flèche montante, dessinés pixel par pixel.
function png(size) {
  const W = size, raw = Buffer.alloc((W * 4 + 1) * W);
  const bg = [35, 70, 216], fg = [255, 255, 255], acc = [196, 236, 255];
  for (let y = 0; y < W; y++) {
    raw[y * (W * 4 + 1)] = 0;
    for (let x = 0; x < W; x++) {
      const u = (x + 0.5) / W - 0.5, v = (y + 0.5) / W - 0.5;
      const r = Math.hypot(u, v), ang = Math.atan2(v, u);
      let c = bg;
      // anneau ouvert en haut à droite (arc de progression)
      if (r > 0.27 && r < 0.335 && !(ang > -Math.PI / 2 && ang < -Math.PI / 8)) c = fg;
      // flèche montante au centre
      const inStem = Math.abs(u) < 0.045 && v > -0.08 && v < 0.16;
      const inHead = v <= -0.06 && v > -0.2 && Math.abs(u) < (v + 0.2) * 0.9;
      if (inStem || inHead) c = acc;
      const o = y * (W * 4 + 1) + 1 + x * 4;
      raw[o] = c[0]; raw[o + 1] = c[1]; raw[o + 2] = c[2]; raw[o + 3] = 255;
    }
  }
  const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b) => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(W, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
fs.mkdirSync('icons', { recursive: true });
for (const s of [180, 192, 512]) fs.writeFileSync(`icons/icon-${s}.png`, png(s));
console.log('index.html et icônes générés');
