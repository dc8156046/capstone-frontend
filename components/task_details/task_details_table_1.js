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

export function TaskDetailsTable1({ projectId }) {
  // State
  const [tasks, setTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState(["1", "2"]);
  const [reminderDialog, setReminderDialog] = useState({
    open: false,
    contractor: null,
    taskName: "",
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
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching project details for projectId: ${projectId}`);
        const projectData = await taskDetailAPI.getProjectDetail(projectId);
        console.log("Project data received:", projectData);

        if (projectData && Array.isArray(projectData.tasks)) {
          const taskMap = new Map();
          const rootTasks = [];

          projectData.tasks.forEach(({ task, project_task }) => {
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
              parentId: task.parent_id,
              level: task.parent_id === 0 ? 0 : 1, // 仅用于渲染层级
              assignTo: project_task.assignee_id,
              status: project_task.status,
              dueDate: project_task.end_date
                ? new Date(project_task.end_date)
                : null,
              budget: project_task.budget,
              pay_due: project_task.amount_due,
              dependence: project_task.dependency,
              notes: project_task.notes,
              children: [],
            };
            taskMap.set(task.id, formattedTask);
          });

          taskMap.forEach((task) => {
            if (task.parentId === 0) {
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
          });

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

        const companyId = projectData?.project?.company_id;
        if (companyId) {
          console.log(`Fetching users for companyId: ${companyId}`);
          const usersData = await taskDetailAPI.getUser(companyId);
          if (usersData && Array.isArray(usersData)) {
            const contractorsData = usersData.map((user) => ({
              id: user.id,
              name: user.name,
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
        } else {
          console.error("No companyId available in project data");
          toast({
            title: "Data Error",
            description: "No company ID found in project data.",
            variant: "destructive",
          });
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
            : undefined);

        if (isEditing) {
          return (
            <Select
              value={task.assignTo || ""}
              onValueChange={(value) => {
                handleUpdateTask(task.id, { assignTo: value });
                setEditingCell({});
              }}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingCell({});
                }
              }}
            >
              <SelectTrigger className="w-full max-w-[180px]">
                <SelectValue placeholder="Select Contractor">
                  {task.assignTo
                    ? contractors.find((c) => c.id === task.assignTo)?.name
                    : "Select Contractor"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full max-w-[180px]">
                {contractors.map((contractor) => (
                  <SelectItem key={contractor.id} value={contractor.id}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer hover:text-[#227B94]"
              onClick={() => setEditingCell({ taskId: task.id, field })}
            >
              {assignee
                ? contractors.find((c) => c.id === assignee)?.name
                : "-"}
            </span>
            {assignee && (
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
                        name: contractor.name,
                        email: contractor.email,
                      },
                      taskName: task.name,
                    });
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
            defaultValue={task[field]?.toString()}
            onBlur={(e) => {
              const value = Number.parseFloat(
                e.target.value.replace(/[^0-9.-]+/g, "")
              );
              handleUpdateTask(task.id, { [field]: value });
              setEditingCell({});
            }}
            onChange={(e) => {
              e.target.value = formatAmount(e.target.value);
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
              {getAllTasks()
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
            {renderEditableCell(task, "dependence")}
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
      setTasks((prevTasks) => updateTaskLocally(prevTasks, taskId, updates));
      const apiUpdates = {
        assignee_id: updates.assignTo,
        status: updates.status,
        end_date:
          updates.dueDate instanceof Date
            ? updates.dueDate.toISOString().split("T")[0]
            : updates.dueDate,
        budget: updates.budget,
        amount_due: updates.pay_due,
        dependency: updates.dependence,
        notes: updates.notes,
      };
      await taskDetailAPI.updateTask(projectId, { taskId, ...apiUpdates });
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Local task update function
  const updateTaskLocally = (tasks, taskId, updates) =>
    tasks.map((task) => ({
      ...task,
      ...(task.id === taskId ? updates : {}),
      children: task.children
        ? updateTaskLocally(task.children, taskId, updates)
        : [],
    }));

  // API-integrated add task
  const handleAddTask = async (parentName, childrenNames, insertAfter) => {
    try {
      // 查找现有的 parent（顶级任务）
      let parentTask = tasks.find(
        (task) => task.name === parentName && task.parentId === 0
      );
      let parentTaskId;

      if (!parentTask) {
        // 如果 parent 不存在，创建一个新的顶级任务
        const newParent = {
          id: Date.now(), // 临时 ID，实际应由 API 返回
          name: parentName,
          parentId: 0,
          level: 0,
          assignTo: null,
          status: null,
          dueDate: null,
          budget: null,
          pay_due: null,
          dependence: null,
          notes: null,
          children: [],
        };
        setTasks((prevTasks) => [...prevTasks, newParent]);
        parentTask = newParent;
        parentTaskId = newParent.id;
      } else {
        parentTaskId = parentTask.id;
      }

      const subtasksData = childrenNames.map((name) => ({
        name,
        parentId: parentTaskId,
      }));

      const response = await taskDetailAPI.createSubtask(
        parentTaskId,
        subtasksData
      );

      if (response) {
        const formattedSubtasks = response.map(({ task, project_task }) => ({
          id: task.id,
          name: task.name,
          parentId: task.parent_id,
          level: 1,
          assignTo: project_task.assignee_id,
          status: project_task.status,
          dueDate: project_task.end_date
            ? new Date(project_task.end_date)
            : null,
          budget: project_task.budget,
          pay_due: project_task.amount_due,
          dependence: project_task.dependency,
          notes: project_task.notes,
          children: [],
        }));

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

        if (!expandedTasks.includes(parentTaskId.toString())) {
          setExpandedTasks((prev) => [...prev, parentTaskId.toString()]);
        }

        toast({ title: "Success", description: "Subtasks added successfully" });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add task",
        variant: "destructive",
      });
      return false;
    }
  };

  // API-integrated delete task
  const handleDeleteTask = async (taskId) => {
    try {
      setTasks((prevTasks) => removeTaskLocally(prevTasks, taskId));
      await taskDetailAPI.deleteTask(projectId, { taskId });
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
    getAllTasks().find((t) => t.id === taskId)?.name || "Unknown";

  // Add notes to a task
  const handleAddNotes = async (taskId, notes) => {
    try {
      await handleUpdateTask(taskId, { notes });
      setNotesInput((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to add notes:", error);
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
    <div className="mx-auto py-6 space-y-6 px-4">
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
                <TableHead className="border-r border-black/5 min-w-[150px] text-center">
                  Dependence
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
          });
        }}
        contractor={reminderDialog.contractor}
        taskName={reminderDialog.taskName || ""}
        projectName="Project XXX"
        onSend={() => {
          if (reminderDialog.contractor) {
            handleSendReminder(
              reminderDialog.contractor,
              reminderDialog.taskName
            );
          }
        }}
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
