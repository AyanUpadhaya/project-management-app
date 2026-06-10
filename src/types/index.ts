import type { Note } from "@/utils/notesStorage";

export type ProjectStatus = "pending" | "in_progress" | "finished";
export type PriorityLevel = "high" | "medium" | "low";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  notes: string;
  created_at: string;
  progress: number;
  user_id: string;
  estimation_date?: string;
  status?: ProjectStatus;
}

export interface Todo {
  id?: string;
  title?: string;
  priority?: PriorityLevel;
  completed?: boolean;
  created_at?: string;
  project_id?: string;
  user_id?: string;
}


export interface Task {
  id: number;
  text: string;
  createdAt: string;
}

export interface Board {
  id: number;
  title: string;
  tasks: Task[];
}

export interface ProjectStruct {
  id: number;
  title: string;
  description?: string | null;
  boards: Board[];
}

export interface TrelloProjectRow {
  id: number;
  title: string | null;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface TrelloBoardRow {
  id: number;
  title: string | null;
  project_id: number | null;
  position: number | null;
  created_at: string;
}

export interface TrelloTaskRow {
  id: number;
  text: string | null;
  board_id: number | null;
  position: number | null;
  created_at: string;
  updated_at: string | null;
}

export type UpdateTrelloProjectInput = {
  id: number;
  title?: string;
  description?: string | null;
};

export interface DraggedTask {
  task: Task;
  boardId: number;
}

export type UpdateProjectInput = Partial<Omit<Project, "created_at">> & {
  id: string | undefined;
};
export type UpdateTodoInput = Partial<Omit<Todo, "created_at">> & {
  id: string | undefined;
};
export type UpdateNoteInput = Partial<Omit<Note, "created_at" | "updated_at">> & {
  id: string | undefined;
};
