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
    <div className="p-6  ">
      <h2 className="font-bold text-2xl mt-4">Project List</h2>

      <div className="border border-gray-300 rounded-lg bg-white mt-6 shadow-md">
        <div className="grid grid-cols-6 gap-4 border-b p-3 mt-4 text-center ">
          <div className="font-semibold">Name</div>
          <div className="font-semibold">Address</div>
          <div className="font-semibold">Start Date</div>
          <div className="font-semibold">Due Date</div>
          <div className="font-semibold">Budget</div>
          <div className="font-semibold">Status</div>
        </div>

        {loading ? (
          <div className="text-center mt-4">Loading...</div>
        ) : (
          projects.map((project) => (
            <Link href={`project/${project.id}`} key={project.id}>
              <div className="grid grid-cols-6 gap-4 p-3 text-center items-center border-b border-gray-200 hover:bg-[#eef2f5] ">
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
                  className={`text-sm   rounded-full w-36 py-2 mx-auto text-white ${
                    project.status === "completed"
                      ? "bg-[#59bd50]"
                      : project.status === "delayed"
                      ? "bg-[#f70e0e]"
                      : project.status === "pending"
                      ? "bg-[#979797]"
                      : project.status === "in_progress"
                      ? "bg-[#78b7d0]"
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
    </div>
  );
}
