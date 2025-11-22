import { X } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';

interface NoteViewModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function NoteViewModal({ isOpen, title, content, onClose, onEdit, onDelete }: NoteViewModalProps) {
  const { isDark } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl shadow-xl max-w-md w-full p-6 transition-colors ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`mb-6 p-4 rounded-lg max-h-64 overflow-y-auto ${
          isDark ? 'bg-slate-700' : 'bg-slate-50'
        }`}>
          <p className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {content}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteViewModal;