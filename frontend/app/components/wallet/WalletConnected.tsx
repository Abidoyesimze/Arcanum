"use client"

import { useState } from "react"
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  QrCode,
  Send,
  ArrowUpDown,
  Clock,
  Plus,
  Minus,
  TrendingUp,
} from "lucide-react"

interface WalletConnectedProps {
  onDisconnect: () => void
}

export default function WalletConnected({ onDisconnect }: WalletConnectedProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const walletData = {
    address: "0x742d35Cc6c63C4Cc529925a3b0b4C9dbC40b40b",
    balance: {
      eco: 1450,
      usdc: 5.05,
      fiat: 5.05
    },
    totalValue: 7050.00,
    change: 12.5
  }

  const transactions = [
    {
      id: 1,
      type: 'received',
      amount: '+25.5 ECO',
      date: '2025-01-14 14:30',
      address: '0xf8dc...3c5b',
      status: 'completed'
    },
    {
      id: 2,
      type: 'sent',
      amount: '-15 USDC',
      date: '2025-01-14 09:15',
      address: '0x7a5c...4b0f',
      status: 'completed'
    },
    {
      id: 3,
      type: 'swap',
      amount: '50 ECO',
      date: '2025-01-13 18:45',
      address: '0x9a8c...4a4b',
      status: 'completed'
    },
    {
      id: 4,
      type: 'received',
      amount: '+18.75 ECO',
      date: '2025-01-12 11:20',
      address: '0x3f7c...3c5b',
      status: 'completed'
    }
  ]

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address)
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'send', label: 'Send' },
    { id: 'swap', label: 'Swap' },
    { id: 'history', label: 'History' }
  ]

  return (
    <div className="space-y-6">
      {/* Wallet Status Card */}
      <div className="bg-black/80 rounded-2xl p-6 lg:p-8   .shadow-wallet-green border border-[#A5D6A74D]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium font-inter font-lg">Wallet Connected</h3>
              <p className="text-white/50 font-normal text-base font-inter">
                {walletData.address.slice(0, 8)}...{walletData.address.slice(-4)}
              </p>
            </div>
          </div>
          <span className="px-4 font-space-grotesk  text-black py-2 gradient-button  rounded-lg  text-lg font-medium border ">
            Trade HBAR For Cash
          </span>
        </div>

        {/* Balance Section */}
        <div className="mb-6">
          <h4 className="text-white font-space-grotesk font-medium mb-4 font-inter text-lg">Balance</h4>
          <div className="space-y-3">
            {/* ECO Tokens */}
            <div className="bg-[#DCFCE7] border  rounded-lg p-4">
              <div className="flex items-center justify-between font-inter text-primary">
                <div>
                  <p className="font-medium">Receive Tokens</p>
                  <p className="text-sm">EcoCleans Utility Token</p>
                </div>
                <div className="text-right text-primary">
                  <p className=" font-medium text-lg  ">{walletData.balance.eco.toLocaleString()} ECO</p>
                  <p className="text-sm ">₦2082.50</p>
                </div>
              </div>
            </div>

            {/* USDC */}
            <div className="bg-[#DBEAFE] border  rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-info-darker">
                  <p className="font-medium">USDC</p>
                  <p className="text-sm">USD Coin Stablecoin</p>
                </div>
                <div className="text-right text-info-darker font-inter">
                  <p className="font-medium text-lg">${walletData.balance.usdc}</p>
                  <p className="text-sm font-normal">{walletData.balance.usdc} HBAR</p>
                </div>
              </div>
            </div>

            {/* Fiat Equivalent */}
            <div className="bg-[#F3E8FF]  rounded-lg p-4">
              <div className="flex items-center justify-between text-[#9333EA]">
                <div>
                  <p className=" font-medium">Fiat Equivalent</p>
                  <p className=" text-sm">Local currency</p>
                </div>
                <div className="text-right text-[#9333EA]">
                  <p className=" font-bold text-lg">${walletData.balance.fiat}</p>
                  <p className=" text-sm">{walletData.balance.fiat} USDC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <button
          onClick={onDisconnect}
          className="bg-[#EF5350] hover:bg-red-700 w-full font-space-grotesk font-medium  px-8 py-2 rounded-lg text-lg 
            hover:shadow-lg transition-all  duration-200 focus-visible mb-4 inline-flex justify-center items-center gap-2"
        >
          <Wallet className="w-5 h-5"  />
          Disconnect Wallet
        </button>
            
     
        {/* Disconnect Button */}
        
        <p className="text-inactive text-sm text-center mt-2 font-inter">
          Supported wallets: MetaMask, WalletConnect, Coinbase Wallet
        </p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-[#DCFCE7] border border-green-500/20 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-inter font-medium">Total Portfolio Value</span>
          </div>
          <p className="text-2xl lg:text-3xl font-space-grotesk font-bold font-space-grotesk text-primary">₦{walletData.totalValue.toLocaleString()}</p>
          <p className="text-primary text-xs flex items-center font-inter font-normal gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +{walletData.change}% (24h)
          </p>
        </div>

        <div className="bg-[#DBEAFE] text-info-darker rounded-lg p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-2 ">
            <Wallet className="w-5 h-5 " />
            <span className="text-sm font-inter font-medium">ECO Tokens</span>
          </div>
          <p className="text-2xl lg:text-3xl font-space-grotesk font-bold">{walletData.balance.eco.toLocaleString()}</p>
          <p className=" text-sm font-inter font-normal mt-1">₦2082.50</p>
        </div>

        <div className="bg-[#F3E8FF] text-info-purple border border-purple-500/20 rounded-lg p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-inter font-medium">HBAR Balance</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold  font-space-grotesk">{walletData.balance.usdc}</p>
          <p className="text-info-purple text-sm font-inter mt-1">Stablecoin</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto bg-black/40 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-black/80 rounded-2xl p-6 lg:p-8 border border-slate-700/50">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'send' && <SendTab />}
        {activeTab === 'swap' && <SwapTab />}
        {activeTab === 'history' && <HistoryTab transactions={transactions} />}
      </div>

      {/* Wallet Address & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/80 shadow-wallet-green rounded-2xl p-6 ">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2 font-space-grotesk">
            <Wallet className="w-5 h-5" />
            Wallet Address
          </h3>
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <p className="text-gray-300 text-sm font-mono break-all">{walletData.address}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyAddress}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 
                text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 
              text-white rounded-lg transition-colors text-sm font-medium">
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 
              text-white rounded-lg transition-colors text-sm font-medium">
              <ExternalLink className="w-4 h-4" />
              Explorer
            </button>
          </div>
        </div>

        <div className="bg-black/80 rounded-2xl p-6 shadow-wallet-green">
          <h3 className="text-white font-semibold mb-4 font-space-grotesk">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 
              text-white rounded-lg transition-colors font-medium">
              <Send className="w-5 h-5" />
              Send Tokens
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 
              text-white rounded-lg transition-colors font-medium">
              <Plus className="w-5 h-5" />
              Receive Tokens
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 
              text-white rounded-lg transition-colors font-medium">
              <ArrowUpDown className="w-5 h-5" />
              Swap Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab Components
function OverviewTab() {
  return (
    <div className="text-center text-gray-400 py-8">
      <p>Overview content will be displayed here</p>
    </div>
  )
}

function SendTab() {
  const [selectedToken, setSelectedToken] = useState('ECO')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-semibold text-white font-space-grotesk">Send Tokens</h3>
      </div>

      <div className="space-y-4">
        {/* Token Selection */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Select Token</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
          >
            <option value="ECO">ECO Token (1450 available)</option>
            <option value="USDC">USDC ($5.05 available)</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Network Fee */}
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Network Fee:</span>
            <span className="text-white">~$0.50</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Total:</span>
            <span className="text-white">0 + fee</span>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 
          rounded-lg transition-all duration-200">
          Send Transaction
        </button>
      </div>
    </div>
  )
}

function SwapTab() {
  const [fromToken, setFromToken] = useState('ECO')
  const [toToken, setToToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <ArrowUpDown className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white font-space-grotesk">Swap Tokens</h3>
      </div>

      <div className="space-y-4">
        {/* From Token */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
            >
              <option value="ECO">ECO</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center">
          <button className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
            <ArrowUpDown className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">To</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
            >
              <option value="USDC">USDC</option>
              <option value="ECO">ECO</option>
            </select>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-sm text-center text-gray-400">
            Exchange Rate: 1 ECO = $0.85 USDC
          </p>
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 
          rounded-lg transition-all duration-200">
          Swap Tokens
        </button>
      </div>
    </div>
  )
}

function HistoryTab({ transactions }: { transactions: any[] }) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <Plus className="w-5 h-5 text-green-400" />
      case 'sent':
        return <Minus className="w-5 h-5 text-red-400" />
      case 'swap':
        return <ArrowUpDown className="w-5 h-5 text-purple-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'received':
        return 'text-green-400'
      case 'sent':
        return 'text-red-400'
      case 'swap':
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-gray-400" />
        <h3 className="text-xl font-semibold text-white font-space-grotesk">Transaction History</h3>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                {getTransactionIcon(tx.type)}
              </div>
              <div>
                <p className="text-white font-medium capitalize">{tx.type} {tx.type === 'swap' ? 'ECO → USDC' : ''}</p>
                <p className="text-gray-400 text-sm">{tx.date}</p>
                <p className="text-gray-500 text-xs">{tx.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${getTransactionColor(tx.type)}`}>{tx.amount}</p>
              <p className="text-gray-400 text-sm">{tx.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}