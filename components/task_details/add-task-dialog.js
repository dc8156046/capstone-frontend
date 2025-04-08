"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";
import { taskDetailAPI } from "@/services/taskDetail";

export function AddTaskDialog({ open, onOpenChange, onAddTask, projectId }) {
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [taskNames, setTaskNames] = useState([""]);
  const [insertAfter, setInsertAfter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtasks, setSubtasks] = useState([]); // insert after subtasks
  const [parentOptions, setParentOptions] = useState([]);
  const [hasLoadedParents, setHasLoadedParents] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setSelectedParent("");
      setSelectedParentId(null);
      setTaskNames([""]);
      setInsertAfter("");
      setSubtasks([]);
      setHasLoadedParents(false);
    }
  }, [open]);

  // 加载父任务选项
  useEffect(() => {
    if (!open || hasLoadedParents) return;

    const loadParentOptions = async () => {
      try {
        const response = await taskDetailAPI.getCategory();
        const parentData = Array.isArray(response)
          ? response.map((cat) => ({ id: cat.id, name: cat.name })) // 假设 API 返回 { id, name }
          : [];
        console.log("Loaded parent options:", parentData);
        setParentOptions(parentData);
        setHasLoadedParents(true);
      } catch (error) {
        console.error("Failed to load parent options:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load parent options",
        });
      }
    };

    loadParentOptions();
  }, [open, hasLoadedParents, toast]);

  useEffect(() => {
    if (!selectedParentId) {
      console.log("Skipping loadSubtasks: parentId missing", {
        selectedParentId,
      });
      setSubtasks([]);
      return;
    }

    let isMounted = true;

    const loadSubtasks = async () => {
      try {
        console.log("Fetching subtasks for taskId:", selectedParentId);
        const response = await taskDetailAPI.getSubtask(selectedParentId);
        console.log("Subtasks response:", response);

        const subtasksData = Array.isArray(response)
          ? response.map((task) => ({
              id: task.id,
              name: task.name,
              parentId: task.parent_id,
              sort_order: task.sort_order,
            }))
          : [];

        console.log("Formatted subtasks:", subtasksData);

        if (isMounted) {
          setSubtasks(subtasksData);
          if (subtasksData.length === 0) {
            console.warn("No subtasks found for this parent");
          }
        }
      } catch (error) {
        console.error("Failed to load subtasks:", error);
        if (isMounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load subtasks for this parent",
          });
          setSubtasks([]);
        }
      }
    };

    loadSubtasks();

    return () => {
      isMounted = false;
    };
  }, [selectedParentId, toast]);

  // 处理表单提交
  const handleSubmit = async () => {
    if (!selectedParent) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a parent task",
      });
      return;
    }

    if (taskNames.some((name) => !name.trim())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all task names",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onAddTask(
        selectedParent,
        taskNames.filter((name) => name.trim()),
        insertAfter === "atTheEnd" ? null : insertAfter
      );
      if (success) {
        toast({ title: "Success", description: "Tasks added successfully" });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add tasks",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTaskNameField = () => setTaskNames([...taskNames, ""]);
  const updateTaskName = (index, value) => {
    const newTaskNames = [...taskNames];
    newTaskNames[index] = value;
    setTaskNames(newTaskNames);
  };
  const removeTaskNameField = (index) => {
    if (taskNames.length > 1)
      setTaskNames(taskNames.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (selectedParent) {
      const parent = parentOptions.find((p) => p.name === selectedParent);
      setSelectedParentId(parent ? parent.id : null);
    } else {
      setSelectedParentId(null);
    }
  }, [selectedParent, parentOptions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new tasks</DialogTitle>
          <DialogDescription>
            Create new tasks for an existing parent in your project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="parent">Parent Task</Label>
            <Select value={selectedParent} onValueChange={setSelectedParent}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent task" />
              </SelectTrigger>
              <SelectContent>
                {parentOptions.length > 0 ? (
                  parentOptions.map((parent) => (
                    <SelectItem key={parent.id} value={parent.name}>
                      {parent.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="noParents" disabled>
                    No parent tasks available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="insertAfter">Insert After</Label>
            <Select value={insertAfter} onValueChange={setInsertAfter}>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {subtasks.length > 0 ? (
                  subtasks.map((subtask) => (
                    <SelectItem key={subtask.id} value={subtask.id.toString()}>
                      {subtask.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="noSubtasks" disabled>
                    No subtasks available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {taskNames.map((taskName, index) => (
            <div key={index} className="grid gap-2">
              <Label htmlFor={`taskName${index}`}>Task Name {index + 1}</Label>
              <div className="flex gap-2">
                <Input
                  id={`taskName${index}`}
                  value={taskName}
                  onChange={(e) => updateTaskName(index, e.target.value)}
                  placeholder="Enter task name"
                />
                {index === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addTaskNameField}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTaskNameField(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#227B94] hover:bg-[#227B94]/90 text-white"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

AddTaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default AddTaskDialog;
