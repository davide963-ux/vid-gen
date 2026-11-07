"""Cut a character out of every frame of a video: rembg (u2net) + colour gate + largest-blob cleanup.

Usage: py -3.12 cutout_video.py <frames_dir_in> <frames_dir_out> [--test f1.png f2.png ...]
Frames in/out are PNG sequences (extract with ffmpeg first). Output is RGBA PNG per frame.
Tuned for the green frog mascot: keeps lime green, red and yellow pixels inside rembg's mask, fills holes (eyes), and
drops anything not connected to the main body (crowd members, bush).
"""
import sys, glob, os, time
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from rembg import new_session, remove

sess = new_session("u2net")

def frog_cut(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    a = np.asarray(remove(rgb, session=sess, only_mask=True), dtype=np.float32) / 255.0
    m = a > 0.45
    hsv = np.asarray(rgb.convert("HSV"), dtype=np.float32) / 255.0
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    green = (h > 0.16) & (h < 0.42) & (s > 0.25) & (v > 0.25)
    red = ((h < 0.03) | (h > 0.95)) & (s > 0.55) & (v > 0.25)
    yellow = (h > 0.10) & (h < 0.17) & (s > 0.40) & (v > 0.45)
    g = m & (green | red | yellow)
    g = ndi.binary_closing(g, iterations=4)
    g = ndi.binary_fill_holes(g)                      # eyes, pupils, teeth
    lab, n = ndi.label(g)
    if n:
        sizes = ndi.sum(g, lab, range(1, n + 1))
        keep = np.zeros_like(g)
        big = sizes.max()
        for i, sz in enumerate(sizes, start=1):
            if sz > 0.04 * big:                       # body + limbs; drops specks and strays
                keep |= lab == i
        g = keep
    g = ndi.binary_opening(g, iterations=1)
    soft = ndi.gaussian_filter(ndi.binary_dilation(g, iterations=1).astype(np.float32), 1.0)
    alpha = np.clip(soft, 0, 1)
    out = np.dstack([np.asarray(rgb), (alpha * 255).astype(np.uint8)])
    return Image.fromarray(out, "RGBA")

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    if "--test" in sys.argv:
        files = [f for f in sys.argv[sys.argv.index("--test") + 1:]]
        for f in files:
            cut = frog_cut(Image.open(f))
            bg = Image.new("RGBA", cut.size, (255, 0, 255, 255)); bg.alpha_composite(cut)
            bg.convert("RGB").resize((360, 640)).save(os.path.join(dst, os.path.basename(f).replace(".png", "_mag.png")))
        sys.exit()
    frames = sorted(glob.glob(os.path.join(src, "*.png")))
    t0 = time.time()
    for i, f in enumerate(frames):
        out = os.path.join(dst, os.path.basename(f))
        if os.path.exists(out): continue                  # resumable
        frog_cut(Image.open(f)).save(out)
        if i % 20 == 0: print(f"{i}/{len(frames)} {time.time()-t0:.0f}s", flush=True)
    print("done", len(frames), "frames", f"{time.time()-t0:.0f}s")
