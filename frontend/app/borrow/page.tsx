'use client';

import React, { useState, useEffect } from 'react';
import {
  Coins,
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
  TrendingDown,
  Percent,
  AlertTriangle,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface BorrowPool {
  id: string;
  asset: string;
  name: string;
  icon: string;
  apr: number;
  availableToBorrow: number;
  totalBorrowed: number;
  utilizationRate: number;
  minBorrow: number;
  isActive: boolean;
}

interface CollateralAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  balanceUSD: number;
  icon: string;
  ltv: number; // Loan-to-Value ratio
  liquidationThreshold: number;
}

interface BorrowStep {
  step: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export default function BorrowPage() {
  const [selectedPool, setSelectedPool] = useState<BorrowPool | null>(null);
  const [selectedCollateral, setSelectedCollateral] = useState<CollateralAsset | null>(null);
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true);

  // Mock collateral assets from vault
  const collateralAssets: CollateralAsset[] = [
    {
      id: '1',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 5.234,
      balanceUSD: 8901.23,
      icon: 'Ξ',
      ltv: 75,
      liquidationThreshold: 80,
    },
    {
      id: '2',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 3549.66,
      balanceUSD: 3549.66,
      icon: '$',
      ltv: 85,
      liquidationThreshold: 90,
    },
    {
      id: '3',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: 1200.5,
      balanceUSD: 1200.5,
      icon: '◈',
      ltv: 80,
      liquidationThreshold: 85,
    },
  ];

  // Mock Vesu borrowing pools
  const borrowPools: BorrowPool[] = [
    {
      id: 'vesu-usdc-borrow',
      asset: 'USDC',
      name: 'USDC Borrow Pool',
      icon: '$',
      apr: 5.8,
      availableToBorrow: 1850000,
      totalBorrowed: 650000,
      utilizationRate: 26,
      minBorrow: 10,
      isActive: true,
    },
    {
      id: 'vesu-eth-borrow',
      asset: 'ETH',
      name: 'ETH Borrow Pool',
      icon: 'Ξ',
      apr: 3.5,
      availableToBorrow: 8900,
      totalBorrowed: 3600,
      utilizationRate: 28.8,
      minBorrow: 0.01,
      isActive: true,
    },
    {
      id: 'vesu-dai-borrow',
      asset: 'DAI',
      name: 'DAI Borrow Pool',
      icon: '◈',
      apr: 4.9,
      availableToBorrow: 1200000,
      totalBorrowed: 600000,
      utilizationRate: 33.3,
      minBorrow: 10,
      isActive: true,
    },
  ];

  const filteredPools = borrowPools.filter(
    (pool) =>
      pool.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const borrowSteps: BorrowStep[] = [
    {
      step: 1,
      title: 'Select Pool',
      description: 'Choose asset to borrow',
      isComplete: selectedPool !== null,
      isActive: currentStep === 1,
    },
    {
      step: 2,
      title: 'Add Collateral',
      description: 'Deposit collateral',
      isComplete: collateralAmount !== '' && parseFloat(collateralAmount) > 0,
      isActive: currentStep === 2,
    },
    {
      step: 3,
      title: 'Set Borrow Amount',
      description: 'Enter amount to borrow',
      isComplete: borrowAmount !== '' && parseFloat(borrowAmount) > 0,
      isActive: currentStep === 3,
    },
    {
      step: 4,
      title: 'Generate Proof',
      description: 'Create ZK proof',
      isComplete: isGeneratingProof || borrowSuccess,
      isActive: currentStep === 4,
    },
    {
      step: 5,
      title: 'Confirm Borrow',
      description: 'Complete transaction',
      isComplete: borrowSuccess,
      isActive: currentStep === 5,
    },
  ];

  const handlePoolSelect = (pool: BorrowPool) => {
    setSelectedPool(pool);
    setCurrentStep(2);
  };

  const handleCollateralSelect = (asset: CollateralAsset) => {
    setSelectedCollateral(asset);
  };

  const handleSetMaxCollateral = () => {
    if (selectedCollateral) {
      setCollateralAmount(selectedCollateral.balance.toString());
    }
  };

  const calculateMaxBorrow = () => {
    if (!selectedCollateral || !collateralAmount || parseFloat(collateralAmount) <= 0) {
      return 0;
    }
    const collateralValue =
      parseFloat(collateralAmount) * (selectedCollateral.balanceUSD / selectedCollateral.balance);
    return (collateralValue * selectedCollateral.ltv) / 100;
  };

  const calculateHealthFactor = () => {
    if (!selectedCollateral || !collateralAmount || !borrowAmount) return 0;
    if (parseFloat(borrowAmount) <= 0) return Infinity;

    const collateralValue =
      parseFloat(collateralAmount) * (selectedCollateral.balanceUSD / selectedCollateral.balance);
    const borrowValue = parseFloat(borrowAmount);
    const liquidationValue = (collateralValue * selectedCollateral.liquidationThreshold) / 100;

    return liquidationValue / borrowValue;
  };

  const calculateLTV = () => {
    if (!selectedCollateral || !collateralAmount || !borrowAmount) return 0;
    if (parseFloat(collateralAmount) <= 0) return 0;

    const collateralValue =
      parseFloat(collateralAmount) * (selectedCollateral.balanceUSD / selectedCollateral.balance);
    const borrowValue = parseFloat(borrowAmount);

    return (borrowValue / collateralValue) * 100;
  };

  const maxBorrow = calculateMaxBorrow();
  const healthFactor = calculateHealthFactor();
  const currentLTV = calculateLTV();

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return 'text-encrypted';
    if (hf >= 1.5) return 'text-warning';
    if (hf >= 1.1) return 'text-error';
    return 'text-error';
  };

  const getHealthFactorStatus = (hf: number) => {
    if (hf >= 2) return 'Safe';
    if (hf >= 1.5) return 'Moderate';
    if (hf >= 1.1) return 'Risky';
    return 'Danger';
  };

  const handleContinueToAmount = () => {
    if (collateralAmount && parseFloat(collateralAmount) > 0 && selectedCollateral) {
      setCurrentStep(3);
    }
  };

  const handleContinueToProof = () => {
    if (borrowAmount && parseFloat(borrowAmount) > 0 && healthFactor >= 1.1) {
      setCurrentStep(4);
    }
  };

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCurrentStep(5);
    } catch (error) {
      console.error('Proof generation failed:', error);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedPool || !borrowAmount) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setBorrowSuccess(true);
    } catch (error) {
      console.error('Borrowing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateInterest = () => {
    if (!selectedPool || !borrowAmount) return { daily: 0, monthly: 0, yearly: 0 };

    const amount = parseFloat(borrowAmount);
    const apr = selectedPool.apr / 100;

    return {
      daily: (amount * apr) / 365,
      monthly: (amount * apr) / 12,
      yearly: amount * apr,
    };
  };

  const interest = calculateInterest();

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8 overflow-x-auto'>
      {borrowSteps.map((step, index) => (
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
            <div className='text-center mt-2 max-w-[100px]'>
              <p
                className={`text-xs font-medium ${step.isActive ? 'text-white' : 'text-white/70'}`}
              >
                {step.title}
              </p>
            </div>
          </div>
          {index < borrowSteps.length - 1 && (
            <div className={`w-12 h-1 mx-2 ${step.isComplete ? 'bg-encrypted' : 'bg-white/20'}`} />
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
              <Coins className='w-8 h-8 text-purple-400' />
              Private Borrowing
            </h1>
            <p className='text-lg text-gray-300 font-inter'>
              Borrow assets privately with collateral via Vesu Protocol
            </p>
            <div className='flex items-center justify-center gap-2 mt-3'>
              <div className='flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-1'>
                <Shield className='w-4 h-4 text-purple-400' />
                <span className='text-purple-400 text-sm font-medium'>Powered by Vesu</span>
              </div>
              <div className='flex items-center gap-2 bg-encrypted/10 border border-encrypted/30 rounded-lg px-3 py-1'>
                <Lock className='w-4 h-4 text-encrypted' />
                <span className='text-encrypted text-sm font-medium'>Private Collateral</span>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          {!borrowSuccess && renderStepIndicator()}

          {/* Success State */}
          {borrowSuccess && selectedPool && selectedCollateral && (
            <div className='bg-glass rounded-2xl p-8 text-center'>
              <div className='w-20 h-20 bg-encrypted-gradient rounded-full flex items-center justify-center mx-auto mb-6 zk-proof-animation'>
                <CheckCircle className='w-10 h-10 text-white' />
              </div>

              <h2 className='text-3xl font-bold text-white mb-4 font-space-grotesk'>
                Borrowing Successful!
              </h2>

              <p className='text-lg text-gray-300 mb-8 font-inter'>
                Your {selectedPool.asset} loan has been issued privately
              </p>

              <div className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8 max-w-md mx-auto'>
                {privacyMode ? (
                  <p className='text-purple-400 font-bold text-2xl font-jetbrains mb-2'>
                    ●●●●●● {selectedPool.asset}
                  </p>
                ) : (
                  <p className='text-purple-400 font-bold text-2xl mb-2'>
                    {borrowAmount} {selectedPool.asset}
                  </p>
                )}
                <p className='text-purple-400/70 text-sm mb-3'>
                  Borrowed at {selectedPool.apr}% APR
                </p>

                <div className='bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-3 mt-4'>
                  <p className='text-warning text-sm mb-1'>Health Factor</p>
                  <p className='text-white text-lg font-bold'>{healthFactor.toFixed(2)}</p>
                  <p className='text-white/70 text-xs'>{getHealthFactorStatus(healthFactor)}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
                <div className='bg-white/5 rounded-xl p-4'>
                  <p className='text-gray-400 text-sm mb-2'>Collateral Locked</p>
                  {privacyMode ? (
                    <p className='text-white font-bold font-jetbrains'>●●●●●●</p>
                  ) : (
                    <p className='text-white font-bold'>
                      {collateralAmount} {selectedCollateral.symbol}
                    </p>
                  )}
                </div>
                <div className='bg-white/5 rounded-xl p-4'>
                  <p className='text-gray-400 text-sm mb-2'>Current LTV</p>
                  <p className='text-white font-bold'>{currentLTV.toFixed(1)}%</p>
                </div>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8'>
                <h3 className='text-blue-400 font-semibold mb-4'>Important Information</h3>
                <div className='space-y-3 text-left'>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Interest accrues continuously at {selectedPool.apr}% APR
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Monitor your health factor to avoid liquidation
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>Repay anytime to unlock your collateral</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => {
                    setBorrowSuccess(false);
                    setCurrentStep(1);
                    setSelectedPool(null);
                    setSelectedCollateral(null);
                    setCollateralAmount('');
                    setBorrowAmount('');
                  }}
                  className='btn-primary px-8 py-3'
                >
                  Borrow More
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

          {/* Step 1: Select Borrow Pool */}
          {currentStep === 1 && !borrowSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Select Asset to Borrow
              </h2>

              {/* Search Bar */}
              <div className='relative mb-6'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search borrow pools...'
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
                    className='w-full p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-xl transition-all duration-200 text-left'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center'>
                          <span className='text-2xl font-bold'>{pool.icon}</span>
                        </div>
                        <div>
                          <p className='text-white font-semibold text-lg'>{pool.name}</p>
                          <p className='text-gray-400 text-sm'>Vesu Protocol</p>
                        </div>
                      </div>
                      <div className='bg-error-red/20 border border-error-red/30 px-4 py-2 rounded-lg'>
                        <p className='text-error font-bold text-xl'>{pool.apr}%</p>
                        <p className='text-error/70 text-xs'>APR</p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Available</p>
                        <p className='text-white font-semibold'>
                          {pool.availableToBorrow > 1000
                            ? `${(pool.availableToBorrow / 1000).toFixed(1)}K`
                            : pool.availableToBorrow}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Total Borrowed</p>
                        <p className='text-white font-semibold'>
                          ${(pool.totalBorrowed / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Utilization</p>
                        <p className='text-white font-semibold'>{pool.utilizationRate}%</p>
                      </div>
                      <div>
                        <p className='text-gray-400 text-xs mb-1'>Min Borrow</p>
                        <p className='text-white font-semibold'>
                          {pool.minBorrow} {pool.asset}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className='mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <Info className='w-5 h-5 text-purple-400 mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-purple-400 font-medium text-sm'>Collateralized Borrowing</p>
                    <p className='text-white/70 text-sm mt-1'>
                      All loans require collateral to be deposited. You'll maintain privacy through
                      zero-knowledge proofs while Vesu Protocol secures your loan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Collateral */}
          {currentStep === 2 && selectedPool && !borrowSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white font-space-grotesk'>Add Collateral</h2>
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
                    <div className='w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center'>
                      <span className='text-xl font-bold'>{selectedPool.icon}</span>
                    </div>
                    <div>
                      <p className='text-white font-semibold'>Borrowing {selectedPool.asset}</p>
                      <p className='text-gray-400 text-sm'>{selectedPool.apr}% APR</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className='text-white font-semibold mb-4'>Select Collateral Asset</h3>

              <div className='space-y-3 mb-6'>
                {collateralAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleCollateralSelect(asset)}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedCollateral?.id === asset.id
                        ? 'bg-primary-blue/20 border-primary-light'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                          <span className='text-xl font-bold'>{asset.icon}</span>
                        </div>
                        <div>
                          <p className='text-white font-semibold'>{asset.symbol}</p>
                          <p className='text-gray-400 text-sm'>
                            Available: {privacyMode ? '●●●●●●' : `${asset.balance} ${asset.symbol}`}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-white text-sm mb-1'>LTV: {asset.ltv}%</p>
                        <p className='text-gray-400 text-xs'>Liq: {asset.liquidationThreshold}%</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedCollateral && (
                <>
                  <div className='mb-6'>
                    <label className='block text-white text-sm font-medium mb-2'>
                      Collateral Amount
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                        className='w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-bold placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                        placeholder='0.00'
                        step='0.01'
                        min='0'
                        max={selectedCollateral.balance}
                      />
                      <button
                        onClick={handleSetMaxCollateral}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-purple hover:text-purple-400 transition-colors text-sm font-medium'
                      >
                        MAX
                      </button>
                    </div>
                    {collateralAmount && (
                      <p className='text-gray-400 text-sm mt-2'>
                        ≈ $
                        {(
                          parseFloat(collateralAmount) *
                          (selectedCollateral.balanceUSD / selectedCollateral.balance)
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
                          setCollateralAmount(
                            ((selectedCollateral.balance * parseInt(percent)) / 100).toString(),
                          )
                        }
                        className='px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors'
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>

                  {/* Max Borrow Preview */}
                  {collateralAmount && parseFloat(collateralAmount) > 0 && (
                    <div className='bg-encrypted/10 border border-encrypted/30 rounded-xl p-6 mb-6'>
                      <h3 className='text-encrypted font-semibold mb-3'>Borrowing Power</h3>
                      <div className='flex items-center justify-between'>
                        <span className='text-white/70'>Maximum you can borrow</span>
                        {privacyMode ? (
                          <span className='text-encrypted font-bold text-xl font-jetbrains'>
                            ●●●●●●
                          </span>
                        ) : (
                          <span className='text-encrypted font-bold text-xl'>
                            ${maxBorrow.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className='text-white/50 text-xs mt-2'>
                        Based on {selectedCollateral.ltv}% LTV ratio
                      </p>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6'>
                    <div className='flex items-start gap-3'>
                      <Info className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                      <div>
                        <p className='text-blue-400 font-medium text-sm'>Collateral Details</p>
                        <p className='text-white/70 text-sm mt-1'>
                          LTV (Loan-to-Value): {selectedCollateral.ltv}% - Maximum borrowing power
                          <br />
                          Liquidation Threshold: {selectedCollateral.liquidationThreshold}% - When
                          your position gets liquidated
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleContinueToAmount}
                    disabled={
                      !collateralAmount ||
                      parseFloat(collateralAmount) <= 0 ||
                      parseFloat(collateralAmount) > selectedCollateral.balance
                    }
                    className='btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
                  >
                    Continue to Borrow Amount
                    <ArrowRight className='w-5 h-5' />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Set Borrow Amount */}
          {currentStep === 3 && selectedPool && selectedCollateral && !borrowSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white font-space-grotesk'>
                  Set Borrow Amount
                </h2>
                <button
                  onClick={() => setCurrentStep(2)}
                  className='text-primary-purple hover:text-purple-400 transition-colors text-sm'
                >
                  Adjust Collateral
                </button>
              </div>

              {/* Collateral Summary */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4 mb-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-gray-400 text-sm'>Collateral Deposited</p>
                    <p className='text-white font-bold'>
                      {collateralAmount} {selectedCollateral.symbol}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-400 text-sm'>Max Borrow</p>
                    {privacyMode ? (
                      <p className='text-encrypted font-bold font-jetbrains'>●●●●●●</p>
                    ) : (
                      <p className='text-encrypted font-bold'>${maxBorrow.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Borrow Amount Input */}
              <div className='mb-6'>
                <label className='block text-white text-sm font-medium mb-2'>
                  Amount to Borrow
                </label>
                <div className='relative'>
                  <input
                    type='number'
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className='w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-bold placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                    placeholder='0.00'
                    step='0.01'
                    min='0'
                    max={maxBorrow}
                  />
                  <button
                    onClick={() => setBorrowAmount(maxBorrow.toFixed(2))}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-purple hover:text-purple-400 transition-colors text-sm font-medium'
                  >
                    MAX
                  </button>
                </div>
                {borrowAmount && parseFloat(borrowAmount) > maxBorrow && (
                  <p className='text-error text-xs mt-2'>
                    Exceeds maximum borrow amount (${maxBorrow.toFixed(2)})
                  </p>
                )}
              </div>

              {/* Quick Percentage Buttons */}
              <div className='grid grid-cols-4 gap-2 mb-6'>
                {['25', '50', '75', '90'].map((percent) => (
                  <button
                    key={percent}
                    onClick={() =>
                      setBorrowAmount(((maxBorrow * parseInt(percent)) / 100).toFixed(2))
                    }
                    className='px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors'
                  >
                    {percent}%
                  </button>
                ))}
              </div>

              {/* Health Factor Display */}
              {borrowAmount && parseFloat(borrowAmount) > 0 && (
                <div className='mb-6'>
                  <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-2'>
                        <Shield className='w-5 h-5 text-white/70' />
                        <span className='text-white font-semibold'>Health Factor</span>
                      </div>
                      <span className={`text-3xl font-bold ${getHealthFactorColor(healthFactor)}`}>
                        {healthFactor === Infinity ? '∞' : healthFactor.toFixed(2)}
                      </span>
                    </div>

                    {/* Health Factor Bar */}
                    <div className='mb-4'>
                      <div className='w-full h-3 bg-white/10 rounded-full overflow-hidden'>
                        <div
                          className={`h-full transition-all duration-300 ${
                            healthFactor >= 2
                              ? 'bg-encrypted'
                              : healthFactor >= 1.5
                                ? 'bg-warning'
                                : 'bg-error'
                          }`}
                          style={{
                            width: `${Math.min((healthFactor / 3) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className='grid grid-cols-3 gap-4 mb-4'>
                      <div>
                        <p className='text-white/70 text-xs mb-1'>Status</p>
                        <p className={`font-semibold ${getHealthFactorColor(healthFactor)}`}>
                          {getHealthFactorStatus(healthFactor)}
                        </p>
                      </div>
                      <div>
                        <p className='text-white/70 text-xs mb-1'>Current LTV</p>
                        <p className='text-white font-semibold'>{currentLTV.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className='text-white/70 text-xs mb-1'>Max LTV</p>
                        <p className='text-white font-semibold'>{selectedCollateral.ltv}%</p>
                      </div>
                    </div>

                    <p className='text-white/50 text-xs'>
                      Health Factor below 1.0 will trigger liquidation. Keep it above 1.5 for
                      safety.
                    </p>
                  </div>

                  {/* Warning for Low Health Factor */}
                  {healthFactor < 1.5 && healthFactor >= 1.1 && (
                    <div className='bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-4 mt-4'>
                      <div className='flex items-start gap-3'>
                        <AlertCircle className='w-5 h-5 text-warning mt-1 flex-shrink-0' />
                        <div>
                          <p className='text-warning font-medium text-sm'>Moderate Risk</p>
                          <p className='text-white/70 text-sm mt-1'>
                            Your health factor is below 1.5. Consider borrowing less to maintain a
                            safer position.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {healthFactor < 1.1 && (
                    <div className='bg-error-red/10 border border-error-red/30 rounded-lg p-4 mt-4'>
                      <div className='flex items-start gap-3'>
                        <AlertTriangle className='w-5 h-5 text-error mt-1 flex-shrink-0' />
                        <div>
                          <p className='text-error font-medium text-sm'>
                            High Risk - Cannot Borrow
                          </p>
                          <p className='text-white/70 text-sm mt-1'>
                            Health factor too low. Reduce borrow amount or add more collateral.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interest Preview */}
              {borrowAmount && parseFloat(borrowAmount) > 0 && (
                <div className='bg-error-red/10 border border-error-red/30 rounded-xl p-6 mb-6'>
                  <h3 className='text-error font-semibold mb-4 flex items-center gap-2'>
                    <Percent className='w-5 h-5' />
                    Interest to Pay
                  </h3>
                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <p className='text-white/70 text-xs mb-1'>Daily</p>
                      {privacyMode ? (
                        <p className='text-white font-bold font-jetbrains'>●●●●</p>
                      ) : (
                        <p className='text-white font-bold'>
                          {interest.daily.toFixed(4)} {selectedPool.asset}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className='text-white/70 text-xs mb-1'>Monthly</p>
                      {privacyMode ? (
                        <p className='text-white font-bold font-jetbrains'>●●●●</p>
                      ) : (
                        <p className='text-white font-bold'>
                          {interest.monthly.toFixed(2)} {selectedPool.asset}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className='text-white/70 text-xs mb-1'>Yearly</p>
                      {privacyMode ? (
                        <p className='text-white font-bold font-jetbrains'>●●●●</p>
                      ) : (
                        <p className='text-white font-bold'>
                          {interest.yearly.toFixed(2)} {selectedPool.asset}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className='text-white/50 text-xs mt-3'>
                    Interest accrues continuously at {selectedPool.apr}% APR
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <Lock className='w-5 h-5 text-encrypted mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-encrypted font-medium text-sm'>Private Borrowing</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Your borrow amount and collateral will remain private through zero-knowledge
                      proofs.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinueToProof}
                disabled={
                  !borrowAmount ||
                  parseFloat(borrowAmount) <= 0 ||
                  parseFloat(borrowAmount) > maxBorrow ||
                  healthFactor < 1.1
                }
                className='btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
              >
                Continue to Proof Generation
                <ArrowRight className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Step 4: Generate Proof */}
          {currentStep === 4 && selectedPool && !borrowSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Generate Zero-Knowledge Proof
              </h2>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Borrow Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Borrowing</span>
                    <span className='text-white font-bold'>
                      {borrowAmount} {selectedPool.asset}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Collateral</span>
                    <span className='text-white font-medium'>
                      {collateralAmount} {selectedCollateral?.symbol}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>APR</span>
                    <span className='text-error font-bold'>{selectedPool.apr}%</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Health Factor</span>
                    <span className={`font-bold ${getHealthFactorColor(healthFactor)}`}>
                      {healthFactor.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>LTV Ratio</span>
                    <span className='text-white'>{currentLTV.toFixed(1)}%</span>
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
                      A cryptographic proof that verifies your collateral without revealing the
                      exact amount. This maintains complete privacy while allowing Vesu Protocol to
                      secure your loan.
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
                    onClick={() => setCurrentStep(3)}
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

          {/* Step 5: Confirm Borrow */}
          {currentStep === 5 && selectedPool && selectedCollateral && !borrowSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Confirm Borrowing
              </h2>

              <div className='bg-encrypted/10 border border-encrypted/30 rounded-xl p-6 mb-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <CheckCircle className='w-6 h-6 text-encrypted' />
                  <p className='text-encrypted font-semibold'>Zero-Knowledge Proof Generated</p>
                </div>
                <p className='text-white/70 text-sm'>
                  Your proof has been successfully generated. You can now complete the borrow
                  transaction.
                </p>
              </div>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Final Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Borrowing</span>
                    <span className='text-white font-bold'>
                      {borrowAmount} {selectedPool.asset}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Collateral Locked</span>
                    <span className='text-white font-medium'>
                      {collateralAmount} {selectedCollateral.symbol}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Interest Rate</span>
                    <span className='text-error font-bold'>{selectedPool.apr}% APR</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Network Fee</span>
                    <span className='text-encrypted'>~$0.01</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Privacy Level</span>
                    <span className='text-encrypted'>100% Private</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-white/70'>Health Factor</span>
                    <span className={`font-bold text-lg ${getHealthFactorColor(healthFactor)}`}>
                      {healthFactor.toFixed(2)} - {getHealthFactorStatus(healthFactor)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-6'>
                <div className='flex items-start gap-3'>
                  <Shield className='w-5 h-5 text-purple-400 mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-purple-400 font-medium text-sm'>Powered by Vesu Protocol</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Your loan is secured by audited smart contracts on Starknet. Repay anytime to
                      unlock your collateral.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-warning-amber mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-warning-amber font-medium text-sm'>Important Warnings</p>
                    <ul className='text-white/70 text-sm mt-2 space-y-1 list-disc list-inside'>
                      <li>Monitor your health factor to avoid liquidation</li>
                      <li>Interest accrues continuously and compounds</li>
                      <li>Asset price volatility can affect your position</li>
                      <li>Maintain health factor above 1.5 for safety</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='flex gap-4'>
                <button
                  onClick={() => setCurrentStep(4)}
                  className='px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                >
                  Back
                </button>
                <button
                  onClick={handleBorrow}
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
                      <Coins className='w-5 h-5' />
                      Confirm Borrow
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
