import os
from PIL import Image

def generate_favicons():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logo_path = os.path.join(base_dir, 'public', 'images', 'broomboom-logo.png')
    public_dir = os.path.join(base_dir, 'public')
    app_dir = os.path.join(base_dir, 'app')

    if not os.path.exists(logo_path):
        print(f"Error: logo not found at {logo_path}")
        return

    print(f"Opening source logo: {logo_path}")
    img = Image.open(logo_path).convert('RGBA')

    # 1. Multi-resolution favicon.ico (16, 32, 48)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_frames = [img.resize(size, Image.Resampling.LANCZOS) for size in ico_sizes]
    
    public_ico = os.path.join(public_dir, 'favicon.ico')
    ico_frames[0].save(
        public_ico,
        format='ICO',
        sizes=ico_sizes,
        append_images=ico_frames[1:]
    )
    print(f"Generated {public_ico}")

    # Also save in app/ for Next.js App Router convention
    app_ico = os.path.join(app_dir, 'favicon.ico')
    ico_frames[0].save(
        app_ico,
        format='ICO',
        sizes=ico_sizes,
        append_images=ico_frames[1:]
    )
    print(f"Generated {app_ico}")

    # 2. Google Search recommended sizes & Apple/PWA icons
    png_specs = [
        ('favicon-48x48.png', (48, 48)),    # Google Search recommended primary
        ('favicon-96x96.png', (96, 96)),    # Google Search 2x multiple
        ('apple-touch-icon.png', (180, 180)), # iOS Touch Icon
        ('icon-192x192.png', (192, 192)),   # Google Search 4x multiple & PWA
        ('icon-512x512.png', (512, 512)),   # High-res PWA & Google Play / Web
    ]

    for filename, size in png_specs:
        resized = img.resize(size, Image.Resampling.LANCZOS)
        target = os.path.join(public_dir, filename)
        resized.save(target, format='PNG', optimize=True)
        print(f"Generated {target} ({size[0]}x{size[1]})")

    print("All favicons generated successfully!")

if __name__ == '__main__':
    generate_favicons()

