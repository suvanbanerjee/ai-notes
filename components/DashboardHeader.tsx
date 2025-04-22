'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Search, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function DashboardHeader({ onSearch, searchQuery }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMobileSearch = () => {
    setMobileSearchVisible(!mobileSearchVisible);
    if (!mobileSearchVisible) {
      onSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black shadow-sm border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-black dark:text-white">
              AI Notes
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pr-8 rounded-md bg-stone-100 dark:bg-stone-900 border-transparent focus:border-stone-300 dark:focus:border-stone-700 focus:bg-white dark:focus:bg-black focus:ring-0 text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-stone-400" />
              </div>
            </div>
            <button 
              className="sm:hidden p-2 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900"
              onClick={toggleMobileSearch}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>
            <span className="hidden sm:inline text-sm text-black dark:text-white truncate max-w-[120px] lg:max-w-none">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="p-2 sm:px-3 sm:py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center transition-colors duration-200"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Mobile search */}
        {mobileSearchVisible && (
          <div className="pb-3 px-2 sm:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-md bg-stone-100 dark:bg-stone-900 border-transparent focus:border-stone-300 dark:focus:border-stone-700 focus:bg-white dark:focus:bg-black focus:ring-0 text-sm"
                autoFocus
              />
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => {
                  onSearch('');
                  setMobileSearchVisible(false);
                }}
              >
                <Search className="h-4 w-4 text-stone-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}