import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabaseClient";
import type { ProjectStruct } from "@/types";

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
  userId: string | undefined,
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

// trello
const assembleTrelloProjects = async (
  userId: string,
): Promise<ProjectStruct[]> => {
  const { data: projects, error } = await supabase
    .from("trello_projects")
    .select("id, title, description, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!projects?.length) return [];

  const projectIds = projects.map((project) => project.id);

  const { data: boards, error: boardsError } = await supabase
    .from("boards")
    .select("id, title, project_id, position, created_at")
    .in("project_id", projectIds)
    .order("position", { ascending: true });

  if (boardsError) throw new Error(boardsError.message);

  const boardIds = boards?.map((board) => board.id) ?? [];
  const tasksByBoard = new Map<number, ProjectStruct["boards"][number]["tasks"]>();

  if (boardIds.length > 0) {
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, text, board_id, position, created_at")
      .in("board_id", boardIds)
      .order("position", { ascending: true });

    if (tasksError) throw new Error(tasksError.message);

    for (const task of tasks ?? []) {
      const boardTasks = tasksByBoard.get(task.board_id) ?? [];
      if (task.board_id == null) continue;
      boardTasks.push({
        id: task.id,
        text: task.text ?? "",
        createdAt: task.created_at,
      });
      tasksByBoard.set(task.board_id, boardTasks);
    }
  }

  return projects.map((project) => ({
    id: project.id,
    title: project.title ?? "",
    description: project.description,
    boards: (boards ?? [])
      .filter((board) => board.project_id === project.id)
      .map((board) => ({
        id: board.id,
        title: board.title ?? "",
        tasks: tasksByBoard.get(board.id) ?? [],
      })),
  }));
};

export const useTrelloProjects = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["trello_projects", userId],
    enabled: !!userId,
    queryFn: () => assembleTrelloProjects(userId!),
  });
};

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
