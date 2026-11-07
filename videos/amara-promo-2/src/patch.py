s=open('src/base.txt',encoding='utf-8').read()
a=s.index('    <script>\n      const WORDS')
b=s.index('</script>',a)+len('</script>\n')
new=open('src/new_script.txt',encoding='utf-8').read()
s=s[:a]+new+s[b:]
s=s.replace('<html lang="sq">','<html lang="en">')
open('src/index.template.txt','w',encoding='utf-8').write(s)
print('ok')
