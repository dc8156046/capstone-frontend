"use client";

import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import { CircleHelp, ChevronDown, ChevronUp } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { useState, useEffect } from "react";
import { userAPI } from "@/services";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export default function ContractorPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openProjects, setOpenProjects] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await userAPI.getContractorProjects();
        //console.log("Projects:", response);

        const updatedProjects = response.map(({ project, tasks }) => ({
          project: {
            ...project,
            //status: determineProjectStatus(project.start_date, project.end_date),
          },
          tasks,
        }));

        setProjects(updatedProjects);

        const initialOpenState = {};
        updatedProjects.forEach(({ project }) => {
          initialOpenState[project.id] = false;
        });
        setOpenProjects(initialOpenState);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /*
  const determineProjectStatus = (start_date, end_date) => {
    if (!start_date || !end_date) return "Pending";

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const currentDate = new Date();

    if (currentDate < startDate) return "Upcoming";
    if (currentDate >= startDate && currentDate <= endDate) return "In Progress";
    if (currentDate > endDate) return "Complete";

    return "Pending";
  };
  */
 
  const toggleProject = (projectId) => {
    setOpenProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardContent className="p-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/help-page">
              <button>
                <CircleHelp className="h-5 w-5" />
              </button>
            </Link>
            <UserNav />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="container mx-auto p-6 flex justify-center">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Your Projects
          </h1>

          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map(({ project, tasks }) => (
                <Collapsible key={project.id} open={openProjects[project.id]}>
                  <Card className="shadow-md">
                    <CardContent className="p-4">
                      <CollapsibleTrigger asChild>
                        <button
                          className="w-full flex justify-between items-center text-left"
                          aria-label="Toggle Project Details"
                          onClick={() => toggleProject(project.id)}
                        >
                          <div>
                            <h2 className="text-lg font-semibold">
                              {project.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                              Address: {project.address}, {project.city_id}
                            </p>
                          </div>
                          {openProjects[project.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4 space-y-2">
                        <p className="text-sm text-gray-500">
                          Due: {new Date(project.end_date).toLocaleDateString()}
                        </p>
                        {/* 
                        <p className="text-sm text-gray-500">
                          Status: 
                          <span
                            className={`px-2 py-1 text-sm rounded-full ${
                              project.status === "Complete"
                                ? "bg-green-100 text-green-800"
                                : project.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {project.status}
                          </span>
                        </p>
                        */}
                        {/* Task List */}
                        <div className="mt-4 space-y-2">
                          <h3 className="text-md font-medium">Tasks</h3>
                          {tasks.length > 0 ? (
                            <div className="space-y-2">
                              {tasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-2">
                                  <span className="text-sm text-gray-800">
                                    {task.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No tasks found.
                            </p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
