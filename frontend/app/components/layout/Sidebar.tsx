'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Shield,
  Lock,
  Unlock,
  TrendingUp,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Eye,
  Activity,
  Coins,
  Landmark,
  BarChart3,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useLayout } from './LayoutProvider';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useLayout();

  // Main menu items for privacy DeFi
  const menuItems = [
    { icon: Shield, label: 'Private Vaults', path: '/dashboard', badge: null },
    { icon: Lock, label: 'Deposit', path: '/deposit', badge: null },
    { icon: Unlock, label: 'Withdraw', path: '/withdraw', badge: null },
    { icon: Coins, label: 'Lend', path: '/lend', badge: null },
    { icon: Landmark, label: 'Borrow', path: '/borrow', badge: null },
    { icon: Activity, label: 'Activity', path: '/transactions', badge: 3 },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
    { icon: TrendingUp, label: 'Markets', path: '/markets', badge: null },
  ];

  // Settings and compliance items
  const bottomItems = [
    { icon: FileText, label: 'Compliance', path: '/compliance', badge: null },
    { icon: CheckCircle, label: 'Proofs', path: '/proofs', badge: 2 },
    { icon: Settings, label: 'Settings', path: '/settings', badge: null },
    { icon: HelpCircle, label: 'Documentation', path: '/docs', badge: null },
  ];

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    router.push(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    router.push('/');
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full w-64 z-50 transform transition-transform font-space-grotesk duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}
      >
        <div className='h-full sidebar-gradient custom-scrollbar overflow-y-auto'>
          {/* Mobile Close Button */}
          <div className='flex justify-end p-4 lg:hidden'>
            <button
              onClick={() => setSidebarOpen(false)}
              className='p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10'
              aria-label='Close sidebar'
            >
              <X className='w-6 h-6' />
            </button>
          </div>

          {/* Sidebar Header */}
          <div className='px-6 pb-6 lg:pt-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center'>
                <Shield className='w-6 h-6 text-white' />
              </div>
              <div>
                <h2 className='text-white font-bold text-lg font-space-grotesk'>Arcanum</h2>
                <p className='text-purple-200 text-xs font-medium'>Privacy Protocol</p>
              </div>
            </div>

            {/* Privacy Status Card */}
            <div className='bg-glass rounded-xl p-4 mb-6'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-white/80 text-sm font-medium'>Privacy Status</span>
                <div className='flex items-center gap-1'>
                  <div className='w-2 h-2 bg-encrypted rounded-full animate-pulse'></div>
                  <Eye className='w-4 h-4 text-encrypted' />
                </div>
              </div>
              <div className='text-encrypted text-xl font-bold font-space-grotesk mb-1'>
                Protected
              </div>
              <div className='text-white/60 text-xs'>All transactions private</div>

              {/* Privacy Meter */}
              <div className='mt-3 h-2 bg-white/10 rounded-full overflow-hidden'>
                <div className='h-full w-full bg-encrypted-gradient'></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='bg-glass rounded-xl p-4 mb-6'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-white/70 text-xs'>Total Value Locked</span>
                <Shield className='w-3 h-3 text-primary-purple' />
              </div>
              <div className='hidden-balance text-lg font-bold'>●●●●●●●●</div>
              <div className='text-white/60 text-xs mt-1'>Private vault balance</div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className='px-4 pb-4'>
            <div className='space-y-2'>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-left
                      transition-all duration-200 font-medium group focus-ring
                      ${isActive ? 'nav-active text-white shadow-lg' : 'text-white/80 nav-hover'}
                    `}
                  >
                    <div className='flex items-center gap-3'>
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-colors ${
                          isActive ? 'text-primary-purple' : 'group-hover:text-white'
                        }`}
                      />
                      <span className='text-sm font-inter'>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className='bg-error-red text-white text-xs rounded-full px-2 py-0.5 font-medium min-w-[18px] text-center'>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className='my-6 border-t border-white/10' />

            {/* Bottom Items */}
            <div className='space-y-2'>
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-left
                      transition-all duration-200 font-medium group focus-ring
                      ${isActive ? 'nav-active text-white shadow-lg' : 'text-white/60 nav-hover'}
                    `}
                  >
                    <div className='flex items-center gap-3'>
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-colors ${
                          isActive ? 'text-primary-purple' : 'group-hover:text-white/80'
                        }`}
                      />
                      <span className='text-sm font-inter'>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className='bg-warning-amber text-black text-xs rounded-full px-2 py-0.5 font-medium min-w-[18px] text-center'>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className='
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 font-medium group focus-ring
                  text-white/60 hover:text-red-400 hover:bg-red-400/10
                '
              >
                <LogOut className='w-5 h-5 flex-shrink-0 group-hover:text-red-400 transition-colors' />
                <span className='text-sm font-inter'>Disconnect</span>
              </button>
            </div>

            {/* Protocol Version */}
            <div className='mt-8 px-4 py-3 bg-white/5 rounded-xl'>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-white/60'>Arcanum v1.0</span>
                <span className='status-encrypted px-2 py-1 rounded text-xs'>Beta</span>
              </div>
              <div className='mt-2 text-white/40 text-xs'>Built on Starknet</div>
            </div>

            {/* Security Notice */}
            <div className='mt-4 p-4 bg-encrypted/10 border border-encrypted/20 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <Shield className='w-4 h-4 text-encrypted' />
                <span className='text-encrypted text-sm font-medium'>ZK Protected</span>
              </div>
              <p className='text-white/70 text-xs mb-3'>All operations use zero-knowledge proofs</p>
              <button className='w-full bg-encrypted text-white text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity'>
                Learn More
              </button>
            </div>

            {/* Compliance Warning (if applicable) */}
            <div className='mt-4 p-3 bg-warning-amber/10 border border-warning-amber/30 rounded-xl'>
              <div className='flex items-center gap-2 mb-1'>
                <AlertTriangle className='w-4 h-4 text-warning-amber' />
                <span className='text-warning-amber text-xs font-medium'>Compliance Required</span>
              </div>
              <p className='text-white/70 text-xs'>Complete KYC for institutional features</p>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
