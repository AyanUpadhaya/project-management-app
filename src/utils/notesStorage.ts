export interface Note {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  created_at?: string | number;
  updated_at?: string | number;
}

const NOTES_KEY = "devtools_notes";

