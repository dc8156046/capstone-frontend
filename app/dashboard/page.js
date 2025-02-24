"use client";

import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function DashboardPage() {
  // Mock data for projects
  const [projects, setProjects] = useState([
   { id: 1, name: "Project 1", address: "123 Main St, Calgary, AB", date: "2025.09.30 - 2026.12.14", status: "In Progress", progress: 75 },
   { id: 2, name: "Project 2", address: "435 Street, Vancouver, BC", date: "2024.05.27 - 2025.03.19", status: "Upcoming", progress: 0 },
   { id: 3, name: "Project 3", address: "564 Ridge, Edmonton, AB", date: "2025.01.14 - 2025.09.16", status: "Complete", progress: 100 },
   { id: 4, name: "Project 4", address: "786 Point, Calgary, AB", date: "2025.06.7 - 2024.05.11", status: "Delayed", progress: 60 }
  ]);

  const groupedProjects = {
    "In Progress":[
      ...projects.filter(p => p.status === "In Progress"),
      ...projects.filter(p => p.status === "Delayed"),
    ],
    "Upcoming": projects.filter(p => p.status === "Upcoming"),
    "Complete": projects.filter(p => p.status === "Complete"),
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Project Overview</h2>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-100 rounded-xl text-black">
              <p className="text-lg font-bold">{groupedProjects["In Progress"].length}</p>
              <p className="text-sm font-semibold">In Progress</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl text-black">
              <p className="text-lg font-bold">{groupedProjects["Upcoming"].length}</p>
              <p className="text-sm font-semibold">Upcoming</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl text-black">
              <p className="text-lg font-bold">{groupedProjects["Complete"].length}</p>
              <p className="text-sm font-semibold">Complete</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl text-black">
              <p className="text-lg font-bold">{projects.length}</p>
              <p className="text-sm font-semibold">Total Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(groupedProjects).map(([status, projectList]) => (
            <div key={status} className="space-y-4">
              <h2 className="text-xl font-semibold">{status}</h2>
              <ul className="space-y-2">
                {projectList.map(project => (
                  <li key={project.id} className="p-4 bg-white shadow rounded-lg text-center">
                    <p className="text-lg font-bold">{project.name}</p>
                    
                    {project.status !== "Upcoming" && (
                      <div className="w-full bg-gray-200 rounded-full h-5 mt-2 relative">
                        <div 
                          className={`h-5 rounded-full text-xs text-white flex items-center justify-center ${project.status === "Delayed" ? "bg-red-600" : project.progress === 100 ? "bg-green-600" : "bg-cyan-600"}`} 
                          style={{ width: `${project.progress}%` }}
                        >
                          <span className="absolute w-full text-center text-xs font-semibold text-white">{project.progress}%</span>
                        </div>
                      </div>
                    )}
                    <p className="text-sm mt-2">{project.address}</p>
                    <p className="text-sm mt-2">{project.status === "Upcoming" ? project.date.split(" - ")[0] : project.date}</p>
                    <p className={`text-sm text-white rounded-lg mt-3 ${project.status === "In Progress" ? "bg-cyan-600" : project.status === "Upcoming" ? "bg-gray-400" : project.status === "Delayed" ? "bg-red-600" : project.status === "Complete" ? "bg-green-600" : ""}`}>{project.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <button className="w-32 h-32 flex items-center justify-center bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-700 mt-8">
            <Plus size={64} />
          </button>
          <span className="mt-2 text-gray-700 text-lg">Add Project</span>
        </div>
      )}
    </div>
  );
}
