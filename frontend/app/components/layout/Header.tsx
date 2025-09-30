'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sun,
  Moon,
  Menu,
  Bell,
  Wallet,
  User,
  LogOut,
  Settings,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayout } from './LayoutProvider';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
  showSidebarToggle?: boolean;
}

interface WalletData {
  address: string;
  balance: string;
  network: 'mainnet' | 'testnet';
  notifications: number;
  userName: string;
  privacyMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ className = '', showSidebarToggle = false }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const router = useRouter();
  const { toggleSidebar } = useLayout();

  // Dummy wallet data
  const walletData: WalletData = {
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    balance: '1,234.56',
    network: 'mainnet',
    notifications: 3,
    userName: 'Anonymous User',
    privacyMode: true,
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Vaults', path: '/dashboard' },
    { label: 'Lend', path: '/lend' },
    { label: 'Borrow', path: '/borrow' },
    { label: 'Compliance', path: '/compliance' },
    { label: 'Docs', path: '/docs' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsWalletConnected(true);
      console.log('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setShowWalletMenu(false);
    console.log('Wallet disconnected');
  };

  const handleLinkClick = (link: string, path: string) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const togglePrivacyMode = () => {
    setPrivacyMode(!privacyMode);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
      if (showWalletMenu && !target.closest('.wallet-menu-container')) {
        setShowWalletMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, showWalletMenu]);

  return (
    <>
      <header className={`header-gradient sticky top-0 z-50 ${className}`}>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16 lg:h-20'>
            {/* Left Section */}
            <div className='flex items-center space-x-3'>
              {showSidebarToggle && (
                <button
                  onClick={toggleSidebar}
                  className='lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200'
                  aria-label='Toggle sidebar'
                >
                  <Menu className='w-5 h-5' />
                </button>
              )}

              {/* Logo */}
              <Link href='/' className='flex items-center space-x-3'>
                <div className='w-10 h-10 lg:w-12 lg:h-12 bg-primary-gradient rounded-xl flex items-center justify-center'>
                  <Shield className='w-6 h-6 lg:w-7 lg:h-7 text-white' />
                </div>
                <div>
                  <span className='text-white text-xl lg:text-2xl font-bold font-space-grotesk'>
                    Arcanum
                  </span>
                  <div className='hidden sm:block'>
                    <span className='text-purple-200 text-xs font-medium'>
                      Privacy DeFi Protocol
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Center - Navigation Links (Desktop) */}
            <nav
              className={`hidden lg:flex items-center space-x-1 ${showSidebarToggle ? 'lg:flex' : 'lg:flex'}`}
            >
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.label, link.path)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm xl:text-base focus-ring ${
                    activeLink === link.label ? 'nav-active text-white' : 'text-white/80 nav-hover'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className='flex items-center gap-2 flex-shrink-0'>
              {/* Privacy Mode Toggle */}
              {isWalletConnected && (
                <button
                  onClick={togglePrivacyMode}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    privacyMode
                      ? 'bg-encrypted-gradient text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  aria-label='Toggle privacy mode'
                  title={privacyMode ? 'Privacy Mode: ON' : 'Privacy Mode: OFF'}
                >
                  {privacyMode ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className='p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus-ring'
                aria-label='Toggle theme'
              >
                {isDarkMode ? (
                  <Sun className='w-5 h-5 text-white' />
                ) : (
                  <Moon className='w-5 h-5 text-white' />
                )}
              </button>

              {/* Wallet Section */}
              {isWalletConnected ? (
                <div className='flex items-center gap-2'>
                  {/* Balance Display */}
                  <div className='hidden md:flex items-center gap-2 bg-primary-gradient px-3 py-1.5 rounded-lg'>
                    <Lock className='w-3 h-3 text-white' />
                    {privacyMode ? (
                      <span className='text-white font-semibold text-sm font-jetbrains'>
                        ●●●●●●
                      </span>
                    ) : (
                      <span className='text-white font-semibold text-sm font-jetbrains'>
                        {walletData.balance} ETH
                      </span>
                    )}
                  </div>

                  {/* Network Indicator */}
                  <div className='hidden lg:flex items-center gap-1 bg-stark-gradient px-2 py-1 rounded-md'>
                    <div className='w-2 h-2 bg-white rounded-full'></div>
                    <span className='text-white text-xs font-medium capitalize'>
                      {walletData.network}
                    </span>
                  </div>

                  {/* ZK Proof Status */}
                  <div className='hidden lg:flex items-center gap-1 bg-encrypted px-2 py-1 rounded-md'>
                    <Shield className='w-3 h-3 text-encrypted' />
                    <span className='text-encrypted text-xs font-medium'>ZK Verified</span>
                  </div>

                  {/* Notifications */}
                  <button className='relative p-2 rounded-full hover:bg-white/20 transition-colors duration-200'>
                    <Bell className='w-5 h-5 text-white' />
                    {walletData.notifications > 0 && (
                      <span className='absolute -top-1 -right-1 bg-error-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                        {walletData.notifications}
                      </span>
                    )}
                  </button>

                  {/* Wallet Menu */}
                  <div className='wallet-menu-container relative'>
                    <button
                      onClick={() => setShowWalletMenu(!showWalletMenu)}
                      className='flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 transition-all duration-200'
                    >
                      <div className='w-8 h-8 bg-primary-gradient rounded-full flex items-center justify-center'>
                        <User className='w-4 h-4 text-white' />
                      </div>
                      <div className='hidden sm:block text-left'>
                        <p className='text-white text-sm font-medium'>{walletData.userName}</p>
                        <p className='text-purple-200 text-xs font-jetbrains'>
                          {formatAddress(walletData.address)}
                        </p>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showWalletMenu && (
                      <div className='absolute right-0 top-full mt-2 w-64 bg-card-dark rounded-xl shadow-xl z-50 fade-in'>
                        <div className='p-4 border-b border-gray-700'>
                          <p className='text-white font-medium'>{walletData.userName}</p>
                          <p className='text-gray-400 text-sm font-jetbrains'>
                            {formatAddress(walletData.address)}
                          </p>
                          <div className='mt-2 flex items-center gap-2'>
                            <div className='wallet-connected px-2 py-1 rounded-md text-xs'>
                              Connected
                            </div>
                            <span className='text-gray-400 text-xs'>{walletData.network}</span>
                          </div>
                        </div>

                        <div className='p-2'>
                          <button
                            onClick={() => router.push('/dashboard')}
                            className='w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors'
                          >
                            <Shield className='w-4 h-4' />
                            My Vaults
                          </button>
                          <button
                            onClick={() => router.push('/settings')}
                            className='w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors'
                          >
                            <Settings className='w-4 h-4' />
                            Settings
                          </button>
                          <button
                            onClick={togglePrivacyMode}
                            className='w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors'
                          >
                            {privacyMode ? (
                              <EyeOff className='w-4 h-4' />
                            ) : (
                              <Eye className='w-4 h-4' />
                            )}
                            Privacy Mode: {privacyMode ? 'ON' : 'OFF'}
                          </button>
                          <div className='border-t border-gray-700 my-2'></div>
                          <button
                            onClick={handleDisconnectWallet}
                            className='w-full flex items-center gap-3 px-3 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
                          >
                            <LogOut className='w-4 h-4' />
                            Disconnect
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Connect Wallet Button */
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className={`btn-primary font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm focus-ring ${
                    isConnecting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Wallet className='w-4 h-4' />
                  {isConnecting ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Connecting...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              )}

              {/* Mobile Menu Toggle */}
              {!showSidebarToggle && (
                <button
                  onClick={toggleMobileMenu}
                  className='lg:hidden p-2 focus-ring'
                  aria-label='Toggle menu'
                >
                  <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className='hamburger-line'></div>
                    <div className='hamburger-line'></div>
                    <div className='hamburger-line'></div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {!showSidebarToggle && isMobileMenuOpen && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'>
            <div className='flex justify-end p-4'>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className='p-2 text-white'
                aria-label='Close menu'
              >
                <div className='hamburger open'>
                  <div className='hamburger-line'></div>
                  <div className='hamburger-line'></div>
                  <div className='hamburger-line'></div>
                </div>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {!showSidebarToggle && (
        <div
          className={`
          mobile-menu-container fixed top-16 left-0 right-0 z-50 lg:hidden
          transform transition-all duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-full opacity-0 pointer-events-none'
          }
        `}
        >
          <div className='mobile-menu'>
            <nav className='max-w-[90vw] mx-auto px-4 py-4'>
              <div className='flex flex-col space-y-2'>
                {/* Mobile Wallet Info */}
                {isWalletConnected && (
                  <div className='flex items-center justify-between p-4 bg-white/10 rounded-lg mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center'>
                        <User className='w-5 h-5 text-white' />
                      </div>
                      <div>
                        <p className='text-white text-sm font-medium'>{walletData.userName}</p>
                        <p className='text-purple-200 text-xs font-jetbrains'>
                          {formatAddress(walletData.address)}
                        </p>
                        <div className='flex items-center gap-3 text-xs mt-1'>
                          {privacyMode ? (
                            <span className='text-primary-purple'>●●●●●● ETH</span>
                          ) : (
                            <span className='text-primary-purple'>{walletData.balance} ETH</span>
                          )}
                          <span className='text-encrypted capitalize'>{walletData.network}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleDisconnectWallet}
                      className='text-red-400 text-xs hover:text-red-300 transition-colors'
                    >
                      Disconnect
                    </button>
                  </div>
                )}

                {/* Mobile Connect Wallet */}
                {!isWalletConnected && (
                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className='btn-primary w-full justify-center mb-4'
                  >
                    <Wallet className='w-4 h-4' />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}

                {navLinks.map((link, index) => (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.label, link.path)}
                    className={`
                      px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium
                      transform hover:scale-105 focus-ring
                      ${
                        activeLink === link.label
                          ? 'nav-active text-white'
                          : 'text-white/80 nav-hover'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
