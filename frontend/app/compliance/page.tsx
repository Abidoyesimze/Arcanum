'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
  FileText,
  Download,
  Eye,
  EyeOff,
  Clock,
  TrendingUp,
  User,
  Building,
  Globe,
  RefreshCw,
  ExternalLink,
  Zap,
  Info,
  Award,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface ComplianceStatus {
  category: string;
  status: 'verified' | 'pending' | 'required' | 'not_required';
  lastUpdated?: string;
  expiryDate?: string;
  description: string;
}

interface ComplianceProof {
  id: string;
  type: string;
  description: string;
  generatedAt: string;
  validUntil: string;
  status: 'active' | 'expired';
  proofHash: string;
}

interface AuditTrail {
  id: string;
  action: string;
  timestamp: string;
  type: 'deposit' | 'withdraw' | 'lend' | 'borrow';
  amount: string;
  complianceScore: number;
}

export default function CompliancePage() {
  const [privacyMode, setPrivacyMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'proofs' | 'audit' | 'reports'>(
    'overview',
  );
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedProofType, setSelectedProofType] = useState('');

  const complianceScore = 98;

  const complianceStatuses: ComplianceStatus[] = [
    {
      category: 'Identity Verification',
      status: 'verified',
      lastUpdated: '2025-09-15',
      expiryDate: '2026-09-15',
      description: 'KYC verification complete',
    },
    {
      category: 'Source of Funds',
      status: 'verified',
      lastUpdated: '2025-09-20',
      description: 'Clean fund verification',
    },
    {
      category: 'AML Screening',
      status: 'verified',
      lastUpdated: '2025-09-25',
      description: 'Anti-money laundering check passed',
    },
    {
      category: 'Institutional Accreditation',
      status: 'pending',
      description: 'Pending institutional investor verification',
    },
    {
      category: 'Tax Reporting',
      status: 'verified',
      lastUpdated: '2025-09-01',
      description: 'Tax compliance documentation submitted',
    },
    {
      category: 'Geographic Compliance',
      status: 'verified',
      lastUpdated: '2025-09-30',
      description: 'Region: United States (Permitted)',
    },
  ];

  const complianceProofs: ComplianceProof[] = [
    {
      id: 'proof-001',
      type: 'Portfolio Balance Threshold',
      description: 'Proof that portfolio value exceeds $10,000 without revealing exact amount',
      generatedAt: '2025-09-28',
      validUntil: '2025-10-28',
      status: 'active',
      proofHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
    },
    {
      id: 'proof-002',
      type: 'No Sanctioned Entities',
      description: 'Proof of no transactions with sanctioned addresses',
      generatedAt: '2025-09-25',
      validUntil: '2025-10-25',
      status: 'active',
      proofHash: '0x2b3c4d5e6f7890abcdef1234567890ab',
    },
    {
      id: 'proof-003',
      type: 'Source of Funds',
      description: 'Verification of legitimate fund sources',
      generatedAt: '2025-09-20',
      validUntil: '2025-10-20',
      status: 'active',
      proofHash: '0x3c4d5e6f7890abcdef1234567890abcd',
    },
  ];

  const auditTrail: AuditTrail[] = [
    {
      id: 'audit-001',
      action: 'Deposit to vault',
      timestamp: '2025-09-30T14:30:00Z',
      type: 'deposit',
      amount: '2.5 ETH',
      complianceScore: 100,
    },
    {
      id: 'audit-002',
      action: 'Lend to Vesu pool',
      timestamp: '2025-09-29T18:15:00Z',
      type: 'lend',
      amount: '1000 USDC',
      complianceScore: 98,
    },
    {
      id: 'audit-003',
      action: 'Withdraw from vault',
      timestamp: '2025-09-28T10:20:00Z',
      type: 'withdraw',
      amount: '0.5 ETH',
      complianceScore: 100,
    },
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'status-encrypted';
      case 'pending':
        return 'status-public';
      case 'required':
        return 'bg-error-red/10 text-error border border-error-red/30';
      case 'not_required':
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/30';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className='w-5 h-5 text-encrypted' />;
      case 'pending':
        return <Clock className='w-5 h-5 text-warning' />;
      case 'required':
        return <AlertCircle className='w-5 h-5 text-error' />;
      default:
        return <Info className='w-5 h-5 text-gray-400' />;
    }
  };

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setShowProofModal(false);
      setSelectedProofType('');
    } catch (error) {
      console.error('Proof generation failed:', error);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
              {[1, 2, 3].map((i) => (
                <div key={i} className='h-32 bg-white/10 rounded-xl loading-shimmer'></div>
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
                <Shield className='w-8 h-8 text-encrypted' />
                Compliance Dashboard
              </h1>
              <p className='text-gray-300 font-inter'>
                Manage regulatory compliance and generate selective disclosure proofs
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
              <button className='btn-encrypted px-6 py-3 flex items-center gap-2'>
                <Download className='w-4 h-4' />
                Export Report
              </button>
            </div>
          </div>

          {/* Compliance Score Card */}
          <div className='vault-card p-8'>
            <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
              <div className='flex items-center gap-6'>
                <div className='w-24 h-24 bg-encrypted-gradient rounded-full flex items-center justify-center'>
                  <Award className='w-12 h-12 text-white' />
                </div>
                <div>
                  <h2 className='text-3xl font-bold text-white mb-2 font-space-grotesk'>
                    Compliance Score
                  </h2>
                  <p className='text-gray-300'>Overall regulatory compliance status</p>
                </div>
              </div>

              <div className='text-center'>
                <div className='text-6xl font-bold text-encrypted mb-2'>{complianceScore}%</div>
                <div className='flex items-center gap-2 justify-center'>
                  <CheckCircle className='w-5 h-5 text-encrypted' />
                  <span className='text-encrypted font-medium'>Fully Compliant</span>
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <div className='w-full h-3 bg-white/10 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-encrypted-gradient'
                  style={{ width: `${complianceScore}%` }}
                ></div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
              <div className='bg-white/5 rounded-lg p-4'>
                <div className='flex items-center gap-3 mb-2'>
                  <CheckCircle className='w-5 h-5 text-encrypted' />
                  <span className='text-white/70 text-sm'>Verified Items</span>
                </div>
                <p className='text-white text-2xl font-bold'>
                  {complianceStatuses.filter((s) => s.status === 'verified').length}
                </p>
              </div>

              <div className='bg-white/5 rounded-lg p-4'>
                <div className='flex items-center gap-3 mb-2'>
                  <Clock className='w-5 h-5 text-warning' />
                  <span className='text-white/70 text-sm'>Pending</span>
                </div>
                <p className='text-white text-2xl font-bold'>
                  {complianceStatuses.filter((s) => s.status === 'pending').length}
                </p>
              </div>

              <div className='bg-white/5 rounded-lg p-4'>
                <div className='flex items-center gap-3 mb-2'>
                  <Shield className='w-5 h-5 text-blue-400' />
                  <span className='text-white/70 text-sm'>Active Proofs</span>
                </div>
                <p className='text-white text-2xl font-bold'>{complianceProofs.length}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex gap-2 overflow-x-auto'>
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'proofs', label: 'ZK Proofs', icon: Lock },
              { id: 'audit', label: 'Audit Trail', icon: FileText },
              { id: 'reports', label: 'Reports', icon: Download },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'bg-primary-gradient text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <tab.icon className='w-4 h-4' />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <div className='space-y-6'>
              <div className='vault-card p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-xl font-bold text-white font-space-grotesk flex items-center gap-2'>
                    <User className='w-6 h-6' />
                    Verification Status
                  </h3>
                  <button className='text-primary-purple hover:text-purple-400 transition-colors text-sm flex items-center gap-1'>
                    <RefreshCw className='w-4 h-4' />
                    Refresh
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {complianceStatuses.map((item, index) => (
                    <div
                      key={index}
                      className='p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          {getStatusIcon(item.status)}
                          <div>
                            <p className='text-white font-semibold'>{item.category}</p>
                            <p className='text-gray-400 text-sm'>{item.description}</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {item.lastUpdated && (
                        <div className='flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-white/10'>
                          <span>Updated: {formatDate(item.lastUpdated)}</span>
                          {item.expiryDate && <span>Expires: {formatDate(item.expiryDate)}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className='vault-card p-6'>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk flex items-center gap-2'>
                  <Building className='w-6 h-6' />
                  Institutional Features
                </h3>

                <div className='bg-warning-amber/10 border border-warning-amber/30 rounded-lg p-6 mb-6'>
                  <div className='flex items-start gap-3'>
                    <AlertCircle className='w-5 h-5 text-warning mt-1 flex-shrink-0' />
                    <div>
                      <p className='text-warning font-medium mb-2'>
                        Institutional Accreditation Pending
                      </p>
                      <p className='text-white/70 text-sm mb-4'>
                        Complete institutional verification to unlock advanced compliance tools,
                        multi-signature support, and dedicated compliance reporting.
                      </p>
                      <button className='btn-primary px-6 py-2 text-sm'>
                        Complete Verification
                      </button>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='bg-white/5 rounded-lg p-4'>
                    <Globe className='w-8 h-8 text-blue-400 mb-3' />
                    <p className='text-white font-semibold mb-2'>Multi-Jurisdiction Support</p>
                    <p className='text-gray-400 text-sm'>
                      Compliance for US, EU, and APAC regulations
                    </p>
                  </div>

                  <div className='bg-white/5 rounded-lg p-4'>
                    <FileText className='w-8 h-8 text-purple-400 mb-3' />
                    <p className='text-white font-semibold mb-2'>Automated Reporting</p>
                    <p className='text-gray-400 text-sm'>Generate audit reports for regulators</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'proofs' && (
            <div className='space-y-6'>
              <div className='vault-card p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-xl font-bold text-white font-space-grotesk'>
                    Compliance Proofs
                  </h3>
                  <button
                    onClick={() => setShowProofModal(true)}
                    className='btn-encrypted px-6 py-3 flex items-center gap-2'
                  >
                    <Zap className='w-4 h-4' />
                    Generate New Proof
                  </button>
                </div>

                <div className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6'>
                  <div className='flex items-start gap-3'>
                    <Info className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                    <div>
                      <p className='text-blue-400 font-medium text-sm'>
                        Zero-Knowledge Compliance Proofs
                      </p>
                      <p className='text-white/70 text-sm mt-1'>
                        Generate cryptographic proofs that verify regulatory requirements without
                        revealing sensitive portfolio details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  {complianceProofs.map((proof) => (
                    <div
                      key={proof.id}
                      className='p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200'
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-3 mb-2'>
                            <Lock className='w-5 h-5 text-encrypted' />
                            <h4 className='text-white font-semibold text-lg'>{proof.type}</h4>
                            <span className='status-encrypted text-xs px-2 py-1 rounded'>
                              {proof.status}
                            </span>
                          </div>
                          <p className='text-gray-400 text-sm mb-3'>{proof.description}</p>

                          <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                              <p className='text-white/70 mb-1'>Generated</p>
                              <p className='text-white'>{formatDate(proof.generatedAt)}</p>
                            </div>
                            <div>
                              <p className='text-white/70 mb-1'>Valid Until</p>
                              <p className='text-white'>{formatDate(proof.validUntil)}</p>
                            </div>
                          </div>

                          <div className='mt-3 pt-3 border-t border-white/10'>
                            <p className='text-white/70 text-xs mb-1'>Proof Hash</p>
                            <div className='flex items-center gap-2'>
                              <p className='text-white font-mono text-sm'>{proof.proofHash}</p>
                              <button
                                onClick={() => copyToClipboard(proof.proofHash)}
                                className='p-1 hover:bg-white/10 rounded transition-colors'
                              >
                                <Copy className='w-3 h-3 text-white/70' />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className='flex flex-col gap-2 ml-4'>
                          <button className='p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors'>
                            <Download className='w-4 h-4 text-white' />
                          </button>
                          <button className='p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors'>
                            <ExternalLink className='w-4 h-4 text-white' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'audit' && (
            <div className='vault-card p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-white font-space-grotesk'>
                  Compliance Audit Trail
                </h3>
                <button className='text-primary-purple hover:text-purple-400 transition-colors text-sm flex items-center gap-1'>
                  <Download className='w-4 h-4' />
                  Export CSV
                </button>
              </div>

              <div className='space-y-4'>
                {auditTrail.map((entry) => (
                  <div
                    key={entry.id}
                    className='p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4 flex-1'>
                        <div className='w-10 h-10 rounded-full flex items-center justify-center bg-white/10'>
                          <TrendingUp className='w-5 h-5 text-encrypted' />
                        </div>

                        <div className='flex-1'>
                          <p className='text-white font-medium'>{entry.action}</p>
                          <div className='flex items-center gap-4 text-xs text-gray-400 mt-1'>
                            <span>{formatDate(entry.timestamp)}</span>
                            <span className='font-mono'>#{entry.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className='text-right flex-shrink-0 ml-4'>
                        {privacyMode ? (
                          <p className='text-primary-purple font-jetbrains mb-1'>●●●●●●</p>
                        ) : (
                          <p className='text-white font-semibold mb-1'>{entry.amount}</p>
                        )}
                        <div className='flex items-center gap-2'>
                          <span className='text-xs text-encrypted'>
                            Score: {entry.complianceScore}%
                          </span>
                          {entry.complianceScore === 100 && (
                            <CheckCircle className='w-4 h-4 text-encrypted' />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-6 text-center'>
                <button className='text-primary-purple hover:text-purple-400 transition-colors text-sm font-medium'>
                  Load More Entries
                </button>
              </div>
            </div>
          )}

          {selectedTab === 'reports' && (
            <div className='vault-card p-6'>
              <h3 className='text-xl font-bold text-white mb-6 font-space-grotesk'>
                Generate Compliance Reports
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  {
                    title: 'Transaction Summary',
                    description: 'Detailed report of all vault transactions',
                    icon: FileText,
                  },
                  {
                    title: 'Tax Report',
                    description: 'Annual tax documentation for filing',
                    icon: FileText,
                  },
                  {
                    title: 'Compliance Certificate',
                    description: 'Official compliance verification document',
                    icon: Award,
                  },
                  {
                    title: 'Audit Package',
                    description: 'Complete audit trail and proofs',
                    icon: Shield,
                  },
                ].map((report, index) => (
                  <div
                    key={index}
                    className='p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200'
                  >
                    <report.icon className='w-10 h-10 text-encrypted mb-4' />
                    <h4 className='text-white font-semibold text-lg mb-2'>{report.title}</h4>
                    <p className='text-gray-400 text-sm mb-4'>{report.description}</p>
                    <button className='btn-primary w-full py-2 flex items-center justify-center gap-2'>
                      <Download className='w-4 h-4' />
                      Generate Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generate Proof Modal */}
      {showProofModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar'>
            <div className='flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-glass backdrop-blur-xl'>
              <h3 className='text-xl font-bold text-white font-space-grotesk'>
                Generate Compliance Proof
              </h3>
              <button
                onClick={() => setShowProofModal(false)}
                className='p-2 hover:bg-white/10 rounded-lg transition-colors'
              >
                <div className='w-6 h-6 text-white/70'>✕</div>
              </button>
            </div>

            <div className='p-6 space-y-6'>
              <div className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <Info className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-blue-400 font-medium text-sm'>Selective Disclosure</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Generate zero-knowledge proofs that verify specific compliance requirements
                      without revealing your complete financial data.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-white text-sm font-medium mb-3'>
                  Select Proof Type
                </label>
                <div className='space-y-3'>
                  {[
                    {
                      id: 'balance-threshold',
                      title: 'Portfolio Balance Threshold',
                      description: 'Prove portfolio value exceeds a specific amount',
                    },
                    {
                      id: 'no-sanctions',
                      title: 'No Sanctioned Transactions',
                      description: 'Verify no transactions with sanctioned addresses',
                    },
                    {
                      id: 'source-funds',
                      title: 'Source of Funds Verification',
                      description: 'Prove legitimate origin of deposited assets',
                    },
                    {
                      id: 'geographic',
                      title: 'Geographic Compliance',
                      description: 'Verify operations within permitted jurisdictions',
                    },
                  ].map((proofType) => (
                    <button
                      key={proofType.id}
                      onClick={() => setSelectedProofType(proofType.id)}
                      className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                        selectedProofType === proofType.id
                          ? 'bg-primary-blue/20 border-primary-light'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <p className='text-white font-semibold mb-1'>{proofType.title}</p>
                      <p className='text-gray-400 text-sm'>{proofType.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProofType && (
                <div className='bg-white/5 rounded-xl p-6'>
                  <h4 className='text-white font-semibold mb-4'>Proof Parameters</h4>

                  {selectedProofType === 'balance-threshold' && (
                    <div>
                      <label className='block text-white text-sm font-medium mb-2'>
                        Minimum Balance Threshold (USD)
                      </label>
                      <input
                        type='number'
                        placeholder='10000'
                        className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors'
                      />
                      <p className='text-gray-400 text-xs mt-2'>
                        Proof will verify your portfolio exceeds this amount without revealing exact
                        balance
                      </p>
                    </div>
                  )}

                  {selectedProofType === 'source-funds' && (
                    <div>
                      <label className='block text-white text-sm font-medium mb-2'>
                        Time Period
                      </label>
                      <select className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors'>
                        <option value='30' className='bg-slate-800'>
                          Last 30 days
                        </option>
                        <option value='90' className='bg-slate-800'>
                          Last 90 days
                        </option>
                        <option value='365' className='bg-slate-800'>
                          Last year
                        </option>
                        <option value='all' className='bg-slate-800'>
                          All time
                        </option>
                      </select>
                    </div>
                  )}

                  {selectedProofType === 'geographic' && (
                    <div>
                      <label className='block text-white text-sm font-medium mb-2'>
                        Jurisdiction
                      </label>
                      <select className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors'>
                        <option value='us' className='bg-slate-800'>
                          United States
                        </option>
                        <option value='eu' className='bg-slate-800'>
                          European Union
                        </option>
                        <option value='uk' className='bg-slate-800'>
                          United Kingdom
                        </option>
                        <option value='sg' className='bg-slate-800'>
                          Singapore
                        </option>
                      </select>
                    </div>
                  )}

                  {selectedProofType === 'no-sanctions' && (
                    <div>
                      <label className='block text-white text-sm font-medium mb-2'>
                        Verification Scope
                      </label>
                      <select className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors'>
                        <option value='all' className='bg-slate-800'>
                          All transactions
                        </option>
                        <option value='recent' className='bg-slate-800'>
                          Last 6 months
                        </option>
                        <option value='year' className='bg-slate-800'>
                          Last year
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className='bg-encrypted/10 border border-encrypted/30 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <Lock className='w-5 h-5 text-encrypted mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-encrypted font-medium text-sm'>Privacy Guarantee</p>
                    <p className='text-white/70 text-sm mt-1'>
                      Zero-knowledge proofs ensure your sensitive data remains private. Only the
                      verification result (true/false) is revealed, never your actual values.
                    </p>
                  </div>
                </div>
              </div>

              {isGeneratingProof ? (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 border-4 border-encrypted/30 border-t-encrypted rounded-full animate-spin mx-auto mb-4'></div>
                  <p className='text-white font-medium mb-2'>Generating Proof...</p>
                  <p className='text-gray-400 text-sm'>Creating cryptographic attestation</p>
                </div>
              ) : (
                <div className='flex gap-4'>
                  <button
                    onClick={() => setShowProofModal(false)}
                    className='flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateProof}
                    disabled={!selectedProofType}
                    className='flex-1 btn-encrypted py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    <Zap className='w-4 h-4' />
                    Generate Proof
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
