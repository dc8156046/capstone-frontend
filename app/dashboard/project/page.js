"use client";

import { useState, useEffect } from "react";
import { userAPI } from "@/services";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await userAPI.getAllProjects();
        console.log("Projects:", response);
        setProjects(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const calculateProgress = (start_date, end_date) => {
    if (!start_date || !end_date) return 0;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const currentDate = new Date();

    if (currentDate < startDate) return 0;
    if (currentDate > endDate) return 100;

    const totalDays = endDate - startDate;
    const elapsedDays = currentDate - startDate;
    const progress = (elapsedDays / totalDays) * 100;

    return Math.round(progress);
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl mt-4">Project List</h2>

      <div className="grid grid-cols-7 gap-4 bg-gray-100 p-3 mt-7 text-center border border-gray-300">
        <div className="font-semibold">Projects</div>
        <div className="font-semibold">Address</div>
        <div className="font-semibold">Start</div>
        <div className="font-semibold">Due</div>
        <div className="font-semibold">Budget</div>
        <div className="font-semibold">Progress</div>
        <div className="font-semibold">Status</div>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading...</div>
      ) : (
        projects.map((project) => {
          const progress = calculateProgress(project.start_date, project.end_date);

          return (
            <div
              key={project.id}
              className="grid grid-cols-7 gap-4 p-3 text-center border-b border-gray-200 hover:bg-gray-50"
            >
              <div>{project.name}</div>
              <div>{project.address}</div>
              <div>{project.start_date ? project.start_date.split("T")[0] : ""}</div>
              <div>{project.end_date ? project.end_date.split("T")[0] : ""}</div>
              <div>{project.budget}</div>

              <div className="flex items-center justify-center">
                <div className="w-full bg-gray-200 rounded-full h-5 relative">
                  <div
                    className={`h-5 rounded-full text-xs text-white flex items-center justify-center transition-all duration-500 ${
                      project.status === "Delayed"
                        ? "bg-red-600"
                        : progress === 100
                        ? "bg-green-600"
                        : "bg-cyan-600"
                    }`}
                    style={{ width: `${progress}%` }}
                  >
                    <span className="absolute w-full text-center text-xs font-semibold text-white">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div
                className={`text-sm text-white font-semibold px-2 py-1 rounded-full w-fit mx-auto ${
                  project.status === "pending"
                    ? "text-gray-600"
                    : project.status === "in_progress"
                    ? "text-cyan-600"
                    : project.status === "Complete"
                    ? "text-green-600"
                    : project.status === "Delayed"
                    ? "text-red-600"
                    : "bg-gray-400"
                }`}
              >
                {project.status}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
