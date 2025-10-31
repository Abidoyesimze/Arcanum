"use client"

import dynamic from 'next/dynamic'

// Dynamically import the deposit content with SSR disabled
const DepositContent = dynamic(() => import('./DepositContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118] p-4 lg:p-6 flex items-center justify-center">
      <div className="bg-glass rounded-2xl p-8 text-center max-w-md">
        <div className="w-16 h-16 border-4 border-encrypted/30 border-t-encrypted rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
        <p className="text-gray-300">Preparing deposit interface</p>
      </div>
    </div>
  ),
})

export default function DepositPage() {
  return <DepositContent />
}
