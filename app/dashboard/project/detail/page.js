"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  DELAYED: "delayed"
};

const statusColors = {
  [TaskStatus.PENDING]: '#979797',
  [TaskStatus.IN_PROGRESS]: '#78B7D0',
  [TaskStatus.COMPLETED]: '#59BD50',
  [TaskStatus.DELAYED]: '#F70E0E'
};

const ProjectDetail = () => {
  const [view, setView] = useState(ViewMode.Week);
  
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const projectData = {
    id: 1,
    name: "SAIT Sports Center",
    address: "1301 16 Ave NW, Calgary, AB T2M 0L4",
    budget: 350000,
    status: TaskStatus.IN_PROGRESS,
    start_date: "2024-03-01",
    end_date: "2025-09-30",
    company_id: 1,
    current_assignee: 1,
  };

  const tasks = [
    {
      start: new Date(2024, 11, 1),
      end: new Date(2024, 11, 25),
      name: 'Foundation',
      id: 'Task 1',
      type: 'project',
      progress: 45,
      project_id: projectData.id,
      status: TaskStatus.IN_PROGRESS,
      budget: 20000,
      amount_due: 5000,
      assignee_id: 1,
      styles: { 
        backgroundColor: statusColors[TaskStatus.IN_PROGRESS],
        backgroundSelectedColor: '#227B94',
        progressColor: '#227B94', 
        progressSelectedColor: '#227B94' 
      },
    },
    {
      start: new Date(2024, 11, 1),
      end: new Date(2024, 11, 20),
      name: 'Pin Footing',
      id: '1-1',
      type: 'task',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 5000,
      amount_due: 0,
      assignee_id: 1,
      dependencies: ['Task 1'],
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      }
    },
    {
      start: new Date(2024, 11, 15),
      end: new Date(2024, 11, 18),
      name: 'Wall Pours',
      id: '1-2',
      type: 'task',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 8000,
      amount_due: 0,
      assignee_id: 1,
      dependencies: ['1-1'],
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      }
    },
    {
      start: new Date(2024, 11, 16),
      end: new Date(2024, 11, 17),
      name: 'Strip Forms',
      id: '1-3',
      type: 'task',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 7000,
      amount_due: 0,
      assignee_id: 1,
      dependencies: ['1-2'],
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      }
    },
    {
      start: new Date(2024, 11, 26),
      end: new Date(2025, 0, 2),
      name: 'Framing',
      id: 'Task 2',
      type: 'project',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 15000,
      amount_due: 0,
      assignee_id: 2,
      dependency: 'Task 1',
      styles: { 
        backgroundColor: statusColors[TaskStatus.PENDING],
        backgroundSelectedColor: '#227B94',
        progressColor: '#227B94', 
        progressSelectedColor: '#227B94' 
      },
    },
    {
      start: new Date(2024, 11, 26),
      end: new Date(2024, 11, 27),
      name: 'Basement Framing',
      id: '2-1',
      type: 'task',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 3000,
      amount_due: 0,
      assignee_id: 2,
      dependencies: ['Task 2'],
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      }
    },
    {
      start: new Date(2024, 11, 27),
      end: new Date(2024, 11, 29),
      name: 'Main Floor Wall',
      id: '2-2',
      type: 'task',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 4000,
      amount_due: 0,
      assignee_id: 2,
      dependencies: ['2-1'],
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      }
    },
    {
      start: new Date(2024, 11, 29),
      end: new Date(2024, 11, 31),
      name: 'Garage Wall',
      id: '2-3',
      type: 'task',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 4000,
      amount_due: 0,
      assignee_id: 2,
      dependencies: ['2-2'],
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      }
    },
    {
      start: new Date(2024, 11, 31),
      end: new Date(2025, 0, 2),
      name: 'Truss Delivery',
      id: '2-4',
      type: 'task',
      progress: 0,
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 4000,
      amount_due: 0,
      assignee_id: 2,
      dependencies: ['2-3'],
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      }
    }
  ];

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
              <p className="text-lg font-medium">{new Date(projectData.start_date).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">End Date</p>
              <p className="text-lg font-medium">{new Date(projectData.end_date).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Status</p>
              <p className="text-lg font-medium capitalize">{projectData.status.replace('_', ' ')}</p>
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
          <div className="w-full">
            <Gantt
              tasks={tasks}
              viewMode={view}
              listCellWidth="155px"
              columnWidth={columnWidth}
              ganttHeight={400}
              onDateChange={(task, start, end) => {
                console.log('Date Change:', task, start, end);
              }}
              onProgressChange={(task, progress) => {
                console.log('Progress Change:', task, progress);
              }}
              onExpanderClick={(task) => {
                console.log('Expander Click:', task);
              }}
              onDoubleClick={(task) => {
                console.log('Double Click:', task);
              }}
              onClick={(task) => {
                console.log('Click:', task);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Task Details Section */}
    </div>
  );
};

export default ProjectDetail;
