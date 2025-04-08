"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings, User, Lock, LogOut, Mail, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function UserNav() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem("username");
      const storedEmail = localStorage.getItem("email");
      setUsername(storedUsername || "");
      setEmail(storedEmail || "");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        document.cookie = "auth_token=; path=/; max-age=0;";
      }
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Handle opening the personal info dialog with separation from dropdown
  const openPersonalInfo = () => {
    setMenuOpen(false);
    setTimeout(() => {
      setDialogOpen(true);
    }, 100);
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/user-avatar.jpg" alt="User Avatar" />
              <AvatarFallback className="text-2xl"></AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={openPersonalInfo}
              onSelect={(e) => {
                // Prevent default selection behavior
                e.preventDefault();
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Personal Information</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Personal Information</DialogTitle>
            <DialogDescription>Your account details</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/user-avatar.jpg" alt="User Avatar" />
              <AvatarFallback className="text-2xl"></AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Username
              </h3>
              <p className="text-lg">{username || "Not available"}</p>
            </div>

            <div className="border-t border-border my-4"></div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email Address
                </h3>
              </div>
              <p className="text-lg">{email || "Not available"}</p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
