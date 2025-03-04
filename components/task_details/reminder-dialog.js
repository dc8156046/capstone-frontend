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

export default function ReminderDialog({
  open,
  onOpenChange,
  contractor,
  taskName,
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (contractor) {
      setSubject(`Reminder: Task "${taskName}" Update Required`);
      setMessage(
        `Dear ${contractor.name},

I hope this message finds you well.

I am writing to remind you about the task "${taskName}" that requires your attention. Please update the status or provide any necessary information.

Best regards,
Project Manager`
      );
    }
  }, [contractor, taskName]);

  const handleSend = async () => {
    // Here you would implement the email sending logic
    onOpenChange(false);
    toast({
      title: "Success",
      description: "Reminder email sent successfully",
    });
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
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
