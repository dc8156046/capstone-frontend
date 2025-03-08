"use client";

import EachProjectBudget from "@/components/analysis/each_project_budget";
import EachProjectDuration from "@/components/analysis/each_project_duration";

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Each Project Budget */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#444444] mb-4">
            {" "}
            Projects Budget Comparison
          </h2>
          <EachProjectBudget title="Q1 Project Budgets" />
        </div>

        {/* Each Project Duration */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#444444] mb-4">
            {" "}
            Projects Duration Comparison
          </h2>
          <EachProjectDuration title="Q2 Project Budgets" />
        </div>
      </div>
    </div>
  );
}
