"use client";

import TaskDetailsTable from "@/components/task_details/task-details-table";

export default function ProjectDetailPage() {
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

      {/* Task Details Table */}
      <TaskDetailsTable />
    </div>
  );
}
