import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateProject } from "@/api/mutationsApi";
import { useAuth } from "@/context/AuthProvider";

export default function CreateProject() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [estimationDate, setEstimationDate] = useState("");
  const createProjectMutation = useCreateProject();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const newProject = {
        user_id: user?.id,
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        created_at: new Date().toISOString(),
        estimation_date: estimationDate,
        progress: 0,
        notes: "",
      };

      if (
        newProject.title.trim() == "" ||
        newProject.description.trim() == "" ||
        newProject.estimation_date == ""
      ) {
        toast({
          title: "Error",
          description:
            "Fileds like title and description and estimation_date is required",
        });
        return;
      }

      await createProjectMutation.mutateAsync(newProject);
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              className="col-span-3"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimation_date">Estimation Date</Label>
            <Input
              id="estimation_date"
              type="date"
              className="col-span-3"
              value={estimationDate}
              onChange={(e) => setEstimationDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={createProjectMutation.isPending}
            type="submit"
            onClick={handleSubmit}
          >
            {createProjectMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
