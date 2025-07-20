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
import { useToast } from "@/hook/use-toast";
import { supabase } from "@/superbase/supabaseClient";
import type { Project } from "@/types";

type PropsType = {
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  project:Project
};

export default function EditProject({ setProjects, project }: PropsType) {
  const [title, setTitle] = useState(project.title || "");
  const [description, setDescription] = useState(project.description || "");
  const [tags, setTags] = useState(project.tags.join(", "));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const trimmedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean); // removes empty strings

      const updatedFields = {
        title,
        description,
        tags: trimmedTags,
      };

      const { data, error } = await supabase
        .from("projects")
        .update(updatedFields)
        .eq("id", project.id);

      if (error) {
        console.error("Update failed:", error.message);
        return;
      } else {
        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
      }

      console.log("Updated project:", data);

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, ...updatedFields } : p))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
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
        </div>
        <DialogFooter>
          <Button disabled={loading} type="submit" onClick={handleSubmit}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
