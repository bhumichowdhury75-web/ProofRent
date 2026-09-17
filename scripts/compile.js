import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('.');
const contractSource = path.join('contracts', 'proofrent.compact');
const targetDir = path.join('contracts', 'managed', 'proofrent');

console.log(`[ProofRent] Compiling ${contractSource} -> ${targetDir}...`);

// Determine execution environment
const isWin = process.platform === 'win32';

let compiled = false;

// 1. Try native compact first (e.g. Linux / CI or Windows with compact in PATH)
try {
  execSync(`compact compile "${contractSource}" "${targetDir}"`, { stdio: 'inherit' });
  compiled = true;
} catch (err) {
  // If not found and on Windows, try WSL
  if (isWin) {
    try {
      console.log('[ProofRent] Native compact failed, attempting compilation via WSL...');
      const wslSource = `/mnt/${projectRoot.replace(/\\/g, '/').replace(':', '')}/${contractSource.replace(/\\/g, '/')}`;
      const wslTarget = `/mnt/${projectRoot.replace(/\\/g, '/').replace(':', '')}/${targetDir.replace(/\\/g, '/')}`;
      execSync(`wsl -e /home/aman/.local/bin/compact compile "${wslSource}" "${wslTarget}"`, { stdio: 'inherit' });
      compiled = true;
    } catch (wslErr) {
      console.error('[ProofRent] WSL compilation error:', wslErr.message);
    }
  }
}

if (!compiled) {
  console.error('[ProofRent] Error: Failed to compile compact contract.');
  process.exit(1);
} else {
  console.log('[ProofRent] Contract compiled successfully.');
}
