import type { Note } from '@/utils/notesStorage';
import { useDarkMode } from '@/context/DarkModeContext';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

function NoteCard({ note, onClick }: NoteCardProps) {
  const { isDark } = useDarkMode();

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const preview = note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content;

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isDark
          ? 'bg-slate-700 border border-slate-600 hover:border-slate-500'
          : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <h3 className={`font-semibold mb-2 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {note.title}
      </h3>
      <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {preview}
      </p>
      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
        {formatDate(note.updatedAt)}
      </p>
    </div>
  );
}

export default NoteCard;
