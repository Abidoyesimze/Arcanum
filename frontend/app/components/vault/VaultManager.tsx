'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useProvider } from '@starknet-react/core';
import { 
  Shield, 
  Plus, 
  Minus, 
  Eye, 
  EyeOff, 
  Lock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { VaultService, VaultPosition, TOKEN_ADDRESSES } from '../../services/VaultService';

interface VaultManagerProps {
  className?: string;
}

export default function VaultManager({ className = '' }: VaultManagerProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [vaultPositions, setVaultPositions] = useState<VaultPosition[]>([]);
  const [vaultStats, setVaultStats] = useState({
    totalPositions: 0,
    totalValue: 0,
    privacyScore: 0,
    tokens: {} as { [token: string]: number }
  });

  // Deposit form state
  const [depositForm, setDepositForm] = useState({
    token: 'ETH',
    amount: '',
    commitment: ''
  });

  // Withdraw form state
  const [withdrawForm, setWithdrawForm] = useState({
    positionId: '',
    amount: ''
  });

  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [vaultService, setVaultService] = useState<VaultService | null>(null);

  // Initialize vault service
  useEffect(() => {
    if (provider && account) {
      const service = new VaultService(provider, account);
      setVaultService(service);
    }
  }, [provider, account]);

  // Load vault positions from contract
  useEffect(() => {
    const loadVaultData = async () => {
      if (!vaultService || !address) {
        setVaultPositions([]);
        setVaultStats({
          totalPositions: 0,
          totalValue: 0,
          privacyScore: 0,
          tokens: {}
        });
        return;
      }

      try {
        // TODO: Implement real contract calls to fetch user positions
        // For now, show empty state
        setVaultPositions([]);
        setVaultStats({
          totalPositions: 0,
          totalValue: 0,
          privacyScore: 0,
          tokens: {}
        });
      } catch (error) {
        console.error('Error loading vault data:', error);
        setVaultPositions([]);
        setVaultStats({
          totalPositions: 0,
          totalValue: 0,
          privacyScore: 0,
          tokens: {}
        });
      }
    };

    loadVaultData();
  }, [vaultService, address]);

  const handleDeposit = async () => {
    if (!vaultService || !depositForm.amount) {
      alert('Please enter an amount to deposit');
      return;
    }

    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Get the actual token contract address
      const tokenAddress = TOKEN_ADDRESSES[depositForm.token as keyof typeof TOKEN_ADDRESSES];
      if (!tokenAddress) {
        alert('Invalid token selected');
        setIsLoading(false);
        return;
      }

      // Generate commitment for privacy
      const nonce = Math.random().toString(36).substring(7);
      const commitment = vaultService.generateCommitment(depositForm.amount, nonce);

      console.log('Depositing:', {
        token: tokenAddress,
        amount: depositForm.amount,
        commitment
      });

      const result = await vaultService.depositToVault({
        token: tokenAddress,
        amount: depositForm.amount,
        commitment
      });

      if (result.success) {
        alert(`Deposit successful! Position ID: ${result.positionId}`);
        setIsDepositModalOpen(false);
        setDepositForm({ token: 'ETH', amount: '', commitment: '' });
        // In a real app, you'd refresh the positions here
      } else {
        alert(`Deposit failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert(`Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!vaultService || !withdrawForm.positionId) return;

    setIsLoading(true);
    try {
      // For now, just show success message
      // In a real implementation, you'd call a withdraw function
      alert('Withdraw functionality will be implemented with the withdrawal contract');
      setIsWithdrawModalOpen(false);
      setWithdrawForm({ positionId: '', amount: '' });
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Withdraw failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number | string) => {
    if (privacyMode) return '●●●●●●';
    return typeof amount === 'number' ? amount.toFixed(4) : amount;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Vault Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-space-grotesk">Private Vault</h2>
            <p className="text-gray-400 text-sm">Your encrypted DeFi portfolio</p>
            {account && (
              <p className="text-xs text-green-400 mt-1">
                ✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            )}
            {!account && (
              <p className="text-xs text-red-400 mt-1">
                ❌ Wallet not connected
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              privacyMode
                ? 'bg-encrypted-gradient text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            title={privacyMode ? 'Privacy Mode: ON' : 'Privacy Mode: OFF'}
          >
            {privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h4 className="text-yellow-500 font-medium mb-2">Debug Info</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <p>VaultService: {vaultService ? '✅ Initialized' : '❌ Not initialized'}</p>
            <p>Account: {account ? '✅ Connected' : '❌ Not connected'}</p>
            <p>Provider: {provider ? '✅ Available' : '❌ Not available'}</p>
            <p>Contract Address: {VaultService.prototype.getContractAddress?.() || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Vault Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-dark rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-primary-purple" />
            <span className="text-gray-400 text-sm font-medium">Total Positions</span>
          </div>
          <p className="text-2xl font-bold text-white font-space-grotesk">
            {vaultStats.totalPositions}
          </p>
        </div>

        <div className="bg-card-dark rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm font-medium">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-white font-space-grotesk">
            {formatAmount(vaultStats.totalValue)} ETH
          </p>
        </div>

        <div className="bg-card-dark rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-encrypted" />
            <span className="text-gray-400 text-sm font-medium">Privacy Score</span>
          </div>
          <p className="text-2xl font-bold text-white font-space-grotesk">
            {vaultStats.privacyScore}%
          </p>
        </div>
      </div>

      {/* Vault Positions */}
      <div className="bg-card-dark rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white font-space-grotesk">Vault Positions</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Deposit
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Minus className="w-4 h-4" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {vaultPositions.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No vault positions yet</p>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-lg mx-auto"
              >
                <Plus className="w-5 h-5" />
                Make Your First Deposit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vaultPositions.map((position, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {position.token === 'ETH' ? 'Ξ' : '$'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{position.token}</p>
                      <p className="text-gray-400 text-sm">
                        Commitment: {privacyMode ? '●●●●●●' : position.commitment.slice(0, 10)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {formatAmount(position.amount)} {position.token}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(parseInt(position.timestamp)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-dark rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Deposit to Vault</h3>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Token</label>
                <select
                  value={depositForm.token}
                  onChange={(e) => setDepositForm({ ...depositForm, token: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
                >
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-encrypted" />
                  <span className="text-encrypted text-sm font-medium">Privacy Protection</span>
                </div>
                <p className="text-gray-400 text-xs">
                  Your deposit amount will be hidden using zero-knowledge commitments
                </p>
              </div>

              <button
                onClick={handleDeposit}
                disabled={isLoading || !depositForm.amount}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Depositing...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Deposit to Vault
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-dark rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Withdraw from Vault</h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Position ID</label>
                <input
                  type="text"
                  value={withdrawForm.positionId}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, positionId: e.target.value })}
                  placeholder="Enter position ID"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 text-sm font-medium">Coming Soon</span>
                </div>
                <p className="text-gray-400 text-xs">
                  Withdrawal functionality will be available once the withdrawal contract is deployed
                </p>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={true}
                className="w-full bg-gray-600 text-gray-400 flex items-center justify-center gap-2 py-3 rounded-lg font-medium cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
                Withdraw (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
