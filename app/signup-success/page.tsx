'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupSuccess() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Try to get email from localStorage if it was saved during signup
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-stone-900 rounded-xl shadow-2xl border border-stone-800">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Account Created!
          </h1>
          <p className="mt-4 text-stone-300">
            We've sent a confirmation link to{' '}
            <span className="font-medium text-white">
              {email || 'your email address'}
            </span>
          </p>
          <p className="mt-2 text-stone-400">
            Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-stone-800/50 rounded-lg border border-stone-700">
            <p className="text-sm text-stone-400">
              <span className="text-amber-400">Note:</span> If you don't see the email, please check your spam folder or request a new verification link.
            </p>
          </div>
          
          <div className="pt-4">
            <Link 
              href="/login"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-stone-700 rounded-md shadow-sm text-sm font-medium text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}