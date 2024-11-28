"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please enter your email and password");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/admin/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${email}&password=${password}`,
      });
      if (response.ok) {
        const data = await response.json();

        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("email", email);
          localStorage.setItem("username", data.username);
        }
        alert("Login successful");
        router.push("/dashboard");
      } else {
        if (response.status === 401) {
          alert("Invalid email or password");
        }
        if (response.status === 500) {
          alert("Internal server error");
        }
        if (response.status === 400) {
          alert("Bad request");
        }
        if (response.status === 403) {
          alert("Forbidden");
        }
        if (response.status === 404) {
          alert("Not found");
        }
        if (response.status === 422) {
          alert("Unprocessable entity");
        }
      }
    } catch (error) {
      console.error(error);
    }
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            Login to BrickbyClick System
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Please enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/90 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full py-2 font-medium"
              disabled={loading}
              type="submit"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
