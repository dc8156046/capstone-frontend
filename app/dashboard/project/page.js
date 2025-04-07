"use client";

import { useState, useEffect } from "react";
import { userAPI } from "@/services";
import Link from "next/link";

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

  const statusDisplayMap = {
    in_progress: "In Progress",
    pending: "Upcoming",
    completed: "Complete",
    delayed: "Delayed",
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl mt-4">Project List</h2>

      <div className="grid grid-cols-6 gap-4 bg-gray-100 p-3 mt-7 text-center border border-gray-300">
        <div className="font-semibold">Projects</div>
        <div className="font-semibold">Address</div>
        <div className="font-semibold">Start</div>
        <div className="font-semibold">Due</div>
        <div className="font-semibold">Budget</div>
        <div className="font-semibold">Status</div>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading...</div>
      ) : (
        projects.map((project) => (
          <Link href={`project/${project.id}`} key={project.id}>
            <div className="grid grid-cols-6 gap-4 p-3 text-center border-b border-gray-200 hover:bg-gray-50">
              <div>{project.name}</div>
              <div>{project.address}</div>
              <div>
                {project.start_date ? project.start_date.split("T")[0] : ""}
              </div>
              <div>
                {project.end_date ? project.end_date.split("T")[0] : ""}
              </div>
              <div>${project.budget}</div>
              <div
                className={`text-sm font-semibold px-2 py-1 rounded-full w-fit mx-auto ${
                  project.status === "completed"
                    ? "text-green-600"
                    : project.status === "delayed"
                    ? "text-red-600"
                    : project.status === "pending"
                    ? "text-gray-600"
                    : project.status === "in_progress"
                    ? "text-cyan-600"
                    : ""
                }`}
              >
                {/* {project.status} */}
                {statusDisplayMap[project.status] || project.status}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
