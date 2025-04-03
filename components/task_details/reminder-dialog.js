"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { taskDetailAPI } from "@/services/taskDetail";

export default function ReminderDialog({
  open,
  onOpenChange,
  contractor,
  taskName,
  projectId,
  onSend,
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    start_date: "",
    address: "",
    company: "",
  });
  const { toast } = useToast();

  // 获取项目详情
  useEffect(() => {
    if (open && projectId) {
      const fetchProjectDetails = async () => {
        try {
          const details = await taskDetailAPI.getProjectDetail(projectId);
          setProjectDetails({
            name: details.name || "",
            start_date: details.start_date
              ? new Date(details.start_date).toLocaleDateString()
              : "",
            address: details.address || "",
            company: details.company || "",
          });
        } catch (error) {
          console.error("Error fetching project details:", error);
          toast({
            title: "Error",
            description: "Could not fetch project details",
            variant: "destructive",
          });
        }
      };

      fetchProjectDetails();
    }
  }, [open, projectId, toast]);

  useEffect(() => {
    if (contractor && projectDetails.name) {
      setSubject(
        `Notification of Upcoming Work on "${projectDetails.name}" Project`
      );
      setMessage(
        `Dear ${contractor.name},

I hope this message finds you well.
I am writing to inform you that work on "${
          projectDetails.name
        }" is scheduled to commence soon. ${
          taskName ? `Your task "${taskName}" ` : "The task "
        }requires your attention.
${
  projectDetails.start_date
    ? `The start date is set for "${projectDetails.start_date}"`
    : ""
}${
          projectDetails.address
            ? `, and the location for the project will be at "${projectDetails.address}"`
            : ""
        }.
If you have any questions or need further clarification, feel free to reach out. We look forward to a successful collaboration.

Best regards,
${projectDetails.company}`
      );
    }
  }, [contractor, taskName, projectDetails]);

  const handleSend = async () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Subject and message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // 准备邮件内容
      const emailContent = {
        title: subject,
        content: message,
        userId: contractor.id,
        email: contractor.email,
        taskName: taskName,
        projectName: projectDetails.name,
      };

      // 调用API发送邮件
      await taskDetailAPI.sendEmail(projectId, emailContent);

      // 关闭对话框并通知父组件
      onOpenChange(false);
      if (onSend) onSend(true);

      toast({
        title: "Success",
        description: "Reminder email sent successfully",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder email",
        variant: "destructive",
      });
      if (onSend) onSend(false);
    } finally {
      setIsSending(false);
    }
  };

  if (!contractor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#227B94]">
            <Mail className="h-5 w-5" />
            Send A Reminder
          </DialogTitle>
          <DialogDescription>
            Send a reminder email to the assigned contractor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#227B94]"
            >
              Email To:
            </label>
            <Input
              id="email"
              value={contractor.email}
              readOnly
              className="bg-[#EEF2F5]"
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-[#227B94]"
            >
              Subject:
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-[#227B94]"
            >
              Message:
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="bg-[#227B94] hover:bg-[#227B94]/90"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
