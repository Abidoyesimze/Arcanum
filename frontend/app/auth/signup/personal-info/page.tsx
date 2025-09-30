"use client"

import { useState } from "react"

export default function PersonalInfoPage() {
  const [formData, setFormData] = useState({
    firstName: 'Leine',
    lastName: 'Medal',
    email: 'leinemedal@example.com',
    phone: '+234 800 000 0000',
    location: 'Lagos Nigeria'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
              <span className="text-sm text-gray-500 font-inter">Step 2 of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Personal Information</h3>
              <p className="text-gray-600 text-sm font-inter">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2 font-inter">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-inter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2 font-inter">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-inter"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-black mb-2 font-inter">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-inter"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-black mb-2 font-inter">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-inter"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📞
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-black mb-2 font-inter">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-inter"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📍
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk">
                Back
              </button>
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2">
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
