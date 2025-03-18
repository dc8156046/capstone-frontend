"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateProject from "@/components/createProject";

export default function DashboardPage() {
  
  /*This page is still missing some functionalities: 
      1.Connect DB to fectch "In Progress", "Upcoming", etc.
      2.Add Project button needs to be implement to actually add a new project

  */
 

  const [showCreateProject, setShowCreateProject] = useState(false); 

  const handleAddProject = () => {
    setShowCreateProject(true);
  };


  return (
    <div className="p-6 space-y-6">
      {!showCreateProject ? ( // Conditionally render the Dashboard or CreateProject
        <>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Project Overview</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{"0"}</p>
                  <p className="text-sm font-semibold">In Progress</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{"0"}</p>
                  <p className="text-sm font-semibold">Upcoming</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{"0"}</p>
                  <p className="text-sm font-semibold">Complete</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-black">
                  <p className="text-lg font-bold">{"0"}</p>
                  <p className="text-sm font-semibold">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col items-center">
            <button
              className="w-32 h-32 flex items-center justify-center bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-700 mt-8"
              onClick={handleAddProject}
            >
              <Plus size={64} />
            </button>
            <span className="mt-2 text-gray-700 text-lg">Add Project</span>
          </div>
        </>
      ) : (
        <CreateProject />
      )}
    </div>
  );
}