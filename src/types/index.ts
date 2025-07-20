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
}

export interface Todo {
  id?: string;
  title?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  created_at?: string;
  project_id?: string;
  user_id?: string;
}


export type UpdateProjectInput = Partial<Omit<Project, "created_at">> & {
  id: string | undefined;
};
export type UpdateTodoInput = Partial<Omit<Todo, "created_at">> & {
  id: string | undefined;
};