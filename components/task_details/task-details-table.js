"use client";

import React, { useState } from "react";
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
import { TableHeader } from "@/components/ui/table";

const contractors = [
  { id: "1", name: "Ali Daniel", email: "ali@example.com" },
  { id: "2", name: "Lena Page", email: "lena@example.com" },
];

const statusOptions = [
  { value: "in_progress", label: "In Progress", color: "#78B7D0" },
  { value: "pending", label: "Pending", color: "#979797" },
  { value: "delayed", label: "Delayed", color: "#F70E0E" },
  { value: "completed", label: "Completed", color: "#59BD50" },
];

const initialTasks = [
  {
    id: "1",
    name: "Foundation",
    assignTo: "1",
    status: "pending",
    dueDate: new Date("2024-12-25"),
    budget: 20000,
    pay_due: 5000,
    level: 0,
    children: [
      {
        id: "1-1",
        name: "Pin Footing",
        dueDate: new Date("2024-12-20"),
        level: 1,
        dependence: "1",
      },
      {
        id: "1-2",
        name: "Wall Pours",
        dueDate: new Date("2024-12-18"),
        level: 1,
        dependence: "1-1",
      },
      {
        id: "1-3",
        name: "Strip Forms",
        dueDate: new Date("2024-12-17"),
        level: 1,
        dependence: "1-2",
      },
    ],
  },
  {
    id: "2",
    name: "Framing",
    assignTo: "2",
    status: "pending",
    dueDate: new Date("2025-01-02"),
    budget: 15000,
    pay_due: 0,
    level: 0,
    dependence: "1",
    children: [
      {
        id: "2-1",
        name: "Basement Framing",
        dueDate: new Date("2025-12-26"),
        level: 1,
        dependence: "2",
      },
      {
        id: "2-2",
        name: "Main Floor Wall",
        dueDate: new Date("2025-12-27"),
        level: 1,
        dependence: "2-1",
      },
      {
        id: "2-3",
        name: "Garage Wall",
        dueDate: new Date("2025-12-29"),
        level: 1,
        dependence: "2-2",
      },
      {
        id: "2-4",
        name: "Truss Delivery",
        dueDate: new Date("2025-12-31"),
        level: 1,
        dependence: "2-3",
      },
    ],
  },
];

export function TaskDetailsTable() {
  const [tasks, setTasks] = useState(initialTasks);
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
  //const [addColumnDialog, setAddColumnDialog] = useState(false);
  //const [newColumnName, setNewColumnName] = useState("");
  const { toast } = useToast();
  const [notesInput, setNotesInput] = useState({});

  const formatAmount = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);

  const renderEditableCell = (task, field) => {
    const isEditing =
      editingCell.taskId === task.id && editingCell.field === field;

    // assign to contractor
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
                setTasks((prevTasks) =>
                  updateTask(prevTasks, task.id, { assignTo: value })
                );
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
              setTasks((prevTasks) =>
                updateTask(prevTasks, task.id, { status: value })
              );
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
                    setTasks((prevTasks) =>
                      updateTask(prevTasks, task.id, { dueDate: date })
                    );
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
              setTasks((prevTasks) =>
                updateTask(prevTasks, task.id, { [field]: value })
              );
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
              setTasks((prevTasks) =>
                updateTask(prevTasks, task.id, { dependence: value })
              );
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
                setTasks((prevTasks) =>
                  updateTask(prevTasks, task.id, { [field]: e.target.value })
                );
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
    const isExpanded = expandedTasks.includes(task.id);
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
              key={column} // Ensure this key is unique as well
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

  //add task
  const handleAddTask = async (category, taskNames, insertAfter) => {
    if (category === "new") {
      const newCategory = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: taskNames[0],
        level: 0,
        children: taskNames.slice(1).map((name) => ({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          level: 1,
        })),
      };

      setTasks((prevTasks) => {
        const insertIndex = insertAfter
          ? prevTasks.findIndex((task) => task.id === insertAfter) + 1
          : prevTasks.length;
        return [
          ...prevTasks.slice(0, insertIndex),
          newCategory,
          ...prevTasks.slice(insertIndex),
        ];
      });
    } else {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.name === category) {
            const children = task.children || [];
            const insertIndex = insertAfter
              ? children.findIndex((child) => child.id === insertAfter) + 1
              : children.length;
            return {
              ...task,
              children: [
                ...children.slice(0, insertIndex),
                ...taskNames.map((name) => ({
                  id: `${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                  name,
                  level: 1,
                })),
                ...children.slice(insertIndex),
              ],
            };
          }
          return task;
        });
      });
    }
    const success = true; // Assuming task addition is always successful for now. Could be improved with error handling.
    if (success) {
      toast({
        title: "Success",
        description: "Task added successfully",
        duration: 3000,
      });
      setAddTaskDialog(false); // Close the dialog after successful addition
    }
    return success;
  };

  //update task
  const updateTask = (tasks, taskId, updates) =>
    tasks.map((task) => ({
      ...task,
      ...(task.id === taskId ? updates : {}),
      children: task.children ? updateTask(task.children, taskId, updates) : [],
    }));

  //get all tasks
  const getAllTasks = () => {
    const flattenTasks = (tasks) => {
      return tasks.reduce((acc, task) => {
        acc.push(task);
        if (task.children) {
          acc.push(...flattenTasks(task.children));
        }
        return acc;
      }, []);
    };
    return flattenTasks(tasks);
  };

  //get task name by id
  const getTaskNameById = (taskId) =>
    getAllTasks().reduce(
      (acc, t) => (t.id === taskId ? t.name : acc),
      "Unknown"
    );

  // const handleAddColumn = () => {
  //   if (newColumnName && !customColumns.includes(newColumnName)) {
  //     setCustomColumns([...customColumns, newColumnName]);
  //     setNewColumnName("");
  //     setAddColumnDialog(false);
  //   }
  // };

  //remove task
  const removeTask = (tasks, taskId) => {
    return tasks.reduce((acc, task) => {
      if (task.id === taskId) {
        return acc;
      }
      if (task.children) {
        const newChildren = removeTask(task.children, taskId);
        if (newChildren.length !== task.children.length) {
          return [...acc, { ...task, children: newChildren }];
        }
      }
      return [...acc, task];
    }, []);
  };

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
                {/* {customColumns.map((column, index) => (
                  <TableHead
                    key={column}
                    className={cn(
                      "border-r border-black/5 w-20",
                      index === customColumns.length - 1 && "border-r-0"
                    )}
                  >
                    {column}
                  </TableHead>
                ))} */}
                <TableHead className="border-r border-black/5 min-w-[100px]">
                  Delete
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddColumnDialog(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button> */}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task, index) => (
                <React.Fragment key={index}>{renderTask(task)}</React.Fragment>
              ))}
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
          toast({
            title: "Success",
            description: "Reminder sent successfully",
          });
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
            setTasks((prevTasks) => removeTask(prevTasks, deleteDialog.taskId));
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
        categories={tasks.map((task) => task.name)}
        tasks={tasks}
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
                onClick={() => {
                  setTasks((prevTasks) =>
                    updateTask(prevTasks, taskId, { notes: value })
                  );
                  setNotesInput((prev) => ({ ...prev, [taskId]: undefined }));
                }}
              >
                {" "}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}

      {/* <Dialog open={addColumnDialog} onOpenChange={setAddColumnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
            <DialogDescription>
              Enter a name for the new column you want to add to the task table.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Column Name
              </Label>
              <Input
                id="name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddColumn}
              className="bg-[#227B94] hover:bg-[#227B94]/90 text-white"
            >
              Add Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}

export default TaskDetailsTable;
