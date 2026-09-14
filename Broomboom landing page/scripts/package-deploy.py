import os
import zipfile

out_dir = os.path.join(os.path.dirname(__file__), '..', 'out')
zip_path = os.path.join(os.path.dirname(__file__), '..', 'durgapuja-deploy.zip')

if not os.path.exists(out_dir):
    print("out directory not found. Please run 'npm run build' first.")
    exit(0)

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(out_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, out_dir).replace(os.sep, '/')
            norm = rel_path.lower()
            if norm == 'images/broomboom-logo.png':
                zipf.write(full_path, 'images/broomboom-logo.png')
                zipf.write(full_path, 'images/Broomboom-logo.png')
            else:
                zipf.write(full_path, rel_path)

print(f"[package-deploy] Successfully updated {zip_path}")

