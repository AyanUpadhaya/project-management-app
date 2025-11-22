import { AlertTriangle } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

function DeleteConfirmModal({ isOpen, title, onConfirm, onCancel, isDeleting = false }: DeleteConfirmModalProps) {
  const { isDark } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl shadow-xl max-w-sm w-full p-6 transition-colors ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Delete Note
          </h2>
        </div>

        <p className={`mb-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Are you sure you want to delete "<span className="font-semibold">{title}</span>"? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
