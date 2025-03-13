"use client"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import Link from "next/link";
import { userAPI } from "@/services";

export default function ResetPassword(){

    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    
    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-900">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-1 text-center">Reset Password</h1>
            <p className="text-sm text-center">Create a new password</p>
            <p className="text-sm text-center mb-5">Ensure it differs from previous ones for security</p>
           
            <form className="space-y-4 text-center">
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}               
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600 ">
                Update password
              </Button>
            </form>
          </div>
        </div>
      );
}