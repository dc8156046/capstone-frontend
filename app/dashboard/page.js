"use client";

import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { userAPI } from "@/services";
import Link from "next/link";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await userAPI.getAllProjects();

        const updatedProjects = response.map((project) => {
          const progress = calculateProgress(
            new Date(project.start_date),
            new Date(project.end_date),
            new Date()
          );

          return { ...project, progress };
        });

        setProjects(updatedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const calculateProgress = (startDate, endDate, currentDate) => {
    if (!startDate || !endDate) return 0;

    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const elapsedDays = (currentDate - startDate) / (1000 * 60 * 60 * 24);

    return Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
  };

  const groupedProjects = {
    "In Progress": projects.filter((project) => project.status === "in_progress"),
    Upcoming: projects.filter((project) => project.status === "pending"),
    Complete: projects.filter((project) => project.status === "completed"),
    Delayed: projects.filter((project) => project.status === "delayed"),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {projects.length > 0 && (
          <Link href="dashboard/project/create">
            <button className="w-40 h-12 bg-cyan-800 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-cyan-700">
              <Plus size={24} className="border rounded-full bg-white text-cyan-700" />
              <span className="text-lg font-semibold">Add Project</span>
            </button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="text-lg font-semibold text-gray-700">Loading Projects...</span>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Project Overview</h2>
              <div className="grid grid-cols-5 gap-5 text-center">
              <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{groupedProjects["Upcoming"].length}</p>
                  <p className="text-sm font-semibold">Upcoming</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{groupedProjects["In Progress"].length}</p>
                  <p className="text-sm font-semibold">In Progress</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{groupedProjects["Complete"].length}</p>
                  <p className="text-sm font-semibold">Complete</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{groupedProjects["Delayed"].length}</p>
                  <p className="text-sm font-semibold">Delayed</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{projects.length}</p>
                  <p className="text-sm font-semibold">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {projects.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {Object.entries(groupedProjects).map(([status, projectList]) => (
                <div key={status} className="space-y-4">
                  <h2 className="text-xl font-semibold">{status}</h2>
                  <ul className="space-y-2">
                    {projectList.map((project) => (
                      <li key={project.id} className="p-4 bg-white shadow rounded-lg text-center max-w-52">
                        <p className="text-lg font-bold">{project.name}</p>

                        {project.status !== "pending" && (
                          <div className="w-full bg-gray-200 rounded-full h-5 mt-2 relative">
                            <div
                              className={`h-5 rounded-full text-xs text-white flex items-center justify-center ${
                                project.status === "delayed"
                                  ? "bg-red-600"
                                  : project.progress === 100
                                  ? "bg-green-600"
                                  : "bg-cyan-600"
                              }`}
                              style={{ width: `${project.progress}%` }}
                            >
                              <span className="absolute w-full text-center text-xs font-semibold text-white">
                                {project.progress}%
                              </span>
                            </div>
                          </div>
                        )}

                        <p className="text-sm mt-2">{project.address}</p>
                        <p className="text-sm mt-2">
                          {project.start_date ? project.start_date.split("T")[0] : ""} -{" "}
                          {project.end_date ? project.end_date.split("T")[0] : ""}
                        </p>

                        <p
                          className={`text-sm text-white rounded-full mt-3 py-1 ${
                            project.status === "pending"
                              ? "bg-gray-600"
                              : project.status === "in_progress"
                              ? "bg-cyan-600"
                              : project.status === "completed"
                              ? "bg-green-600"
                              : project.status === "delayed"
                              ? "bg-red-600"
                              : ""
                          }`}
                        >
                          {project.status}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Link href="dashboard/project/create">
                <button className="w-32 h-32 flex items-center justify-center bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-700 mt-8">
                  <Plus size={64} />
                </button>
                <span className="mt-2 text-gray-700 text-lg">Add Project</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
