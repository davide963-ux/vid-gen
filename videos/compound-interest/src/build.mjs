// Assembles index.html = base.template.txt + src/body.html + src/scenes.js + shared helpers + words.json/lines.json.
// Run from the project folder:  node src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
const read = (p) => fs.readFileSync(p, 'utf8');
const words = JSON.parse(read('words.json')).map((w) => ({ w: w.w, s: w.s, e: w.e, line: w.line }));
const total = JSON.parse(read('lines.json')).total;
const helpers = read(path.resolve('../../scripts/motion_helpers.js'));
const html = read('src/base.template.txt')
  .replaceAll('__TOTAL__', String(total))
  .replace('__WORDS__', () => JSON.stringify(words))
  .replace('/*__HELPERS__*/', () => helpers)
  .replace('/*__THEME__*/', () => (fs.existsSync('src/theme.css') ? read('src/theme.css') : ''))
  .replace('<!--__BODY__-->', () => read('src/body.html'))
  .replace('/*__SCENES__*/', () => read('src/scenes.js'));
fs.writeFileSync('index.html', html);
console.log('built index.html', total + 's,', words.length, 'caption words');
