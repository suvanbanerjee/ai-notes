'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { Note, NoteSummary } from './types';
import { summarizeNote } from './gemini';

// Query keys
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...noteKeys.lists(), filters] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
  summaries: () => [...noteKeys.all, 'summaries'] as const,
  summary: (noteId: string) => [...noteKeys.summaries(), noteId] as const,
};

// Get all notes
export function useNotes() {
  return useQuery({
    queryKey: noteKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Note[];
    },
  });
}

// Get a single note by ID
export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    enabled: !!id,
  });
}

// Get a note summary
export function useNoteSummary(noteId: string, noteContent: string) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: noteKeys.summary(noteId),
    queryFn: async () => {
      // First try to get from database
      const { data, error } = await supabase
        .from('note_summaries')
        .select('summary')
        .eq('note_id', noteId)
        .maybeSingle();
      
      if (error) throw error;
      
      // If summary exists, return it
      if (data) return data.summary;
      
      // Otherwise generate a new summary
      const summary = await summarizeNote(noteContent);
      
      // Save the summary
      await supabase
        .from('note_summaries')
        .insert([{ note_id: noteId, summary }]);
      
      return summary;
    },
    enabled: !!noteId && !!noteContent,
  });

  // Add a function to regenerate the summary on demand
  const regenerateSummary = async () => {
    if (!noteId || !noteContent) return;
    
    // Generate a new summary
    const newSummary = await summarizeNote(noteContent);
    
    // Update or insert the summary in the database
    const { error } = await supabase
      .from('note_summaries')
      .upsert([{ note_id: noteId, summary: newSummary }], { onConflict: 'note_id' });
    
    if (error) throw error;
    
    // Update the cache
    queryClient.setQueryData(noteKeys.summary(noteId), newSummary);
    
    return newSummary;
  };

  return {
    ...query,
    regenerateSummary
  };
}

// Toggle favorite status
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ noteId, isFavorite }: { noteId: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from('notes')
        .update({ is_favorited: isFavorite })
        .eq('id', noteId);
      
      if (error) throw error;
      return { noteId, isFavorite };
    },
    onSuccess: (data) => {
      // Update the note in the cache
      queryClient.setQueryData(
        noteKeys.detail(data.noteId),
        (oldData: Note | undefined) => {
          if (!oldData) return undefined;
          return { ...oldData, is_favorited: data.isFavorite };
        }
      );
      
      // Also update the note in the list cache
      queryClient.setQueryData(
        noteKeys.lists(),
        (oldData: Note[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(note => 
            note.id === data.noteId ? { ...note, is_favorited: data.isFavorite } : note
          );
        }
      );
    },
  });
}

// Delete note
export function useDeleteNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (noteId: string) => {
      // Delete the note summary first
      await supabase
        .from('note_summaries')
        .delete()
        .eq('note_id', noteId);
        
      // Then delete the note
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
      
      if (error) throw error;
      return noteId;
    },
    onSuccess: (noteId) => {
      // Remove from the single note cache
      queryClient.removeQueries({ queryKey: noteKeys.detail(noteId) });
      
      // Remove from the summary cache
      queryClient.removeQueries({ queryKey: noteKeys.summary(noteId) });
      
      // Update the notes list cache
      queryClient.setQueryData(
        noteKeys.lists(),
        (oldData: Note[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.filter(note => note.id !== noteId);
        }
      );
    },
  });
}

// Update note
export function useUpdateNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      noteId, 
      title, 
      content, 
      tags 
    }: { 
      noteId: string; 
      title: string; 
      content: string; 
      tags?: string[] 
    }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          title, 
          content, 
          tags, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Generate a new summary after updating the note
      const newSummary = await summarizeNote(content);
      
      // Update the summary in the database
      await supabase
        .from('note_summaries')
        .upsert([{ note_id: noteId, summary: newSummary }], { onConflict: 'note_id' });
      
      return { 
        note: data as Note, 
        summary: newSummary 
      };
    },
    onSuccess: (result) => {
      const { note: updatedNote, summary } = result;
      
      // Update the note in the cache
      queryClient.setQueryData(
        noteKeys.detail(updatedNote.id),
        updatedNote
      );
      
      // Also update the note in the list cache
      queryClient.setQueryData(
        noteKeys.lists(),
        (oldData: Note[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(note => 
            note.id === updatedNote.id ? updatedNote : note
          );
        }
      );
      
      // Update the summary cache with the new summary
      queryClient.setQueryData(
        noteKeys.summary(updatedNote.id),
        summary
      );
    },
  });
}