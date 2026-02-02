import React, { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { useBackgroundMode } from '@/context/BackgroundModeContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colors, mode } = useBackgroundMode();

  return (
    <div className={cn(
      'flex min-h-screen flex-col transition-colors duration-500',
      colors.background,
      colors.text
    )}>
      {/* Risk mode overlay */}
      {mode === 'risk' && colors.overlay && (
        <div className={cn(
          'fixed inset-0 pointer-events-none z-0 transition-opacity duration-500',
          colors.overlay
        )} />
      )}

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
