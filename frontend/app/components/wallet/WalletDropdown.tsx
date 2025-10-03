'use client';

import React, { useState, useEffect } from 'react';
import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import { Wallet, ChevronDown, User, LogOut, Settings, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WalletService, WalletInfo } from './WalletService';

interface WalletDropdownProps {
  className?: string;
}

export default function WalletDropdown({ className = '' }: WalletDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting: isStarknetConnecting, chainId: starknetChainId, account } = useAccount();
  const router = useRouter();
  const walletService = WalletService.getInstance();

  // Load available wallets on component mount
  useEffect(() => {
    const loadWallets = async () => {
      try {
        // Use the connectors from Starknet React to determine available wallets
        const walletOptions = [
          {
            id: 'argentX',
            name: 'Argent X',
            description: 'Secure smart wallet',
            icon: '🛡️',
            isInstalled: connectors.some(c => c.id.toLowerCase().includes('argent'))
          },
          {
            id: 'braavos',
            name: 'Braavos',
            description: 'Multi-sig wallet',
            icon: '⚔️',
            isInstalled: connectors.some(c => c.id.toLowerCase().includes('braavos'))
          }
        ];
        
        setAvailableWallets(walletOptions);
      } catch (error) {
        console.error('Error loading wallets:', error);
        // Fallback to default wallets
        setAvailableWallets([
          {
            id: 'argentX',
            name: 'Argent X',
            description: 'Secure smart wallet',
            icon: '🛡️',
            isInstalled: true
          },
          {
            id: 'braavos',
            name: 'Braavos',
            description: 'Multi-sig wallet',
            icon: '⚔️',
            isInstalled: true
          }
        ]);
      }
    };

    loadWallets();
  }, [connectors]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.wallet-dropdown-container')) {
        setIsOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleWalletSelect = async (walletId: string) => {
    setIsConnecting(true);
    setSelectedWallet(walletId);
    
    try {
      // Find the appropriate connector
      const connector = connectors.find(c => c.id.toLowerCase().includes(walletId.toLowerCase()));
      
      if (connector) {
        await connect({ connector });
        setIsOpen(false);
      } else {
        throw new Error(`Connector for ${walletId} not found`);
      }
    } catch (error) {
      console.error('Connection failed:', error);
      alert(`Failed to connect to ${walletId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect using Starknet React
      disconnect();
      setIsOpen(false);
    } catch (error) {
      console.error('Disconnect failed:', error);
      alert(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: bigint | string | null | undefined): string => {
    if (!chainId) return 'Unknown';

    const networks: Record<string, string> = {
      '0x534e5f4d41494e': 'Mainnet',
      '0x534e5f5345504f4c4941': 'Sepolia',
    };

    let chainIdHex: string;
    if (typeof chainId === 'string') {
      chainIdHex = chainId;
    } else {
      chainIdHex = '0x' + chainId.toString(16);
    }
    return networks[chainIdHex] || 'Unknown';
  };

  // Use Starknet React connection state
  const isWalletConnected = isConnected;
  const currentAddress = address;
  const currentChainId = starknetChainId;

  if (isWalletConnected && currentAddress) {
    // Connected state - show wallet info dropdown
    return (
      <div className={`wallet-dropdown-container relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
        >
          <div className="w-8 h-8 bg-primary-gradient rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-white text-sm font-medium">Starknet User</p>
            <p className="text-purple-200 text-xs font-jetbrains">
              {formatAddress(currentAddress)}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Connected Wallet Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card-dark rounded-lg shadow-xl z-50 fade-in border border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <p className="text-white font-medium text-sm">Connected</p>
              <p className="text-gray-400 text-xs font-jetbrains break-all">
                {currentAddress}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="wallet-connected px-2 py-0.5 rounded text-xs">
                  {getNetworkName(currentChainId)}
                </div>
              </div>
            </div>

            <div className="p-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard');
                }}
                className="w-full flex items-center gap-2 px-2 py-2 text-left text-white hover:bg-white/10 rounded transition-colors text-sm"
              >
                <Shield className="w-4 h-4" />
                My Vaults
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/settings');
                }}
                className="w-full flex items-center gap-2 px-2 py-2 text-left text-white hover:bg-white/10 rounded transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="border-t border-gray-700 my-1"></div>
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-2 px-2 py-2 text-left text-red-400 hover:bg-red-500/10 rounded transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected state - show wallet selection dropdown
  return (
    <div className={`wallet-dropdown-container relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConnecting || isStarknetConnecting}
        className={`btn-primary font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm focus-ring ${
          isConnecting || isStarknetConnecting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        <Wallet className="w-4 h-4" />
        {isConnecting || isStarknetConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Connecting...
          </>
        ) : (
          <>
            Connect Wallet
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

        {/* Wallet Selection Dropdown */}
        {isOpen && !isConnecting && !isStarknetConnecting && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-card-dark rounded-lg shadow-xl z-50 fade-in border border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-white font-medium text-sm">Connect Wallet</h3>
            </div>

            <div className="p-2 space-y-1">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.id)}
                  disabled={!wallet.isInstalled || isConnecting}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    !wallet.isInstalled 
                      ? 'bg-gray-800/30 cursor-not-allowed opacity-50'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 bg-primary-gradient rounded-md flex items-center justify-center text-lg">
                    {wallet.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-medium transition-colors ${
                      !wallet.isInstalled 
                        ? 'text-gray-500' 
                        : 'text-white group-hover:text-primary-purple'
                    }`}>
                      {wallet.name}
                      {!wallet.isInstalled && ' (Not Installed)'}
                    </p>
                    <p className="text-gray-400 text-xs">{wallet.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-gray-700">
              <p className="text-gray-400 text-xs text-center">
                By connecting, you agree to our Terms of Service
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
