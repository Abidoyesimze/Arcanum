'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Zap,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  FileText,
  Coins,
} from 'lucide-react';
import AppLayout from './components/layout/AppLayout';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Protocol stats
  const stats = {
    tvl: '$548M',
    users: '12,500+',
    transactions: '450K+',
    proofs: '2.1M+',
  };

  return (
    <AppLayout showHeader={true} showSidebar={false} showFooter={true}>
      <div className='min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118]'>
        {/* Hero Section */}
        <section className='relative px-4 sm:px-6 lg:px-8 pt-20 pb-32 overflow-hidden'>
          {/* Background Effects */}
          <div className='absolute top-20 left-10 w-32 h-32 bg-primary-purple/20 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-40 h-40 bg-encrypted-green/20 rounded-full blur-3xl animate-pulse'></div>

          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              {/* Left Column - Content */}
              <div className={`fade-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className='flex items-center gap-2 mb-6'>
                  <div className='status-encrypted px-3 py-1 rounded-full text-sm font-medium'>
                    Built on Starknet L2
                  </div>
                  <div className='bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium'>
                    Zero-Knowledge Proofs
                  </div>
                </div>

                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-space-grotesk leading-tight'>
                  Private DeFi
                  <span className='block text-gradient-primary'>Without Compromise</span>
                </h1>

                <p className='text-xl text-gray-300 mb-8 leading-relaxed font-inter'>
                  Trade, lend, and borrow on Starknet with complete privacy.
                  <strong className='text-white'> Zero-knowledge proofs</strong> keep your portfolio
                  hidden while maintaining{' '}
                  <strong className='text-white'>full regulatory compliance</strong>.
                </p>

                {/* Key Benefits */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-encrypted/20 rounded-lg flex items-center justify-center'>
                      <Lock className='w-5 h-5 text-encrypted' />
                    </div>
                    <div>
                      <p className='text-white font-medium text-sm'>Hidden Balances</p>
                      <p className='text-gray-400 text-xs'>Fully private</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-primary-purple/20 rounded-lg flex items-center justify-center'>
                      <Shield className='w-5 h-5 text-primary-purple' />
                    </div>
                    <div>
                      <p className='text-white font-medium text-sm'>ZK Proofs</p>
                      <p className='text-gray-400 text-xs'>Cryptographically secure</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-warning-amber/20 rounded-lg flex items-center justify-center'>
                      <CheckCircle className='w-5 h-5 text-warning' />
                    </div>
                    <div>
                      <p className='text-white font-medium text-sm'>Compliant</p>
                      <p className='text-gray-400 text-xs'>Regulatory ready</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                  <button className='btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3'>
                    <Shield className='w-5 h-5' />
                    Launch App
                    <ArrowRight className='w-5 h-5' />
                  </button>

                  <button className='flex items-center justify-center gap-3 px-8 py-4 rounded-xl border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-200'>
                    <FileText className='w-5 h-5' />
                    Read Docs
                  </button>
                </div>

                {/* Protocol Stats */}
                <div className='flex items-center gap-6 text-sm text-gray-400'>
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='w-4 h-4' />
                    <span>{stats.tvl} TVL</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4' />
                    <span>{stats.users} users</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Activity className='w-4 h-4' />
                    <span>{stats.proofs} proofs</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Privacy Demo */}
              <div className={`slide-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className='bg-glass rounded-2xl p-8 backdrop-blur-xl border border-purple-500/10'>
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-2xl font-bold text-white font-space-grotesk'>
                      Your Private Vault
                    </h3>
                    <button
                      onClick={() => setPrivacyMode(!privacyMode)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        privacyMode ? 'bg-encrypted text-white' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {privacyMode ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                    </button>
                  </div>

                  {/* Balance Display */}
                  <div className='mb-6'>
                    <label className='block text-white/70 text-sm mb-2'>Total Balance</label>
                    <div className='bg-white/5 border border-white/20 rounded-xl p-6'>
                      {privacyMode ? (
                        <div className='text-4xl font-bold font-jetbrains text-gradient-primary'>
                          ●●●●●●●●
                        </div>
                      ) : (
                        <div>
                          <div className='text-4xl font-bold text-white font-space-grotesk'>
                            $12,450.89
                          </div>
                          <div className='text-gray-400 text-sm mt-1'>≈ 7.234 ETH</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assets Breakdown */}
                  <div className='space-y-3 mb-6'>
                    <div className='flex items-center justify-between p-4 bg-white/5 rounded-lg'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center'>
                          <span className='text-sm'>Ξ</span>
                        </div>
                        <span className='text-white font-medium'>ETH</span>
                      </div>
                      <div className='text-right'>
                        {privacyMode ? (
                          <span className='text-primary-purple font-jetbrains'>●●●●</span>
                        ) : (
                          <>
                            <p className='text-white font-semibold'>5.234 ETH</p>
                            <p className='text-gray-400 text-xs'>$8,901.23</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center justify-between p-4 bg-white/5 rounded-lg'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center'>
                          <span className='text-sm'>$</span>
                        </div>
                        <span className='text-white font-medium'>USDC</span>
                      </div>
                      <div className='text-right'>
                        {privacyMode ? (
                          <span className='text-primary-purple font-jetbrains'>●●●●</span>
                        ) : (
                          <>
                            <p className='text-white font-semibold'>3,549.66</p>
                            <p className='text-gray-400 text-xs'>$3,549.66</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Privacy Status */}
                  <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-4 mb-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Shield className='w-5 h-5 text-encrypted' />
                        <span className='text-encrypted font-medium text-sm'>Privacy Status</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-encrypted rounded-full animate-pulse'></div>
                        <span className='text-encrypted text-sm font-semibold'>Protected</span>
                      </div>
                    </div>
                    <p className='text-white/60 text-xs mt-2'>
                      All balances hidden with zero-knowledge proofs
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className='grid grid-cols-2 gap-3'>
                    <button className='btn-encrypted py-3 text-sm'>Deposit</button>
                    <button className='btn-primary py-3 text-sm'>Start Trading</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-black/20'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk'>
                How Arcanum Works
              </h2>
              <p className='text-xl text-gray-300 font-inter'>
                Privacy-preserving DeFi in three simple steps
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Step 1 */}
              <div className='text-center group'>
                <div className='w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200'>
                  <Lock className='w-8 h-8 text-white' />
                </div>
                <div className='w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 bg-primary-purple'>
                  1
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Create Private Vault
                </h3>
                <p className='text-gray-300 font-inter'>
                  Deposit assets into encrypted vaults. Balances are hidden using cryptographic
                  commitments.
                </p>
              </div>

              {/* Step 2 */}
              <div className='text-center group'>
                <div className='w-16 h-16 bg-encrypted-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200'>
                  <Shield className='w-8 h-8 text-white' />
                </div>
                <div className='w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 bg-encrypted'>
                  2
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Trade Privately
                </h3>
                <p className='text-gray-300 font-inter'>
                  Lend, borrow, and trade without exposing amounts. Zero-knowledge proofs verify
                  transactions.
                </p>
              </div>

              {/* Step 3 */}
              <div className='text-center group'>
                <div className='w-16 h-16 bg-stark-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200'>
                  <CheckCircle className='w-8 h-8 text-white' />
                </div>
                <div className='w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 bg-warning-amber'>
                  3
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Stay Compliant
                </h3>
                <p className='text-gray-300 font-inter'>
                  Generate compliance proofs for regulators without exposing your full portfolio
                  details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk'>
                Why Choose Arcanum?
              </h2>
              <p className='text-xl text-gray-300 font-inter'>
                Privacy meets regulatory compliance
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Feature 1 */}
              <div className='vault-card p-8 text-center'>
                <div className='w-16 h-16 bg-encrypted-gradient rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Lock className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Hidden Balances
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Your portfolio balances and transaction amounts remain completely private using
                  cryptographic commitments.
                </p>
                <div className='bg-encrypted/10 rounded-lg p-3'>
                  <p className='text-encrypted text-sm font-medium'>🔒 100% Private by Default</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className='vault-card p-8 text-center'>
                <div className='w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Shield className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Zero-Knowledge Proofs
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Prove you have sufficient funds or meet requirements without revealing exact
                  amounts or portfolio details.
                </p>
                <div className='bg-purple-500/10 rounded-lg p-3'>
                  <p className='text-primary-purple text-sm font-medium'>⚡ Powered by Starknet</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className='vault-card p-8 text-center'>
                <div className='w-16 h-16 bg-stark-gradient rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Zap className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Lightning Fast
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Built on Starknet L2 for instant transactions with minimal fees while maintaining
                  strong privacy guarantees.
                </p>
                <div className='bg-blue-500/10 rounded-lg p-3'>
                  <p className='text-blue-400 text-sm font-medium'>
                    ⚡ {'< 0.01$ per transaction'}
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className='vault-card p-8 text-center'>
                <div className='w-16 h-16 bg-warning-amber/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-warning-amber/30'>
                  <FileText className='w-8 h-8 text-warning' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Regulatory Compliance
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Generate selective disclosure proofs for regulators while keeping sensitive data
                  private from public view.
                </p>
                <div className='bg-warning-amber/10 rounded-lg p-3'>
                  <p className='text-warning text-sm font-medium'>✓ SEC/GDPR Ready</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className='vault-card p-8 text-center'>
                <div className='w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30'>
                  <Coins className='w-8 h-8 text-green-400' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Private Lending
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Lend and borrow without revealing your collateral amounts or borrowing capacity to
                  other market participants.
                </p>
                <div className='bg-green-500/10 rounded-lg p-3'>
                  <p className='text-green-400 text-sm font-medium'>💰 Competitive rates</p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className='vault-card p-8 text-center'>
                <div className='w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30'>
                  <BarChart3 className='w-8 h-8 text-red-400' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  MEV Protection
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Prevent front-running and sandwich attacks by keeping transaction amounts and
                  strategies completely private.
                </p>
                <div className='bg-red-500/10 rounded-lg p-3'>
                  <p className='text-red-400 text-sm font-medium'>🛡️ Anti-MEV by design</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-primary-gradient'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk'>
              Ready to Experience Private DeFi?
            </h2>
            <p className='text-xl text-white/90 mb-8 font-inter'>
              Join thousands of users protecting their financial privacy on Starknet
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-white text-purple-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-3'>
                <Shield className='w-5 h-5' />
                Launch App
              </button>
              <button className='border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-colors duration-200'>
                Read Documentation
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
