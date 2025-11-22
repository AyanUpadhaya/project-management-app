export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const NOTES_KEY = 'devtools_notes';

export function getNotes(): Note[] {
  try {
    const notes = localStorage.getItem(NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch {
    return [];
  }
}

export function saveNote(title: string, content: string): Note {
  const notes = getNotes();
  const newNote: Note = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  notes.push(newNote);
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  return newNote;
}

export function updateNote(id: string, title: string, content: string): Note | null {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === id);
  if (index === -1) return null;

  notes[index] = {
    ...notes[index],
    title,
    content,
    updatedAt: Date.now(),
  };
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  return notes[index];
}

export function deleteNote(id: string): boolean {
  const notes = getNotes();
  const filtered = notes.filter(note => note.id !== id);
  if (filtered.length === notes.length) return false;
  localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
  return true;
}
