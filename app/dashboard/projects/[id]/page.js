"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TaskDetailsTable1 from "@/components/task_details/task_details_table_1";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { taskDetailAPI } from "@/services/taskDetail";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id;

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setError("No project ID provided");
      setLoading(false);
      return;
    }

    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await taskDetailAPI.getProjectDetail(projectId);
        const { project } = response;

        setProjectData({
          id: project.id,
          name: project.name || "",
          address: project.address || "",
          budget: project.budget || 0,
          status: project.status || "pending",
          start_date: project.start_date?.split("T")[0] || "",
          end_date: project.end_date?.split("T")[0] || "",
          actual_end_date: project.actual_end_date?.split("T")[0] || "",
          company_id: project.company_id || 0,
          current_assignee: project.current_assignee || 0,
          city_id: project.city_id || 0,
          province_id: project.province_id || 0,
        });
      } catch (err) {
        console.error("Failed to fetch project data:", err);
        setError(`Failed to load project data: ${err.message}`);
        toast({
          title: "Error",
          description: `Failed to load project data: ${err.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, toast]);

  if (loading) {
    return (
      <div
        className="container mx-auto py-6 space-y-6"
        style={{ backgroundColor: "#EEF2F5" }}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div
        className="container mx-auto py-6 space-y-6"
        style={{ backgroundColor: "#EEF2F5" }}
      >
        <h1 className="text-3xl font-bold">Iris Project</h1>

        {/* Project Information */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#444444]">
            Project Information
          </h2>
        </div>

        <div className="p-4 border border-destructive text-destructive rounded-md">
          <h3 className="font-bold">Error</h3>
          <p>{error || "Failed to load project data"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#227B94] text-white rounded-md hover:bg-[#227B94]/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto py-6 space-y-6"
      style={{ backgroundColor: "#EEF2F5" }}
    >
      <h1 className="text-3xl font-bold">{projectData.name}</h1>

      {/* Project Information */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#444444]">
          Project Information
        </h2>
      </div>

      {/* Task Details Table */}
      <TaskDetailsTable1 projectId={projectId} projectData={projectData} />
    </div>
  );
}
