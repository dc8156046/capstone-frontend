"use client"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import Link from "next/link";
import { userAPI } from "@/services";


export default function VerifyCode(){

   /* const [opt, setOtp] = useState(new Array(numberOfDigits).fill)
    const otpInputIndex = useRef([]);

    const handleShortCuts = async (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0){
            otpInputIndex.current[index - 1].focus()
        }
        if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1){
            otpInputIndex.current[index + 1].focus()
        }
    }

    */



    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-900">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-1 text-center">Check your email</h1>
            <p className="text-sm text-center">We sent a reset link to {/*email */}</p>
            <p className="text-sm text-center mb-5">enter the 5 digit code mentioned in the email.</p>
           
            <form className="space-y-4 text-center">
              <div className="flex justify-center gap-2.5">
                <input 
                type="text"
                maxLength="1"
                className="w-16 h-16 font-semibold outline-none text-xl text-gray-700 text-center border rounded-md transition-all bg-gray-100 border-gray-300 focus:border-blue-500">
            
                </input>
                <input 
                type="text"
                maxLength="1"
                className="w-16 h-16 font-semibold outline-none text-xl text-gray-700 text-center border rounded-md transition-all bg-gray-100 border-gray-300 focus:border-blue-500">
                </input>
                <input 
                type="text"
                maxLength="1"
                className="w-16 h-16 font-semibold outline-none text-xl text-gray-700 text-center border rounded-md transition-all bg-gray-100 border-gray-300 focus:border-blue-500">
                </input>
                <input 
                type="text"
                maxLength="1"
                className="w-16 h-16 font-semibold outline-none text-xl text-gray-700 text-center border rounded-md transition-all bg-gray-100 border-gray-300 focus:border-blue-500">
                </input>
                <input 
                type="text"
                maxLength="1"
                className="w-16 h-16 font-semibold outline-none text-xl text-gray-700 text-center border rounded-md transition-all bg-gray-100 border-gray-300 focus:border-blue-500">
                </input>
              </div>
              <Button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600 ">
                Verify
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              Haven't got the email yet?{" "}
              <button className="text-blue-500 hover:underline">
                Resend email
              </button>
            </p>
          </div>
        </div>
      );

    
}