"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState('recycler')

  return (
    <div className="min-h-screen body-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <h1 className="text-2xl font-bold text-white font-space-grotesk">Join Pick'n'Get</h1>
          <p className="text-gray-300 font-inter">Start your sustainable journey today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6">
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black font-space-grotesk">Create Account</h2>
              <span className="text-sm text-gray-500 font-inter">Step 1 of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Choose Your Role</h3>
              <p className="text-gray-600 text-sm font-inter">Select how you want to participate in the Pick'n'Get ecosystem</p>
            </div>

            <div className="space-y-3">
              {/* Recycler Option */}
              <button
                onClick={() => setSelectedRole('recycler')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedRole === 'recycler'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'recycler'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === 'recycler' && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded"></div>
                      </div>
                      <h4 className="font-semibold text-black font-space-grotesk">Recycler</h4>
                    </div>
                    <p className="text-sm text-gray-600 font-inter">Earn rewards by recycling waste materials</p>
                  </div>
                </div>
              </button>

              {/* Pickup Agent Option */}
              <button
                onClick={() => setSelectedRole('agent')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedRole === 'agent'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'agent'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === 'agent' && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded"></div>
                      </div>
                      <h4 className="font-semibold text-black font-space-grotesk">Pickup Agent</h4>
                    </div>
                    <p className="text-sm text-gray-600 font-inter">Collect recyclables and earn income</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Continue Button */}
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2">
              Continue →
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 font-inter">
              Already have an account? <a href="#" className="text-green-500 hover:underline">Sign in here</a>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-8 text-center">
          <div className="text-white">
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-inter">Earn ECO Tokens</p>
          </div>
          <div className="text-white">
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-inter">Verified Platform</p>
          </div>
          <div className="text-white">
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-inter">Secure & Private</p>
          </div>
        </div>
      </div>
    </div>
  )
}
