import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabaseClient";
import type {
  Project,
  Todo,
  UpdateNoteInput,
  UpdateProjectInput,
  UpdateTodoInput,
  UpdateTrelloProjectInput,
} from "@/types";
import type { Note } from "@/utils/notesStorage";

//projects
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      const { data, error } = await supabase
        .from("projects")
        .insert([projectData])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", newProject.user_id],
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateProjectInput) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (updatedProject: Project) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", updatedProject.user_id],
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

//todos
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todoData: Partial<Todo>) => {
      const { data, error } = await supabase
        .from("todos")
        .insert([todoData])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (newTodo) => {
      queryClient.invalidateQueries({
        queryKey: ["todos", newTodo.project_id, newTodo.user_id],
      });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTodoInput) => {
      const { data, error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // 2. Fetch all todos for the project/user
      const { data: allTodos, error: fetchError } = await supabase
        .from("todos")
        .select("completed")
        .eq("project_id", updates.project_id)
        .eq("user_id", updates.user_id);

      if (fetchError) throw new Error(fetchError.message);

      // 3. Calculate progress
      const total = allTodos.length;
      const completed = allTodos.filter((t) => t.completed).length;
      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

      // 4. Update project progress
      const { error: projectError } = await supabase
        .from("projects")
        .update({ progress })
        .eq("id", updates.project_id);

      if (projectError) throw new Error(projectError.message);

      return data;
    },
    onSuccess: (updatedTodo) => {
      queryClient.invalidateQueries({
        queryKey: ["todos", updatedTodo.project_id, updatedTodo.user_id],
      });
    },
  });
};

export const useDeleteTodo = (
  project_id: string | undefined,
  user_id: string | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw new Error(error.message);
      // 2. Fetch all todos for the project/user
      const { data: allTodos, error: fetchError } = await supabase
        .from("todos")
        .select("completed")
        .eq("project_id", project_id)
        .eq("user_id", user_id);

      if (fetchError) throw new Error(fetchError.message);

      // 3. Calculate progress
      const total = allTodos.length;
      const completed = allTodos.filter((t) => t.completed).length;
      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

      // 4. Update project progress
      const { error: projectError } = await supabase
        .from("projects")
        .update({ progress })
        .eq("id", project_id);

      if (projectError) throw new Error(projectError.message);

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", project_id, user_id],
      });
    },
  });
};

const DEFAULT_TRELLO_BOARD_TITLES = ["To Do", "In Progress", "Done"];

const invalidateTrelloProjects = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId?: string,
) => {
  queryClient.invalidateQueries({
    queryKey: userId ? ["trello_projects", userId] : ["trello_projects"],
  });
};

// trello
export const useCreateTrelloProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      user_id,
      description,
    }: {
      title: string;
      user_id: string;
      description?: string | null;
    }) => {
      const { data: project, error } = await supabase
        .from("trello_projects")
        .insert([{ title, user_id, description: description ?? null }])
        .select()
        .single();

      if (error) throw new Error(error.message);

      const { error: boardsError } = await supabase.from("boards").insert(
        DEFAULT_TRELLO_BOARD_TITLES.map((boardTitle, index) => ({
          title: boardTitle,
          project_id: project.id,
          position: index,
        })),
      );

      if (boardsError) throw new Error(boardsError.message);
      return project;
    },
    onSuccess: (newProject) => {
      invalidateTrelloProjects(queryClient, newProject.user_id);
    },
  });
};

export const useUpdateTrelloProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTrelloProjectInput) => {
      const { data, error } = await supabase
        .from("trello_projects")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (updatedProject) => {
      invalidateTrelloProjects(queryClient, updatedProject.user_id);
    },
  });
};

export const useDeleteTrelloProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from("trello_projects")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      invalidateTrelloProjects(queryClient);
    },
  });
};

export const useCreateTrelloBoard = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      project_id,
      title,
      position,
    }: {
      project_id: number;
      title: string;
      position: number;
    }) => {
      const { data, error } = await supabase
        .from("boards")
        .insert([{ project_id, title, position }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      invalidateTrelloProjects(queryClient, userId);
    },
  });
};

export const useUpdateTrelloBoard = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
    }: {
      id: number;
      title: string;
    }) => {
      const { data, error } = await supabase
        .from("boards")
        .update({ title })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      invalidateTrelloProjects(queryClient, userId);
    },
  });
};

export const useDeleteTrelloBoard = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase.from("boards").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      invalidateTrelloProjects(queryClient, userId);
    },
  });
};

export const useCreateTrelloTask = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      board_id,
      text,
      position,
    }: {
      board_id: number;
      text: string;
      position: number;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ board_id, text, position }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      invalidateTrelloProjects(queryClient, userId);
    },
  });
};

export const useDeleteTrelloTask = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      invalidateTrelloProjects(queryClient, userId);
    },
  });
};

export const useMoveTrelloTask = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      board_id,
      position,
    }: {
      id: number;
      board_id: number;
      position: number;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          board_id,
          position,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      invalidateTrelloProjects(queryClient, userId);
    },
  });
};

//notes
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteData: Partial<Note>) => {
      const { data, error } = await supabase
        .from("notes")
        .insert([noteData])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", newNote.user_id],
      });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateNoteInput) => {
      const { data, error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: (updated: Note) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", updated.user_id],
      });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      console.log("Deleting note with id:", userId);
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw new Error(error.message);

      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.userId] });
    },
  });
};

/**
 * onSuccess: (data, variables, context) => {
  console.log("Server returned:", data);
  console.log("You sent:", variables);
  console.log("Context from onMutate:", context);
}
 */
