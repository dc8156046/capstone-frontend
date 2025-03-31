"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userAPI } from "@/services";

export default function ActivateAccount() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleActivation = async () => {
        try {
            const response = await userAPI.activateAccount(token); // Call the API
            //console.log(response); 
            alert("Account activated successfully!");
            router.push("/"); 
        } catch (error) {
            console.error("Activation failed:", error); 
            alert("Activation failed. Please try again."); 
        }
    };

    useEffect(() => {
        if (token) {
            handleActivation();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cyan-800 text-white text-xl">
            {token ? "Activating your account..." : "Invalid activation link."}
        </div>
    );
}