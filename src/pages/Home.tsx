import CreateProject from "@/components/CreateProject";
import ProjectList from "@/components/ProjectList";

import { useEffect, useState } from "react";
import { supabase } from "@/superbase/supabaseClient";
import { getCurrentUser } from "@/services/authService";

const Home = ({ emptyBox }) => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  return (
    <div className="w-full p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Projects</h1>
          <CreateProject setProjects={setProjects} />
        </div>
        <div>
          {projects.length > 0 ? (
            <ProjectList setProjects={setProjects} projects={projects} />
          ) : (
            <div className="p-4 text-center flex flex-col items-center">
              <h2 className="text-lg text-gray-600 font-semibold">
                No projects found
              </h2>
              <img
                src={emptyBox}
                alt="empty box"
                className="w-[100px] h-[100px] object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
