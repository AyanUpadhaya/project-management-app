import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/superbase/supabaseClient";
import type {
  Project,
  Todo,
  UpdateNoteInput,
  UpdateProjectInput,
  UpdateTodoInput,
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
  user_id: string | undefined
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
