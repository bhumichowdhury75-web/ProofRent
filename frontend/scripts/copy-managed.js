import fs from 'fs';
import path from 'path';

try {
  const src = path.resolve('src/managed');
  const dist = path.resolve('dist/managed');
  if (fs.existsSync(src)) {
    fs.cpSync(src, dist, { recursive: true });
    console.log('[ProofRent Frontend] Successfully copied src/managed to dist/managed.');
  }
} catch (error) {
  console.error('[ProofRent Frontend] Failed to copy managed artifacts:', error);
  process.exit(1);
}
