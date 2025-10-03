'use client';

import React from 'react';
import { StarknetConfig, publicProvider, InjectedConnector } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';

// Define the chains we want to support (Sepolia for testing)
const chains = [sepolia];

// Create a public provider for Starknet
const provider = publicProvider();

// Create connectors for Argent and Braavos wallets
const connectors = [
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
      autoConnect={false}
    >
      {children}
    </StarknetConfig>
  );
}
