"use client"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { userAPI } from "@/services";
import { useRouter } from "next/navigation";

export default function CreateAccount(){
    

      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPass, setConfirmPass] = useState("");
      const [companyName, setCompanyName] = useState("");
      const [loading, setLoading] = useState(false);

      const router = useRouter();

      const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (company === ""){
          alert("Please enter your company name")
          return;
        }

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
          const response = await userAPI.signUp(email, password, companyName);
          //console.log(response);
          
          alert("Sign-up successful");
          router.push("/");
        } catch (error) {
          console.error(error);
        }
        setCompanyName("");
        setEmail("");
        setPassword("");
        setConfirmPass("");
        setLoading(false);
      };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-900">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
            <form className="space-y-4" onSubmit={handleSignUp}>
              <div>
                <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                <Input 
                  id="company"
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>  
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
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
                  placeholder="Confirm your password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full bg-cyan-700 hover:bg-cyan-600" disabled={loading}  type="submit" >
                {loading ? "Registering..." : "Sign Up"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      );
}