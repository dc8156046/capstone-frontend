"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EachProjectDuration from "@/components/analysis/each_project_duration";
import ProjectsBudget from "@/components/analysis/projects_budget";
import CategoryBudget from "@/components/category_date1";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState("project1");

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of all projects and individual project details
        </p>
      </div>

      {/* All Projects Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Projects Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Duration Comparison Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#444444]">
                Projects Duration Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EachProjectDuration title="Q2 Project Budgets" />
            </CardContent>
          </Card>

          {/* Budget Comparison Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#444444]">
                Projects Budget Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectsBudget title="Q2 Project Budgets" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visual separator using border and margin instead of Separator component */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Single Project Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Individual Project Analysis</h2>
          {/* Project selector for individual project view */}
          <div className="w-[200px]">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project1">Project 1</SelectItem>
                <SelectItem value="project2">Project 2</SelectItem>
                <SelectItem value="project3">Project 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project Summary Card - Project Specific */}
        <Card className="md:col-span-2 mb-5">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#444444]">
              {selectedProject.replace("project", "Project ")} Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">$45,000</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Estimated Duration
                </p>
                <p className="text-2xl font-bold">120 days</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Actual Duration</p>
                <p className="text-2xl font-bold">90 days</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">65%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Budget Card - Project Specific */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#444444]">
                Category Budget
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Budget distribution by category for{" "}
                {selectedProject.replace("project", "Project ")}
              </p>
            </CardHeader>
            <CardContent>
              <CategoryBudget
                title="Category Distribution"
                selectedProject={selectedProject}
              />
            </CardContent>
          </Card>

          {/* Placeholder for future line chart - Project Specific */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#444444]">
                Category Duration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Progress over time for{" "}
                {selectedProject.replace("project", "Project ")}
              </p>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Duration chart will be added here
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
