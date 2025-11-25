import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';

import NoteModal from '../components/NoteModal';
import NoteViewModal from '../components/NoteViewModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import NoteCard from '../components/NoteCard';

import { useAuth } from '@/context/AuthProvider';
import { useNotes } from '@/api/querysApi';
import type { Note } from '@/utils/notesStorage';

function Notes() {
  const { isDark } = useDarkMode();
  // const [notes, setNotes] = useState<Note[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting] = useState(false);

  const { user } = useAuth();
  const { data: notes, isLoading, isError } = useNotes(user?.id);
  const notesList: Note[] = notes ?? [];


  const handleOpenAddModal = () => {
    setFormTitle('');
    setFormContent('');
    setIsAddModalOpen(true);
  };

  const handleSaveNewNote = () => {
    setIsSaving(true);
    
  };

  const handleOpenViewModal = (note: Note) => {
    setCurrentNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedNote = () => {
    if (!currentNote) return;
    
  };

  const handleOpenDeleteModal = () => {
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentNote) return;
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setFormTitle('');
    setFormContent('');
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentNote(null);
    setFormTitle('');
    setFormContent('');
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    if (currentNote) {
      setFormTitle(currentNote.title);
      setFormContent(currentNote.content);
    }
  };

  if (isError) return <div>Error...</div>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-sm border p-6 transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Notes
            </h2>
            <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Keep track of your thoughts and ideas
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Note
          </button>
        </div>
        {notesList.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No notes yet. Create your first note!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notesList.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleOpenViewModal(note)}
              />
            ))}
          </div>
        )}

      </div>

      <NoteModal
        isOpen={isAddModalOpen}
        title="Add New Note"
        content="Create a new note"
        modalTitle="Add Note"
        submitButtonText="Create Note"
        inputTitle={formTitle}
        inputContent={formContent}
        onTitleChange={setFormTitle}
        onContentChange={setFormContent}
        onSave={handleSaveNewNote}
        onClose={handleCloseAddModal}
        isSaving={isSaving}
      />

      <NoteViewModal
        isOpen={isViewModalOpen}
        title={formTitle}
        content={formContent}
        onClose={handleCloseViewModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <NoteModal
        isOpen={isEditModalOpen}
        title="Edit Note"
        content="Update your note"
        modalTitle="Edit Note"
        submitButtonText="Save Changes"
        inputTitle={formTitle}
        inputContent={formContent}
        onTitleChange={setFormTitle}
        onContentChange={setFormContent}
        onSave={handleSaveEditedNote}
        onClose={handleCloseEditModal}
        isSaving={isSaving}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title={formTitle}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setIsViewModalOpen(true);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default Notes;
