"use client"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

/*Functionality example: 

    -user inputs email then submits
    -gets a random verification code 
    -verify the verification code
    -once the code verifies takes user to reset password page 

*/

export default function ForgotPassword(){

    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-900">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-1 text-center">Forgot Password?</h1>
            <p className="text-sm text-center mb-5">There is nothing to worry about, we'll send you a verification code to help you reset your password.</p>
           
            <form className="space-y-4 text-center">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
    
                
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600 ">
                Send reset link
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