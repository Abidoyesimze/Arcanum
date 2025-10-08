import ComplianceModuleImport from './ComplianceModule.json';
import ProofVerifierImport from './ProofVerifier.json';
import VaultManagerImport from './VaultManager.json';
import VesuAdapterImport from './VesuAdapter.json';
import type { Abi } from 'starknet';

// Helper function to ensure we get a proper array from JSON imports
function ensureAbiArray(imported: any): any[] {
  // Handle various JSON import formats
  const data = imported?.default ?? imported;
  // Ensure it's an array
  return Array.isArray(data) ? data : [];
}

// Ensure we get the actual array from JSON imports
const ComplianceModule = ensureAbiArray(ComplianceModuleImport);
const ProofVerifier = ensureAbiArray(ProofVerifierImport);
const VaultManager = ensureAbiArray(VaultManagerImport);
const VesuAdapter = ensureAbiArray(VesuAdapterImport);

export const ComplianceModuleContract = {
    abi: ComplianceModule as Abi,
    address: "0x04e11b2d2527f0fdd122d4e65a06a3eef07f522bfff27c4e646631c46b72a7c6"
}

export const ProofVerifierContract = {
    abi: ProofVerifier as Abi,
    address: "0x079fb38dc187909d0c007171bde05eef19596a8ab74928e8cfcd9aaa25a649e9"
}

export const VaultManagerContract = {
    abi: VaultManager as Abi,
    address: "0x05ec8dd7f2fc86736db19922d510ed984efbf8adaddc731c0e6d7ea6311e6ee3"
}

export const VesuAdapterContract = {
    abi: VesuAdapter as Abi,
    address: "0x042231282ee5e009a0260342bd6ddaa36ec91e644520488890e69813191b638"
}