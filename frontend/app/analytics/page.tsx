'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Calendar,
  DollarSign,
  Percent,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Shield,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface PortfolioMetrics {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  totalEarnings: number;
  totalDeposited: number;
  averageAPY: number;
  activePositions: number;
}

interface AssetAllocation {
  asset: string;
  value: number;
  percentage: number;
  color: string;
}

interface PerformanceData {
  date: string;
  value: number;
}

interface EarningsData {
  month: string;
  lending: number;
  staking: number;
  fees: number;
}

export default function AnalyticsPage() {
  const [privacyMode, setPrivacyMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedChart, setSelectedChart] = useState<'portfolio' | 'earnings'>('portfolio');

  // Mock portfolio metrics
  const portfolioMetrics: PortfolioMetrics = {
    totalValue: 12450.89,
    totalChange24h: 342.56,
    totalChangePercent24h: 2.83,
    totalEarnings: 2450.89,
    totalDeposited: 10000.0,
    averageAPY: 6.8,
    activePositions: 4,
  };

  // Mock asset allocation
  const assetAllocation: AssetAllocation[] = [
    { asset: 'ETH', value: 8901.23, percentage: 71.5, color: '#8b5cf6' },
    { asset: 'USDC', value: 3549.66, percentage: 28.5, color: '#10b981' },
  ];

  // Mock performance data
  const performanceData: PerformanceData[] = [
    { date: '2025-09-01', value: 10000 },
    { date: '2025-09-05', value: 10250 },
    { date: '2025-09-10', value: 10580 },
    { date: '2025-09-15', value: 10920 },
    { date: '2025-09-20', value: 11340 },
    { date: '2025-09-25', value: 11850 },
    { date: '2025-09-30', value: 12450.89 },
  ];

  // Mock earnings data
  const earningsData: EarningsData[] = [
    { month: 'Jun', lending: 320, staking: 180, fees: 50 },
    { month: 'Jul', lending: 410, staking: 220, fees: 65 },
    { month: 'Aug', lending: 580, staking: 310, fees: 85 },
    { month: 'Sep', lending: 720, staking: 390, fees: 95 },
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const calculateROI = () => {
    return ((portfolioMetrics.totalEarnings / portfolioMetrics.totalDeposited) * 100).toFixed(2);
  };

  if (isLoading) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
        <div className='min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118] p-4 lg:p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='animate-pulse space-y-6'>
              <div className='h-8 bg-white/10 rounded mb-4 w-64'></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className='h-64 bg-white/10 rounded-xl loading-shimmer'></div>
              ))}
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
                <BarChart3 className='w-8 h-8 text-blue-400' />
                Portfolio Analytics
              </h1>
              <p className='text-gray-300 font-inter'>
                Track performance and earnings with privacy-preserving insights
              </p>
            </div>

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
              </button>
              <button className='px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center gap-2'>
                <Download className='w-4 h-4' />
                Export
              </button>
              <button className='p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'>
                <RefreshCw className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Total Portfolio Value */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-3'>
                <div className='w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center'>
                  <DollarSign className='w-6 h-6 text-white' />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    portfolioMetrics.totalChangePercent24h >= 0 ? 'text-encrypted' : 'text-error'
                  }`}
                >
                  {portfolioMetrics.totalChangePercent24h >= 0 ? (
                    <TrendingUp className='w-4 h-4' />
                  ) : (
                    <TrendingDown className='w-4 h-4' />
                  )}
                  {Math.abs(portfolioMetrics.totalChangePercent24h)}%
                </div>
              </div>
              <p className='text-white/70 text-sm mb-1'>Total Value</p>
              {privacyMode ? (
                <p className='text-white text-2xl font-bold font-jetbrains'>●●●●●●●●</p>
              ) : (
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  ${portfolioMetrics.totalValue.toLocaleString()}
                </p>
              )}
              <p
                className={`text-sm mt-2 ${portfolioMetrics.totalChange24h >= 0 ? 'text-encrypted' : 'text-error'}`}
              >
                {portfolioMetrics.totalChange24h >= 0 ? '+' : ''}$
                {Math.abs(portfolioMetrics.totalChange24h).toFixed(2)} today
              </p>
            </div>

            {/* Total Earnings */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-3'>
                <div className='w-12 h-12 bg-encrypted-gradient rounded-xl flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-white' />
                </div>
                <div className='flex items-center gap-1 text-sm font-medium text-encrypted'>
                  <ArrowUpRight className='w-4 h-4' />+{calculateROI()}%
                </div>
              </div>
              <p className='text-white/70 text-sm mb-1'>Total Earnings</p>
              {privacyMode ? (
                <p className='text-white text-2xl font-bold font-jetbrains'>●●●●●●●●</p>
              ) : (
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  ${portfolioMetrics.totalEarnings.toLocaleString()}
                </p>
              )}
              <p className='text-encrypted text-sm mt-2'>ROI: {calculateROI()}%</p>
            </div>

            {/* Average APY */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-3'>
                <div className='w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center'>
                  <Percent className='w-6 h-6 text-blue-400' />
                </div>
              </div>
              <p className='text-white/70 text-sm mb-1'>Average APY</p>
              <p className='text-white text-2xl font-bold font-space-grotesk'>
                {portfolioMetrics.averageAPY}%
              </p>
              <p className='text-blue-400 text-sm mt-2'>Across all positions</p>
            </div>

            {/* Active Positions */}
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-3'>
                <div className='w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center'>
                  <Activity className='w-6 h-6 text-purple-400' />
                </div>
              </div>
              <p className='text-white/70 text-sm mb-1'>Active Positions</p>
              <p className='text-white text-2xl font-bold font-space-grotesk'>
                {portfolioMetrics.activePositions}
              </p>
              <p className='text-purple-400 text-sm mt-2'>
                ${portfolioMetrics.totalDeposited.toLocaleString()} deposited
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div className='vault-card p-6'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6'>
              <div className='flex items-center gap-4'>
                <h2 className='text-xl font-bold text-white font-space-grotesk'>
                  Performance Overview
                </h2>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setSelectedChart('portfolio')}
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      selectedChart === 'portfolio'
                        ? 'bg-primary-gradient text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    Portfolio Value
                  </button>
                  <button
                    onClick={() => setSelectedChart('earnings')}
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      selectedChart === 'earnings'
                        ? 'bg-primary-gradient text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    Earnings
                  </button>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4 text-white/70' />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className='px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400'
                >
                  <option value='7d' className='bg-slate-800'>
                    Last 7 days
                  </option>
                  <option value='30d' className='bg-slate-800'>
                    Last 30 days
                  </option>
                  <option value='90d' className='bg-slate-800'>
                    Last 90 days
                  </option>
                  <option value='1y' className='bg-slate-800'>
                    Last year
                  </option>
                </select>
              </div>
            </div>

            {/* Simple Chart Visualization */}
            {selectedChart === 'portfolio' ? (
              <div className='relative h-64'>
                {privacyMode ? (
                  <div className='absolute inset-0 flex items-center justify-center bg-white/5 rounded-lg'>
                    <div className='text-center'>
                      <Shield className='w-12 h-12 text-white/50 mx-auto mb-3' />
                      <p className='text-white/70 text-sm'>Enable visibility to view chart data</p>
                    </div>
                  </div>
                ) : (
                  <div className='h-full flex items-end gap-2'>
                    {performanceData.map((point, index) => {
                      const maxValue = Math.max(...performanceData.map((p) => p.value));
                      const height = (point.value / maxValue) * 100;
                      return (
                        <div key={index} className='flex-1 flex flex-col items-center group'>
                          <div
                            className='w-full bg-primary-gradient rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer'
                            style={{ height: `${height}%` }}
                          >
                            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/10 rounded p-2 text-xs text-white text-center -mt-12 whitespace-nowrap'>
                              ${point.value.toLocaleString()}
                            </div>
                          </div>
                          <span className='text-xs text-white/50 mt-2'>
                            {new Date(point.date).getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className='relative h-64'>
                {privacyMode ? (
                  <div className='absolute inset-0 flex items-center justify-center bg-white/5 rounded-lg'>
                    <div className='text-center'>
                      <Shield className='w-12 h-12 text-white/50 mx-auto mb-3' />
                      <p className='text-white/70 text-sm'>
                        Enable visibility to view earnings data
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='h-full flex items-end gap-4'>
                    {earningsData.map((data, index) => {
                      const total = data.lending + data.staking + data.fees;
                      const maxTotal = Math.max(
                        ...earningsData.map((d) => d.lending + d.staking + d.fees),
                      );
                      return (
                        <div key={index} className='flex-1 flex flex-col items-center'>
                          <div className='w-full flex flex-col gap-1'>
                            <div
                              className='w-full bg-encrypted rounded-t transition-all duration-300 hover:opacity-80'
                              style={{
                                height: `${(data.lending / maxTotal) * 200}px`,
                                minHeight: '10px',
                              }}
                              title={`Lending: $${data.lending}`}
                            ></div>
                            <div
                              className='w-full bg-blue-500 transition-all duration-300 hover:opacity-80'
                              style={{
                                height: `${(data.staking / maxTotal) * 200}px`,
                                minHeight: '10px',
                              }}
                              title={`Staking: $${data.staking}`}
                            ></div>
                            <div
                              className='w-full bg-purple-500 transition-all duration-300 hover:opacity-80'
                              style={{
                                height: `${(data.fees / maxTotal) * 200}px`,
                                minHeight: '10px',
                              }}
                              title={`Fees: $${data.fees}`}
                            ></div>
                          </div>
                          <span className='text-xs text-white/50 mt-2'>{data.month}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!privacyMode && selectedChart === 'earnings' && (
                  <div className='flex items-center justify-center gap-6 mt-6'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-encrypted rounded'></div>
                      <span className='text-white/70 text-sm'>Lending</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-blue-500 rounded'></div>
                      <span className='text-white/70 text-sm'>Staking</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-purple-500 rounded'></div>
                      <span className='text-white/70 text-sm'>Fees</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Asset Allocation & Activity */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Asset Allocation */}
            <div className='vault-card p-6'>
              <h3 className='text-xl font-bold text-white mb-6 font-space-grotesk flex items-center gap-2'>
                <PieChart className='w-6 h-6' />
                Asset Allocation
              </h3>

              {privacyMode ? (
                <div className='flex items-center justify-center h-48 bg-white/5 rounded-lg'>
                  <div className='text-center'>
                    <Shield className='w-12 h-12 text-white/50 mx-auto mb-3' />
                    <p className='text-white/70 text-sm'>Enable visibility to view allocation</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Simple Pie Chart Representation */}
                  <div className='flex items-center justify-center mb-6'>
                    <div className='relative w-48 h-48'>
                      <svg className='w-full h-full' viewBox='0 0 100 100'>
                        <circle
                          cx='50'
                          cy='50'
                          r='40'
                          fill='none'
                          stroke={assetAllocation[0].color}
                          strokeWidth='20'
                          strokeDasharray={`${assetAllocation[0].percentage * 2.51} 251`}
                          transform='rotate(-90 50 50)'
                        />
                        <circle
                          cx='50'
                          cy='50'
                          r='40'
                          fill='none'
                          stroke={assetAllocation[1].color}
                          strokeWidth='20'
                          strokeDasharray={`${assetAllocation[1].percentage * 2.51} 251`}
                          strokeDashoffset={`-${assetAllocation[0].percentage * 2.51}`}
                          transform='rotate(-90 50 50)'
                        />
                      </svg>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='text-center'>
                          <p className='text-white text-2xl font-bold font-space-grotesk'>
                            {assetAllocation.length}
                          </p>
                          <p className='text-white/70 text-xs'>Assets</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    {assetAllocation.map((asset, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 bg-white/5 rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className='w-4 h-4 rounded-full'
                            style={{ backgroundColor: asset.color }}
                          ></div>
                          <span className='text-white font-semibold'>{asset.asset}</span>
                        </div>
                        <div className='text-right'>
                          <p className='text-white font-bold'>${asset.value.toLocaleString()}</p>
                          <p className='text-white/70 text-sm'>{asset.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Recent Activity Summary */}
            <div className='vault-card p-6'>
              <h3 className='text-xl font-bold text-white mb-6 font-space-grotesk flex items-center gap-2'>
                <Activity className='w-6 h-6' />
                Activity Summary
              </h3>

              <div className='space-y-4'>
                {[
                  {
                    label: 'Total Transactions',
                    value: '127',
                    icon: Activity,
                    color: 'text-blue-400',
                  },
                  {
                    label: 'Deposits',
                    value: privacyMode ? '●●●' : '$10,000',
                    icon: ArrowDownLeft,
                    color: 'text-green-400',
                  },
                  {
                    label: 'Withdrawals',
                    value: privacyMode ? '●●●' : '$2,450',
                    icon: ArrowUpRight,
                    color: 'text-red-400',
                  },
                  {
                    label: 'ZK Proofs Generated',
                    value: '127',
                    icon: Zap,
                    color: 'text-encrypted',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center'>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className='text-white/70'>{item.label}</span>
                    </div>
                    <span className='text-white font-bold text-lg'>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className='mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                  <Shield className='w-5 h-5 text-blue-400' />
                  <p className='text-blue-400 font-medium text-sm'>Privacy Score</p>
                </div>
                <p className='text-white text-2xl font-bold mb-1'>100%</p>
                <p className='text-white/70 text-sm'>All transactions encrypted with ZK proofs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
