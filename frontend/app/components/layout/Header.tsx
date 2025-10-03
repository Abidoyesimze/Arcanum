'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sun,
  Moon,
  Menu,
  Bell,
  User,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayout } from './LayoutProvider';
import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import Link from 'next/link';
import WalletDropdown from '../wallet/WalletDropdown';

interface HeaderProps {
  className?: string;
  showSidebarToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className = '', showSidebarToggle = false }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [walletBalance, setWalletBalance] = useState('0.00');

  const router = useRouter();
  const { toggleSidebar } = useLayout();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting, chainId, account } = useAccount();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Vaults', path: '/dashboard' },
    { label: 'Lend', path: '/lend' },
    { label: 'Borrow', path: '/borrow' },
    { label: 'Compliance', path: '/compliance' },
    { label: 'Docs', path: '/docs' },
  ];

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  // Fetch balance when account is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (account && isConnected && address) {
        try {
          // TODO: Implement actual balance fetching using your token contract
          // Example:
          // const { Contract } = await import('starknet');
          // const tokenContract = new Contract(tokenAbi, tokenAddress, account);
          // const balance = await tokenContract.balanceOf(address);
          // setWalletBalance(formatBalance(balance));

          // For now, using placeholder
          setWalletBalance('0.00');
        } catch (error) {
          console.error('Failed to fetch balance:', error);
          setWalletBalance('0.00');
        }
      }
    };

    fetchBalance();
  }, [account, isConnected, address]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    document.documentElement.setAttribute('data-theme', theme);
  };

  const getNetworkName = (chainId: bigint | undefined): string => {
    if (!chainId) return 'Unknown';

    const networks: Record<string, string> = {
      '0x534e5f4d41494e': 'Mainnet',
      '0x534e5f5345504f4c4941': 'Sepolia',
    };

    const chainIdHex = '0x' + chainId.toString(16);
    return networks[chainIdHex] || 'Unknown';
  };

  const handleLinkClick = (link: string, path: string) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const togglePrivacyMode = () => {
    setPrivacyMode(!privacyMode);
  };


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

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
            <nav className='hidden lg:flex items-center space-x-1'>
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
              {isConnected && (
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
              {isConnected && address ? (
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
                        {walletBalance} ETH
                      </span>
                    )}
                  </div>

                  {/* Network Indicator */}
                  <div className='hidden lg:flex items-center gap-1 bg-stark-gradient px-2 py-1 rounded-md'>
                    <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                    <span className='text-white text-xs font-medium'>
                      {getNetworkName(chainId)}
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
                    <span className='absolute -top-1 -right-1 bg-error-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                      0
                    </span>
                  </button>
                </div>
              ) : null}

              {/* Wallet Dropdown Component */}
              <WalletDropdown />

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
                {isConnected && address && (
                  <div className='flex items-center justify-between p-4 bg-white/10 rounded-lg mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center'>
                        <User className='w-5 h-5 text-white' />
                      </div>
                      <div>
                        <p className='text-white text-sm font-medium'>Starknet User</p>
                        <p className='text-purple-200 text-xs font-jetbrains'>
                          {formatAddress(address)}
                        </p>
                        <div className='flex items-center gap-3 text-xs mt-1'>
                          {privacyMode ? (
                            <span className='text-primary-purple'>●●●●●● ETH</span>
                          ) : (
                            <span className='text-primary-purple'>{walletBalance} ETH</span>
                          )}
                          <span className='text-encrypted'>{getNetworkName(chainId)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => disconnect()}
                      className='text-red-400 text-xs hover:text-red-300 transition-colors'
                    >
                      Disconnect
                    </button>
                  </div>
                )}

                {/* Mobile Connect Wallet */}
                {!isConnected && (
                  <div className='mb-4'>
                    <WalletDropdown className='w-full' />
                  </div>
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
