"use client";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { userAPI } from "@/services";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      //console.log(email);
      const response = await userAPI.forgotPassword(email);
      console.log(response);
      router.push(`/verify-code?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(error);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }

    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1 text-center">Forgot Password?</h1>
        <p className="text-sm text-center mb-5">
          There is nothing to worry about, we'll send you a verification code to help you reset your password.
        </p>

        <form className="space-y-4 text-center" onSubmit={handleResetPassword}>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-cyan-700 hover:bg-cyan-600"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
          <div>
            <Link href="/" className="hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}