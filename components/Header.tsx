'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  showAuthButtons?: boolean;
}

export default function Header({ showAuthButtons = true }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-black shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo - Always visible */}
          <div className="flex items-center space-x-2">
            <Link href={user ? '/dashboard' : '/'} className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              AI Notes
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-black dark:text-white truncate max-w-[120px] lg:max-w-none">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center transition-colors duration-200"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : showAuthButtons && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white border border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 rounded-md transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-stone-800 hover:bg-stone-700 rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 mt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-black dark:text-white truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-3 text-left text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-black dark:hover:text-white rounded-md transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : showAuthButtons && (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 text-center text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-black dark:hover:text-white rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-3 text-center text-sm font-medium text-white bg-stone-800 hover:bg-stone-700 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}