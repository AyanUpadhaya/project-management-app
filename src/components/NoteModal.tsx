import { X } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';

interface NoteModalProps {
  isOpen: boolean;
  inputTitle: string;
  inputContent: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onClose: () => void;
  isSaving?: boolean;
  modalTitle: string;
  submitButtonText?: string;
  title?: string;
  content?: string;
}

function NoteModal({
  isOpen,
  inputTitle,
  inputContent,
  onTitleChange,
  onContentChange,
  onSave,
  onClose,
  isSaving = false,
  modalTitle,
  submitButtonText = 'Save Note',
}: NoteModalProps) {
  const { isDark } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl shadow-xl max-w-md w-full p-6 transition-colors ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {modalTitle}
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

        <div className="space-y-4 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Title
            </label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter note title"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Note
            </label>
            <textarea
              value={inputContent}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Enter your note content"
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!inputTitle.trim() || !inputContent.trim() || isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;