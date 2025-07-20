import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/superbase/supabaseClient";
import { getCurrentUser } from "@/services/authService";
import type { Project, Todo } from "@/types";
import { useToast } from "@/hook/use-toast";
import TodoList from "./TodoList";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    if (!project) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("projects")
        .update({ notes })
        .eq("id", project.id);

      if (error) {
        console.error("Failed to save notes:", error.message);
      } else {
        toast({
          title: "Success",
          description: "Notes saved!",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  //todos
  const handleAddTodo = async (todo: Todo) => {
    const user = await getCurrentUser();
    if (!user) return;

    const newTodo = {
      ...todo,
      user_id: user.id,
      project_id: id,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert([newTodo])
      .select("*");

    if (error) {
      console.error("Error creating todo:", error.message);
    } else {
      setTodos((prev) => [...prev, data[0]]);
      toast({ title: "Success", description: "Todo added!" });
    }
  };

  const handleUpdateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    const { data, error } = await supabase
      .from("todos")
      .update(updatedFields)
      .eq("id", id)
      .select("*");

    console.log(data);

    if (error) {
      console.error("Update failed:", error.message);
    } else {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedFields } : todo
        )
      );
      toast({ title: "Success", description: "Todo updated!" });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Delete failed:", error.message);
    } else {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast({ title: "Success", description: "Todo deleted!" });
    }
  };
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project:", error.message);
        navigate("/dashboard");
      } else {
        setProject(data);
        setNotes(data.notes || "");
      }

      setLoading(false);
    };

    fetchProject();
  }, [id, navigate]);

  useEffect(() => {
    const fetchTodos = async (
      projectId: string | undefined,
      userId: string | undefined
    ) => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error.message);
        return [];
      }

      return data;
    };
    async function getCurrentProjectTodos() {
      const user = await getCurrentUser();
      if (!user) return;

      const result = await fetchTodos(id, user?.id);
      setTodos(result);
    }
    getCurrentProjectTodos();
  }, [id]);

  const handleDelete = async (projectId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Delete failed:", error.message);
    } else {
      toast({
        title: "Success",
        description: "Project deleted!",
      });

      navigate("/");
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div>
      <div className="flex justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{project.title}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="destructive"
            onClick={() => handleDelete(project.id)}
          >
            Delete Project
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Check Note</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Save Note</DialogTitle>
                <DialogDescription>
                  Here you can add a note to the related project.
                </DialogDescription>
              </DialogHeader>
              <div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="mt-2"
                />
                <Button
                  disabled={isSaving}
                  onClick={handleSaveNotes}
                  className="mt-2"
                >
                  {isSaving ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-4 space-y-4 flex-1">
        <h2 className="text-2xl font-semibold">Todos</h2>
        <TodoList
          todos={todos}
          onUpdate={handleUpdateTodo}
          onAdd={handleAddTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </div>
  );
}
