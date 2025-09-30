'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
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
  TrendingUp,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  balanceUSD: number;
  icon: string;
  contractAddress: string;
  decimals: number;
}

interface DepositStep {
  step: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export default function DepositPage() {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true);

  // Mock wallet tokens
  const availableTokens: Token[] = [
    {
      id: '1',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 3.5,
      balanceUSD: 5950.0,
      icon: 'Ξ',
      contractAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      decimals: 18,
    },
    {
      id: '2',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 10000,
      balanceUSD: 10000,
      icon: '$',
      contractAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      decimals: 6,
    },
    {
      id: '3',
      symbol: 'USDT',
      name: 'Tether',
      balance: 5000,
      balanceUSD: 5000,
      icon: '₮',
      contractAddress: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
      decimals: 6,
    },
    {
      id: '4',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: 2500,
      balanceUSD: 2500,
      icon: '◈',
      contractAddress: '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
      decimals: 18,
    },
  ];

  const filteredTokens = availableTokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const depositSteps: DepositStep[] = [
    {
      step: 1,
      title: 'Select Token',
      description: 'Choose the asset you want to deposit',
      isComplete: selectedToken !== null,
      isActive: currentStep === 1,
    },
    {
      step: 2,
      title: 'Enter Amount',
      description: 'Specify deposit amount',
      isComplete: depositAmount !== '' && parseFloat(depositAmount) > 0,
      isActive: currentStep === 2,
    },
    {
      step: 3,
      title: 'Generate Proof',
      description: 'Create zero-knowledge proof',
      isComplete: isGeneratingProof || depositSuccess,
      isActive: currentStep === 3,
    },
    {
      step: 4,
      title: 'Confirm Deposit',
      description: 'Complete private deposit',
      isComplete: depositSuccess,
      isActive: currentStep === 4,
    },
  ];

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setCurrentStep(2);
  };

  const handleSetMax = () => {
    if (selectedToken) {
      setDepositAmount(selectedToken.balance.toString());
    }
  };

  const handleContinueToProof = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      setCurrentStep(3);
    }
  };

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);

    try {
      // Simulate ZK proof generation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCurrentStep(4);
    } catch (error) {
      console.error('Proof generation failed:', error);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedToken || !depositAmount) return;

    setIsProcessing(true);

    try {
      // Simulate deposit transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDepositSuccess(true);
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8 overflow-x-auto'>
      {depositSteps.map((step, index) => (
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
          {index < depositSteps.length - 1 && (
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
              <Download className='w-8 h-8 text-encrypted' />
              Deposit to Vault
            </h1>
            <p className='text-lg text-gray-300 font-inter'>
              Add assets to your private vault with hidden balance commitments
            </p>
          </div>

          {/* Step Indicator */}
          {!depositSuccess && renderStepIndicator()}

          {/* Success State */}
          {depositSuccess && selectedToken && (
            <div className='bg-glass rounded-2xl p-8 text-center'>
              <div className='w-20 h-20 bg-encrypted-gradient rounded-full flex items-center justify-center mx-auto mb-6 zk-proof-animation'>
                <CheckCircle className='w-10 h-10 text-white' />
              </div>

              <h2 className='text-3xl font-bold text-white mb-4 font-space-grotesk'>
                Deposit Successful!
              </h2>

              <p className='text-lg text-gray-300 mb-8 font-inter'>
                Your {selectedToken.symbol} has been deposited to your private vault
              </p>

              <div className='bg-encrypted/10 border border-encrypted/30 rounded-xl p-6 mb-8 max-w-md mx-auto'>
                {privacyMode ? (
                  <p className='text-encrypted font-bold text-2xl font-jetbrains mb-2'>
                    ●●●●●● {selectedToken.symbol}
                  </p>
                ) : (
                  <p className='text-encrypted font-bold text-2xl mb-2'>
                    {depositAmount} {selectedToken.symbol}
                  </p>
                )}
                <p className='text-encrypted/70 text-sm'>Deposited with zero-knowledge proof</p>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8'>
                <h3 className='text-blue-400 font-semibold mb-4'>What happened?</h3>
                <div className='space-y-3 text-left'>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>Assets transferred to vault contract</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Zero-knowledge proof generated and verified
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Balance hidden with cryptographic commitment
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => {
                    setDepositSuccess(false);
                    setCurrentStep(1);
                    setSelectedToken(null);
                    setDepositAmount('');
                  }}
                  className='btn-primary px-8 py-3'
                >
                  Make Another Deposit
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

          {/* Step 1: Select Token */}
          {currentStep === 1 && !depositSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Select Token to Deposit
              </h2>

              {/* Search Bar */}
              <div className='relative mb-6'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search tokens...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                />
              </div>

              <div className='space-y-3'>
                {filteredTokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => handleTokenSelect(token)}
                    className='w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-xl transition-all duration-200 text-left'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                          <span className='text-xl font-bold'>{token.icon}</span>
                        </div>
                        <div>
                          <p className='text-white font-semibold'>{token.symbol}</p>
                          <p className='text-gray-400 text-sm'>{token.name}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        {privacyMode ? (
                          <p className='text-primary-purple font-jetbrains'>●●●●●●</p>
                        ) : (
                          <>
                            <p className='text-white font-semibold'>
                              {token.balance} {token.symbol}
                            </p>
                            <p className='text-gray-400 text-sm'>
                              ${token.balanceUSD.toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Enter Amount */}
          {currentStep === 2 && selectedToken && !depositSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white font-space-grotesk'>
                  Enter Deposit Amount
                </h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className='text-primary-purple hover:text-purple-400 transition-colors text-sm'
                >
                  Change Token
                </button>
              </div>

              {/* Selected Token Display */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4 mb-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                    <span className='text-xl font-bold'>{selectedToken.icon}</span>
                  </div>
                  <div>
                    <p className='text-white font-semibold'>{selectedToken.symbol}</p>
                    <p className='text-gray-400 text-sm'>
                      Available:{' '}
                      {privacyMode ? '●●●●●●' : `${selectedToken.balance} ${selectedToken.symbol}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className='mb-6'>
                <label className='block text-white text-sm font-medium mb-2'>Deposit Amount</label>
                <div className='relative'>
                  <input
                    type='number'
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className='w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-bold placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                    placeholder='0.00'
                    step='0.01'
                    min='0'
                    max={selectedToken.balance}
                  />
                  <button
                    onClick={handleSetMax}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-purple hover:text-purple-400 transition-colors text-sm font-medium'
                  >
                    MAX
                  </button>
                </div>
                {depositAmount && (
                  <p className='text-gray-400 text-sm mt-2'>
                    ≈ $
                    {(
                      parseFloat(depositAmount) *
                      (selectedToken.balanceUSD / selectedToken.balance)
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
                      setDepositAmount(
                        ((selectedToken.balance * parseInt(percent)) / 100).toString(),
                      )
                    }
                    className='px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors'
                  >
                    {percent}%
                  </button>
                ))}
              </div>

              {/* Privacy Notice */}
              <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <Lock className='w-5 h-5 text-encrypted mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-encrypted font-medium text-sm'>Private Deposit</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Your deposit amount will be hidden using zero-knowledge proofs. Only you can
                      see your balance.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinueToProof}
                disabled={
                  !depositAmount ||
                  parseFloat(depositAmount) <= 0 ||
                  parseFloat(depositAmount) > selectedToken.balance
                }
                className='btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
              >
                Continue to Proof Generation
                <ArrowRight className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Step 3: Generate Proof */}
          {currentStep === 3 && selectedToken && !depositSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Generate Zero-Knowledge Proof
              </h2>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Deposit Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Token</span>
                    <span className='text-white font-medium'>{selectedToken.symbol}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Amount</span>
                    <span className='text-white font-bold'>
                      {depositAmount} {selectedToken.symbol}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Value</span>
                    <span className='text-white'>
                      $
                      {(
                        parseFloat(depositAmount) *
                        (selectedToken.balanceUSD / selectedToken.balance)
                      ).toFixed(2)}
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
                      revealing the exact amount. This keeps your balance completely private while
                      allowing you to interact with DeFi protocols.
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

          {/* Step 4: Confirm Deposit */}
          {currentStep === 4 && selectedToken && !depositSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Confirm Deposit
              </h2>

              <div className='bg-encrypted/10 border border-encrypted/30 rounded-xl p-6 mb-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <CheckCircle className='w-6 h-6 text-encrypted' />
                  <p className='text-encrypted font-semibold'>Zero-Knowledge Proof Generated</p>
                </div>
                <p className='text-white/70 text-sm'>
                  Your proof has been successfully generated. You can now complete the deposit.
                </p>
              </div>

              <div className='bg-white/5 border border-white/10 rounded-xl p-6 mb-6'>
                <h3 className='text-white font-semibold mb-4'>Final Summary</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Depositing</span>
                    <span className='text-white font-bold'>
                      {depositAmount} {selectedToken.symbol}
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
                </div>
              </div>

              <div className='bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-warning-amber mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-warning-amber font-medium text-sm'>Important</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Once deposited, your balance will be hidden. Only you can view it with your
                      private key.
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
                  onClick={handleDeposit}
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
                      <Download className='w-5 h-5' />
                      Confirm Deposit
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
