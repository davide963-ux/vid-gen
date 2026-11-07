p='src/index.template.txt'
s=open(p,encoding='utf-8').read()
a=s.index('      // ---- photos (image is')
b=s.index('      // ---------- captions ----------')
new=open('src/new_block.txt',encoding='utf-8').read()
s=s[:a]+new+s[b:]
s=s.replace('<html lang="sq">','<html lang="en">')
open(p,'w',encoding='utf-8').write(s)
print('patched')
