'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  MessageSquare,
  CheckCircle,
  Clock,
  Shield,
  AlertCircle,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Banknote,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface PendingTransfer {
  id: string;
  senderName: string;
  amount: number;
  currency: string;
  localAmount: string;
  localCurrency: string;
  sentDate: string;
  expiryDate: string;
  reference: string;
  status: 'pending' | 'claimed' | 'expired';
  payoutMethods: PayoutMethod[];
}

interface PayoutMethod {
  id: string;
  type: 'mobile_money' | 'bank_transfer' | 'cash_pickup';
  name: string;
  icon: string;
  processingTime: string;
  isAvailable: boolean;
  fees?: number;
  description: string;
}

interface ClaimStep {
  step: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export default function ReceivePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<PendingTransfer | null>(null);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<PayoutMethod | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Mock data for demonstration
  const mockTransfers: PendingTransfer[] = [
    {
      id: 'TXN-202312250001',
      senderName: 'John Smith',
      amount: 100,
      currency: 'USD',
      localAmount: '15,025',
      localCurrency: 'KES',
      sentDate: '2 hours ago',
      expiryDate: '7 days',
      reference: 'REF-KES-12250001',
      status: 'pending',
      payoutMethods: [
        {
          id: 'mpesa',
          type: 'mobile_money',
          name: 'M-Pesa',
          icon: '📱',
          processingTime: 'Instant',
          isAvailable: true,
          fees: 0,
          description: 'Direct to your M-Pesa wallet',
        },
        {
          id: 'bank',
          type: 'bank_transfer',
          name: 'Bank Transfer',
          icon: '🏦',
          processingTime: '1-2 hours',
          isAvailable: true,
          fees: 0,
          description: 'Direct to your bank account',
        },
        {
          id: 'cash',
          type: 'cash_pickup',
          name: 'Cash Pickup',
          icon: '💵',
          processingTime: 'Immediate',
          isAvailable: true,
          fees: 0,
          description: 'Pick up cash at agent locations',
        },
      ],
    },
    {
      id: 'TXN-202312240002',
      senderName: 'Sarah Johnson',
      amount: 75,
      currency: 'USD',
      localAmount: '56,813',
      localCurrency: 'NGN',
      sentDate: '1 day ago',
      expiryDate: '6 days',
      reference: 'REF-NGN-12240002',
      status: 'pending',
      payoutMethods: [
        {
          id: 'mobile',
          type: 'mobile_money',
          name: 'Mobile Money',
          icon: '📱',
          processingTime: 'Instant',
          isAvailable: true,
          fees: 0,
          description: 'Direct to your mobile wallet',
        },
        {
          id: 'bank_ng',
          type: 'bank_transfer',
          name: 'Bank Transfer',
          icon: '🏦',
          processingTime: '1-3 hours',
          isAvailable: true,
          fees: 0,
          description: 'Direct to your Nigerian bank account',
        },
      ],
    },
  ];

  const claimSteps: ClaimStep[] = [
    {
      step: 1,
      title: 'Verify Phone Number',
      description: 'Enter your phone number to receive verification code',
      isComplete: isVerified,
      isActive: currentStep === 1,
    },
    {
      step: 2,
      title: 'Select Transfer',
      description: 'Choose the money transfer you want to claim',
      isComplete: selectedTransfer !== null,
      isActive: currentStep === 2,
    },
    {
      step: 3,
      title: 'Choose Payout Method',
      description: 'Select how you want to receive your money',
      isComplete: selectedPayoutMethod !== null,
      isActive: currentStep === 3,
    },
    {
      step: 4,
      title: 'Claim Money',
      description: 'Complete the claim process',
      isComplete: claimSuccess,
      isActive: currentStep === 4,
    },
  ];

  useEffect(() => {
    if (isVerified && currentStep === 1) {
      setPendingTransfers(mockTransfers);
      setCurrentStep(2);
    }
  }, [isVerified]);

  const handleVerifyPhone = async () => {
    setIsVerifying(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsVerified(true);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectTransfer = (transfer: PendingTransfer) => {
    setSelectedTransfer(transfer);
    setCurrentStep(3);
  };

  const handleSelectPayoutMethod = (method: PayoutMethod) => {
    setSelectedPayoutMethod(method);
    setCurrentStep(4);
  };

  const handleClaimMoney = async () => {
    if (!selectedTransfer || !selectedPayoutMethod) return;

    setIsClaiming(true);

    try {
      // Simulate claim process
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setClaimSuccess(true);

      // Update transfer status
      setPendingTransfers((prev) =>
        prev.map((t) => (t.id === selectedTransfer.id ? { ...t, status: 'claimed' } : t)),
      );
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8'>
      {claimSteps.map((step, index) => (
        <React.Fragment key={step.step}>
          <div className={`flex flex-col items-center ${step.isActive ? 'z-10' : ''}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                step.isComplete
                  ? 'bg-success text-white'
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
          {index < claimSteps.length - 1 && (
            <div className={`w-16 h-1 mx-2 ${step.isComplete ? 'bg-success' : 'bg-white/20'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 lg:p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk flex items-center justify-center gap-3'>
              <Download className='w-8 h-8 text-success' />
              Receive Money
            </h1>
            <p className='text-lg text-gray-300 font-inter'>
              Claim money sent to your phone number - no wallet required
            </p>
          </div>

          {/* How It Works Info */}
          <div className='bg-glass rounded-2xl p-6 mb-8'>
            <h2 className='text-xl font-bold text-white mb-4 font-space-grotesk flex items-center gap-2'>
              <MessageSquare className='w-5 h-5 text-blue-400' />
              How to Receive Money
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-white/5 rounded-xl'>
                <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3'>
                  <MessageSquare className='w-6 h-6 text-blue-400' />
                </div>
                <h3 className='text-white font-medium mb-2'>Receive SMS</h3>
                <p className='text-gray-400 text-sm'>
                  Get a text message with claim link when someone sends you money
                </p>
              </div>

              <div className='text-center p-4 bg-white/5 rounded-xl'>
                <div className='w-12 h-12 bg-success-green/20 rounded-xl flex items-center justify-center mx-auto mb-3'>
                  <Phone className='w-6 h-6 text-success' />
                </div>
                <h3 className='text-white font-medium mb-2'>Verify Phone</h3>
                <p className='text-gray-400 text-sm'>
                  Enter your phone number and verify with OTP code
                </p>
              </div>

              <div className='text-center p-4 bg-white/5 rounded-xl'>
                <div className='w-12 h-12 bg-warning-yellow/20 rounded-xl flex items-center justify-center mx-auto mb-3'>
                  <Banknote className='w-6 h-6 text-warning' />
                </div>
                <h3 className='text-white font-medium mb-2'>Get Paid</h3>
                <p className='text-gray-400 text-sm'>
                  Choose how to receive: mobile money, bank, or cash pickup
                </p>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          {!claimSuccess && renderStepIndicator()}

          {/* Success State */}
          {claimSuccess && selectedTransfer && selectedPayoutMethod && (
            <div className='bg-glass rounded-2xl p-8 text-center'>
              <div className='w-20 h-20 bg-success-gradient rounded-full flex items-center justify-center mx-auto mb-6 pulse-success'>
                <CheckCircle className='w-10 h-10 text-white' />
              </div>

              <h2 className='text-3xl font-bold text-white mb-4 font-space-grotesk'>
                Money Claimed Successfully!
              </h2>

              <p className='text-lg text-gray-300 mb-8 font-inter'>
                Your money is being processed via {selectedPayoutMethod.name}
              </p>

              <div className='bg-success-green/10 border border-success-green/30 rounded-xl p-6 mb-8 max-w-md mx-auto'>
                <p className='text-success font-bold text-2xl mb-2'>
                  {selectedTransfer.localCurrency} {selectedTransfer.localAmount}
                </p>
                <p className='text-success/70 text-sm'>From {selectedTransfer.senderName}</p>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8'>
                <h3 className='text-blue-400 font-semibold mb-4'>What happens next?</h3>
                <div className='space-y-3 text-left'>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Processing time: {selectedPayoutMethod.processingTime}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      You'll receive confirmation once money is available
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>Reference: {selectedTransfer.reference}</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => {
                    setClaimSuccess(false);
                    setCurrentStep(1);
                    setIsVerified(false);
                    setSelectedTransfer(null);
                    setSelectedPayoutMethod(null);
                    setPhoneNumber('');
                  }}
                  className='btn-primary px-8 py-3'
                >
                  Claim Another Transfer
                </button>

                <button className='px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'>
                  Download Receipt
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Phone Verification */}
          {currentStep === 1 && !claimSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Verify Your Phone Number
              </h2>

              <div className='max-w-md mx-auto'>
                <div className='mb-6'>
                  <label className='block text-white text-sm font-medium mb-2'>Phone Number</label>
                  <input
                    type='tel'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className='phone-input w-full'
                    placeholder='+254 712 345 678'
                  />
                  <p className='text-gray-400 text-xs mt-2'>
                    Enter the phone number where you received the SMS notification
                  </p>
                </div>

                <div className='mb-6'>
                  <label className='block text-white text-sm font-medium mb-2'>
                    Verification Code
                  </label>
                  <div className='relative'>
                    <input
                      type={showCode ? 'text' : 'password'}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors pr-12'
                      placeholder='Enter 6-digit code'
                      maxLength={6}
                    />
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors'
                    >
                      {showCode ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                  <p className='text-gray-400 text-xs mt-2'>
                    Check your SMS for the 6-digit verification code
                  </p>
                </div>

                <button
                  onClick={handleVerifyPhone}
                  disabled={!phoneNumber || verificationCode.length !== 6 || isVerifying}
                  className='btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
                >
                  {isVerifying ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className='w-5 h-5' />
                      Verify Phone Number
                    </>
                  )}
                </button>

                <div className='text-center mt-6'>
                  <p className='text-gray-400 text-sm mb-2'>Didn't receive the code?</p>
                  <button className='text-primary-light hover:text-primary-blue transition-colors text-sm font-medium'>
                    Resend Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Transfer */}
          {currentStep === 2 && !claimSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Select Transfer to Claim
              </h2>

              {pendingTransfers.length === 0 ? (
                <div className='text-center py-12'>
                  <MessageSquare className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-400 text-lg font-inter'>No pending transfers found</p>
                  <p className='text-gray-500 text-sm font-inter'>
                    Make sure you entered the correct phone number
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {pendingTransfers.map((transfer) => (
                    <button
                      key={transfer.id}
                      onClick={() => handleSelectTransfer(transfer)}
                      className='w-full p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 text-left'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <p className='text-white font-semibold text-lg'>
                            From {transfer.senderName}
                          </p>
                          <p className='text-gray-400 text-sm'>
                            Sent {transfer.sentDate} • Expires in {transfer.expiryDate}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-white font-bold text-xl'>${transfer.amount}</p>
                          <p className='text-success font-semibold'>
                            {transfer.localCurrency} {transfer.localAmount}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2'>
                            <Clock className='w-4 h-4 text-warning' />
                            <span className='status-pending'>Pending</span>
                          </div>
                          <span className='text-gray-400 text-sm font-mono'>
                            #{transfer.reference}
                          </span>
                        </div>

                        <ArrowRight className='w-5 h-5 text-white/70' />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Payout Method */}
          {currentStep === 3 && selectedTransfer && !claimSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white font-space-grotesk'>
                  Choose Payout Method
                </h2>
                <button
                  onClick={() => setCurrentStep(2)}
                  className='text-primary-light hover:text-primary-blue transition-colors text-sm'
                >
                  Back to transfers
                </button>
              </div>

              <div className='bg-white/5 rounded-xl p-4 mb-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-white font-semibold'>
                      Claiming: {selectedTransfer.localCurrency} {selectedTransfer.localAmount}
                    </p>
                    <p className='text-gray-400 text-sm'>From {selectedTransfer.senderName}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-400 text-sm'>${selectedTransfer.amount} USD</p>
                    <p className='text-gray-400 text-xs'>#{selectedTransfer.reference}</p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                {selectedTransfer.payoutMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectPayoutMethod(method)}
                    disabled={!method.isAvailable}
                    className={`w-full p-6 border rounded-xl transition-all duration-200 text-left ${
                      method.isAvailable
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                        : 'bg-gray-500/10 border-gray-500/20 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className='flex items-center gap-4'>
                      <div className='text-3xl'>{method.icon}</div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between mb-2'>
                          <h3 className='text-white font-semibold text-lg'>{method.name}</h3>
                          <div className='text-right'>
                            <p className='text-success font-semibold'>{method.processingTime}</p>
                            {method.fees && method.fees > 0 ? (
                              <p className='text-gray-400 text-sm'>Fee: ${method.fees}</p>
                            ) : (
                              <p className='text-success text-sm'>No fees</p>
                            )}
                          </div>
                        </div>
                        <p className='text-gray-400 text-sm'>{method.description}</p>
                        {!method.isAvailable && (
                          <p className='text-error text-sm mt-2'>Currently unavailable</p>
                        )}
                      </div>
                      {method.isAvailable && <ArrowRight className='w-5 h-5 text-white/70' />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Claim Money */}
          {currentStep === 4 && selectedTransfer && selectedPayoutMethod && !claimSuccess && (
            <div className='bg-glass rounded-2xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white font-space-grotesk'>Confirm Claim</h2>
                <button
                  onClick={() => setCurrentStep(3)}
                  className='text-primary-light hover:text-primary-blue transition-colors text-sm'
                >
                  Change method
                </button>
              </div>

              <div className='space-y-6'>
                {/* Transfer Summary */}
                <div className='bg-success-green/10 border border-success-green/30 rounded-xl p-6'>
                  <div className='text-center mb-4'>
                    <p className='text-success font-bold text-3xl'>
                      {selectedTransfer.localCurrency} {selectedTransfer.localAmount}
                    </p>
                    <p className='text-success/70 text-sm'>From {selectedTransfer.senderName}</p>
                  </div>

                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-success/70'>USD Amount</span>
                    <span className='text-success'>${selectedTransfer.amount}</span>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-success/70'>Reference</span>
                    <span className='text-success font-mono'>{selectedTransfer.reference}</span>
                  </div>
                </div>

                {/* Payout Method Details */}
                <div className='bg-white/5 rounded-xl p-6'>
                  <h3 className='text-white font-semibold mb-4'>Payout Method</h3>
                  <div className='flex items-center gap-4'>
                    <div className='text-3xl'>{selectedPayoutMethod.icon}</div>
                    <div className='flex-1'>
                      <p className='text-white font-medium'>{selectedPayoutMethod.name}</p>
                      <p className='text-gray-400 text-sm'>{selectedPayoutMethod.description}</p>
                      <div className='flex items-center gap-4 mt-2 text-sm'>
                        <span className='text-success'>
                          Processing: {selectedPayoutMethod.processingTime}
                        </span>
                        <span className='text-success'>Fee: ${selectedPayoutMethod.fees || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className='bg-warning-yellow/10 border border-warning-yellow/30 rounded-xl p-4'>
                  <div className='flex items-start gap-3'>
                    <AlertCircle className='w-5 h-5 text-warning mt-1 flex-shrink-0' />
                    <div>
                      <p className='text-warning font-medium text-sm'>Important</p>
                      <p className='text-white/70 text-sm mt-1'>
                        By claiming this transfer, you confirm that you are the intended recipient.
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={handleClaimMoney}
                  disabled={isClaiming}
                  className='btn-success w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
                >
                  {isClaiming ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Processing Claim...
                    </>
                  ) : (
                    <>
                      <Download className='w-5 h-5' />
                      Claim {selectedTransfer.localCurrency} {selectedTransfer.localAmount}
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
