import fs from 'node:fs';
const t=fs.readFileSync('src/index.template.txt','utf8');
const words=JSON.parse(fs.readFileSync('words.json','utf8')).map(w=>({w:w.w,s:w.s,e:w.e,line:w.line}));
const L=JSON.parse(fs.readFileSync('lines.json','utf8'));
const lines=L.lines.map(l=>({i:l.i,start:l.start,end:l.end}));
fs.writeFileSync('index.html',t.replaceAll('__TOTAL__',String(L.total)).replace('__WORDS__',JSON.stringify(words)).replace('__LINES__',JSON.stringify(lines)));
console.log('built index.html',L.total+'s');
