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
import type { Project, ProjectStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

type PropsType = {
  projects: Project[];
};

function getStatusClasses(status:ProjectStatus)  {
  switch (status) {
    case "pending":
      return "bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white";
    case "in_progress":
      return "bg-blue-500 dark:bg-blue-600 text-white";
    case "finished":
      return "bg-green-500 dark:bg-green-600 text-white";
    default:
      return "bg-gray-300 dark:bg-gray-700 text-black dark:text-white";
  }
}


export default function ProjectList({ projects }: PropsType) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: Project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between gap-1">
              <div className="flex gap-1 items-center">
                <Link to={`/project/${project.id}`}>{project.title}</Link>
                <Badge
                  variant="secondary"
                  className={getStatusClasses(project.status ?? "pending")}
                >
                  {project.status}
                </Badge>
              </div>
              <EditProject project={project}></EditProject>
            </CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="mt-2" />
            <div className="py-3">
              {project.tags.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between text-sm text-muted-foreground">
              <span>
                Created: {new Date(project.created_at).toLocaleDateString()}
              </span>
              <span>
                Due:{" "}
                {project.estimation_date
                  ? new Date(project.estimation_date).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
