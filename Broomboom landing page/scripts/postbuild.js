const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function syncLogos(dir) {
  if (!fs.existsSync(dir)) return;

  const lower = path.join(dir, 'broomboom-logo.png');
  const upper = path.join(dir, 'Broomboom-logo.png');

  const lowerExists = fs.existsSync(lower);
  const upperExists = fs.existsSync(upper);

  if (lowerExists && !upperExists) {
    try {
      fs.copyFileSync(lower, upper);
      console.log(`[postbuild] Created alias: ${upper}`);
    } catch (err) {
      console.warn(`[postbuild] Could not duplicate logo to uppercase:`, err.message);
    }
  } else if (upperExists && !lowerExists) {
    try {
      fs.copyFileSync(upper, lower);
      console.log(`[postbuild] Created alias: ${lower}`);
    } catch (err) {
      console.warn(`[postbuild] Could not duplicate logo to lowercase:`, err.message);
    }
  }
}

// 1. Sync in out/images/ (for static export deployment)
syncLogos(path.join(__dirname, '..', 'out', 'images'));

// 2. Sync in .next/static/ if applicable
syncLogos(path.join(__dirname, '..', '.next', 'static', 'media'));

// 3. Update durgapuja-deploy.zip if python is available
try {
  const pyScript = path.join(__dirname, 'package-deploy.py');
  if (fs.existsSync(pyScript)) {
    const res = spawnSync('python', [pyScript], { encoding: 'utf-8' });
    if (res.stdout) console.log(res.stdout.trim());
  }
} catch (err) {
  // Python zip generation is optional
}

