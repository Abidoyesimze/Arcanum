'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import VaultManager from '../components/vault/VaultManager';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
        <div className='min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118] p-4 lg:p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='animate-pulse'>
              <div className='h-8 bg-white/10 rounded mb-4 w-64'></div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='h-32 bg-white/10 rounded-xl loading-shimmer'></div>
                ))}
              </div>
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
          {/* Vault Manager Component */}
          <VaultManager />
        </div>
      </div>
    </AppLayout>
  );
}