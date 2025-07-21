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
import { NotebookIcon, Trash2Icon } from "lucide-react";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/authService";

import { useToast } from "@/hooks/use-toast";
import TodoList from "./TodoList";
import { useGetProject, useTodos } from "@/api/querysApi";
import type { Todo } from "@/types";
import { useCreateTodo, useDeleteProject, useDeleteTodo, useUpdateProject, useUpdateTodo } from "@/api/mutationsApi";
import { useAuth } from "@/context/AuthProvider";





export default function ProjectDetail() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useGetProject(id);
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo()
  const deleteTodoMutation = useDeleteTodo(id, user?.id);
  const [notes, setNotes] = useState<string>(project?.notes);
  const { data: todos } = useTodos(id, user?.id);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    if (!project) return;
    if (!notes) {
      toast({
        title: "Error",
        description: "Note can't be empty",
        variant: "destructive",
      });
      return;
    }
    try {
      await updateProjectMutation.mutateAsync({ id, notes });
      toast({
        title: "Success",
        description: "Note updated",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  //todos
  const handleAddTodo = async (todo: Todo) => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const newTodo = {
        ...todo,
        user_id: user.id,
        project_id: id,
      };

      if(Object.keys(newTodo).some(item=>item.trim() == "")){
        alert("Empty values not allowed")
        return 
      }

      await createTodoMutation.mutateAsync(newTodo);
      toast({
        title: "Success",
        description: "Todo created",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    try {
      await updateTodoMutation.mutateAsync({ id, ...updatedFields });
        toast({
          title: "Success",
          description: "Todo updated",
        });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
   try {
    await deleteTodoMutation.mutateAsync({id});
     toast({
       title: "Success",
       description: "Todo Deleted",
     });
   } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
   }
  };

  const handleDelete = async (projectId: string) => {
   try {
     const confirmDelete = window.confirm(
       "Are you sure you want to delete this project?"
     );
     if (!confirmDelete) return;

     await deleteProjectMutation.mutateAsync({ id: projectId });
     toast({
       title: "Success",
       description: "Project deleted!",
     });

     navigate("/");
   } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
   }
  };

  if (isLoading) return <p>Loading project...</p>;
  if (!project || isError) return <p>Project not found.</p>;

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
            className="flex gap-2"
          >
            <Trash2Icon className="text-white w-4 h-4"></Trash2Icon>
            <span>Delete Project</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex gap-2">
                <NotebookIcon className="w-4 h-4 text-white"></NotebookIcon>
                <span>Check Note</span>
              </Button>
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
                  disabled={updateProjectMutation.isPending}
                  onClick={handleSaveNotes}
                  className="mt-2"
                >
                  {updateProjectMutation.isPending ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-4 space-y-4 flex-1">
        <h2 className="text-2xl font-semibold">Todos</h2>
        <TodoList
          todos={todos ?? []}
          onUpdate={handleUpdateTodo}
          onAdd={handleAddTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </div>
  );
}
