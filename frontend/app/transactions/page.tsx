'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Shield,
  TrendingUp,
  Coins,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'lend' | 'borrow';
  asset: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  proofGenerated: boolean;
  proofHash?: string;
  txHash?: string;
  gasUsed?: string;
  privacyLevel: 'full' | 'partial' | 'public';
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-2025-001',
      type: 'deposit',
      asset: 'ETH',
      amount: 2.5,
      timestamp: '2025-09-30T14:30:00Z',
      status: 'completed',
      proofGenerated: true,
      proofHash: '0x1a2b3c4d5e6f7890abcdef',
      txHash: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      gasUsed: '0.0012 ETH',
      privacyLevel: 'full',
    },
    {
      id: 'TXN-2025-002',
      type: 'lend',
      asset: 'USDC',
      amount: 1000,
      timestamp: '2025-09-29T18:15:00Z',
      status: 'completed',
      proofGenerated: true,
      proofHash: '0x2b3c4d5e6f7890abcdef12',
      txHash: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      gasUsed: '0.0008 ETH',
      privacyLevel: 'full',
    },
    {
      id: 'TXN-2025-003',
      type: 'withdraw',
      asset: 'ETH',
      amount: 0.5,
      timestamp: '2025-09-28T10:20:00Z',
      status: 'completed',
      proofGenerated: true,
      proofHash: '0x3c4d5e6f7890abcdef1234',
      txHash: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
      gasUsed: '0.0015 ETH',
      privacyLevel: 'full',
    },
    {
      id: 'TXN-2025-004',
      type: 'borrow',
      asset: 'USDC',
      amount: 500,
      timestamp: '2025-09-27T16:45:00Z',
      status: 'pending',
      proofGenerated: false,
      privacyLevel: 'partial',
    },
    {
      id: 'TXN-2025-005',
      type: 'deposit',
      asset: 'DAI',
      amount: 750,
      timestamp: '2025-09-26T12:10:00Z',
      status: 'failed',
      proofGenerated: false,
      privacyLevel: 'public',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, statusFilter, typeFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-5 h-5 text-encrypted' />;
      case 'pending':
        return <Clock className='w-5 h-5 text-warning' />;
      case 'failed':
        return <XCircle className='w-5 h-5 text-error' />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'completed':
        return `${baseClasses} status-encrypted`;
      case 'pending':
        return `${baseClasses} status-public`;
      case 'failed':
        return `${baseClasses} bg-error-red/10 text-error border border-error-red/30`;
      default:
        return baseClasses;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className='w-5 h-5 text-green-400' />;
      case 'withdraw':
        return <ArrowUpRight className='w-5 h-5 text-red-400' />;
      case 'lend':
        return <TrendingUp className='w-5 h-5 text-blue-400' />;
      case 'borrow':
        return <Coins className='w-5 h-5 text-purple-400' />;
      default:
        return <Activity className='w-5 h-5' />;
    }
  };

  const getPrivacyBadge = (level: string) => {
    switch (level) {
      case 'full':
        return <span className='status-encrypted text-xs px-2 py-0.5 rounded'>Full Privacy</span>;
      case 'partial':
        return <span className='status-public text-xs px-2 py-0.5 rounded'>Partial Privacy</span>;
      case 'public':
        return (
          <span className='bg-gray-500/10 text-gray-400 border border-gray-500/30 text-xs px-2 py-0.5 rounded'>
            Public
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
        <div className='min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118] p-4 lg:p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='animate-pulse space-y-6'>
              <div className='h-8 bg-white/10 rounded mb-4 w-64'></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='h-20 bg-white/10 rounded-xl loading-shimmer'></div>
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
                <Activity className='w-8 h-8 text-primary-purple' />
                Transaction History
              </h1>
              <p className='text-gray-300 font-inter'>View all your private vault activities</p>
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

          {/* Summary Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='vault-card p-6 text-center'>
              <div className='w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center mx-auto mb-3'>
                <Activity className='w-6 h-6 text-white' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                {transactions.length}
              </p>
              <p className='text-gray-400 text-sm'>Total Transactions</p>
            </div>

            <div className='vault-card p-6 text-center'>
              <div className='w-12 h-12 bg-encrypted-gradient rounded-xl flex items-center justify-center mx-auto mb-3'>
                <CheckCircle className='w-6 h-6 text-white' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                {transactions.filter((tx) => tx.status === 'completed').length}
              </p>
              <p className='text-gray-400 text-sm'>Completed</p>
            </div>

            <div className='vault-card p-6 text-center'>
              <div className='w-12 h-12 bg-warning-amber/20 border border-warning-amber/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
                <Clock className='w-6 h-6 text-warning' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                {transactions.filter((tx) => tx.status === 'pending').length}
              </p>
              <p className='text-gray-400 text-sm'>Pending</p>
            </div>

            <div className='vault-card p-6 text-center'>
              <div className='w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
                <Shield className='w-6 h-6 text-primary-purple' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                {transactions.filter((tx) => tx.proofGenerated).length}
              </p>
              <p className='text-gray-400 text-sm'>ZK Proofs</p>
            </div>
          </div>

          {/* Filters */}
          <div className='vault-card p-6'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {/* Search */}
              <div className='md:col-span-2 relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search by ID, asset, or transaction hash...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors'
                >
                  <option value='all' className='bg-slate-800'>
                    All Types
                  </option>
                  <option value='deposit' className='bg-slate-800'>
                    Deposits
                  </option>
                  <option value='withdraw' className='bg-slate-800'>
                    Withdrawals
                  </option>
                  <option value='lend' className='bg-slate-800'>
                    Lending
                  </option>
                  <option value='borrow' className='bg-slate-800'>
                    Borrowing
                  </option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors'
                >
                  <option value='all' className='bg-slate-800'>
                    All Status
                  </option>
                  <option value='completed' className='bg-slate-800'>
                    Completed
                  </option>
                  <option value='pending' className='bg-slate-800'>
                    Pending
                  </option>
                  <option value='failed' className='bg-slate-800'>
                    Failed
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className='vault-card p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-white font-space-grotesk'>
                Transactions ({filteredTransactions.length})
              </h2>
              <div className='flex items-center gap-2'>
                <Filter className='w-4 h-4 text-white/70' />
                <span className='text-white/70 text-sm'>Filters applied</span>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className='text-center py-12'>
                <Activity className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-400 text-lg font-inter'>No transactions found</p>
                <p className='text-gray-500 text-sm font-inter'>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className='p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200'
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowDetails(true);
                    }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4 flex-1'>
                        {/* Type Icon */}
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 rounded-full flex items-center justify-center bg-white/10'>
                            {getTypeIcon(transaction.type)}
                          </div>
                          {getStatusIcon(transaction.status)}
                        </div>

                        {/* Transaction Details */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-2 flex-wrap'>
                            <p className='text-white font-semibold capitalize'>
                              {transaction.type}
                            </p>
                            <span className='text-gray-400'>{transaction.asset}</span>
                            {transaction.proofGenerated && (
                              <span className='flex items-center gap-1 text-encrypted text-xs'>
                                <Shield className='w-3 h-3' />
                                ZK Proof
                              </span>
                            )}
                            {getPrivacyBadge(transaction.privacyLevel)}
                          </div>
                          <div className='flex items-center gap-4 text-xs text-gray-400'>
                            <span>{formatDate(transaction.timestamp)}</span>
                            <span className='font-mono'>#{transaction.id}</span>
                            <span className={getStatusBadge(transaction.status)}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-6 flex-shrink-0 ml-4'>
                        {/* Amount */}
                        <div className='text-right'>
                          {privacyMode ? (
                            <p className='text-primary-purple font-jetbrains text-lg'>●●●●●●</p>
                          ) : (
                            <p className='text-white font-bold text-lg'>
                              {transaction.type === 'withdraw' || transaction.type === 'borrow'
                                ? '-'
                                : '+'}
                              {transaction.amount} {transaction.asset}
                            </p>
                          )}
                        </div>

                        {/* View Details */}
                        <button
                          className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(transaction);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className='w-4 h-4 text-white/70' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-glass backdrop-blur-xl'>
              <div className='flex items-center gap-3'>
                {getStatusIcon(selectedTransaction.status)}
                <h3 className='text-xl font-bold text-white font-space-grotesk'>
                  Transaction Details
                </h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className='p-2 hover:bg-white/10 rounded-lg transition-colors'
              >
                <div className='w-6 h-6 text-white/70'>✕</div>
              </button>
            </div>

            <div className='p-6 space-y-6'>
              {/* Status Badge */}
              <div className='text-center'>
                <span className={`${getStatusBadge(selectedTransaction.status)} text-lg px-4 py-2`}>
                  {selectedTransaction.status.charAt(0).toUpperCase() +
                    selectedTransaction.status.slice(1)}
                </span>
              </div>

              {/* Amount Section */}
              <div className='bg-white/5 rounded-xl p-6 text-center'>
                <p className='text-gray-400 text-sm mb-2 capitalize'>
                  {selectedTransaction.type} Amount
                </p>
                {privacyMode ? (
                  <p className='text-white text-3xl font-bold font-jetbrains mb-2'>●●●●●●●●</p>
                ) : (
                  <p className='text-white text-3xl font-bold font-space-grotesk mb-2'>
                    {selectedTransaction.amount} {selectedTransaction.asset}
                  </p>
                )}
                {getPrivacyBadge(selectedTransaction.privacyLevel)}
              </div>

              {/* Transaction Info */}
              <div>
                <h4 className='text-white font-semibold mb-3'>Transaction Information</h4>
                <div className='bg-white/5 rounded-lg p-4 space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Transaction ID</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-white font-mono text-sm'>{selectedTransaction.id}</span>
                      <button
                        onClick={() => copyToClipboard(selectedTransaction.id)}
                        className='p-1 hover:bg-white/10 rounded transition-colors'
                      >
                        <Copy className='w-3 h-3 text-white/70' />
                      </button>
                    </div>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Type</span>
                    <span className='text-white capitalize'>{selectedTransaction.type}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Asset</span>
                    <span className='text-white'>{selectedTransaction.asset}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Timestamp</span>
                    <span className='text-white'>{formatDate(selectedTransaction.timestamp)}</span>
                  </div>

                  {selectedTransaction.txHash && (
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-400'>Blockchain Tx</span>
                      <div className='flex items-center gap-2'>
                        <span className='text-white font-mono text-sm'>
                          {selectedTransaction.txHash.slice(0, 10)}...
                          {selectedTransaction.txHash.slice(-8)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.txHash!)}
                          className='p-1 hover:bg-white/10 rounded transition-colors'
                        >
                          <Copy className='w-3 h-3 text-white/70' />
                        </button>
                        <a
                          href={`https://starkscan.co/tx/${selectedTransaction.txHash}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-1 hover:bg-white/10 rounded transition-colors'
                        >
                          <ExternalLink className='w-3 h-3 text-white/70' />
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedTransaction.gasUsed && (
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Gas Used</span>
                      <span className='text-white'>{selectedTransaction.gasUsed}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ZK Proof Info */}
              {selectedTransaction.proofGenerated && selectedTransaction.proofHash && (
                <div>
                  <h4 className='text-white font-semibold mb-3'>Zero-Knowledge Proof</h4>
                  <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-4'>
                    <div className='flex items-center gap-3 mb-3'>
                      <Shield className='w-5 h-5 text-encrypted' />
                      <span className='text-encrypted font-medium'>Proof Generated</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-gray-400 text-sm'>Proof Hash</span>
                      <div className='flex items-center gap-2'>
                        <span className='text-white font-mono text-sm'>
                          {selectedTransaction.proofHash}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.proofHash!)}
                          className='p-1 hover:bg-white/10 rounded transition-colors'
                        >
                          <Copy className='w-3 h-3 text-white/70' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className='flex gap-3'>
                {selectedTransaction.status === 'failed' && (
                  <button className='flex-1 btn-primary py-3'>Retry Transaction</button>
                )}

                <button
                  onClick={() => {
                    /* Implement receipt download */
                  }}
                  className='flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center justify-center gap-2'
                >
                  <Download className='w-4 h-4' />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
