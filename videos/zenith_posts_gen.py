import os, shutil
Z = 'zenith-ig/'
LOGO = '<svg viewBox="380 210 500 510" class="lg"><defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB6FF"/><stop offset="1" stop-color="#3D7BFF"/></linearGradient><linearGradient id="gZ" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9BB0D3"/></linearGradient><linearGradient id="gW" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B9BFF"/><stop offset="1" stop-color="#2A6BFF"/></linearGradient></defs><polygon fill="url(#gB)" points="630,226 742,350 630,280 520,350"/><polygon fill="url(#gZ)" points="462,361 815,361 484,700 398,700 652,425 418,425"/><polygon fill="url(#gW)" points="676,573 856,573 738,700 484,700"/></svg>'
CSS = """@font-face{font-family:Syne;font-weight:400 800;src:url(assets/fonts/syne.woff2)}@font-face{font-family:'Instrument Sans';font-weight:400 700;src:url(assets/fonts/instrument.woff2)}@font-face{font-family:'JetBrains Mono';font-weight:400 700;src:url(assets/fonts/jbmono.woff2)}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1350px;overflow:hidden;background:#040A18}
#root{position:relative;width:1080px;height:1350px;overflow:hidden;font-family:'Instrument Sans',sans-serif;color:#E8F0FF;background:radial-gradient(900px 700px at 80% 8%,rgba(61,123,255,.30),transparent 70%),radial-gradient(800px 600px at 0% 100%,rgba(91,60,200,.22),transparent 70%),#040A18}
#stage{position:absolute;inset:0}
.st{position:absolute;inset:0;background-image:radial-gradient(#7FB6FF 1.2px,transparent 1.6px);background-size:97px 83px;opacity:.16}
.h{font-family:Syne,sans-serif;font-weight:800;letter-spacing:-.025em;line-height:1.02}
.mono{font-family:'JetBrains Mono',monospace;font-weight:500;letter-spacing:.2em;font-size:24px;color:#7FB6FF;text-transform:uppercase}
.card{position:absolute;background:rgba(9,20,46,.78);border:1.5px solid rgba(140,175,255,.3);border-radius:14px;box-shadow:0 30px 70px rgba(0,0,0,.5),0 0 50px rgba(61,123,255,.14)}
.pill{display:inline-block;padding:10px 22px;border:1.5px solid rgba(127,182,255,.5);background:rgba(61,123,255,.16);border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:24px;color:#7FB6FF}
.lg{width:64px;height:65px}.brand{position:absolute;left:70px;top:62px;display:flex;align-items:center;gap:20px}.brand b{font-family:Syne;font-weight:800;font-size:34px;letter-spacing:.22em}
.foot{position:absolute;left:70px;right:70px;bottom:56px;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:24px;color:#9BB0D3}
.sh{position:absolute;border-radius:12px;border:2px solid #5B8FFF;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(61,123,255,.25);overflow:hidden}.sh img{display:block;width:100%}
.dot{position:absolute;border-radius:50%;background:#FFB93D;width:26px;height:26px;box-shadow:0 0 30px #FFB93D}
"""

def page(n, body, title):
    d = f'zenith-posts/p{n}'
    os.makedirs(d + '/assets/img', exist_ok=True)
    shutil.copytree(Z + 'assets/fonts', d + '/assets/fonts', dirs_exist_ok=True)
    for f in ['pipe.png', 'ui-blue.png', 'ui-xing.png']:
        shutil.copy(Z + 'assets/img/' + f, d + '/assets/img/' + f)
    for f in ['hyperframes.json', 'package.json', 'meta.json']:
        shutil.copy('thumb-cc/' + f, d + '/' + f)
    html = ('<!doctype html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1350"/>'
            '<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><title>' + title + '</title><style>' + CSS + '</style></head><body>'
            '<div id="root" data-composition-id="main" data-start="0" data-duration="1" data-width="1080" data-height="1350">'
            '<div id="stage" class="clip" data-start="0" data-duration="1" data-track-index="0"><div class="st"></div>' + body + '</div></div>'
            "<script>window.__timelines=window.__timelines||{};window.__timelines['main']=gsap.timeline({paused:true});</script></body></html>")
    open(d + '/index.html', 'w', encoding='utf-8').write(html)

brand = '<div class="brand">' + LOGO + '<b>ZENITH</b></div>'
foot = '<div class="foot"><span>zenith-software.tech</span><span>SOFTWARE STUDIO · ALBANIA</span></div>'

page(1, brand + '''<div class="mono" style="position:absolute;left:70px;top:250px">Software studio · Albania</div>
<div class="h" style="position:absolute;left:70px;top:300px;font-size:104px">We build<br><span style="color:#5B9BFF">software.</span></div>
<div style="position:absolute;left:70px;top:600px;font-size:34px;color:#9BB0D3;line-height:1.45;width:800px">Websites, web apps and custom tools.<br>You work directly with the developer.</div>
<div class="sh" style="left:420px;top:720px;width:560px"><img src="assets/img/pipe.png"></div>
<div class="sh" style="left:90px;top:790px;width:400px;transform:rotate(-5deg)"><img src="assets/img/ui-blue.png"></div>
<div class="sh" style="left:70px;top:930px;width:420px;transform:rotate(3deg)"><img src="assets/img/ui-xing.png"></div><div class="dot" style="left:380px;top:710px"></div>''' + foot, 'Cover')

def svc(l, t, title, desc, stack):
    return (f'<div class="card" style="left:70px;top:{t}px;width:940px;height:360px;padding:48px"><div class="mono" style="font-size:22px">{l}</div>'
            f'<div class="h" style="font-size:46px;margin:14px 0 18px">{title}</div><div style="font-size:31px;line-height:1.45;color:#C4D2EE">{desc}</div>'
            f'<div style="margin-top:22px"><span class="pill">{stack}</span></div></div>')
page(2, brand + '<div class="mono" style="position:absolute;left:70px;top:190px">What we build</div><div class="h" style="position:absolute;left:70px;top:235px;font-size:62px">Two services,<br>done properly.</div>'
     + svc('01', 440, 'Websites &amp; web apps', 'Company sites, online stores, dashboards and admin panels. Fast on a phone and easy to edit.', 'Next.js · React · TypeScript · Supabase')
     + svc('02', 860, 'Custom software', 'Internal tools, automation and integrations built around how your business really works.', 'Node.js · PostgreSQL · REST APIs') + '<div class="foot" style="bottom:20px;display:none"></div>', 'Services')

def why(t, h, d):
    return (f'<div class="card" style="left:70px;top:{t}px;width:940px;height:230px;padding:36px 48px"><div class="h" style="font-size:42px;color:#7FB6FF">{h}</div>'
            f'<div style="font-size:32px;line-height:1.45;color:#C4D2EE;margin-top:12px">{d}</div></div>')
page(3, brand + '<div class="mono" style="position:absolute;left:70px;top:190px">Why Zenith</div><div class="h" style="position:absolute;left:70px;top:235px;font-size:56px">Everything you need,<br>from one developer.</div>'
     + why(420, 'A direct line', 'You talk to the person writing your code. No account managers and no hand-offs.')
     + why(680, 'You own everything', 'Code, hosting and domain end up in your accounts. You are never locked in.')
     + why(940, 'Built to last', 'Four clean layers, common tools and plain code, so anyone can maintain it.'), 'Why')

page(4, brand + '<div class="mono" style="position:absolute;left:70px;top:190px">Selected work</div><div class="h" style="position:absolute;left:70px;top:235px;font-size:62px">Real projects.</div>'
     '<div class="sh" style="left:70px;top:390px;width:940px"><img src="assets/img/pipe.png"></div>'
     '<div style="position:absolute;left:70px;top:1075px"><div class="h" style="font-size:38px">Pipe &amp; Project Pros</div><div style="font-size:30px;color:#9BB0D3;margin-top:8px">Business website for a US plumbing and construction company</div></div>'
     '<div style="position:absolute;left:70px;top:1235px"><span class="pill">WordPress</span> <span class="pill">Plumbing</span> <span class="pill">Construction</span></div>' + '', 'Work')

steps = [('01', 'Brief'), ('02', 'Scope'), ('03', 'Build'), ('04', 'Ship'), ('05', 'Support')]
st = ''.join(f'<div class="card" style="left:{70 + i * 190}px;top:430px;width:170px;height:170px;padding:22px"><div class="mono" style="font-size:20px">{a}</div><div class="h" style="font-size:24px;margin-top:44px">{b}</div></div>' for i, (a, b) in enumerate(steps))
tm = ''.join(f'<div class="card" style="left:{70 + i * 320}px;top:720px;width:300px;height:230px;padding:30px"><div class="mono" style="font-size:20px">{a}</div><div class="h" style="font-size:44px;margin-top:22px">{b}</div><div style="font-size:24px;color:#9BB0D3;margin-top:8px">weeks</div></div>' for i, (a, b) in enumerate([('Website', '2–4'), ('Web app', '4–8'), ('Custom', '6–12')]))
page(5, brand + '<div class="mono" style="position:absolute;left:70px;top:190px">How we work</div><div class="h" style="position:absolute;left:70px;top:235px;font-size:44px">Five steps. A fixed quote.</div>' + st + tm
     + '<div style="position:absolute;left:70px;top:985px;font-size:26px;color:#9BB0D3">Typical timelines. Your quote confirms scope, price and date.</div>'
     '<div class="card" style="left:70px;top:1070px;width:940px;height:120px;background:#3D7BFF;border-color:#7FB6FF"><div class="h" style="font-size:38px;text-align:center;line-height:120px">Start with a free call</div></div>'
     '<div class="foot" style="bottom:40px"><span>zenith-software.tech</span><span>contact@zenith-software.tech</span></div>', 'Process')
print('ok')
