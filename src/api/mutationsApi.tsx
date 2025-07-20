import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/superbase/supabaseClient";
import type {
  Project,
  Todo,
  UpdateProjectInput,
  UpdateTodoInput,
} from "@/types";

//projects
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectData) => {
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
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", project_id, user_id],
      });
    },
  });
};
