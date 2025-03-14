"use client";
import { Button } from "@/components/ui/button";
import { userAPI } from "@/services";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyCode({ email }) {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", ""]); 

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = otp.join(""); 

    try {
      const response = await userAPI.verifyCode(email, code);
      console.log(response);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1 text-center">Check your email</h1>
        <p className="text-sm text-center">We sent a reset link to {email}</p>
        <p className="text-sm text-center mb-5">Enter the 5-digit code mentioned in the email.</p>

        <form className="space-y-4 text-center" onSubmit={handleVerifyCode}>
          <div className="flex justify-center gap-2.5">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-16 h-16 font-semibold outline-none text-xl text-gray-700 text-center border rounded-md transition-all bg-gray-100 border-gray-300 focus:border-blue-500"
              />
            ))}
          </div>
          <Button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600">
            Verify
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Haven't got the email yet?{" "}
          <button className="text-blue-500 hover:underline">Resend email</button>
        </p>
      </div>
    </div>
  );
}