import sys, time, glob
from PIL import Image
from rembg import new_session, remove
for model in ["u2net", "isnet-general-use"]:
    s = new_session(model)
    for p in sorted(glob.glob("work/toad/test/f_*.png")):
        t = time.time()
        im = Image.open(p).convert("RGB")
        out = remove(im, session=s)            # RGBA cutout
        bg = Image.new("RGBA", im.size, (255, 0, 255, 255))   # magenta so cut edges are obvious
        bg.alpha_composite(out)
        bg.convert("RGB").resize((360, 640)).save(p.replace("f_", f"{model}_").replace(".png", "_mag.png"))
        print(model, p, round(time.time() - t, 2), "s")
