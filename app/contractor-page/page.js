"use client";

import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import { CircleHelp } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { useState, useEffect } from "react";
import { userAPI } from "@/services";
import Link from "next/link";

export default function ContractorPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); 
  //const [error, setError] = useState(""); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await userAPI.getContractorProjects();
        //console.log("Projects:", response);
        setProjects(response);
      } catch (error) {
        console.error(error);
        //setError("Failed to get projects. Please try again.");
      } finally {
        setLoading(false); 
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

 // if (error) {
 //   return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
 // }

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
            <UserNav/>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Your Projects</h1>

        {/* Display Projects */}
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map(({ project, tasks }) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  {/* Project Details */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">{project.name}</h2>
                    <p className="text-sm text-gray-600">
                      Address: {project.address}, {project.city_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(project.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : project.status === "Delay" 
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status}
                      </span>
                    </p>
                  </div>

                  {/* Task List */}
                  <div className="mt-4 space-y-2">
                    <h3 className="text-md font-medium">Tasks</h3>
                    {tasks.length > 0 ? (
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-800">
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No tasks found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
}