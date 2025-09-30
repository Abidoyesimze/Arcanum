'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  MoreHorizontal,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Zap,
  Coins,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  valueUSD: number;
  icon: string;
  apy?: number;
  change24h: number;
}

interface ActivityItem {
  id: string;
  type: 'deposit' | 'withdraw' | 'lend' | 'borrow';
  asset: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  proofGenerated: boolean;
  txHash?: string;
}

export default function DashboardPage() {
  const [privacyMode, setPrivacyMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // User vault stats
  const vaultStats = {
    totalBalance: 12450.89,
    totalDeposited: 10000.0,
    totalEarned: 2450.89,
    privacyScore: 98,
    proofsGenerated: 127,
    activeLending: 5234.5,
  };

  // Mock assets in vault
  const vaultAssets: Asset[] = [
    {
      id: '1',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 5.234,
      valueUSD: 8901.23,
      icon: 'Ξ',
      apy: 4.2,
      change24h: 2.5,
    },
    {
      id: '2',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 3549.66,
      valueUSD: 3549.66,
      icon: '$',
      apy: 8.5,
      change24h: 0.1,
    },
  ];

  // Mock recent activities
  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'deposit',
      asset: 'ETH',
      amount: 2.5,
      timestamp: '2 hours ago',
      status: 'completed',
      proofGenerated: true,
      txHash: '0x1a2b3c4d5e6f7890',
    },
    {
      id: '2',
      type: 'lend',
      asset: 'USDC',
      amount: 1000,
      timestamp: '5 hours ago',
      status: 'completed',
      proofGenerated: true,
      txHash: '0x2b3c4d5e6f789012',
    },
    {
      id: '3',
      type: 'withdraw',
      asset: 'ETH',
      amount: 0.5,
      timestamp: '1 day ago',
      status: 'completed',
      proofGenerated: true,
      txHash: '0x3c4d5e6f78901234',
    },
    {
      id: '4',
      type: 'borrow',
      asset: 'USDC',
      amount: 500,
      timestamp: '2 days ago',
      status: 'pending',
      proofGenerated: false,
    },
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className='w-5 h-5 text-green-400' />;
      case 'withdraw':
        return <ArrowUpRight className='w-5 h-5 text-red-400' />;
      case 'lend':
        return <TrendingUp className='w-5 h-5 text-blue-400' />;
      case 'borrow':
        return <Download className='w-5 h-5 text-purple-400' />;
      default:
        return <Activity className='w-5 h-5' />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-encrypted';
      case 'pending':
        return 'status-public';
      case 'failed':
        return 'bg-error-red/10 text-error border border-error-red/30';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
        <div className='min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118] p-4 lg:p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='animate-pulse'>
              <div className='h-8 bg-white/10 rounded mb-4 w-64'></div>
              <div className='dashboard-grid'>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className='h-32 bg-white/10 rounded-xl loading-shimmer'></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
      <div className='min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118] p-4 lg:p-6'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Header */}
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2 font-space-grotesk flex items-center gap-3'>
                <Shield className='w-8 h-8 text-primary-purple' />
                Private Vaults
              </h1>
              <p className='text-gray-300 font-inter'>Manage your encrypted DeFi portfolio</p>
            </div>

            {/* Quick Actions */}
            <div className='flex gap-3'>
              <button
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  privacyMode
                    ? 'bg-encrypted text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {privacyMode ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                {privacyMode ? 'Hide' : 'Show'}
              </button>
              <button className='btn-primary px-6 py-3 flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Deposit
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='dashboard-grid'>
            {/* Total Balance */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center'>
                  <Shield className='w-6 h-6 text-white' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>Total Balance</p>
                {privacyMode ? (
                  <p className='text-white text-2xl font-bold font-jetbrains'>●●●●●●●●</p>
                ) : (
                  <p className='text-white text-2xl font-bold font-space-grotesk'>
                    ${vaultStats.totalBalance.toLocaleString()}
                  </p>
                )}
              </div>
              <div className='flex items-center gap-2 text-encrypted'>
                <ArrowUpRight className='w-4 h-4' />
                <span className='text-sm font-medium'>
                  +${vaultStats.totalEarned.toFixed(2)} this month
                </span>
              </div>
            </div>

            {/* Privacy Score */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-encrypted-gradient rounded-xl flex items-center justify-center'>
                  <Lock className='w-6 h-6 text-white' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>Privacy Score</p>
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  {vaultStats.privacyScore}%
                </p>
              </div>
              <div className='flex items-center gap-2 text-encrypted'>
                <CheckCircle className='w-4 h-4' />
                <span className='text-sm font-medium'>Fully protected</span>
              </div>
            </div>

            {/* ZK Proofs Generated */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-stark-gradient rounded-xl flex items-center justify-center'>
                  <Zap className='w-6 h-6 text-white' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>ZK Proofs</p>
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  {vaultStats.proofsGenerated}
                </p>
              </div>
              <div className='flex items-center gap-2 text-purple-400'>
                <Activity className='w-4 h-4' />
                <span className='text-sm font-medium'>All transactions verified</span>
              </div>
            </div>

            {/* Active Lending */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-warning-amber/20 border border-warning-amber/30 rounded-xl flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-warning' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>Active Lending</p>
                {privacyMode ? (
                  <p className='text-white text-2xl font-bold font-jetbrains'>●●●●●●</p>
                ) : (
                  <p className='text-white text-2xl font-bold font-space-grotesk'>
                    ${vaultStats.activeLending.toLocaleString()}
                  </p>
                )}
              </div>
              <div className='flex items-center gap-2 text-green-400'>
                <TrendingUp className='w-4 h-4' />
                <span className='text-sm font-medium'>Earning 8.5% APY</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Vault Assets */}
            <div className='lg:col-span-2'>
              <div className='vault-card p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-bold text-white font-space-grotesk'>Vault Assets</h2>
                  <div className='flex items-center gap-2'>
                    <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                      <RefreshCw className='w-4 h-4 text-white/70' />
                    </button>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className='px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400'
                    >
                      <option value='24h' className='bg-slate-800'>
                        Last 24h
                      </option>
                      <option value='7d' className='bg-slate-800'>
                        Last 7 days
                      </option>
                      <option value='30d' className='bg-slate-800'>
                        Last 30 days
                      </option>
                    </select>
                  </div>
                </div>

                <div className='space-y-4'>
                  {vaultAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className='p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4 flex-1'>
                          <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center flex-shrink-0'>
                            <span className='text-xl font-bold'>{asset.icon}</span>
                          </div>

                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <p className='text-white font-semibold'>{asset.symbol}</p>
                              <span className='text-gray-400 text-sm'>{asset.name}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  asset.change24h >= 0
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-red-500/10 text-red-400'
                                }`}
                              >
                                {asset.change24h >= 0 ? '+' : ''}
                                {asset.change24h}%
                              </span>
                            </div>
                            {privacyMode ? (
                              <p className='text-primary-purple font-jetbrains text-sm'>●●●●●●</p>
                            ) : (
                              <p className='text-gray-400 text-sm'>
                                {asset.balance} {asset.symbol} • ${asset.valueUSD.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className='text-right flex-shrink-0 ml-4'>
                          {asset.apy && (
                            <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg px-3 py-1 mb-2'>
                              <p className='text-encrypted font-semibold text-sm'>
                                {asset.apy}% APY
                              </p>
                            </div>
                          )}
                          <button className='btn-primary text-xs px-4 py-2'>Manage</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6 text-center'>
                  <button className='btn-encrypted px-6 py-3 flex items-center gap-2 mx-auto'>
                    <Plus className='w-4 h-4' />
                    Add More Assets
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='space-y-6'>
              {/* Privacy Status */}
              <div className='vault-card p-6'>
                <h3 className='text-lg font-bold text-white mb-4 font-space-grotesk'>
                  Privacy Status
                </h3>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>Balance Privacy</span>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-encrypted rounded-full animate-pulse'></div>
                      <span className='text-encrypted text-sm font-medium'>Protected</span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>Transaction Privacy</span>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-encrypted rounded-full animate-pulse'></div>
                      <span className='text-encrypted text-sm font-medium'>Encrypted</span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>ZK Proofs Active</span>
                    <span className='text-white text-sm font-medium'>
                      {vaultStats.proofsGenerated}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>Compliance Ready</span>
                    <span className='text-encrypted text-sm font-medium'>Yes</span>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-encrypted/10 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <Shield className='w-4 h-4 text-encrypted' />
                    <span className='text-encrypted text-sm font-medium'>All systems secure</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className='vault-card p-6'>
                <h3 className='text-lg font-bold text-white mb-4 font-space-grotesk'>
                  Quick Actions
                </h3>

                <div className='space-y-3'>
                  <button className='w-full p-3 bg-encrypted/10 hover:bg-encrypted/20 border border-encrypted/30 rounded-lg text-left transition-all duration-200'>
                    <div className='flex items-center gap-3'>
                      <Download className='w-5 h-5 text-encrypted' />
                      <div>
                        <p className='text-white font-medium text-sm'>Deposit Assets</p>
                        <p className='text-gray-400 text-xs'>Add funds to vault</p>
                      </div>
                    </div>
                  </button>

                  <button className='w-full p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-left transition-all duration-200'>
                    <div className='flex items-center gap-3'>
                      <TrendingUp className='w-5 h-5 text-primary-purple' />
                      <div>
                        <p className='text-white font-medium text-sm'>Start Lending</p>
                        <p className='text-gray-400 text-xs'>Earn interest privately</p>
                      </div>
                    </div>
                  </button>

                  <button className='w-full p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-left transition-all duration-200'>
                    <div className='flex items-center gap-3'>
                      <BarChart3 className='w-5 h-5 text-blue-400' />
                      <div>
                        <p className='text-white font-medium text-sm'>View Analytics</p>
                        <p className='text-gray-400 text-xs'>Portfolio insights</p>
                      </div>
                    </div>
                  </button>

                  <button className='w-full p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-left transition-all duration-200'>
                    <div className='flex items-center gap-3'>
                      <Coins className='w-5 h-5 text-orange-400' />
                      <div>
                        <p className='text-white font-medium text-sm'>Borrow Funds</p>
                        <p className='text-gray-400 text-xs'>Private collateral</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Compliance Alert */}
              <div className='vault-card p-6 bg-warning-amber/10 border-warning-amber/30'>
                <div className='flex items-center gap-3 mb-3'>
                  <AlertCircle className='w-5 h-5 text-warning-amber' />
                  <h3 className='text-warning-amber font-semibold text-sm'>Compliance Notice</h3>
                </div>
                <p className='text-white/70 text-xs mb-3'>
                  Institutional features require KYC verification to access advanced compliance
                  tools
                </p>
                <button className='w-full bg-warning-amber text-black text-sm font-medium py-2 rounded-lg hover:opacity-90 transition-opacity'>
                  Complete Verification
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='vault-card p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-white font-space-grotesk'>Recent Activity</h2>
              <button className='text-primary-purple hover:text-purple-400 transition-colors text-sm font-medium'>
                View All
              </button>
            </div>

            <div className='space-y-4'>
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className='p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4 flex-1'>
                      <div className='w-10 h-10 rounded-full flex items-center justify-center bg-white/10 flex-shrink-0'>
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1 flex-wrap'>
                          <p className='text-white font-medium capitalize'>{activity.type}</p>
                          <span className='text-gray-400 text-sm'>{activity.asset}</span>
                          {activity.proofGenerated && (
                            <span className='flex items-center gap-1 text-encrypted text-xs'>
                              <CheckCircle className='w-3 h-3' />
                              ZK Proof
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-3 text-xs text-gray-400'>
                          <span>{activity.timestamp}</span>
                          {activity.txHash && (
                            <button className='flex items-center gap-1 hover:text-primary-purple transition-colors'>
                              <span className='font-mono'>{activity.txHash}</span>
                              <ExternalLink className='w-3 h-3' />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='text-right flex-shrink-0 ml-4'>
                      {privacyMode ? (
                        <p className='text-primary-purple font-jetbrains mb-1'>●●●●</p>
                      ) : (
                        <p className='text-white font-semibold mb-1'>
                          {activity.type === 'withdraw' || activity.type === 'borrow' ? '-' : '+'}
                          {activity.amount} {activity.asset}
                        </p>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(activity.status)}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-6 text-center'>
              <button className='text-primary-purple hover:text-purple-400 transition-colors text-sm font-medium'>
                Load More Activities
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
