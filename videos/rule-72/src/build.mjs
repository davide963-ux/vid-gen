import fs from 'node:fs';
const t = fs.readFileSync('src/index.template.txt', 'utf8');
const words = JSON.parse(fs.readFileSync('words.json', 'utf8')).map((w) => ({ w: w.w, s: w.s, e: w.e, line: w.line }));
const L = JSON.parse(fs.readFileSync('lines.json', 'utf8'));
const helpers = fs.readFileSync('../../scripts/motion_helpers.js', 'utf8');
fs.writeFileSync('index.html', t.replaceAll('__TOTAL__', '10').replace('__WORDS__', JSON.stringify(words)).replace('/*__HELPERS__*/', () => helpers));
console.log('built index.html 10s');
