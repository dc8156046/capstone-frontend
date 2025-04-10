"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ReminderDialog from "./reminder-dialog";
import DeleteDialog from "./delete-dialog";
import { AddTaskDialog } from "./add-task-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { taskDetailAPI } from "@/services/taskDetail";
import { userAPI } from "@/services";

export function TaskDetailsTable1({ projectId, projectData }) {
  // State
  const [tasks, setTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState(["1", "2"]);
  const [reminderDialog, setReminderDialog] = useState({
    open: false,
    contractor: null,
    taskName: "",
    taskId: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    taskId: null,
    taskName: "",
  });
  const [editingCell, setEditingCell] = useState({
    taskId: null,
    field: null,
  });
  const [addTaskDialog, setAddTaskDialog] = useState(false);
  const [customColumns, setCustomColumns] = useState([]);
  const { toast } = useToast();
  const [notesInput, setNotesInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  // Fetch initial data
  useEffect(() => {
    console.log("useEffect received projectId:", projectId);
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        if (!projectId) {
          throw new Error("No projectId provided");
        }
        console.log(`Fetching project details for projectId: ${projectId}`);
        const projectData = await taskDetailAPI.getProjectDetail(projectId);
        console.log("Project data received:", projectData);

        if (projectData && Array.isArray(projectData.tasks)) {
          console.log("All tasks:", projectData.tasks);

          const taskMap = new Map();
          const rootTasks = [];

          projectData.tasks.forEach(({ task, project_task }) => {
            console.log("Task assignee_id:", project_task?.assignee_id);
            if (!task.id || task.id <= 0) {
              console.warn(
                `Invalid task ID ${task.id} found, skipping task:`,
                task
              );
              return;
            }

            const formattedTask = {
              id: task.id,
              name: task.name,
              parentId: task.parent_id || 0,
              level: 0,
              assignTo: project_task.assignee_id || null,
              status: project_task.status || "pending",
              dueDate: project_task.end_date
                ? new Date(project_task.end_date)
                : null,
              budget: project_task.budget,
              pay_due: project_task.amount_due,
              dependence: project_task.dependency,
              notes: project_task.notes,
              children: [],
              sort_order: task.sort_order || 0,
            };
            taskMap.set(task.id, formattedTask);
          });
          console.log("Task map size:", taskMap.size);
          console.log("Quantity for root tasks:", rootTasks.length);

          taskMap.forEach((task) => {
            if (task.parentId === 0 || task.parentId === "0") {
              task.level = 0;
              rootTasks.push(task);
            } else {
              const parentTask = taskMap.get(task.parentId);
              if (parentTask) {
                task.level = parentTask.level + 1;
                parentTask.children.push(task);
                console.log(
                  ` ${task.id} has added to ${parentTask.id} as child`
                );
              } else {
                console.warn(
                  `Parent task with ID ${task.parentId} not found for task ${task.id}`
                );
                task.level = 0;
                rootTasks.push(task);
              }
            }
          });

          /* const childTask = taskMap.get(task.id);
            const parentTask = taskMap.get(task.parent_id);

            if (childTask && parentTask) {
              parentTask.children.push(childTask);
              console.log(
                ` ${childTask.id} has added to ${parentTask.id} as child`
              );
            } else {
              console.warn(
                `Parent task with ID ${task.parentId} not found for task ${task.id}`
              );
            }
          }); */

          if (rootTasks.length === 0) {
            console.warn("No root task , adding all tasks as root tasks");
            taskMap.forEach((task) => {
              task.level = 0;
              task.parentId = 0;
              rootTasks.push(task);
            });
          }
          /* if (task.parentId === 0) {
              rootTasks.push(task);
            } else {
              const parent = taskMap.get(task.parentId);
              if (parent) {
                parent.children.push(task);
              } else {
                console.warn(
                  `Parent task with ID ${task.parentId} not found for task ${task.id}`
                );
              }
            }
          }); */

          const sortTasks = (taskArray) => {
            taskArray.sort((a, b) => a.sort_order - b.sort_order);
            taskArray.forEach((task) => {
              if (task.children.length > 0) {
                sortTasks(task.children);
              }
            });
          };
          sortTasks(rootTasks);

          console.log("Task map size:", taskMap.size);
          console.log("Quantity for:", rootTasks.length);
          console.log("Formatted tasks:", rootTasks);

          setTasks(rootTasks);
          if (rootTasks.length > 0) {
            setExpandedTasks(rootTasks.map((task) => task.id.toString()));
          } else {
            toast({
              title: "No Tasks",
              description: "No tasks found for this project.",
              variant: "warning",
            });
          }
        } else {
          console.error("Invalid tasks data structure:", projectData);
          toast({
            title: "Data Error",
            description: "Project tasks data is in unexpected format.",
            variant: "destructive",
          });
          setTasks([]);
        }

        const usersData = await userAPI.getUsers();
        console.log("Raw users data:", usersData);
        if (usersData && Array.isArray(usersData)) {
          const contractorsData = usersData.map((user) => ({
            id: user.id,
            name:
              user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.email,
            email: user.email,
          }));
          console.log("Contractors data:", contractorsData);
          setContractors(contractorsData);
        } else {
          console.error("Invalid users data structure:", usersData);
          toast({
            title: "Data Error",
            description: "Failed to load contractors data.",
            variant: "destructive",
          });
          setContractors([]);
        }

        setStatusOptions([
          { value: "in_progress", label: "In Progress", color: "#78B7D0" },
          { value: "pending", label: "Pending", color: "#979797" },
          { value: "delayed", label: "Delayed", color: "#F70E0E" },
          { value: "completed", label: "Completed", color: "#59BD50" },
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        const errorMessage = error.response
          ? `API Error: ${error.response.status} - ${error.response.statusText}`
          : `Network Error: ${error.message}`;
        toast({
          title: "Error",
          description: `Failed to load project data: ${errorMessage}`,
          variant: "destructive",
        });
        setTasks([]);
        setContractors([]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchInitialData();
    } else {
      console.error("No projectId provided");
      toast({
        title: "Error",
        description: "No project ID provided",
        variant: "destructive",
      });
    }
  }, [projectId, toast]);

  // Format amount as currency
  const formatAmount = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);

  // Render editable cell
  const renderEditableCell = (task, field) => {
    const isEditing =
      editingCell.taskId === task.id && editingCell.field === field;

    switch (field) {
      case "assignTo":
        const assignee =
          task.assignTo ||
          (task.level > 0
            ? tasks.find((t) =>
                t.children?.some((child) => child.id === task.id)
              )?.assignTo
            : null);

        /* console.log("Assignee for task", task.id, ":", assignee);
        console.log("Contractors:", contractors); */

        return (
          <div className="flex items-center gap-2">
            {contractors.length === 0 ? (
              <span className="text-red-500">No contractors available</span>
            ) : (
              <Select
                value={assignee || ""}
                onValueChange={(value) => {
                  handleUpdateTask(task.id, { assignTo: value });
                  if (isEditing) {
                    setEditingCell({});
                  }
                }}
                onOpenChange={(open) => {
                  if (!open && isEditing) {
                    setEditingCell({});
                  }
                }}
              >
                <SelectTrigger className="w-full max-w-[180px]">
                  <SelectValue placeholder="Select Contractor">
                    {assignee
                      ? contractors.find((c) => c.id === assignee)?.name ||
                        contractors.find((c) => c.id === assignee)?.email ||
                        "Unassigned"
                      : "Select Contractor"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full max-w-[180px]">
                  {contractors.map((contractor) => (
                    <SelectItem key={contractor.id} value={contractor.id}>
                      {contractor.name || contractor.email || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {assignee && contractors.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-[#227B94] hover:text-[#227B94]/90"
                onClick={() => {
                  const contractor = contractors.find((c) => c.id === assignee);
                  if (contractor) {
                    setReminderDialog({
                      open: true,
                      contractor: {
                        id: contractor.id,
                        name: contractor.name || contractor.email || "Unknown",
                        email: contractor.email || "",
                      },
                      taskName: task.name || "Unknown Task",
                      taskId: task.id,
                    });
                  } else {
                    console.error(
                      "Contractor not found for assignee:",
                      assignee
                    );
                  }
                }}
              >
                <span className="text-xs mr-1">+</span>
                <Mail className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case "status":
        return (
          <Select
            value={task.status || ""}
            onValueChange={(value) => {
              handleUpdateTask(task.id, { status: value });
            }}
          >
            <SelectTrigger
              className="w-[120px]"
              style={{
                backgroundColor: task.status
                  ? statusOptions.find((s) => s.value === task.status)?.color
                  : undefined,
                color: task.status ? "white" : undefined,
                border: "none",
                borderRadius: "40px",
              }}
            >
              <SelectValue placeholder="Select status">
                {task.status
                  ? statusOptions.find((s) => s.value === task.status)?.label
                  : "Select status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="flex items-center"
                >
                  <div
                    className="flex items-center w-full px-2 py-1 rounded-[40px]"
                    style={{
                      backgroundColor: option.color,
                      color: "white",
                    }}
                  >
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "dueDate":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "cursor-pointer hover:text-[#227B94]",
                  !task.dueDate && "text-muted-foreground"
                )}
                onClick={() =>
                  setEditingCell({ taskId: task.id, field: "dueDate" })
                }
              >
                {task.dueDate
                  ? format(task.dueDate, "MMM d, yyyy")
                  : "Pick a date"}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={task.dueDate}
                onSelect={(date) => {
                  if (date) {
                    handleUpdateTask(task.id, { dueDate: date });
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        );

      case "budget":
      case "pay_due":
        return isEditing ? (
          <Input
            autoFocus
            defaultValue={task[field]?.toString() || ""}
            onBlur={(e) => {
              const value = Number.parseFloat(
                e.target.value.replace(/[^0-9.-]+/g, "")
              );
              handleUpdateTask(task.id, { [field]: value });
              setEditingCell({});
            }}
            onChange={(e) => {
              e.target.value = e.target.value;
            }}
          />
        ) : (
          <div
            onClick={() => setEditingCell({ taskId: task.id, field })}
            className="cursor-pointer"
          >
            {task[field] ? formatAmount(task[field].toString()) : "-"}
          </div>
        );

      case "dependence":
        return (
          <Select
            value={task.dependence}
            onValueChange={(value) => {
              handleUpdateTask(task.id, { dependence: value });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select dependence">
                {task.dependence ? getTaskNameById(task.dependence) : "None"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              {getAllTasks
                .filter((t) => t.id !== task.id)
                .map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );

      default:
        if (customColumns.includes(field)) {
          return isEditing ? (
            <Input
              autoFocus
              defaultValue={task[field]}
              onBlur={(e) => {
                handleUpdateTask(task.id, { [field]: e.target.value });
                setEditingCell({});
              }}
            />
          ) : (
            <div
              onClick={() => setEditingCell({ taskId: task.id, field })}
              className="cursor-pointer"
            >
              {task[field] || "-"}
            </div>
          );
        }
        return null;
    }
  };

  const toggleTask = (taskId) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  //table row
  const renderTask = (task) => {
    if (!task.id) {
      console.error("Task with missing ID:", task);
      return null;
    }
    const isExpanded = expandedTasks.includes(task.id.toString());
    const hasChildren = task.children && task.children.length > 0;

    return (
      <React.Fragment key={task.id}>
        <TableRow key={task.id}>
          <TableCell className="font-medium border-r-2 border-black/10 text-center">
            <div className="flex items-center space-x-2">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => toggleTask(task.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              <span
                style={{ marginLeft: `${task.level * 24}px` }}
                className={cn(
                  "transition-colors",
                  task.level === 0
                    ? "font-bold text-[#227B94]"
                    : "text-muted-foreground"
                )}
              >
                {task.name}
              </span>
            </div>
          </TableCell>
          <TableCell className="border-r border-black/5 text-center">
            {renderEditableCell(task, "assignTo")}
          </TableCell>
          <TableCell className="border-r border-black/5 text-center">
            {renderEditableCell(task, "status")}
          </TableCell>
          <TableCell className="border-r border-black/5 text-center">
            {renderEditableCell(task, "dueDate")}
          </TableCell>
          <TableCell className="border-r border-black/5 text-center">
            {renderEditableCell(task, "budget")}
          </TableCell>
          <TableCell className="border-r border-black/5 text-center">
            {renderEditableCell(task, "pay_due")}
          </TableCell>
          <TableCell className="border-r border-black/5 text-center relative group">
            <div className="notes-cell">
              {task.notes ? (
                <span className="truncate">{task.notes}</span>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setNotesInput((prev) => ({
                      ...prev,
                      [task.id]: task.notes || "",
                    }));
                  }}
                >
                  +
                </Button>
              )}
            </div>
            {task.notes && (
              <div className="absolute left-0 top-full w-max max-w-[300px] bg-white shadow-md border p-2 rounded-md hidden group-hover:block z-10">
                {task.notes}
              </div>
            )}
          </TableCell>
          {customColumns.map((column, index) => (
            <TableCell
              key={column}
              className={cn(
                "border-r border-black/5 text-center",
                index === customColumns.length - 1 && "border-r-0"
              )}
            >
              {renderEditableCell(task, column)}
            </TableCell>
          ))}
          <TableCell className="text-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setDeleteDialog({
                  open: true,
                  taskId: task.id,
                  taskName: task.name,
                });
              }}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TableCell>
        </TableRow>
        {isExpanded && task.children?.map((child) => renderTask(child))}
      </React.Fragment>
    );
  };

  // API-integrated update task
  const handleUpdateTask = async (taskId, updates) => {
    try {
      const task = await taskDetailAPI.getTaskDetail(projectId, taskId);
      console.log(`task detail: ${task}`);
      const apiUpdates = {
        task_id: taskId,
        assignee_id: task.assignTo || null,
        status: task.status || "pending", // Default to "pending"
        end_date: task.endDate ? new Date(task.endDate).toISOString() : null,
        actual_end_date: task.actualEndDate
          ? new Date(task.actualEndDate).toISOString()
          : null,
        budget: task.budget || 0,
        amount_due: task.amountDue || 0, // assuming task.amountDue exists
        dependency: task.dependency || null,
        duration: task.duration || null, // default duration to 1
        notes: task.notes || "",
      };

      if (updates.assignTo !== undefined) {
        apiUpdates.assignee_id = updates.assignTo;
      }

      if (updates.status !== undefined) {
        const validStatuses = [
          "pending",
          "in_progress",
          "completed",
          "delayed",
        ];
        if (!validStatuses.includes(updates.status)) {
          throw new Error(`Invalid status value: ${updates.status}`);
        }
        apiUpdates.status = updates.status;
      }

      if (updates.dueDate !== undefined) {
        apiUpdates.start_date =
          updates.dueDate instanceof Date
            ? updates.dueDate.toISOString()
            : updates.dueDate;
      }

      if (updates.budget !== undefined) apiUpdates.budget = updates.budget;

      if (updates.pay_due !== undefined)
        apiUpdates.amount_due = updates.pay_due;

      if (updates.dependence !== undefined)
        apiUpdates.dependency = parseInt(updates.dependence, 10);

      if (updates.notes !== undefined) apiUpdates.notes = updates.notes;

      if (updates.endDate !== undefined) {
        apiUpdates.end_date =
          updates.endDate instanceof Date
            ? updates.endDate.toISOString()
            : updates.endDate;
      }

      if (updates.actualEndDate !== undefined) {
        apiUpdates.actual_end_date =
          updates.actualEndDate instanceof Date
            ? updates.actualEndDate.toISOString()
            : updates.actualEndDate;
      }

      if (updates.duration !== undefined) {
        apiUpdates.duration = updates.duration;
      }
      console.log("project id:", projectId);
      console.log("Sending update request with data:", apiUpdates);
      await taskDetailAPI.updateTask(projectId, apiUpdates);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update task:", error);
      let errorMessage = "Failed to update task.";
      if (error.response) {
        errorMessage += ` Server responded with status ${error.response.status}.`;
        if (error.response.status === 422) {
          errorMessage += " Validation error.";
          if (error.response.data?.detail) {
            errorMessage += ` Details: ${JSON.stringify(
              error.response.data.detail
            )}`;
          }
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // API-integrated add task
  const handleAddTask = async (parentName, childrenNames, insertAfter) => {
    console.log("handleAddTask called with projectId:", projectId);
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project ID provided",
        variant: "destructive",
      });
      return false;
    }
    try {
      let parentTask = tasks.find(
        (task) => task.name === parentName && task.parentId === 0
      );
      let parentTaskId;

      if (!parentTask) {
        const newParentData = {
          name: parentName,
          parent_id: "0",
          sort_order: tasks.length + 1,
          status: "pending",
          company_id: projectData?.project?.company_id || 0,
          priority: "low",
          estimated_duration: 0,
          start_date: new Date().toISOString(),
        };
        console.log("Adding new parent task with data:", newParentData);
        const response = await taskDetailAPI.addTask(projectId, newParentData);
        if (!response || !response.id) {
          throw new Error("Failed to create parent task: Invalid response");
        }
        parentTask = {
          id: response.id,
          name: parentName,
          parentId: 0,
          level: 0,
          children: [],
          assignTo: null,
          status: "pending",
          dueDate: null,
          budget: null,
          pay_due: null,
          dependence: null,
          notes: null,
          sort_order: newParentData.sort_order,
        };
        setTasks((prevTasks) => [...prevTasks, parentTask]);
        parentTaskId = parentTask.id;
      } else {
        parentTaskId = parentTask.id;
      }

      let sortOrder = 1;
      let insertIndex = -1;
      if (insertAfter && insertAfter !== "atTheEnd") {
        const targetSubtask = parentTask.children.find(
          (child) => child.id === parseInt(insertAfter)
        );
        if (targetSubtask) {
          sortOrder = targetSubtask.sort_order + 1;
          insertIndex =
            parentTask.children.findIndex(
              (t) => t.id === parseInt(insertAfter)
            ) + 1;
        }
      } else {
        sortOrder =
          parentTask.children.length > 0
            ? Math.max(
                ...parentTask.children.map((child) => child.sort_order)
              ) + 1
            : 1;
      }

      const subtasksData = childrenNames.map((name, index) => ({
        name,
        parent_id: parentTaskId.toString(),
        sort_order: sortOrder + index,
        status: "pending",
        company_id: projectData?.project?.company_id || 0,
        priority: "low",
        estimated_duration: 0,
        start_date: new Date().toISOString(),
      }));

      console.log("Creating subtasks with data:", subtasksData);
      const response = await taskDetailAPI.createSubtask(
        parentTaskId,
        subtasksData
      );
      console.log("createSubtask response:", response);

      if (response && Array.isArray(response)) {
        const formattedSubtasks = response.map((item, index) => {
          console.log("Processing subtask item:", item);
          if (!item || typeof item !== "object" || !item.id) {
            console.error("Invalid subtask item:", item);
            return null;
          }
          return {
            id: item.id,
            name: item.name || "",
            parentId: item.parent_id || parentTaskId,
            level: 1,
            assignTo: null,
            status: "pending",
            dueDate: null,
            budget: null,
            pay_due: null,
            dependence: null,
            notes: null,
            children: [],
            sort_order: item.sort_order || sortOrder + index,
          };
        });

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === parentTaskId
              ? {
                  ...task,
                  children: insertAfter
                    ? [
                        ...task.children.slice(
                          0,
                          task.children.findIndex(
                            (t) => t.id === parseInt(insertAfter)
                          ) + 1
                        ),
                        ...formattedSubtasks,
                        ...task.children.slice(
                          task.children.findIndex(
                            (t) => t.id === parseInt(insertAfter)
                          ) + 1
                        ),
                      ]
                    : [...(task.children || []), ...formattedSubtasks],
                }
              : task
          )
        );

        const updatedProjectData = await taskDetailAPI.getProjectDetail(
          projectId
        );
        if (updatedProjectData && Array.isArray(updatedProjectData.tasks)) {
          const taskMap = new Map();
          const rootTasks = [];

          updatedProjectData.tasks.forEach(({ task, project_task }) => {
            if (!task.id || task.id <= 0) {
              console.warn(
                `Invalid task ID ${task.id} found, skipping task:`,
                task
              );
              return;
            }
            const formattedTask = {
              id: task.id,
              name: task.name,
              parentId: task.parent_id || 0,
              level: 0,
              assignTo: project_task?.assignee_id || null,
              status: project_task?.status || "pending",
              dueDate: project_task?.end_date
                ? new Date(project_task.end_date)
                : null,
              budget: project_task?.budget || null,
              pay_due: project_task?.amount_due || null,
              dependence: project_task?.dependency || null,
              notes: project_task?.notes || null,
              children: [],
              sort_order: task.sort_order || 0,
            };
            taskMap.set(task.id, formattedTask);
          });

          formattedSubtasks.forEach((subtask) => {
            if (!taskMap.has(subtask.id)) {
              taskMap.set(subtask.id, subtask);
            }
          });

          taskMap.forEach((task) => {
            if (task.parentId === 0 || task.parentId === "0") {
              task.level = 0;
              rootTasks.push(task);
            } else {
              const parentTask = taskMap.get(task.parentId);
              if (parentTask) {
                task.level = parentTask.level + 1;
                parentTask.children.push(task);
              } else {
                console.warn(
                  `Parent task with ID ${task.parentId} not found for task ${task.id}`
                );
                task.level = 0;
                rootTasks.push(task);
              }
            }
          });

          const sortTasks = (taskArray) => {
            taskArray.sort((a, b) => a.sort_order - b.sort_order);
            taskArray.forEach((task) => {
              if (task.children.length > 0) {
                sortTasks(task.children);
              }
            });
          };
          sortTasks(rootTasks);

          setTasks(rootTasks);
          setExpandedTasks(rootTasks.map((task) => task.id.toString()));
        } else {
          throw new Error("Failed to fetch updated project data");
        }

        if (!expandedTasks.includes(parentTaskId.toString())) {
          setExpandedTasks((prev) => [...prev, parentTaskId.toString()]);
        }

        toast({ title: "Success", description: "Subtasks added successfully" });
        return true;
      } else {
        throw new Error("Invalid response from createSubtask");
      }
    } catch (error) {
      console.error("Failed to add task:", error);
      let errorMessage = "Failed to add task.";
      if (error.response) {
        errorMessage += ` Server responded with status ${error.response.status}.`;
        if (error.response.status === 422) {
          errorMessage += " Validation error.";
          if (error.response.data?.detail) {
            console.log(
              "Validation error details:",
              error.response.data.detail
            );
            errorMessage += ` Details: ${JSON.stringify(
              error.response.data.detail
            )}`;
          }
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // API-integrated delete task
  const handleDeleteTask = async (taskId) => {
    try {
      setTasks((prevTasks) => removeTaskLocally(prevTasks, taskId));
      await taskDetailAPI.deleteTask(projectId, taskId);
      toast({
        title: "Success",
        description: "Task deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Local task removal function
  const removeTaskLocally = (tasks, taskId) => {
    return tasks.reduce((acc, task) => {
      if (task.id === taskId) {
        return acc;
      }
      if (task.children) {
        const newChildren = removeTaskLocally(task.children, taskId);
        if (newChildren.length !== task.children.length) {
          return [...acc, { ...task, children: newChildren }];
        }
      }
      return [...acc, task];
    }, []);
  };

  // Helper function to send reminder email
  const handleSendReminder = async (contractor, taskName) => {
    try {
      await taskDetailAPI.sendEmail(projectId, {
        userId: contractor.id,
        email: contractor.email,
        taskName,
        projectName: "Project XXX", // This should come from project data
      });

      toast({
        title: "Success",
        description: "Reminder sent successfully",
        duration: 3000,
      });

      return true;
    } catch (error) {
      console.error("Failed to send reminder:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get all tasks (flattened)
  const getAllTasks = useMemo(() => {
    const flattenTasks = (tasks) => {
      return tasks.reduce((acc, task) => {
        acc.push(task);
        if (task.children) acc.push(...flattenTasks(task.children));
        return acc;
      }, []);
    };
    return flattenTasks(tasks);
  }, [tasks]);

  // Get task name by id
  const getTaskNameById = (taskId) =>
    getAllTasks.find((t) => t.id === taskId)?.name || "Unknown";

  // Add notes to a task
  const handleAddNotes = async (taskId, notes) => {
    try {
      await handleUpdateTask(taskId, { notes });

      setNotesInput((prev) => {
        const updated = { ...prev };

        return updated;
      });
      toast({
        title: "Success",
        description: "Notes added successfully",
      });
    } catch (error) {
      console.error("Failed to add notes:", error);
      toast({
        title: "Error",
        description:
          error.message === "Task not found in current state"
            ? "Task has been deleted. Cannot add notes."
            : "Failed to add notes.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#227B94]"></div>
      </div>
    );
  }

  return (
    <div className=" py-6 space-y-6 px-4 max-w-[1450px]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#444444]">Task Details</h2>
        <Button
          onClick={() => setAddTaskDialog(true)}
          className="bg-[#227B94] hover:bg-[#227B94]/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="rounded-2xl  border bg-white overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="border-r-2 border-black/10 min-w-[150px] text-center">
                  Task
                </TableHead>

                <TableHead className="border-r border-black/5 min-w-[120px] text-center">
                  Assign To
                </TableHead>
                <TableHead className="border-r border-black/5 min-w-[120px] text-center">
                  Status
                </TableHead>
                <TableHead className="border-r border-black/5 min-w-[120px] text-center">
                  Due Date
                </TableHead>
                <TableHead className="border-r border-black/5 min-w-[120px] text-center">
                  Budget
                </TableHead>
                <TableHead className="border-r border-black/5 min-w-[120px] text-center">
                  Amount Due
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 ml-1 inline-block" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Amount Due = Budget * Current task completion
                          percentage.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="border-r border-black/5 min-w-[120px] text-center">
                  Notes
                </TableHead>
                <TableHead className="border-r border-black/5 min-w-[100px]">
                  Delete
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <React.Fragment key={index}>
                    {renderTask(task)}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No tasks available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ReminderDialog
        open={reminderDialog.open}
        onOpenChange={(open) => {
          setReminderDialog({
            open,
            contractor: open ? reminderDialog.contractor : null,
            taskName: open ? reminderDialog.taskName : "",
            taskId: open ? reminderDialog.taskId : null,
          });
        }}
        contractor={reminderDialog.contractor}
        taskName={reminderDialog.taskName || ""}
        taskId={reminderDialog.taskId}
        projectId={projectId}
      />

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog({ open: false, taskId: null, taskName: "" });
          }
        }}
        onConfirm={() => {
          if (deleteDialog.taskId) {
            handleDeleteTask(deleteDialog.taskId);
            setDeleteDialog({ open: false, taskId: null, taskName: "" });
            toast({
              title: "Success",
              description: "Task deleted successfully",
              duration: 3000,
            });
          }
        }}
        taskName={deleteDialog.taskName}
      />

      <AddTaskDialog
        open={addTaskDialog}
        onOpenChange={setAddTaskDialog}
        onAddTask={handleAddTask}
        projectId={projectId}
      />

      {Object.entries(notesInput).map(([taskId, value]) => (
        <Dialog
          key={taskId}
          open={notesInput[taskId] !== undefined}
          onOpenChange={() => {
            setNotesInput((prev) => {
              const updated = { ...prev };
              delete updated[taskId];
              return updated;
            });
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Notes Here</DialogTitle>
            </DialogHeader>
            <Input
              value={value || ""}
              onChange={(e) => {
                const val = e.target.value.slice(0, 200);
                setNotesInput((prev) => ({ ...prev, [taskId]: val }));
              }}
              placeholder="Enter up to 200 characters"
            />
            <DialogFooter>
              <Button
                className="bg-[#227B94] text-white"
                onClick={() => handleAddNotes(taskId, value)}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

export default TaskDetailsTable1;
