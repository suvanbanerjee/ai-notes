'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { summarizeNote } from '@/lib/gemini';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { X, Save, ChevronLeft, Edit, Eye, Loader2 } from 'lucide-react';

// Reusable loader component for consistent loading states
const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin text-stone-500 dark:text-stone-400`} />
    </div>
  );
};

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your note');
      return;
    }

    if (!content.trim()) {
      setError('Please enter some content for your note');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a note');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, insert the note
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            tags,
            user_id: user.id,
          },
        ])
        .select();

      if (noteError) throw noteError;
      
      if (!noteData || noteData.length === 0) {
        throw new Error('Failed to create note');
      }

      const newNote = noteData[0];

      // Then, generate a summary using Gemini AI
      const summary = await summarizeNote(content);

      // Save the summary to the database
      const { error: summaryError } = await supabase
        .from('note_summaries')
        .insert([
          {
            note_id: newNote.id,
            summary,
          },
        ]);

      if (summaryError) {
        console.error('Error saving summary:', summaryError);
        // We don't want to block the user if summary fails
      }

      // Redirect to the new note
      router.push(`/dashboard/notes/${newNote.id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <div className="text-xl font-medium text-stone-800 dark:text-stone-200">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <nav className="bg-white dark:bg-black shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-black dark:text-white">
                AI Notes
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveNote}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? <LoadingSpinner size="small" /> : 'Save Note'}
              </button>
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-stone-100 dark:hover:bg-stone-900 flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-black shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="w-full px-4 py-2 text-2xl font-bold bg-transparent border-0 border-b-2 border-stone-200 dark:border-stone-800 focus:ring-0 focus:border-stone-500 dark:focus:border-stone-400 placeholder-stone-400 dark:placeholder-stone-600 text-black dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 flex items-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tags (press Enter to add)"
                  className="flex-grow px-3 py-2 bg-stone-100 dark:bg-stone-900 text-black dark:text-white border border-stone-300 dark:border-stone-700 rounded-l-md focus:outline-none focus:ring-stone-500 focus:border-stone-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-stone-800 text-white rounded-r-md hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="mb-4 flex space-x-2">
              <button
                onClick={() => setIsPreview(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                  !isPreview 
                    ? 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200' 
                    : 'text-black dark:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                  isPreview 
                    ? 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200' 
                    : 'text-black dark:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </button>
            </div>
            
            {!isPreview ? (
              <div className="mb-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note content..."
                  rows={20}
                  className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-900 text-black dark:text-white border border-stone-300 dark:border-stone-700 rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 font-mono"
                ></textarea>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  Use Markdown for formatting.
                </p>
              </div>
            ) : (
              <div className="mb-6 prose dark:prose-invert prose-stone max-w-none border border-stone-200 dark:border-stone-800 rounded-md p-4">
                {content ? (
                  <div className="markdown-preview">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]} 
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-stone-400 dark:text-stone-500">Nothing to preview</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}