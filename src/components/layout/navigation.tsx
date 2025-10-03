'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Navigation as NavigationData } from '@/lib/cms/types';

interface NavigationProps {
  navigationData: NavigationData;
}

export default function Navigation({ navigationData }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-gray-800" />
              <span className="text-xl font-bold text-gray-900">{navigationData.brandName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigationData.menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  pathname === item.href
                    ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={navigationData.mobileMenuToggleLabel}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigationData.menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-base font-medium transition-colors duration-200',
                    pathname === item.href
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}