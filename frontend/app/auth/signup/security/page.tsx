"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export default function SecurityPage() {
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [newsletterChecked, setNewsletterChecked] = useState(false)

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
              <span className="text-sm text-gray-500 font-inter">Step 3 of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
          </div>

          {/* Security & Preferences */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Security & Preferences</h3>
              <p className="text-gray-600 text-sm font-inter">Secure your account and set preferences</p>
            </div>

            <div className="space-y-4">
              {/* Terms Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div 
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                    agreementChecked 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setAgreementChecked(!agreementChecked)}
                >
                  {agreementChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-gray-700 font-inter">
                  I agree to the <a href="#" className="text-green-500 hover:underline">Terms of Service</a> and <a href="#" className="text-green-500 hover:underline">Privacy Policy</a>
                </span>
              </label>

              {/* Newsletter Subscription */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div 
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                    newsletterChecked 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setNewsletterChecked(!newsletterChecked)}
                >
                  {newsletterChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-gray-700 font-inter">
                  Subscribe to our newsletter for eco-tips and platform updates
                </span>
              </label>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk">
                Back
              </button>
              <button 
                className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2 ${
                  agreementChecked 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!agreementChecked}
              >
                ✓ Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}