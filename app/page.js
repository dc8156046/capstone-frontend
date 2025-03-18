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
import { userAPI } from "@/services";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await userAPI.login(email, password);
      //console.log(response);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("email", email);
      }
      alert("Login successful");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden md:flex flex-2 bg-cover bg-center h-full">
        <img src="/loginBackground.jpg" alt="BackgroundImg" />
      </div>
      <div className="flex-1 flex items-center justify-center bg-cyan-900 px-6 h-full">
        <Card className="w-full max-w-md bg-white text-black">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">
              Login to BrickByClick
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                className="w-full py-2 font-medium bg-cyan-700 hover:bg-cyan-600 text-white"
                disabled={loading}
                type="submit"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
