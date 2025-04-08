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
        setProjects(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const groupedProjects = {
    "In Progress": projects.filter(
      (project) => project.status === "in_progress"
    ),
    Upcoming: projects.filter((project) => project.status === "pending"),
    Complete: projects.filter((project) => project.status === "completed"),
    Delayed: projects.filter((project) => project.status === "delayed"),
  };
  const statusDisplayMap = {
    in_progress: "In Progress",
    pending: "Upcoming",
    completed: "Complete",
    delayed: "Delayed",
  };

  return (
    <div className="p-4 space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {projects.length > 0 && (
          <Link href="/dashboard/project/create">
            <button className="w-48 h-14 bg-[#16325b] text-white rounded-lg flex items-center justify-center space-x-3 shadow-lg hover:bg-[#227b94] ">
              <Plus
                size={24}
                className="border rounded-full bg-white text-[#16325b] hover:text-[#227b94]"
              />
              <span className="text-lg ">Add Project</span>
            </button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="text-lg font-semibold text-gray-700">
            Loading Projects...
          </span>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl ">Project Overview</h2>
              <div className="grid grid-cols-5 gap-5 text-center">
                {Object.entries(groupedProjects).map(
                  ([status, projectList]) => (
                    <div
                      key={status}
                      className="p-4 bg-gray-100 rounded-xl text-black"
                    >
                      <p className="text-lg font-bold">{projectList.length}</p>
                      <p className="text-sm ">{status}</p>
                    </div>
                  )
                )}
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{projects.length}</p>
                  <p className="text-sm ">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {projects.length > 0 ? (
            <div className="grid grid-cols-4 gap-6 text-center pt-6 ">
              {Object.entries(groupedProjects).map(([status, projectList]) => (
                <div key={status} className="space-y-4 ">
                  <h2 className="text-xl  text-left ">{status}</h2>
                  <ul className="space-y-2">
                    {projectList.map((project) => (
                      <Link
                        key={project.id}
                        href={`dashboard/project/${project.id}`}
                      >
                        <li className="p-6 bg-white shadow rounded-2xl text-center max-w-72 cursor-pointer hover:shadow-lg transition mb-4 flex flex-col h-52 items-center">
                          <p className="text-2xl font-semibold">
                            {project.name}
                          </p>
                          <p className="text-md mt-3">{project.address}</p>
                          <p className="text-md mt-3">
                            {project.start_date
                              ? project.start_date.split("T")[0]
                              : ""}{" "}
                            ~{" "}
                            {project.end_date
                              ? project.end_date.split("T")[0]
                              : ""}
                          </p>
                          <p
                            className={`text-sm text-white rounded-full mt-5 w-36 py-1 ${
                              project.status === "pending"
                                ? "bg-[#979797]"
                                : project.status === "in_progress"
                                ? "bg-[#78b7d0]"
                                : project.status === "completed"
                                ? "bg-[#59bd50]"
                                : project.status === "delayed"
                                ? "bg-[#f70e0e]"
                                : ""
                            }`}
                          >
                            {/* {project.status} */}
                            {statusDisplayMap[project.status] || project.status}
                          </p>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Link href="/dashboard/project/create">
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
