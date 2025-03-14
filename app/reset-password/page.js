"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { userAPI } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function ResetPassword({ email }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await userAPI.resetPassword(email, password);
      console.log(response);
      router.push("/"); // Redirect to login page after successful reset
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1 text-center">Reset Password</h1>
        <p className="text-sm text-center">Create a new password</p>
        <p className="text-sm text-center mb-5">Ensure it differs from previous ones for security</p>

        <form className="space-y-4 text-center" onSubmit={handleResetPassword}>
          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
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
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}