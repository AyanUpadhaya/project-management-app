import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import EditProject from "./EditProject";

export default function ProjectList({ projects, setProjects }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between gap-1">
              <div>
                <Link to={`/project/${project.id}`}>{project.title}</Link>
              </div>
              <EditProject
                setProjects={setProjects}
                project={project}
              ></EditProject>
            </CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between text-sm text-muted-foreground">
              <span>
                Created: {new Date(project.created_at).toLocaleDateString()}
              </span>
              <span>
                Due: {new Date(project.estimation_date).toLocaleDateString()}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
