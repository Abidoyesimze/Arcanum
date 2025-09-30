import React from 'react';
import {
  Shield,
  Lock,
  Zap,
  Twitter,
  Github,
  MessageCircle,
  FileText,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

interface FooterLink {
  id: number;
  title: string;
  href: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const protocolLinks: FooterLink[] = [
    { id: 1, title: 'Private Vaults', href: '/dashboard' },
    { id: 2, title: 'Lend', href: '/lend' },
    { id: 3, title: 'Borrow', href: '/borrow' },
    { id: 4, title: 'Markets', href: '/markets' },
    { id: 5, title: 'Analytics', href: '/analytics' },
  ];

  const complianceLinks: FooterLink[] = [
    { id: 6, title: 'Compliance Dashboard', href: '/compliance' },
    { id: 7, title: 'ZK Proofs', href: '/proofs' },
    { id: 8, title: 'Audit Reports', href: '/audits' },
    { id: 9, title: 'Regulatory Info', href: '/regulatory' },
    { id: 10, title: 'Security', href: '/security' },
  ];

  const legalLinks: FooterLink[] = [
    { id: 11, title: 'Privacy Policy', href: '/privacy' },
    { id: 12, title: 'Terms of Service', href: '/terms' },
    { id: 13, title: 'Risk Disclosure', href: '/risks' },
    { id: 14, title: 'Cookie Policy', href: '/cookies' },
    { id: 15, title: 'Licenses', href: '/licenses' },
  ];

  const developerLinks: FooterLink[] = [
    { id: 16, title: 'Documentation', href: '/docs' },
    { id: 17, title: 'API Reference', href: '/api' },
    { id: 18, title: 'Smart Contracts', href: '/contracts' },
    { id: 19, title: 'GitHub', href: 'https://github.com/arcanum' },
    { id: 20, title: 'Bug Bounty', href: '/bounty' },
  ];

  return (
    <footer className='footer-gradient text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center'>
                <Shield className='w-7 h-7 text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white font-space-grotesk'>Arcanum</h3>
                <p className='text-purple-200 text-sm font-medium'>Privacy DeFi Protocol</p>
              </div>
            </div>

            <p className='text-gray-300 mb-6 leading-relaxed font-inter'>
              Privacy-preserving DeFi infrastructure on Starknet. Trade, lend, and borrow without
              exposing your portfolio. Zero-knowledge proofs ensure privacy while maintaining
              regulatory compliance.
            </p>

            {/* Key Features */}
            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-encrypted/20 rounded-lg flex items-center justify-center'>
                  <Lock className='w-4 h-4 text-encrypted' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Private</p>
                  <p className='text-gray-400 text-xs'>Hidden balances</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-primary-purple/20 rounded-lg flex items-center justify-center'>
                  <Shield className='w-4 h-4 text-primary-purple' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Secure</p>
                  <p className='text-gray-400 text-xs'>ZK Proofs</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-warning-amber/20 rounded-lg flex items-center justify-center'>
                  <Zap className='w-4 h-4 text-warning' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Fast</p>
                  <p className='text-gray-400 text-xs'>Starknet L2</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-encrypted/20 rounded-lg flex items-center justify-center'>
                  <CheckCircle className='w-4 h-4 text-encrypted' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Compliant</p>
                  <p className='text-gray-400 text-xs'>Regulated</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className='flex items-center gap-3'>
              <a
                href='https://twitter.com/arcanum'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white/10 hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <Twitter className='w-5 h-5 text-purple-400' />
              </a>
              <a
                href='https://github.com/arcanum'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white/10 hover:bg-gray-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <Github className='w-5 h-5 text-gray-300' />
              </a>
              <a
                href='https://discord.gg/arcanum'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white/10 hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <MessageCircle className='w-5 h-5 text-purple-400' />
              </a>
              <a
                href='/docs'
                className='w-10 h-10 bg-white/10 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <FileText className='w-5 h-5 text-green-400' />
              </a>
            </div>
          </div>

          {/* Protocol Links */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>Protocol</h4>
            <ul className='space-y-3'>
              {protocolLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-purple-400 transition-colors duration-200 text-sm'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Links */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>Compliance</h4>
            <ul className='space-y-3'>
              {complianceLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-purple-400 transition-colors duration-200 text-sm'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Security Badge */}
            <div className='mt-6 p-3 bg-encrypted/10 border border-encrypted/20 rounded-lg'>
              <p className='text-encrypted text-xs font-medium mb-1'>Audited by CertiK</p>
              <p className='text-gray-300 text-xs'>Smart contracts verified</p>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>Legal</h4>
            <ul className='space-y-3'>
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-purple-400 transition-colors duration-200 text-sm'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Regulatory Badges */}
            <div className='mt-6 space-y-2'>
              <div className='flex items-center gap-2 text-xs'>
                <Shield className='w-4 h-4 text-encrypted' />
                <span className='text-encrypted'>SEC Compliant</span>
              </div>
              <div className='flex items-center gap-2 text-xs'>
                <Shield className='w-4 h-4 text-purple-400' />
                <span className='text-purple-400'>GDPR Ready</span>
              </div>
              <div className='flex items-center gap-2 text-xs'>
                <Shield className='w-4 h-4 text-blue-400' />
                <span className='text-blue-400'>SOC 2 Type II</span>
              </div>
            </div>
          </div>

          {/* Developers */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>Developers</h4>
            <ul className='space-y-3'>
              {developerLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-purple-400 transition-colors duration-200 text-sm'
                    {...(link.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Dev CTA */}
            <div className='mt-6 p-3 bg-primary-gradient/20 border border-primary-purple/30 rounded-lg'>
              <p className='text-purple-300 text-xs font-medium mb-1'>Build with Arcanum</p>
              <p className='text-gray-300 text-xs mb-2'>Integrate privacy into your DeFi app</p>
              <a
                href='/developers'
                className='inline-block bg-primary-gradient text-white text-xs font-medium px-3 py-1 rounded hover:opacity-90 transition-opacity'
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 pt-8 border-t border-white/10'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
            {/* Copyright */}
            <div className='text-center lg:text-left'>
              <p className='text-gray-400 text-sm font-inter'>
                © {currentYear} Arcanum Protocol • All Rights Reserved • Built on Starknet
              </p>
              <p className='text-gray-500 text-xs mt-1 font-inter'>
                Privacy-preserving DeFi for everyone
              </p>
            </div>

            {/* Compliance & Security Badges */}
            <div className='flex flex-wrap items-center gap-3 justify-center lg:justify-end'>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-encrypted/10 border border-encrypted/30 rounded-lg'>
                <Shield className='w-4 h-4 text-encrypted' />
                <span className='text-encrypted text-xs font-medium font-jetbrains'>
                  Zero-Knowledge Proofs
                </span>
              </div>

              <div className='flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg'>
                <Lock className='w-4 h-4 text-primary-purple' />
                <span className='text-primary-purple text-xs font-medium font-jetbrains'>
                  End-to-End Encrypted
                </span>
              </div>

              <div className='flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg'>
                <Zap className='w-4 h-4 text-blue-400' />
                <span className='text-blue-400 text-xs font-medium font-jetbrains'>
                  Starknet L2
                </span>
              </div>
            </div>
          </div>

          {/* Additional Legal Notice */}
          <div className='mt-6 p-4 bg-white/5 rounded-lg'>
            <p className='text-gray-400 text-xs leading-relaxed font-inter'>
              <strong>Important:</strong> Arcanum Protocol is an experimental DeFi protocol. While
              we implement industry-leading zero-knowledge cryptography and security measures, all
              DeFi protocols carry inherent risks. Users should understand the risks of smart
              contracts, privacy systems, and decentralized finance before participating. This
              platform is not available in restricted jurisdictions. Always conduct your own
              research and consult with qualified professionals before making financial decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
