"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import TaskDetailsTable from '@/components/task_details/task-details-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Save, Trash2 } from 'lucide-react';

const customGanttStyles = `
  .gantt-header-month {
    font-size: 14px;
    font-weight: normal;
    padding: 6px 0;
  }
  
  .gantt-header-day {
    font-size: 12px;
    font-weight: normal;
  }
`;

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
  const [view, setView] = useState(ViewMode.Day);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  let columnWidth = 60;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }
  
  const [projectData, setProjectData] = useState({
    id: 1,
    name: "SAIT Sports Center",
    address: "1301 16 Ave NW, Calgary, AB T2M 0L4",
    budget: 350000,
    status: TaskStatus.IN_PROGRESS,
    start_date: "2024-03-01",
    end_date: "2025-09-30",
    company_id: 1,
    current_assignee: 1,
  });

  const initialTasks = [
    {
      start: new Date(2024, 11, 1),
      end: new Date(2024, 11, 25),
      name: 'Foundation',
      id: 'Foundation',
      type: 'project',
      progress: 45,
      hideChildren: false,
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
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 1),
      end: new Date(2024, 11, 20),
      name: 'Pin Footing',
      id: 'Task 1-1',
      type: 'task',
      progress: 0,
      project: 'Foundation',
      dependencies: ['Foundation'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 5000,
      amount_due: 0,
      assignee_id: 1,
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      },
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 15),
      end: new Date(2024, 11, 18),
      name: 'Wall Pours',
      id: 'Task 1-2',
      type: 'task',
      progress: 0,
      project: 'Foundation',
      dependencies: ['Task 1-1'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 8000,
      amount_due: 0,
      assignee_id: 1,
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      },
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 16),
      end: new Date(2024, 11, 17),
      name: 'Strip Forms',
      id: 'Task 1-3',
      type: 'task',
      progress: 0,
      project: 'Foundation',
      dependencies: ['Task 1-2'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 7000,
      amount_due: 0,
      assignee_id: 1,
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      },
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 26),
      end: new Date(2025, 0, 2),
      name: 'Framing',
      id: 'Framing',
      type: 'project',
      progress: 0,
      hideChildren: false,
      dependencies: ['Foundation'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 15000,
      amount_due: 0,
      assignee_id: 2,
      styles: { 
        backgroundColor: statusColors[TaskStatus.PENDING],
        backgroundSelectedColor: '#227B94',
        progressColor: '#227B94', 
        progressSelectedColor: '#227B94' 
      },
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 26),
      end: new Date(2024, 11, 27),
      name: 'Basement Framing',
      id: 'Task 2-1',
      type: 'task',
      progress: 0,
      project: 'Framing',
      dependencies: ['Framing'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 3000,
      amount_due: 0,
      assignee_id: 2,
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      },
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 27),
      end: new Date(2024, 11, 29),
      name: 'Main Floor Wall',
      id: 'Task 2-2',
      type: 'task',
      progress: 0,
      project: 'Framing',
      dependencies: ['Task 2-1'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 4000,
      amount_due: 0,
      assignee_id: 2,
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      },
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 29),
      end: new Date(2024, 11, 31),
      name: 'Garage Wall',
      id: 'Task 2-3',
      type: 'task',
      progress: 0,
      project: 'Framing',
      dependencies: ['Task 2-2'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 4000,
      amount_due: 0,
      assignee_id: 2,
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      },
      isDisabled: true
    },
    {
      start: new Date(2024, 11, 31),
      end: new Date(2025, 0, 2),
      name: 'Truss Delivery',
      id: 'Task 2-4',
      type: 'task',
      progress: 0,
      project: 'Framing',
      dependencies: ['Task 2-3'],
      project_id: projectData.id,
      status: TaskStatus.PENDING,
      budget: 4000,
      amount_due: 0,
      assignee_id: 2,
      styles: {
        backgroundColor: statusColors[TaskStatus.PENDING]
      },
      isDisabled: true
    }
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [editedProject, setEditedProject] = useState({...projectData});

  const handleExpanderClick = (task) => {
    setTasks(tasks.map(t => 
      t.id === task.id 
        ? { ...t, hideChildren: !t.hideChildren } 
        : t
    ));
  };

  const handleDeleteProject = () => {
    console.log("Deleting project with ID:", projectData.id);
    alert("Project successfully deleted!");
    setDeleteDialogOpen(false);
  };

  const handleEditToggle = () => {
    if (editMode) {
      setProjectData({...editedProject});
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'budget') {
      setEditedProject({
        ...editedProject,
        [name]: Number(value) || 0
      });
    } else {
      setEditedProject({
        ...editedProject,
        [name]: value
      });
    }
  };

  const handleStatusChange = (e) => {
    setEditedProject({
      ...editedProject,
      status: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Overview</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleEditToggle}
            >
              {editMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Project Name</p>
              {editMode ? (
                <Input 
                  name="name"
                  value={editedProject.name}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">{projectData.name}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Project Address</p>
              {editMode ? (
                <Input 
                  name="address"
                  value={editedProject.address}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">{projectData.address}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Budget</p>
              {editMode ? (
                <Input 
                  name="budget"
                  type="number"
                  value={editedProject.budget}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">${projectData.budget.toLocaleString()}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Start Date</p>
              {editMode ? (
                <Input 
                  name="start_date"
                  type="date"
                  value={editedProject.start_date}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">{new Date(projectData.start_date).toLocaleDateString()}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">End Date</p>
              {editMode ? (
                <Input 
                  name="end_date"
                  type="date"
                  value={editedProject.end_date}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">{new Date(projectData.end_date).toLocaleDateString()}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">Status</p>
              {editMode ? (
                <select
                  name="status"
                  value={editedProject.status}
                  onChange={handleStatusChange}
                  className="w-full rounded-md border border-input px-3 py-2 text-base"
                >
                  <option value={TaskStatus.PENDING}>Pending</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.COMPLETED}>Completed</option>
                  <option value={TaskStatus.DELAYED}>Delayed</option>
                </select>
              ) : (
                <p className="text-lg font-medium capitalize">{projectData.status.replace('_', ' ')}</p>
              )}
            </div>
          </div>
        </CardContent>
        {editMode && (
          <CardFooter className="flex justify-end pt-0">
            <Button variant="outline" onClick={() => {
              setEditedProject({...projectData});
              setEditMode(false);
            }} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleEditToggle}>
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <style>{customGanttStyles}</style>
          <div className="w-full">
            <Gantt
              tasks={tasks}
              viewMode={view}
              listCellWidth="155px"
              columnWidth={columnWidth}
              ganttHeight={400}
              headerHeight={50}
              rowHeight={50}
              todayColor="rgba(252, 211, 77, 0.15)"
              TaskListHeader={({ headerHeight = 50 }) => (
                <div style={{
                  height: `${headerHeight}px`,
                  padding: '0 12px',
                  fontWeight: 'bold',
                  background: '#f5f5f5',
                  borderBottom: '1px solid #e0e0e0',
                  width: '155px',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box'
                }}>
                  Task
                </div>
              )}
              TaskListTable={({ tasks, fontFamily, fontSize, rowHeight }) => (
                <div style={{ width: '155px', fontFamily, fontSize }}>
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      style={{
                        height: `${rowHeight}px`,
                        padding: '0 12px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: task.type === 'project' ? '12px' : '24px',
                        fontWeight: task.type === 'project' ? 'bold' : 'normal',
                        boxSizing: 'border-box',
                      }}
                    >
                      {task.hideChildren !== undefined && (
                        <span 
                          onClick={() => handleExpanderClick(task)}
                          style={{
                            cursor: 'pointer',
                            marginRight: '6px',
                            display: 'inline-flex',
                          }}
                        >
                          {task.hideChildren ? '▶' : '▼'}
                        </span>
                      )}
                      <span>{task.name}</span>
                    </div>
                  ))}
                </div>
              )}
              onExpanderClick={handleExpanderClick}
              onDateChange={() => {}}
              onProgressChange={() => {}}
              onDoubleClick={() => {}}
              onClick={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      <TaskDetailsTable />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Project Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the project "{projectData.name}"? This action cannot be undone and all associated data will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetail;
