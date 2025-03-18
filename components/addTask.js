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
 
export function AddTaskDialog({
  open,
  onOpenChange,
  onAddTask,
  categories,
  tasks,
}) {
  const [category, setCategory] = useState("");
  const [taskNames, setTaskNames] = useState([""]);
  const [insertAfter, setInsertAfter] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
 
  useEffect(() => {
    if (open) {
      setCategory("");
      setTaskNames([""]);
      setInsertAfter(null);
    }
  }, [open]);
 
  const handleSubmit = async () => {
    if (!category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a category",
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
    const success = await onAddTask(
      category,
      taskNames.filter((name) => name.trim()),
      insertAfter
    );
    setIsSubmitting(false);
 
    if (success) {
      toast({
        title: "Success",
        description: "Tasks added successfully",
      });
      onOpenChange(false);
    }
  };
 
  const addTaskNameField = () => {
    setTaskNames([...taskNames, ""]);
  };
 
  const updateTaskName = (index, value) => {
    const newTaskNames = [...taskNames];
    newTaskNames[index] = value;
    setTaskNames(newTaskNames);
  };
 
  const removeTaskNameField = (index) => {
    if (taskNames.length > 1) {
      const newTaskNames = taskNames.filter((_, i) => i !== index);
      setTaskNames(newTaskNames);
    }
  };
 
  const getInsertOptions = () => {
    const selectedCategory = tasks.find((task) => task.name === category);
    return selectedCategory
      ? [selectedCategory, ...(selectedCategory.children || [])]
      : [];
  };
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new tasks</DialogTitle>
          <DialogDescription>
            Create new tasks for an existing category in your project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 
          {category && (
            <div className="grid gap-2">
              <Label htmlFor="insertAfter">Insert After</Label>
              <Select value={insertAfter || ""} onValueChange={setInsertAfter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atTheEnd">At the end</SelectItem>
                  {getInsertOptions().map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
 
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
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      children: PropTypes.array,
      level: PropTypes.number.isRequired,
    })
  ).isRequired,
};