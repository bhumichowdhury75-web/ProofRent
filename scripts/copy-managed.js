import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('.');
const managedSource = path.join(projectRoot, 'contracts', 'managed', 'proofrent');
const frontendManagedSrc = path.join(projectRoot, 'frontend', 'src', 'managed', 'contract');
const frontendPublicManaged = path.join(projectRoot, 'frontend', 'public', 'managed');

console.log('[ProofRent] Copying managed artifacts to frontend...');

try {
  // Ensure target directories exist
  fs.mkdirSync(frontendManagedSrc, { recursive: true });
  fs.mkdirSync(frontendPublicManaged, { recursive: true });

  // Copy 1: TypeScript contract types to frontend/src/managed/contract
  const contractSrcDir = path.join(managedSource, 'contract');
  if (fs.existsSync(contractSrcDir)) {
    fs.cpSync(contractSrcDir, frontendManagedSrc, { recursive: true });
    console.log('✓ Copied TypeScript contract bindings to frontend/src/managed/contract');
  }

  // Copy 2: Full managed tree (ZK keys, zkir, etc.) to frontend/public/managed
  if (fs.existsSync(managedSource)) {
    fs.cpSync(managedSource, frontendPublicManaged, { recursive: true });
    console.log('✓ Copied ZK proving keys and artifacts to frontend/public/managed');
  }
} catch (error) {
  console.error('[ProofRent] Failed to copy managed artifacts:', error);
  process.exit(1);
}
