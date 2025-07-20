import CreateProject from "@/components/CreateProject";
import ProjectList from "@/components/ProjectList";
import { emptyBox } from "@/assets/getAssets";

// Remove local Project type and import from types/index

import { useProjects } from "@/api/querysApi";
import { useAuth } from "@/context/AuthProvider";

const Home = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useProjects(user?.id);
  if (isError) return <div>Error...</div>;
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="w-full p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Projects</h1>
          <CreateProject />
        </div>
        <div>
          {data && data.length > 0 ? (
            <ProjectList projects={data} />
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
