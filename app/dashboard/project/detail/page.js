"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectDetail = () => {
  const projectData = {
    name: "SAIT Sports Center",
    address: "1301 16 Ave NW, Calgary, AB T2M 0L4",
    budget: 350000,
    startDate: "2024-03-01",
    endDate: "2025-09-30",
  };

  return (
    <div className="space-y-6">
      {/* Project Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Project Name</p>
              <p className="text-lg font-medium">{projectData.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Project Address</p>
              <p className="text-lg font-medium">{projectData.address}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Budget</p>
              <p className="text-lg font-medium">${projectData.budget.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Start Date</p>
              <p className="text-lg font-medium">{new Date(projectData.startDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">End Date</p>
              <p className="text-lg font-medium">{new Date(projectData.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gantt Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full border rounded-lg flex items-center justify-center text-muted-foreground">
            Gantt Chart Component Will Be Placed Here
          </div>
        </CardContent>
      </Card>

      {/* Task Details Section */}
    </div>
  );
};

export default ProjectDetail;
