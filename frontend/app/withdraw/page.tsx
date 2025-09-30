'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Info,
  Zap,
  Eye,
  EyeOff,
  Search,
  Wallet,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface VaultAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  balanceUSD: number;
  icon: string;
  apy?: number;
  isLending: boolean;
}

interface WithdrawStep {
  step: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export default function WithdrawPage() {
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifyingProof, setIsVerifyingProof] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true);

  // Mock vault assets
  const vaultAssets: VaultAsset[] = [
    {
      id: '1',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 5.234,
      balanceUSD: 8901.23,
      icon: 'Ξ',
      apy: 4.2,
      isLending: false,
    },
    {
      id: '2',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 3549.66,
      balanceUSD: 3549.66,
      icon: '$',
      apy: 8.5,
      isLending: true,
    },
    {
      id: '3',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: 1200.5,
      balanceUSD: 1200.5,
      icon: '◈',
      apy: 6.8,
      isLending: false,
    },
  ];

  const filteredAssets = vaultAssets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const withdrawSteps: WithdrawStep[] = [
    {
      step: 1,
      title: 'Select Asset',
      description: 'Choose asset to withdraw',
      isComplete: selectedAsset !== null,
      isActive: currentStep === 1,
    },
    {
      step: 2,
      title: 'Enter Details',
      description: 'Amount and destination',
      isComplete: withdrawAmount !== '' && withdrawAddress !== '',
      isActive: currentStep === 2,
    },
    {
      step: 3,
      title: 'Verify Proof',
      description: 'Validate ZK proof',
      isComplete: isVerifyingProof || withdrawSuccess,
      isActive: currentStep === 3,
    },
    {
      step: 4,
      title: 'Confirm Withdrawal',
      description: 'Complete transaction',
      isComplete: withdrawSuccess,
      isActive: currentStep === 4,
    },
  ];

  const handleAssetSelect = (asset: VaultAsset) => {
    setSelectedAsset(asset);
    setCurrentStep(2);
  };

  const handleSetMax = () => {
    if (selectedAsset) {
      setWithdrawAmount(selectedAsset.balance.toString());
    }
  };

  const handleContinueToVerify = () => {
    if (withdrawAmount && parseFloat(withdrawAmount) > 0 && withdrawAddress) {
      setCurrentStep(3);
    }
  };

  const handleVerifyProof = async () => {
    setIsVerifyingProof(true);

    try {
      // Simulate ZK proof verification
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCurrentStep(4);
    } catch (error) {
      console.error('Proof verification failed:', error);
    } finally {
      setIsVerifyingProof(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAsset || !withdrawAmount || !withdrawAddress) return;

    setIsProcessing(true);

    try {
      // Simulate withdrawal transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setWithdrawSuccess(true);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8 overflow-x-auto'>
      {withdrawSteps.map((step, index) => (
        <React.Fragment key={step.step}>
          <div className={`flex flex-col items-center ${step.isActive ? 'z-10' : ''}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                step.isComplete
                  ? 'bg-encrypted text-white'
                  : step.isActive
                    ? 'bg-primary-gradient text-white'
                    : 'bg-white/10 text-white/50'
              }`}
            >
              {step.isComplete ? <CheckCircle className='w-5 h-5' /> : step.step}
            </div>
            <div className='text-center mt-2 max-w-[120px]'>
              <p
                className={`text-xs font-medium ${step.isActive ? 'text-white' : 'text-white/70'}`}
              >
                {step.title}
              </p>
            </div>
          </div>
          {index < withdrawSteps.length - 1 && (
            <div className={`w-16 h-1 mx-2 ${step.isComplete ? 'bg-encrypted' : 'bg-white/20'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
      <div className='min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118] p-4 lg:p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk flex items-center justify-center gap-3'>
              <ArrowUpRight className='w-8 h-8 text-primary-purple' />
              Withdraw from Vault
            </h1>
            <p className='text-lg text-gray-300 font-inter'>
              Withdraw assets from your private vault securely
            </p>
          </div>

          {/* Step Indicator */}
          {!withdrawSuccess && renderStepIndicator()}

          {/* Success State */}
          {withdrawSuccess && selectedAsset && (
            <div className='bg-glass rounded-2xl p-8 text-center'>
              <div className='w-20 h-20 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-6 zk-proof-animation'>
                <CheckCircle className='w-10 h-10 text-white' />
              </div>

              <h2 className='text-3xl font-bold text-white mb-4 font-space-grotesk'>
                Withdrawal Successful!
              </h2>

              <p className='text-lg text-gray-300 mb-8 font-inter'>
                Your {selectedAsset.symbol} has been withdrawn from your private vault
              </p>

              <div className='bg-primary-purple/10 border border-primary-purple/30 rounded-xl p-6 mb-8 max-w-md mx-auto'>
                {privacyMode ? (
                  <p className='text-primary-purple font-bold text-2xl font-jetbrains mb-2'>
                    ●●●●●● {selectedAsset.symbol}
                  </p>
                ) : (
                  <p className='text-primary-purple font-bold text-2xl mb-2'>
                    {withdrawAmount} {selectedAsset.symbol}
                  </p>
                )}
                <p className='text-primary-purple/70 text-sm'>Withdrawn with privacy maintained</p>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8'>
                <h3 className='text-blue-400 font-semibold mb-4'>Transaction Details</h3>
                <div className='space-y-3 text-left'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Destination</span>
                    <span className='text-white font-mono text-sm'>
                      {withdrawAddress.slice(0, 10)}...{withdrawAddress.slice(-8)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Network Fee</span>
                    <span className='text-white'>~$0.01</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Privacy Maintained</span>
                    <span className='text-encrypted'>Yes</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => {
                    setWithdrawSuccess(false);
                    setCurrentStep(1);
                    setSelectedAsset(null);
                    setWithdrawAmount('');
                    setWithdrawAddress('');
                  }}
                  className='btn-primary px-8 py-3'
                >
                  Make Another Withdrawal
                </button>

                <button
                  onClick={() => (window.location.href = '/dashboard')}
                  className='px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                >
                  View Vault
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Select Asset */}
          {currentStep === 1 && !withdrawSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Select Asset to Withdraw
              </h2>

              {/* Search Bar */}
              <div className='relative mb-6'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search vault assets...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                />
              </div>

              <div className='space-y-3'>
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset)}
                    className='w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-xl transition-all duration-200 text-left'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                          <span className='text-xl font-bold'>{asset.icon}</span>
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='text-white font-semibold'>{asset.symbol}</p>
                            {asset.isLending && (
                              <span className='bg-encrypted/20 text-encrypted text-xs px-2 py-0.5 rounded'>
                                Lending
                              </span>
                            )}
                          </div>
                          <p className='text-gray-400 text-sm'>{asset.name}</p>
                          {asset.apy && (
                            <p className='text-encrypted text-xs'>Earning {asset.apy}% APY</p>
                          )}
                        </div>
                      </div>
                      <div className='text-right'>
                        {privacyMode ? (
                          <p className='text-primary-purple font-jetbrains'>●●●●●●</p>
                        ) : (
                          <>
                            <p className='text-white font-semibold'>
                              {asset.balance} {asset.symbol}
                            </p>
                            <p className='text-gray-400 text-sm'>
                              ${asset.balanceUSD.toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredAssets.some((a) => a.isLending) && (
                <div className='mt-6 bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-4'>
                  <div className='flex items-start gap-3'>
                    <AlertCircle className='w-5 h-5 text-warning-amber mt-1 flex-shrink-0' />
                    <div>
                      <p className='text-warning-amber font-medium text-sm'>
                        Active Lending Position
                      </p>
                      <p className='text-white/70 text-sm mt-1'>
                        Some assets may have reduced availability due to active lending positions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Enter Details */}
          {currentStep === 2 && selectedAsset && !withdrawSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white font-space-grotesk'>
                  Withdrawal Details
                </h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className='text-primary-purple hover:text-purple-400 transition-colors text-sm'
                >
                  Change Asset
                </button>
              </div>

              {/* Selected Asset Display */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4 mb-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                    <span className='text-xl font-bold'>{selectedAsset.icon}</span>
                  </div>
                  <div>
                    <p className='text-white font-semibold'>{selectedAsset.symbol}</p>
                    <p className='text-gray-400 text-sm'>
                      Available:{' '}
                      {privacyMode ? '●●●●●●' : `${selectedAsset.balance} ${selectedAsset.symbol}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className='mb-6'>
                <label className='block text-white text-sm font-medium mb-2'>
                  Withdrawal Amount
                </label>
                <div className='relative'>
                  <input
                    type='number'
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className='w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-bold placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                    placeholder='0.00'
                    step='0.01'
                    min='0'
                    max={selectedAsset.balance}
                  />
                  <button
                    onClick={handleSetMax}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-purple hover:text-purple-400 transition-colors text-sm font-medium'
                  >
                    MAX
                  </button>
                </div>
                {withdrawAmount && (
                  <p className='text-gray-400 text-sm mt-2'>
                    ≈ $
                    {(
                      parseFloat(withdrawAmount) *
                      (selectedAsset.balanceUSD / selectedAsset.balance)
                    ).toFixed(2)}{' '}
                    USD
                  </p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className='grid grid-cols-4 gap-2 mb-6'>
                {['25', '50', '75', '100'].map((percent) => (
                  <button
                    key={percent}
                    onClick={() =>
                      setWithdrawAmount(
                        ((selectedAsset.balance * parseInt(percent)) / 100).toString(),
                      )
                    }
                    className='px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors'
                  >
                    {percent}%
                  </button>
                ))}
              </div>

              {/* Destination Address */}
              <div className='mb-6'>
                <label className='block text-white text-sm font-medium mb-2'>
                  Destination Address
                </label>
                <input
                  type='text'
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-mono placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                  placeholder='0x...'
                />
                <div className='flex items-center gap-2 mt-2'>
                  <Wallet className='w-4 h-4 text-gray-400' />
                  <button className='text-primary-purple hover:text-purple-400 transition-colors text-sm'>
                    Use connected wallet
                  </button>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <Lock className='w-5 h-5 text-encrypted mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-encrypted font-medium text-sm'>Privacy Maintained</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Your withdrawal will not reveal your vault balance. Zero-knowledge proofs
                      verify you have sufficient funds.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinueToVerify}
                disabled={
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  parseFloat(withdrawAmount) > selectedAsset.balance ||
                  !withdrawAddress
                }
                className='btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
              >
                Continue to Verification
                <ArrowRight className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Step 3: Verify Proof */}
          {currentStep === 3 && selectedAsset && !withdrawSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Verify Zero-Knowledge Proof
              </h2>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Withdrawal Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Asset</span>
                    <span className='text-white font-medium'>{selectedAsset.symbol}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Amount</span>
                    <span className='text-white font-bold'>
                      {withdrawAmount} {selectedAsset.symbol}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Destination</span>
                    <span className='text-white font-mono text-sm'>
                      {withdrawAddress.slice(0, 10)}...{withdrawAddress.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6'>
                <div className='flex items-start gap-3'>
                  <Info className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-blue-400 font-medium text-sm mb-2'>Proof Verification</p>
                    <p className='text-white/70 text-sm'>
                      We're verifying you have sufficient balance in your vault without revealing
                      the exact amount. This maintains your financial privacy.
                    </p>
                  </div>
                </div>
              </div>

              {isVerifyingProof ? (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 border-4 border-encrypted/30 border-t-encrypted rounded-full animate-spin mx-auto mb-4'></div>
                  <p className='text-white font-medium mb-2'>Verifying ZK Proof...</p>
                  <p className='text-gray-400 text-sm'>This may take a few seconds</p>
                </div>
              ) : (
                <div className='flex gap-4'>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className='px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyProof}
                    className='btn-encrypted flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-3'
                  >
                    <Zap className='w-5 h-5' />
                    Verify Proof
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm Withdrawal */}
          {currentStep === 4 && selectedAsset && !withdrawSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Confirm Withdrawal
              </h2>

              <div className='bg-encrypted/10 border border-encrypted/30 rounded-xl p-6 mb-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <CheckCircle className='w-6 h-6 text-encrypted' />
                  <p className='text-encrypted font-semibold'>Proof Verified Successfully</p>
                </div>
                <p className='text-white/70 text-sm'>
                  Your zero-knowledge proof has been verified. You can now complete the withdrawal.
                </p>
              </div>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Final Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Withdrawing</span>
                    <span className='text-white font-bold'>
                      {withdrawAmount} {selectedAsset.symbol}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Network Fee</span>
                    <span className='text-white'>~$0.01</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Privacy Level</span>
                    <span className='text-encrypted'>100% Private</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Destination</span>
                    <span className='text-white font-mono text-sm'>
                      {withdrawAddress.slice(0, 10)}...{withdrawAddress.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-warning-amber mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-warning-amber font-medium text-sm'>Important</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Double-check the destination address. Withdrawals cannot be reversed.
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex gap-4'>
                <button
                  onClick={() => setCurrentStep(3)}
                  className='px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                >
                  Back
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={isProcessing}
                  className='btn-primary flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
                >
                  {isProcessing ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className='w-5 h-5' />
                      Confirm Withdrawal
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
