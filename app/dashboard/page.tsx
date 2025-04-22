"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useNotes } from "@/lib/note-queries";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Star, Clock, X, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClass = size === "small" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        className={`${sizeClass} animate-spin text-stone-500 dark:text-stone-400`}
      />
    </div>
  );
};

const NoteCardSkeleton = () => (
  <div className="bg-white dark:bg-black overflow-hidden shadow-sm rounded-lg h-full border border-stone-200 dark:border-stone-800 animate-pulse">
    <div className="px-4 py-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
      </div>
      <div className="mt-1 flex-grow">
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full mb-2"></div>
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-4/6"></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-12"></div>
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-16"></div>
        </div>
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { data: notes, isLoading: notesLoading } = useNotes();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleNavigate = (path: string) => {
    setIsTransitioning(true);
    router.push(path);
  };

  const filteredNotes = notes?.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      activeTag === null || (note.tags && note.tags.includes(activeTag));

    return matchesSearch && matchesTag;
  });

  const allTags = notes
    ? Array.from(new Set(notes.flatMap((note) => note.tags || []))).sort()
    : [];

  if (isLoading || !user || isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <div className="text-xl font-medium text-stone-800 dark:text-stone-200">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Using our new DashboardHeader component */}
      <DashboardHeader searchQuery={searchQuery} onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-black rounded-lg shadow-sm p-4 lg:sticky lg:top-20 border border-stone-200 dark:border-stone-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-black dark:text-white">
                  Filters
                </h3>
                {activeTag && (
                  <button
                    onClick={() => setActiveTag(null)}
                    className="text-xs flex items-center text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors duration-200"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </button>
                )}
              </div>

              <div className="mb-4">
                <Link
                  href="/dashboard/new"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Link>
              </div>

              {allTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-black dark:text-white mb-2">
                    Tags
                  </h4>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700 scrollbar-track-transparent">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setActiveTag(activeTag === tag ? null : tag)
                        }
                        className={`w-full text-left px-2 py-1 rounded-md text-sm transition-colors duration-200 ${
                          activeTag === tag
                            ? "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                            : "text-black dark:text-white hover:bg-stone-100 dark:hover:bg-stone-900"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                {activeTag ? `Notes tagged with "${activeTag}"` : "All Notes"}
              </h2>
              {searchQuery && (
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Search results for "{searchQuery}"
                </p>
              )}
            </div>

            {notesLoading ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <NoteCardSkeleton key={i} />
                ))}
              </div>
            ) : !filteredNotes || filteredNotes.length === 0 ? (
              <div className="bg-white dark:bg-black shadow-sm rounded-lg p-5 sm:p-6 text-center border border-stone-200 dark:border-stone-800">
                <div className="text-stone-600 dark:text-stone-400 mb-2">
                  {notes && notes.length > 0
                    ? "No notes match your search criteria."
                    : "You don't have any notes yet."}
                </div>
                {(!notes || notes.length === 0) && (
                  <div className="mt-4">
                    <Link
                      href="/dashboard/new"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Note
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                {filteredNotes.map((note) => (
                  <Link
                    href={`/dashboard/notes/${note.id}`}
                    key={note.id}
                    className="block group"
                  >
                    <div
                      className={`bg-white dark:bg-black overflow-hidden shadow-sm hover:shadow-md rounded-lg transition-all duration-200 h-full border border-stone-200 dark:border-stone-800 ${
                        note.is_favorited ? "ring-2 ring-yellow-400" : ""
                      } hover:translate-y-[-2px]`}
                    >
                      <div className="px-4 py-5 sm:p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-medium text-black dark:text-white line-clamp-1 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-200">
                            {note.title || "Untitled Note"}
                          </h3>
                          {note.is_favorited && (
                            <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 fill-current" />
                          )}
                        </div>
                        <div className="mt-1 flex-grow">
                          <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3">
                            {note.content}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {note.tags &&
                              note.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(new Date(note.updated_at), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
