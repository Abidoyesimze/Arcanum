'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LayoutContextType {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setSidebarOpen = (open: boolean) => setIsSidebarOpen(open);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};
