'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
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
  Clock,
  DollarSign,
  Percent,
  Calendar,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface LendingPool {
  id: string;
  asset: string;
  name: string;
  icon: string;
  apy: number;
  totalSupplied: number;
  availableLiquidity: number;
  utilizationRate: number;
  minDeposit: number;
  isActive: boolean;
}

interface VaultAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  balanceUSD: number;
  icon: string;
}

interface LendStep {
  step: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export default function LendPage() {
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset | null>(null);
  const [lendAmount, setLendAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [lendSuccess, setLendSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState('flexible');

  // Mock vault assets
  const vaultAssets: VaultAsset[] = [
    {
      id: '1',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 5.234,
      balanceUSD: 8901.23,
      icon: 'Ξ',
    },
    {
      id: '2',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 3549.66,
      balanceUSD: 3549.66,
      icon: '$',
    },
    {
      id: '3',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: 1200.5,
      balanceUSD: 1200.5,
      icon: '◈',
    },
    {
      id: '4',
      symbol: 'USDT',
      name: 'Tether',
      balance: 2000.0,
      balanceUSD: 2000.0,
      icon: '₮',
    },
  ];

  // Mock Vesu lending pools
  const lendingPools: LendingPool[] = [
    {
      id: 'vesu-usdc',
      asset: 'USDC',
      name: 'USDC Lending Pool',
      icon: '$',
      apy: 8.5,
      totalSupplied: 2500000,
      availableLiquidity: 1850000,
      utilizationRate: 26,
      minDeposit: 10,
      isActive: true,
    },
    {
      id: 'vesu-eth',
      asset: 'ETH',
      name: 'ETH Lending Pool',
      icon: 'Ξ',
      apy: 4.2,
      totalSupplied: 12500,
      availableLiquidity: 8900,
      utilizationRate: 28.8,
      minDeposit: 0.01,
      isActive: true,
    },
    {
      id: 'vesu-dai',
      asset: 'DAI',
      name: 'DAI Lending Pool',
      icon: '◈',
      apy: 6.8,
      totalSupplied: 1800000,
      availableLiquidity: 1200000,
      utilizationRate: 33.3,
      minDeposit: 10,
      isActive: true,
    },
    {
      id: 'vesu-usdt',
      asset: 'USDT',
      name: 'USDT Lending Pool',
      icon: '₮',
      apy: 7.5,
      totalSupplied: 3200000,
      availableLiquidity: 2400000,
      utilizationRate: 25,
      minDeposit: 10,
      isActive: true,
    },
  ];

  const filteredPools = lendingPools.filter(
    (pool) =>
      pool.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const lendSteps: LendStep[] = [
    {
      step: 1,
      title: 'Select Pool',
      description: 'Choose lending pool',
      isComplete: selectedPool !== null,
      isActive: currentStep === 1,
    },
    {
      step: 2,
      title: 'Enter Amount',
      description: 'Specify lending amount',
      isComplete: lendAmount !== '' && parseFloat(lendAmount) > 0,
      isActive: currentStep === 2,
    },
    {
      step: 3,
      title: 'Generate Proof',
      description: 'Create ZK proof',
      isComplete: isGeneratingProof || lendSuccess,
      isActive: currentStep === 3,
    },
    {
      step: 4,
      title: 'Confirm Lending',
      description: 'Complete transaction',
      isComplete: lendSuccess,
      isActive: currentStep === 4,
    },
  ];

  const handlePoolSelect = (pool: LendingPool) => {
    setSelectedPool(pool);
    const asset = vaultAssets.find((a) => a.symbol === pool.asset);
    if (asset) {
      setSelectedAsset(asset);
    }
    setCurrentStep(2);
  };

  const handleSetMax = () => {
    if (selectedAsset) {
      setLendAmount(selectedAsset.balance.toString());
    }
  };

  const handleContinueToProof = () => {
    if (lendAmount && parseFloat(lendAmount) > 0 && selectedPool) {
      if (parseFloat(lendAmount) < selectedPool.minDeposit) {
        alert(`Minimum deposit is ${selectedPool.minDeposit} ${selectedPool.asset}`);
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCurrentStep(4);
    } catch (error) {
      console.error('Proof generation failed:', error);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleLend = async () => {
    if (!selectedPool || !lendAmount) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLendSuccess(true);
    } catch (error) {
      console.error('Lending failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateEarnings = () => {
    if (!selectedPool || !lendAmount) return { daily: 0, monthly: 0, yearly: 0 };

    const amount = parseFloat(lendAmount);
    const apy = selectedPool.apy / 100;

    return {
      daily: (amount * apy) / 365,
      monthly: (amount * apy) / 12,
      yearly: amount * apy,
    };
  };

  const earnings = calculateEarnings();

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8 overflow-x-auto'>
      {lendSteps.map((step, index) => (
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
          {index < lendSteps.length - 1 && (
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
              <TrendingUp className='w-8 h-8 text-blue-400' />
              Private Lending
            </h1>
            <p className='text-lg text-gray-300 font-inter'>
              Earn interest on your assets privately via Vesu Protocol
            </p>
            <div className='flex items-center justify-center gap-2 mt-3'>
              <div className='flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1'>
                <Shield className='w-4 h-4 text-blue-400' />
                <span className='text-blue-400 text-sm font-medium'>Powered by Vesu</span>
              </div>
              <div className='flex items-center gap-2 bg-encrypted/10 border border-encrypted/30 rounded-lg px-3 py-1'>
                <Lock className='w-4 h-4 text-encrypted' />
                <span className='text-encrypted text-sm font-medium'>Zero-Knowledge Proofs</span>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          {!lendSuccess && renderStepIndicator()}

          {/* Success State */}
          {lendSuccess && selectedPool && (
            <div className='bg-glass rounded-2xl p-8 text-center'>
              <div className='w-20 h-20 bg-encrypted-gradient rounded-full flex items-center justify-center mx-auto mb-6 zk-proof-animation'>
                <CheckCircle className='w-10 h-10 text-white' />
              </div>

              <h2 className='text-3xl font-bold text-white mb-4 font-space-grotesk'>
                Lending Successful!
              </h2>

              <p className='text-lg text-gray-300 mb-8 font-inter'>
                Your {selectedPool.asset} is now earning interest privately
              </p>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8 max-w-md mx-auto'>
                {privacyMode ? (
                  <p className='text-blue-400 font-bold text-2xl font-jetbrains mb-2'>
                    ●●●●●● {selectedPool.asset}
                  </p>
                ) : (
                  <p className='text-blue-400 font-bold text-2xl mb-2'>
                    {lendAmount} {selectedPool.asset}
                  </p>
                )}
                <p className='text-blue-400/70 text-sm mb-3'>Lending at {selectedPool.apy}% APY</p>

                <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-3 mt-4'>
                  <p className='text-encrypted text-sm mb-1'>Estimated Earnings</p>
                  {privacyMode ? (
                    <p className='text-encrypted font-bold text-lg font-jetbrains'>●●●●●●</p>
                  ) : (
                    <>
                      <p className='text-white text-lg font-bold'>
                        +{earnings.yearly.toFixed(2)} {selectedPool.asset}/year
                      </p>
                      <p className='text-white/70 text-xs'>
                        (~{earnings.monthly.toFixed(2)}/month)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8'>
                <h3 className='text-blue-400 font-semibold mb-4'>What happens next?</h3>
                <div className='space-y-3 text-left'>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Interest accrues automatically in real-time
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Your balance remains private with zero-knowledge proofs
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>Withdraw anytime with no lock-up period</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => {
                    setLendSuccess(false);
                    setCurrentStep(1);
                    setSelectedPool(null);
                    setSelectedAsset(null);
                    setLendAmount('');
                  }}
                  className='btn-primary px-8 py-3'
                >
                  Lend More Assets
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

          {/* Step 1: Select Pool */}
          {currentStep === 1 && !lendSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Select Lending Pool
              </h2>

              {/* Search Bar */}
              <div className='relative mb-6'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search lending pools...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                />
              </div>

              <div className='space-y-4'>
                {filteredPools.map((pool) => (
                  <button
                    key={pool.id}
                    onClick={() => handlePoolSelect(pool)}
                    className='w-full p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 rounded-xl transition-all duration-200 text-left'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center'>
                          <span className='text-2xl font-bold'>{pool.icon}</span>
                        </div>
                        <div>
                          <p className='text-white font-semibold text-lg'>{pool.name}</p>
                          <p className='text-gray-400 text-sm'>Vesu Protocol</p>
                        </div>
                      </div>
                      <div className='bg-encrypted-gradient px-4 py-2 rounded-lg'>
                        <p className='text-white font-bold text-xl'>{pool.apy}%</p>
                        <p className='text-white/70 text-xs'>APY</p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Total Supplied</p>
                        <p className='text-white font-semibold'>
                          ${(pool.totalSupplied / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Available</p>
                        <p className='text-white font-semibold'>
                          ${(pool.availableLiquidity / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Utilization</p>
                        <p className='text-white font-semibold'>{pool.utilizationRate}%</p>
                      </div>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Min Deposit</p>
                        <p className='text-white font-semibold'>
                          {pool.minDeposit} {pool.asset}
                        </p>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className='mt-4'>
                      <div className='w-full h-2 bg-white/10 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-blue-500'
                          style={{ width: `${pool.utilizationRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className='mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <Info className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-blue-400 font-medium text-sm'>About Vesu Protocol</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Vesu is a decentralized lending protocol on Starknet. Your deposits are
                      secured by smart contracts and earn interest from borrowers. APY rates are
                      dynamic and adjust based on utilization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Enter Amount */}
          {currentStep === 2 && selectedPool && selectedAsset && !lendSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white font-space-grotesk'>
                  Enter Lending Amount
                </h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className='text-primary-purple hover:text-purple-400 transition-colors text-sm'
                >
                  Change Pool
                </button>
              </div>

              {/* Selected Pool Display */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4 mb-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center'>
                      <span className='text-xl font-bold'>{selectedPool.icon}</span>
                    </div>
                    <div>
                      <p className='text-white font-semibold'>{selectedPool.name}</p>
                      <p className='text-gray-400 text-sm'>
                        Available:{' '}
                        {privacyMode
                          ? '●●●●●●'
                          : `${selectedAsset.balance} ${selectedAsset.symbol}`}
                      </p>
                    </div>
                  </div>
                  <div className='bg-encrypted-gradient px-3 py-1.5 rounded-lg'>
                    <p className='text-white font-bold'>{selectedPool.apy}% APY</p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className='mb-6'>
                <label className='block text-white text-sm font-medium mb-2'>Lending Amount</label>
                <div className='relative'>
                  <input
                    type='number'
                    value={lendAmount}
                    onChange={(e) => setLendAmount(e.target.value)}
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
                {lendAmount && (
                  <div className='flex items-center justify-between mt-2'>
                    <p className='text-gray-400 text-sm'>
                      ≈ $
                      {(
                        parseFloat(lendAmount) *
                        (selectedAsset.balanceUSD / selectedAsset.balance)
                      ).toFixed(2)}{' '}
                      USD
                    </p>
                    {parseFloat(lendAmount) < selectedPool.minDeposit && (
                      <p className='text-warning text-xs'>
                        Min: {selectedPool.minDeposit} {selectedPool.asset}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className='grid grid-cols-4 gap-2 mb-6'>
                {['25', '50', '75', '100'].map((percent) => (
                  <button
                    key={percent}
                    onClick={() =>
                      setLendAmount(((selectedAsset.balance * parseInt(percent)) / 100).toString())
                    }
                    className='px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors'
                  >
                    {percent}%
                  </button>
                ))}
              </div>

              {/* Duration Selection */}
              <div className='mb-6'>
                <label className='block text-white text-sm font-medium mb-3'>
                  Lending Duration
                </label>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  <button
                    onClick={() => setSelectedDuration('flexible')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedDuration === 'flexible'
                        ? 'bg-primary-blue/20 border-primary-light'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <p className='text-white font-semibold mb-1'>Flexible</p>
                    <p className='text-gray-400 text-xs'>No lock-up period</p>
                    <p className='text-blue-400 text-sm mt-2'>Withdraw anytime</p>
                  </button>

                  <button
                    onClick={() => setSelectedDuration('30days')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedDuration === '30days'
                        ? 'bg-primary-blue/20 border-primary-light'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <p className='text-white font-semibold mb-1'>30 Days</p>
                    <p className='text-encrypted text-xs'>+0.5% Bonus APY</p>
                    <p className='text-gray-400 text-sm mt-2'>
                      {selectedPool.apy + 0.5}% Total APY
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedDuration('90days')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedDuration === '90days'
                        ? 'bg-primary-blue/20 border-primary-light'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <p className='text-white font-semibold mb-1'>90 Days</p>
                    <p className='text-encrypted text-xs'>+1.5% Bonus APY</p>
                    <p className='text-gray-400 text-sm mt-2'>
                      {selectedPool.apy + 1.5}% Total APY
                    </p>
                  </button>
                </div>
              </div>

              {/* Earnings Preview */}
              {lendAmount && parseFloat(lendAmount) > 0 && (
                <div className='bg-encrypted/10 border border-encrypted/30 rounded-xl p-6 mb-6'>
                  <h3 className='text-encrypted font-semibold mb-4 flex items-center gap-2'>
                    <DollarSign className='w-5 h-5' />
                    Estimated Earnings
                  </h3>
                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <p className='text-white/70 text-xs mb-1'>Daily</p>
                      {privacyMode ? (
                        <p className='text-white font-bold font-jetbrains'>●●●●</p>
                      ) : (
                        <p className='text-white font-bold'>
                          +{earnings.daily.toFixed(4)} {selectedPool.asset}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className='text-white/70 text-xs mb-1'>Monthly</p>
                      {privacyMode ? (
                        <p className='text-white font-bold font-jetbrains'>●●●●</p>
                      ) : (
                        <p className='text-white font-bold'>
                          +{earnings.monthly.toFixed(2)} {selectedPool.asset}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className='text-white/70 text-xs mb-1'>Yearly</p>
                      {privacyMode ? (
                        <p className='text-white font-bold font-jetbrains'>●●●●</p>
                      ) : (
                        <p className='text-white font-bold'>
                          +{earnings.yearly.toFixed(2)} {selectedPool.asset}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className='text-white/50 text-xs mt-3'>
                    Earnings are estimates based on current APY rates and may fluctuate
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <Lock className='w-5 h-5 text-encrypted mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-encrypted font-medium text-sm'>Private Lending</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Your lending amount and earnings will be hidden using zero-knowledge proofs.
                      Only you can see your balance and interest earned.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinueToProof}
                disabled={
                  !lendAmount ||
                  parseFloat(lendAmount) <= 0 ||
                  parseFloat(lendAmount) > selectedAsset.balance ||
                  parseFloat(lendAmount) < selectedPool.minDeposit
                }
                className='btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
              >
                Continue to Proof Generation
                <ArrowRight className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Step 3: Generate Proof */}
          {currentStep === 3 && selectedPool && !lendSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Generate Zero-Knowledge Proof
              </h2>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Lending Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Pool</span>
                    <span className='text-white font-medium'>{selectedPool.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Amount</span>
                    <span className='text-white font-bold'>
                      {lendAmount} {selectedPool.asset}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>APY</span>
                    <span className='text-encrypted font-bold'>{selectedPool.apy}%</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Duration</span>
                    <span className='text-white capitalize'>
                      {selectedDuration === 'flexible'
                        ? 'Flexible (No lock-up)'
                        : selectedDuration === '30days'
                          ? '30 Days'
                          : '90 Days'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Expected Yearly</span>
                    <span className='text-encrypted font-bold'>
                      +{earnings.yearly.toFixed(2)} {selectedPool.asset}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6'>
                <div className='flex items-start gap-3'>
                  <Info className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-blue-400 font-medium text-sm mb-2'>
                      What is a Zero-Knowledge Proof?
                    </p>
                    <p className='text-white/70 text-sm'>
                      A cryptographic proof that verifies you have sufficient funds without
                      revealing the exact amount. This keeps your lending balance completely private
                      while allowing the protocol to verify your deposit.
                    </p>
                  </div>
                </div>
              </div>

              {isGeneratingProof ? (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 border-4 border-encrypted/30 border-t-encrypted rounded-full animate-spin mx-auto mb-4'></div>
                  <p className='text-white font-medium mb-2'>Generating ZK Proof...</p>
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
                    onClick={handleGenerateProof}
                    className='btn-encrypted flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-3'
                  >
                    <Zap className='w-5 h-5' />
                    Generate Proof
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm Lending */}
          {currentStep === 4 && selectedPool && !lendSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Confirm Lending
              </h2>

              <div className='bg-encrypted/10 border border-encrypted/30 rounded-xl p-6 mb-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <CheckCircle className='w-6 h-6 text-encrypted' />
                  <p className='text-encrypted font-semibold'>Zero-Knowledge Proof Generated</p>
                </div>
                <p className='text-white/70 text-sm'>
                  Your proof has been successfully generated. You can now complete the lending
                  deposit.
                </p>
              </div>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Final Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Lending to</span>
                    <span className='text-white font-medium'>{selectedPool.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Amount</span>
                    <span className='text-white font-bold'>
                      {lendAmount} {selectedPool.asset}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Network Fee</span>
                    <span className='text-encrypted'>~$0.01</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Privacy Level</span>
                    <span className='text-encrypted'>100% Private</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Current APY</span>
                    <span className='text-encrypted font-bold'>{selectedPool.apy}%</span>
                  </div>
                </div>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6'>
                <div className='flex items-start gap-3'>
                  <Shield className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-blue-400 font-medium text-sm'>Powered by Vesu Protocol</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Your funds will be deposited into Vesu's audited smart contracts on Starknet.
                      You maintain full custody and can withdraw anytime.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-warning-amber mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-warning-amber font-medium text-sm'>Important</p>
                    <p className='text-white/70 text-sm mt-1'>
                      APY rates are variable and may change based on market conditions. Interest
                      accrues in real-time and compounds automatically.
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
                  onClick={handleLend}
                  disabled={isProcessing}
                  className='btn-encrypted flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
                >
                  {isProcessing ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className='w-5 h-5' />
                      Confirm Lending
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
