'use client';

import React from 'react';
import { StarknetConfig, publicProvider, InjectedConnector, argent, braavos } from '@starknet-react/core';
import { sepolia, mainnet } from '@starknet-react/chains';

// Your WalletConnect Project ID
const PROJECT_ID = 'a69043ecf4dca5c34a5e70fdfeac4558';

// Define the chains we want to support
const chains = [sepolia, mainnet];

// Create a public provider for Starknet
const provider = publicProvider();

// Create connectors with WalletConnect support
const connectors = [
  argent({
    projectId: PROJECT_ID,
    dappName: 'Arcanum',
    description: 'Private vault and DeFi protocol',
  }),
  braavos({
    projectId: PROJECT_ID,
    dappName: 'Arcanum',
    description: 'Private vault and DeFi protocol',
  }),
  // Fallback injected connectors for backward compatibility
  new InjectedConnector({ options: { id: 'argentX', name: 'Argent X' } }),
  new InjectedConnector({ options: { id: 'braavos', name: 'Braavos' } }),
];

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
