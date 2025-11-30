import React, { useState } from 'react';
import { Plus, X, Trash2, FolderOpen } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';

interface Task {
  id: number;
  text: string;
  createdAt: string;
}

interface Board {
  id: number;
  title: string;
  tasks: Task[];
}

interface Project {
  id: number;
  name: string;
  boards: Board[];
}

interface DraggedTask {
  task: Task;
  boardId: number;
}

export default function TrelloDashboard() {
  const { isDark:darkMode } = useDarkMode()
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);

  // Project Management
  const createProject = (): void => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now(),
        name: newProjectName,
        boards: [
          { id: 1, title: 'To Do', tasks: [] },
          { id: 2, title: 'In Progress', tasks: [] },
          { id: 3, title: 'Done', tasks: [] }
        ]
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setShowProjectForm(false);
    }
  };

  const deleteProject = (projectId: number): void => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  // Board Management
  const addBoard = (): void => {
    if (selectedProject) {
      const updatedProject: Project = {
        ...selectedProject,
        boards: [...selectedProject.boards, {
          id: Date.now(),
          title: 'New Board',
          tasks: []
        }]
      };
      updateProject(updatedProject);
    }
  };

  const deleteBoard = (boardId: number): void => {
    if (selectedProject) {
      const updatedProject: Project = {
        ...selectedProject,
        boards: selectedProject.boards.filter(b => b.id !== boardId)
      };
      updateProject(updatedProject);
    }
  };

  const updateBoardTitle = (boardId: number, newTitle: string): void => {
    if (selectedProject) {
      const updatedProject: Project = {
        ...selectedProject,
        boards: selectedProject.boards.map(b =>
          b.id === boardId ? { ...b, title: newTitle } : b
        )
      };
      updateProject(updatedProject);
    }
  };

  // Task Management
  const addTask = (boardId: number, taskText: string): void => {
    if (selectedProject && taskText.trim()) {
      const updatedProject: Project = {
        ...selectedProject,
        boards: selectedProject.boards.map(b =>
          b.id === boardId
            ? {
                ...b,
                tasks: [...b.tasks, {
                  id: Date.now(),
                  text: taskText,
                  createdAt: new Date().toISOString()
                }]
              }
            : b
        )
      };
      updateProject(updatedProject);
    }
  };

  const deleteTask = (boardId: number, taskId: number): void => {
    if (selectedProject) {
      const updatedProject: Project = {
        ...selectedProject,
        boards: selectedProject.boards.map(b =>
          b.id === boardId
            ? { ...b, tasks: b.tasks.filter(t => t.id !== taskId) }
            : b
        )
      };
      updateProject(updatedProject);
    }
  };

  const moveTask = (taskId: number, fromBoardId: number, toBoardId: number): void => {
    if (selectedProject) {
      const fromBoard = selectedProject.boards.find(b => b.id === fromBoardId);
      if (!fromBoard) return;
      
      const task = fromBoard.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedProject: Project = {
        ...selectedProject,
        boards: selectedProject.boards.map(b => {
          if (b.id === fromBoardId) {
            return { ...b, tasks: b.tasks.filter(t => t.id !== taskId) };
          }
          if (b.id === toBoardId) {
            return { ...b, tasks: [...b.tasks, task] };
          }
          return b;
        })
      };
      updateProject(updatedProject);
    }
  };

  const updateProject = (updatedProject: Project): void => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const handleDragStart = (task: Task, boardId: number): void => {
    setDraggedTask({ task, boardId });
  };

  const handleDragEnd = (): void => {
    setDraggedTask(null);
  };

  const handleDrop = (toBoardId: number): void => {
    if (draggedTask && draggedTask.boardId !== toBoardId) {
      moveTask(draggedTask.task.id, draggedTask.boardId, toBoardId);
    }
    setDraggedTask(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} rounded-2xl`}>
      {!selectedProject ? (
        // Projects View
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Trello
              </h1>
              <div className="flex items-center gap-4">
                
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  <Plus size={20} />
                  New Project
                </button>
              </div>
            </div>

            {showProjectForm && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Create New Project
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createProject()}
                    placeholder="Project name..."
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    autoFocus
                  />
                  <button
                    onClick={createProject}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowProjectForm(false);
                      setNewProjectName('');
                    }}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="text-indigo-600" size={24} />
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {project.name}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.boards.length} boards • {project.boards.reduce((sum, b) => sum + b.tasks.length, 0)} tasks
                  </div>
                </div>
              ))}
            </div>

            {projects.length === 0 && !showProjectForm && (
              <div className="text-center py-20">
                <FolderOpen className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No projects yet
                </h3>
                <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                  Create your first project to get started
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Board View
        <div className="flex flex-col h-screen">
          <div className={`${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'} shadow-md px-8 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedProject(null)}
                className={`transition-colors ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ← Back
              </button>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedProject.name}
              </h1>
            </div>
            <div className="flex items-center gap-4">
             
              <button
                onClick={addBoard}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} />
                Add Board
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto p-8">
            <div className="flex gap-6 h-full">
              {selectedProject.boards.map(board => (
                <BoardComponent
                  key={board.id}
                  board={board}
                  darkMode={darkMode}
                  onDeleteBoard={deleteBoard}
                  onUpdateTitle={updateBoardTitle}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  isDragging={draggedTask !== null}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface BoardProps {
  board: Board;
  darkMode: boolean;
  onDeleteBoard: (boardId: number) => void;
  onUpdateTitle: (boardId: number, newTitle: string) => void;
  onAddTask: (boardId: number, taskText: string) => void;
  onDeleteTask: (boardId: number, taskId: number) => void;
  onDragStart: (task: Task, boardId: number) => void;
  onDragEnd: () => void;
  onDrop: (boardId: number) => void;
  isDragging: boolean;
}

function BoardComponent({ 
  board, 
  darkMode, 
  onDeleteBoard, 
  onUpdateTitle, 
  onAddTask, 
  onDeleteTask, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  isDragging 
}: BoardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(board.title);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleTitleSubmit = (): void => {
    if (title.trim()) {
      onUpdateTitle(board.id, title);
      setIsEditingTitle(false);
    }
  };

  const handleAddTask = (): void => {
    if (newTaskText.trim()) {
      onAddTask(board.id, newTaskText);
      setNewTaskText('');
      setShowTaskForm(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (): void => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(board.id);
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      } rounded-lg p-4 w-80 flex-shrink-0 flex flex-col max-h-full transition-all ${
        isDragOver ? 'ring-2 ring-indigo-500 scale-105' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className={`flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            autoFocus
          />
        ) : (
          <h3
            className={`font-semibold cursor-pointer hover:text-indigo-600 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
            onClick={() => setIsEditingTitle(true)}
          >
            {board.title} ({board.tasks.length})
          </h3>
        )}
        <button
          onClick={() => onDeleteBoard(board.id)}
          className={`transition-colors ${
            darkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-600'
          }`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {board.tasks.map(task => (
          <TaskComponent
            key={task.id}
            task={task}
            boardId={board.id}
            darkMode={darkMode}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        {board.tasks.length === 0 && isDragging && (
          <div className={`text-center py-8 border-2 border-dashed rounded-lg ${
            darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-300 text-gray-400'
          }`}>
            Drop task here
          </div>
        )}
      </div>

      {showTaskForm ? (
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-3 shadow`}>
          <textarea
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter task description..."
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
              darkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddTask}
              className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition-colors text-sm"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowTaskForm(false);
                setNewTaskText('');
              }}
              className={`px-4 py-1 rounded transition-colors text-sm ${
                darkMode 
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowTaskForm(true)}
          className={`flex items-center gap-2 transition-colors ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Plus size={18} />
          Add Task
        </button>
      )}
    </div>
  );
}

interface TaskProps {
  task: Task;
  boardId: number;
  darkMode: boolean;
  onDelete: (boardId: number, taskId: number) => void;
  onDragStart: (task: Task, boardId: number) => void;
  onDragEnd: () => void;
}

function TaskComponent({ task, boardId, darkMode, onDelete, onDragStart, onDragEnd }: TaskProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task, boardId)}
      onDragEnd={onDragEnd}
      className={`${
        darkMode ? 'bg-gray-700' : 'bg-white'
      } rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move relative group`}
    >
      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {task.text}
      </p>
      <div className="flex items-center justify-end">
        <button
          onClick={() => onDelete(boardId, task.id)}
          className={`transition-colors opacity-0 group-hover:opacity-100 ${
            darkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-red-600'
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}