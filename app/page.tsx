"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Sparkles, Globe, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-black dark:text-white">
      {/* Using the reusable Header component */}
      <Header />

      <main>
        {/* Hero Section with improved responsiveness */}
        <section className="relative py-12 sm:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-black dark:text-white">
                  Smart Note-Taking with AI
                </h1>
                <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-400">
                  Supercharge your productivity with AI-powered note
                  summarization and organization.
                </p>
                <div className="mt-8 sm:mt-10">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-md text-white bg-stone-800 hover:bg-stone-700 font-medium shadow-sm transition-all flex items-center justify-center sm:inline-flex"
                  >
                    Get started for free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Note Card Preview */}
              <div className="md:w-2/5 mt-8 md:mt-0">
                <div className="bg-white dark:bg-black shadow-lg rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800">
                  <div className="p-4 sm:p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="text-lg font-medium text-black dark:text-white">
                        Meeting Notes
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                        Work
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Today we discussed the new product launch strategy. Key
                      points:
                      <br />- Launch timeline: June 15th
                      <br />- Marketing campaign to start May 20th
                      <br />- Budget allocation finalized
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        Updated 2 hours ago
                      </div>
                      <div className="flex space-x-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                          meeting
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-white dark:bg-black border-t border-stone-200 dark:border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-black dark:text-white">
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-stone-50 dark:bg-stone-900 p-5 sm:p-6 rounded-lg shadow-sm hover:shadow transition-all border border-stone-200 dark:border-stone-800">
                <div className="flex justify-center mb-4">
                  <div className="bg-stone-200 dark:bg-stone-800 p-3 rounded-full">
                    <FileText className="h-5 sm:h-6 w-5 sm:w-6 text-stone-700 dark:text-stone-300" />
                  </div>
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-bold text-black dark:text-white text-center">
                  Take Smart Notes
                </h3>
                <p className="mt-3 text-stone-600 dark:text-stone-400 text-center">
                  Capture your thoughts, ideas, and important information in an
                  organized way.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-stone-50 dark:bg-stone-900 p-5 sm:p-6 rounded-lg shadow-sm hover:shadow transition-all border border-stone-200 dark:border-stone-800">
                <div className="flex justify-center mb-4">
                  <div className="bg-stone-200 dark:bg-stone-800 p-3 rounded-full">
                    <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-stone-700 dark:text-stone-300" />
                  </div>
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-bold text-black dark:text-white text-center">
                  AI-Powered Summaries
                </h3>
                <p className="mt-3 text-stone-600 dark:text-stone-400 text-center">
                  Get automatic summarization of your notes, saving you time and
                  enhancing productivity.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-stone-50 dark:bg-stone-900 p-5 sm:p-6 rounded-lg shadow-sm hover:shadow transition-all border border-stone-200 dark:border-stone-800 sm:col-span-2 lg:col-span-1 mx-auto lg:mx-0 w-full sm:w-1/2 lg:w-full">
                <div className="flex justify-center mb-4">
                  <div className="bg-stone-200 dark:bg-stone-800 p-3 rounded-full">
                    <Globe className="h-5 sm:h-6 w-5 sm:w-6 text-stone-700 dark:text-stone-300" />
                  </div>
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-bold text-black dark:text-white text-center">
                  Access Anywhere
                </h3>
                <p className="mt-3 text-stone-600 dark:text-stone-400 text-center">
                  Your notes are securely stored in the cloud, accessible from
                  any device, anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-black dark:text-white">
              Ready to get started?
            </h2>
            <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 mb-8 sm:mb-10">
              Join thousands of users already enhancing their productivity with
              AI Notes.
            </p>
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-md text-white bg-stone-800 hover:bg-stone-700 font-medium shadow-sm transition-all inline-flex items-center justify-center"
            >
              Create your free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-black border-t border-stone-200 dark:border-stone-800 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-stone-500 dark:text-stone-400">
              © {new Date().getFullYear()} AI Notes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
