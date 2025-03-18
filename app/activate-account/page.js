"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userAPI } from "@/services";

export default function ActivateAccount() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Extract the token from the URL

    const handleActivation = async () => {
        try {
            const response = await userAPI.activateAccount(token); // Call the API
            console.log(response); // Log the response
            alert("Account activated successfully!"); // Show success message
            router.push("/"); // Redirect to the home page
        } catch (error) {
            console.error("Activation failed:", error); // Log the error
            alert("Activation failed. Please try again."); // Show error message
        }
    };

    // Call handleActivation when the component mounts or when the token changes
    useEffect(() => {
        if (token) {
            handleActivation();
        }
    }, [token]);

    return (
        <div>
            {token ? "Activating your account..." : "Invalid activation link."}
        </div>
    );
}