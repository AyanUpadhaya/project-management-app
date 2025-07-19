# React & Superbase Project Managment app

Superbase CRUD operations

1. Create
``` js

const {
        data: { user },
      } = await supabase.auth.getUser();
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
      const { data, error } = await supabase
        .from("projects")
        .insert([newProject]);
```

2. GET

``` js

 useEffect(() => {
    const fetchProjects = async () => {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error.message);
      } else {
        console.log(data);
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

```

3. GET project by id

``` js

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
```

4. Update project

``` js

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

```

5. Delete Project

``` js

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

```
