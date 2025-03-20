/* "use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Gantt, ViewMode } from "gantt-task-react";
import TaskDetailsTable1 from "@/components/task_details/task-details-table_1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Save, Trash2, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import CONFIG from "../../../config";

const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  DELAYED: "delayed",
};

const statusColors = {
  [TaskStatus.PENDING]: "#979797",
  [TaskStatus.IN_PROGRESS]: "#78B7D0",
  [TaskStatus.COMPLETED]: "#59BD50",
  [TaskStatus.DELAYED]: "#F70E0E",
};

const ProjectDetail = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;

  const [view, setView] = useState(ViewMode.Day);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [projectData, setProjectData] = useState({
    id: 0,
    name: "",
    address: "",
    budget: 0,
    status: TaskStatus.PENDING,
    start_date: "",
    end_date: "",
    actual_end_date: "",
    company_id: 1,
    current_assignee: 0,
    city_id: 0,
    province_id: 0,
  });

  const [editedProject, setEditedProject] = useState({});
  const [tasks, setTasks] = useState([]);

  let columnWidth = 60;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(
          `${CONFIG.API_BASE_URL}/projects/${projectId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          let errorText = await response.text();
          throw new Error(
            `API request failed with status ${response.status}: ${
              errorText || response.statusText
            }`
          );
        }

        const responseText = await response.text();
        const data = JSON.parse(responseText);

        const { project, tasks: projectTasks } = data;

        setProjectData({
          id: project.id,
          name: project.name,
          address: project.address,
          budget: project.budget || 0,
          status: project.status,
          start_date: project.start_date?.split("T")[0] || "",
          end_date: project.end_date?.split("T")[0] || "",
          actual_end_date: project.actual_end_date?.split("T")[0] || "",
          company_id: project.company_id,
          current_assignee: project.current_assignee,
          city_id: project.city_id || 0,
          province_id: project.province_id || 0,
        });

        setEditedProject({
          id: project.id,
          name: project.name,
          address: project.address,
          budget: project.budget || 0,
          status: project.status,
          start_date: project.start_date?.split("T")[0] || "",
          end_date: project.end_date?.split("T")[0] || "",
          actual_end_date: project.actual_end_date?.split("T")[0] || "",
          company_id: project.company_id,
          current_assignee: project.current_assignee,
          city_id: project.city_id || 0,
          province_id: project.province_id || 0,
        });
      } catch (err) {
        setError(`Failed to load project data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, router]);

  const handleExpanderClick = (task) => {
    setTasks(
      tasks.map((t) =>
        t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t
      )
    );
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      handleSaveChanges();
    } else {
      // Enter edit mode
      setEditedProject({ ...projectData });
      setEditMode(true);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      // Prepare the complete request data with all required fields
      const requestData = {
        name: editedProject.name,
        address: editedProject.address,
        budget: Number(editedProject.budget),
        status: editedProject.status,
        start_date: editedProject.start_date,
        end_date: editedProject.end_date,
        actual_end_date: editedProject.actual_end_date,
        company_id: editedProject.company_id,
        current_assignee: editedProject.current_assignee,
        city_id: editedProject.city_id || 1, // Default to 1 if not available
        province_id: editedProject.province_id || 1, // Default to 1 if not available
      };

      console.log("Sending update request with data:", requestData);

      const response = await fetch(
        `${CONFIG.API_BASE_URL}/projects/${projectId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `Error: ${response.status} - ${errorText || response.statusText}`
        );
      }

      const responseText = await response.text();
      const updatedProject = JSON.parse(responseText);

      // Update the local state with all the changes
      setProjectData({
        ...projectData,
        ...requestData,
      });

      setEditMode(false);
      alert("Project updated successfully!");
    } catch (err) {
      console.error("Update project error:", err);
      alert(`Failed to update project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "budget") {
      setEditedProject({
        ...editedProject,
        [name]: Number(value) || 0,
      });
    } else {
      setEditedProject({
        ...editedProject,
        [name]: value,
      });
    }
  };

  const handleStatusChange = (e) => {
    setEditedProject({
      ...editedProject,
      status: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading project details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive text-destructive rounded-md">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

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
              disabled={saving}
            >
              {editMode ? (
                saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={saving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">
                Project Name
              </p>
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
              <p className="text-sm font-normal text-muted-foreground">
                Project Address
              </p>
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
              <p className="text-sm font-normal text-muted-foreground">
                Budget
              </p>
              {editMode ? (
                <Input
                  name="budget"
                  type="number"
                  value={editedProject.budget}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">
                  ${projectData.budget.toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">
                Start Date
              </p>
              {editMode ? (
                <Input
                  name="start_date"
                  type="date"
                  value={editedProject.start_date}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">
                  {projectData.start_date
                    ? new Date(projectData.start_date).toLocaleDateString()
                    : "Not set"}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">
                Planned End Date
              </p>
              {editMode ? (
                <Input
                  name="end_date"
                  type="date"
                  value={editedProject.end_date}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">
                  {projectData.end_date
                    ? new Date(projectData.end_date).toLocaleDateString()
                    : "Not set"}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">
                Actual End Date
              </p>
              {editMode ? (
                <Input
                  name="actual_end_date"
                  type="date"
                  value={editedProject.actual_end_date}
                  onChange={handleInputChange}
                  className="text-base"
                />
              ) : (
                <p className="text-lg font-medium">
                  {projectData.actual_end_date
                    ? new Date(projectData.actual_end_date).toLocaleDateString()
                    : "Not set"}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-muted-foreground">
                Status
              </p>
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
                <p className="text-lg font-medium capitalize">
                  {projectData.status?.replace("_", " ") || "Not set"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        {editMode && (
          <CardFooter className="flex justify-end pt-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditedProject({ ...projectData });
                setEditMode(false);
              }}
              className="mr-2"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      <TaskDetailsTable1 />
    </div>
  );
};

export default ProjectDetail;
 */
