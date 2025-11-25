import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/superbase/supabaseClient";

//projects
export const useProjects = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useGetProject = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// todos
export const useTodos = (
  projectId: string | undefined,
  userId: string | undefined
) => {
  return useQuery({
    queryKey: ["todos", projectId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

//notes

export const useNotes = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["notes", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};
