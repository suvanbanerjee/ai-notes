export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_favorited: boolean;
};

export type NoteSummary = {
  id: string;
  note_id: string;
  summary: string;
  created_at: string;
};

export type NoteTag = {
  id: string;
  name: string;
  color: string;
  user_id: string;
};
