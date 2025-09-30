'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  ArrowRight,
  User,
  Phone,
  DollarSign,
  Globe,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Star,
  Zap,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface Recipient {
  id: string;
  name: string;
  phone: string;
  country: string;
  flag: string;
  isFavorite: boolean;
  lastSent?: string;
}

interface Country {
  name: string;
  currency: string;
  rate: number;
  flag: string;
  processingTime: string;
  payoutMethods: string[];
}

export default function SendMoneyPage() {
  const [step, setStep] = useState(1);
  const [sendAmount, setSendAmount] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in production, this would come from APIs
  const countries: Country[] = [
    {
      name: 'Nigeria',
      currency: 'NGN',
      rate: 755.5,
      flag: '🇳🇬',
      processingTime: '< 1 minute',
      payoutMethods: ['Bank Transfer', 'Mobile Money', 'Cash Pickup'],
    },
    {
      name: 'Kenya',
      currency: 'KES',
      rate: 150.25,
      flag: '🇰🇪',
      processingTime: '< 2 minutes',
      payoutMethods: ['M-Pesa', 'Bank Transfer', 'Airtel Money'],
    },
    {
      name: 'Ghana',
      currency: 'GHS',
      rate: 12.45,
      flag: '🇬🇭',
      processingTime: '< 1 minute',
      payoutMethods: ['MTN Mobile Money', 'Bank Transfer', 'Cash Pickup'],
    },
    {
      name: 'Philippines',
      currency: 'PHP',
      rate: 56.75,
      flag: '🇵🇭',
      processingTime: '< 3 minutes',
      payoutMethods: ['GCash', 'Bank Transfer', 'Cash Pickup'],
    },
    {
      name: 'India',
      currency: 'INR',
      rate: 83.25,
      flag: '🇮🇳',
      processingTime: '< 2 minutes',
      payoutMethods: ['UPI', 'Bank Transfer', 'Paytm'],
    },
  ];

  const recentRecipients: Recipient[] = [
    {
      id: '1',
      name: 'Adaora Okafor',
      phone: '+234 803 123 4567',
      country: 'Nigeria',
      flag: '🇳🇬',
      isFavorite: true,
      lastSent: '2 days ago',
    },
    {
      id: '2',
      name: 'Grace Wanjiku',
      phone: '+254 712 345 678',
      country: 'Kenya',
      flag: '🇰🇪',
      isFavorite: false,
      lastSent: '1 week ago',
    },
    {
      id: '3',
      name: 'Kwame Asante',
      phone: '+233 24 567 8901',
      country: 'Ghana',
      flag: '🇬🇭',
      isFavorite: true,
      lastSent: '3 days ago',
    },
  ];

  const filteredRecipients = recentRecipients.filter(
    (recipient) =>
      recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.phone.includes(searchQuery),
  );

  // Calculate receive amount
  const receiveAmount =
    selectedCountry && sendAmount
      ? (parseFloat(sendAmount) * selectedCountry.rate).toLocaleString()
      : '0';

  // Calculate fees (ultra-low for demo)
  const networkFee = 0.005; // Less than $0.01
  const totalCost = sendAmount ? parseFloat(sendAmount) + networkFee : 0;

  useEffect(() => {
    // Check wallet connection status
    setIsWalletConnected(true); // Simulate connected wallet
  }, []);

  const handleSendTransfer = async () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Move to success step
      setStep(4);
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setRecipientName(recipient.name);
    setRecipientPhone(recipient.phone);

    // Auto-select country based on recipient
    const country = countries.find((c) => c.name === recipient.country);
    if (country) {
      setSelectedCountry(country);
    }

    setShowRecipientModal(false);
    if (step === 1) setStep(2);
  };

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8'>
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
              step >= stepNumber ? 'bg-primary-gradient text-white' : 'bg-white/10 text-white/50'
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-primary-light' : 'bg-white/20'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 lg:p-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk flex items-center justify-center gap-3'>
              <Send className='w-8 h-8 text-primary-light' />
              Send Money
            </h1>
            <p className='text-lg text-gray-300 font-inter'>
              Send money across borders instantly with ultra-low fees
            </p>
          </div>

          {/* Step Indicator */}
          {step !== 4 && renderStepIndicator()}

          {/* Step 1: Recipient Selection */}
          {step === 1 && (
            <div className='bg-glass rounded-2xl p-8 mb-6'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Who are you sending to?
              </h2>

              {/* Search Bar */}
              <div className='relative mb-6'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search recipients or enter phone number...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors'
                />
              </div>

              {/* Recent Recipients */}
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-white font-space-grotesk'>
                    Recent Recipients
                  </h3>
                  <button
                    onClick={() => setShowRecipientModal(true)}
                    className='text-primary-light hover:text-primary-blue transition-colors text-sm flex items-center gap-2'
                  >
                    <Plus className='w-4 h-4' />
                    Add New
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {filteredRecipients.map((recipient) => (
                    <button
                      key={recipient.id}
                      onClick={() => selectRecipient(recipient)}
                      className='transfer-card p-6 text-left hover:scale-[1.02] transition-all duration-200'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                            <User className='w-6 h-6 text-white' />
                          </div>
                          <div>
                            <p className='text-white font-semibold'>{recipient.name}</p>
                            <p className='text-gray-400 text-sm'>{recipient.phone}</p>
                          </div>
                        </div>
                        {recipient.isFavorite && (
                          <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                        )}
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-2xl'>{recipient.flag}</span>
                          <span className='text-white text-sm'>{recipient.country}</span>
                        </div>
                        <span className='text-gray-400 text-xs'>{recipient.lastSent}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* New Recipient Form */}
              <div className='bg-white/5 rounded-xl p-6'>
                <h3 className='text-lg font-semibold text-white mb-4 font-space-grotesk'>
                  Or send to someone new
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-white text-sm font-medium mb-2'>
                      Recipient Name
                    </label>
                    <input
                      type='text'
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors'
                      placeholder='Enter full name'
                    />
                  </div>

                  <div>
                    <label className='block text-white text-sm font-medium mb-2'>
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className='phone-input w-full'
                      placeholder='+234 803 123 4567'
                    />
                  </div>
                </div>

                <button
                  onClick={() => recipientName && recipientPhone && setStep(2)}
                  disabled={!recipientName || !recipientPhone}
                  className='btn-primary mt-4 w-full md:w-auto px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Continue
                  <ArrowRight className='w-5 h-5 ml-2' />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Amount & Country */}
          {step === 2 && (
            <div className='bg-glass rounded-2xl p-8 mb-6'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                How much are you sending?
              </h2>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Left: Amount Input */}
                <div>
                  <div className='mb-6'>
                    <label className='block text-white text-sm font-medium mb-2'>You Send</label>
                    <div className='relative'>
                      <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white font-bold text-xl'>
                        $
                      </div>
                      <input
                        type='number'
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className='w-full pl-8 pr-16 py-6 bg-white/10 border border-white/20 rounded-xl text-white text-2xl font-bold placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors'
                        placeholder='100'
                        min='1'
                        max='5000'
                      />
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70'>
                        USD
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className='flex gap-2 mt-3'>
                      {['25', '50', '100', '250', '500'].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setSendAmount(amount)}
                          className='px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors'
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div className='mb-6'>
                    <label className='block text-white text-sm font-medium mb-2'>
                      Send To Country
                    </label>
                    <div className='grid grid-cols-1 gap-3 max-h-64 overflow-y-auto custom-scrollbar'>
                      {countries.map((country) => (
                        <button
                          key={country.name}
                          onClick={() => setSelectedCountry(country)}
                          className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                            selectedCountry?.name === country.name
                              ? 'bg-primary-blue/20 border-primary-light text-white'
                              : 'bg-white/10 border-white/20 hover:bg-white/20 text-white/80'
                          }`}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <span className='text-2xl'>{country.flag}</span>
                              <div>
                                <p className='font-semibold'>{country.name}</p>
                                <p className='text-xs opacity-70'>
                                  {country.processingTime} • {country.payoutMethods[0]}
                                </p>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='text-sm font-medium'>
                                1 USD = {country.rate} {country.currency}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Summary */}
                <div>
                  {selectedCountry && sendAmount && (
                    <div className='bg-success-green/10 border border-success-green/30 rounded-xl p-6 mb-6'>
                      <h3 className='text-lg font-semibold text-white mb-4'>Transfer Summary</h3>

                      <div className='space-y-3 mb-4'>
                        <div className='flex justify-between'>
                          <span className='text-white/70'>Send amount</span>
                          <span className='text-white font-semibold'>${sendAmount}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-white/70'>Network fee</span>
                          <span className='text-success font-semibold'>$0.01</span>
                        </div>
                        <div className='border-t border-white/20 pt-3'>
                          <div className='flex justify-between'>
                            <span className='text-white font-medium'>Total cost</span>
                            <span className='text-white font-bold text-lg'>
                              ${totalCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='bg-success-green/20 rounded-lg p-4 mb-4'>
                        <p className='text-success font-bold text-2xl'>
                          {selectedCountry.currency} {receiveAmount}
                        </p>
                        <p className='text-success/70 text-sm'>Recipient receives</p>
                      </div>

                      <div className='space-y-2 text-sm text-white/70'>
                        <div className='flex items-center gap-2'>
                          <Clock className='w-4 h-4' />
                          <span>Delivery: {selectedCountry.processingTime}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Shield className='w-4 h-4' />
                          <span>Secured by Starknet L2</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Zap className='w-4 h-4' />
                          <span>Rate guaranteed for 30 minutes</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected Recipient Info */}
                  {(selectedRecipient || (recipientName && recipientPhone)) && (
                    <div className='bg-white/5 rounded-xl p-4 mb-6'>
                      <h4 className='text-white font-semibold mb-2'>Sending to:</h4>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center'>
                          <User className='w-5 h-5 text-white' />
                        </div>
                        <div>
                          <p className='text-white font-medium'>
                            {selectedRecipient?.name || recipientName}
                          </p>
                          <p className='text-gray-400 text-sm'>
                            {selectedRecipient?.phone || recipientPhone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <div className='flex gap-4 mt-8'>
                <button
                  onClick={() => setStep(1)}
                  className='px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedCountry || !sendAmount || parseFloat(sendAmount) <= 0}
                  className='btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                >
                  Review Transfer
                  <ArrowRight className='w-5 h-5' />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {step === 3 && selectedCountry && (
            <div className='bg-glass rounded-2xl p-8 mb-6'>
              <h2 className='text-2xl font-bold text-white mb-6 font-space-grotesk'>
                Review Your Transfer
              </h2>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Transfer Details */}
                <div>
                  <div className='transfer-card p-6 mb-6'>
                    <h3 className='text-lg font-semibold text-white mb-4'>Transfer Details</h3>

                    <div className='space-y-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-white/70'>You send</span>
                        <span className='text-white font-bold text-xl'>${sendAmount}</span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-white/70'>Network fee</span>
                        <span className='text-success font-semibold'>$0.01</span>
                      </div>

                      <div className='border-t border-white/20 pt-4'>
                        <div className='flex justify-between items-center'>
                          <span className='text-white font-medium'>Total debit</span>
                          <span className='text-white font-bold text-xl'>
                            ${totalCost.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className='bg-success-green/10 border border-success-green/30 rounded-lg p-4 mt-4'>
                        <div className='flex justify-between items-center'>
                          <span className='text-success/70'>Recipient gets</span>
                          <span className='text-success font-bold text-2xl'>
                            {selectedCountry.currency} {receiveAmount}
                          </span>
                        </div>
                        <p className='text-success/70 text-sm mt-1'>
                          Exchange rate: 1 USD = {selectedCountry.rate} {selectedCountry.currency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recipient Info */}
                  <div className='transfer-card p-6'>
                    <h3 className='text-lg font-semibold text-white mb-4'>Recipient</h3>
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                        <User className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <p className='text-white font-semibold'>
                          {selectedRecipient?.name || recipientName}
                        </p>
                        <p className='text-gray-400'>
                          {selectedRecipient?.phone || recipientPhone}
                        </p>
                        <div className='flex items-center gap-2 mt-1'>
                          <span className='text-xl'>{selectedCountry.flag}</span>
                          <span className='text-white text-sm'>{selectedCountry.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Method & Timeline */}
                <div>
                  <div className='transfer-card p-6 mb-6'>
                    <h3 className='text-lg font-semibold text-white mb-4'>Delivery Method</h3>

                    <div className='space-y-3'>
                      {selectedCountry.payoutMethods.map((method, index) => (
                        <div
                          key={method}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            index === 0
                              ? 'bg-primary-blue/20 border-primary-light'
                              : 'bg-white/10 border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-success-gradient rounded-lg flex items-center justify-center'>
                              {method.includes('Mobile') ||
                              method.includes('M-Pesa') ||
                              method.includes('GCash') ? (
                                <Smartphone className='w-5 h-5 text-white' />
                              ) : (
                                <CreditCard className='w-5 h-5 text-white' />
                              )}
                            </div>
                            <div>
                              <p className='text-white font-medium'>{method}</p>
                              <p className='text-white/70 text-sm'>
                                {index === 0 ? 'Recommended • Instant' : 'Available'}
                              </p>
                            </div>
                            {index === 0 && (
                              <div className='ml-auto'>
                                <div className='w-4 h-4 bg-success rounded-full flex items-center justify-center'>
                                  <CheckCircle className='w-3 h-3 text-white' />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6'>
                    <div className='flex items-start gap-3'>
                      <Shield className='w-5 h-5 text-blue-400 mt-1 flex-shrink-0' />
                      <div>
                        <p className='text-blue-400 font-medium text-sm'>Secure Transfer</p>
                        <p className='text-white/70 text-sm mt-1'>
                          Your funds are protected by Starknet's zero-knowledge proofs and our
                          paymaster system ensures gasless delivery to your recipient.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className='bg-warning-yellow/10 border border-warning-yellow/30 rounded-lg p-4'>
                    <div className='flex items-start gap-3'>
                      <AlertCircle className='w-5 h-5 text-warning mt-1 flex-shrink-0' />
                      <div>
                        <p className='text-warning font-medium text-sm'>Important</p>
                        <p className='text-white/70 text-sm mt-1'>
                          Make sure recipient's phone number is correct. They'll receive an SMS with
                          instructions to claim the money.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 mt-8'>
                <button
                  onClick={() => setStep(2)}
                  className='px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                >
                  Back
                </button>
                <button
                  onClick={handleSendTransfer}
                  disabled={isProcessing || !isWalletConnected}
                  className='btn-success px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 flex-1 justify-center'
                >
                  {isProcessing ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className='w-5 h-5' />
                      Send ${sendAmount} Now
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && selectedCountry && (
            <div className='bg-glass rounded-2xl p-8 text-center'>
              <div className='w-20 h-20 bg-success-gradient rounded-full flex items-center justify-center mx-auto mb-6 pulse-success'>
                <CheckCircle className='w-10 h-10 text-white' />
              </div>

              <h2 className='text-3xl font-bold text-white mb-4 font-space-grotesk'>
                Transfer Successful!
              </h2>

              <p className='text-lg text-gray-300 mb-8 font-inter'>
                Your money is on its way to {selectedRecipient?.name || recipientName}
              </p>

              <div className='bg-success-green/10 border border-success-green/30 rounded-xl p-6 mb-8 max-w-md mx-auto'>
                <p className='text-success font-bold text-2xl mb-2'>
                  {selectedCountry.currency} {receiveAmount}
                </p>
                <p className='text-success/70 text-sm'>
                  Will be available for pickup within {selectedCountry.processingTime}
                </p>
              </div>

              {/* Transaction Details */}
              <div className='bg-white/5 rounded-xl p-6 mb-8 text-left max-w-md mx-auto'>
                <h3 className='text-white font-semibold mb-4'>Transaction Details</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Transaction ID</span>
                    <span className='text-white font-mono'>
                      TXN-{Date.now().toString().slice(-8)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Amount sent</span>
                    <span className='text-white'>${sendAmount}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Network fee</span>
                    <span className='text-white'>$0.01</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Status</span>
                    <span className='text-success'>Completed</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8'>
                <h3 className='text-blue-400 font-semibold mb-4'>What happens next?</h3>
                <div className='space-y-3 text-left'>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      SMS notification sent to {selectedRecipient?.phone || recipientPhone}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      Recipient can claim money via mobile money or bank transfer
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></div>
                    <p className='text-white/70 text-sm'>
                      You'll receive confirmation once money is claimed
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => {
                    // Reset form and go back to step 1
                    setStep(1);
                    setSendAmount('');
                    setSelectedCountry(null);
                    setRecipientPhone('');
                    setRecipientName('');
                    setSelectedRecipient(null);
                  }}
                  className='btn-primary px-8 py-3'
                >
                  Send Another Transfer
                </button>

                <button
                  onClick={() => (window.location.href = '/transactions')}
                  className='px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                >
                  View Transaction History
                </button>
              </div>

              {/* Support */}
              <div className='mt-8 pt-6 border-t border-white/10'>
                <p className='text-white/60 text-sm mb-2'>Need help or have questions?</p>
                <button className='text-primary-light hover:text-primary-blue transition-colors text-sm'>
                  Contact Support 24/7
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipient Modal */}
      {showRecipientModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-glass rounded-2xl w-full max-w-md p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-white font-space-grotesk'>Add New Recipient</h3>
              <button
                onClick={() => setShowRecipientModal(false)}
                className='p-2 hover:bg-white/10 rounded-lg transition-colors'
              >
                <div className='w-6 h-6 text-white/70'>✕</div>
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-white text-sm font-medium mb-2'>Full Name</label>
                <input
                  type='text'
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors'
                  placeholder="Enter recipient's full name"
                />
              </div>

              <div>
                <label className='block text-white text-sm font-medium mb-2'>Phone Number</label>
                <input
                  type='tel'
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className='phone-input w-full'
                  placeholder='+234 803 123 4567'
                />
              </div>

              <div>
                <label className='block text-white text-sm font-medium mb-2'>Country</label>
                <select
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors'
                  onChange={(e) => {
                    const country = countries.find((c) => c.name === e.target.value);
                    if (country) setSelectedCountry(country);
                  }}
                >
                  <option value='' className='bg-slate-800'>
                    Select country
                  </option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name} className='bg-slate-800'>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => setShowRecipientModal(false)}
                className='flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (recipientName && recipientPhone && selectedCountry) {
                    setShowRecipientModal(false);
                    setStep(2);
                  }
                }}
                disabled={!recipientName || !recipientPhone || !selectedCountry}
                className='flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Add & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
