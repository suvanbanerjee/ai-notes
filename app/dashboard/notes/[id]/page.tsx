'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useNote, useNoteSummary, useToggleFavorite, useDeleteNote } from '@/lib/note-queries';
import Link from 'next/link';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Star, Edit, Trash, ChevronLeft, Clock, Cpu, Loader2 } from 'lucide-react';

// Reusable loader component for consistent loading states
const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin text-stone-500 dark:text-stone-400`} />
    </div>
  );
};

export default function NotePage({ params }: { params: { id: string } }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Use the TanStack Query hooks
  const { data: note, isLoading: noteLoading } = useNote(params.id);
  const { data: summary, isLoading: summaryLoading } = useNoteSummary(
    params.id, 
    note?.content || ''
  );
  const toggleFavoriteMutation = useToggleFavorite();
  const deleteNoteMutation = useDeleteNote();
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Add transition state when navigating
  const handleNavigate = (path: string) => {
    setIsTransitioning(true);
    router.push(path);
  };

  const handleToggleFavorite = async () => {
    if (!note) return;
    
    try {
      const newFavoriteState = !note.is_favorited;
      toggleFavoriteMutation.mutate({ 
        noteId: note.id, 
        isFavorite: newFavoriteState 
      });
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!note) return;
    
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      setIsTransitioning(true);
      deleteNoteMutation.mutate(note.id, {
        onSuccess: () => router.push('/dashboard')
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      setIsTransitioning(false);
    }
  };

  const isLoading = authLoading || noteLoading || isTransitioning || deleteNoteMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <div className="text-xl font-medium text-stone-800 dark:text-stone-200">Loading...</div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900">
        <div className="text-xl text-stone-800 dark:text-stone-200">Note not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-black shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-black dark:text-white">
                AI Notes
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${
                  note.is_favorited 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-stone-400 hover:text-yellow-500'
                }`}
                aria-label={note.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className="w-5 h-5" fill={note.is_favorited ? "currentColor" : "none"} />
              </button>
              <Link
                href={`/dashboard/notes/${note.id}/edit`}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-full"
                aria-label="Edit note"
              >
                <Edit className="w-5 h-5" />
              </Link>
              <button
                onClick={handleDeleteNote}
                className="p-2 text-stone-400 hover:text-red-500 rounded-full"
                aria-label="Delete note"
              >
                <Trash className="w-5 h-5" />
              </button>
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-black shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            {/* Title and metadata */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-4">{note.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(note.updated_at), 'MMMM d, yyyy h:mm a')}
                </span>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* AI Summary */}
            {summary && (
              <div className="mb-8 p-4 bg-stone-100 dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-800">
                <h2 className="text-md font-medium text-black dark:text-white mb-2 flex items-center">
                  <Cpu className="w-5 h-5 mr-2 text-stone-600 dark:text-stone-400" />
                  AI Summary
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  {summary}
                </p>
              </div>
            )}
            
            {/* Note Content with Markdown */}
            <div className="prose dark:prose-invert prose-stone max-w-none prose-img:rounded-md prose-headings:border-b prose-headings:border-stone-200 dark:prose-headings:border-stone-800 prose-headings:pb-2">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}