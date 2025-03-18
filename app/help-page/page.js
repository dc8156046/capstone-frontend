"use client";

import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { ArrowLeft } from "lucide-react";


export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardContent className="p-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </CardContent>
      </Card>
      
        {/* Main Content */}
        <div className="flex-1 p-6">
          <button 
            onClick={() => window.history.back()}
            className="mb-6 text-white">
              <ArrowLeft size={32} className="border rounded-full bg-cyan-800 hover:bg-cyan-700"/>
            </button>
          <h1 className="text-3xl font-bold mb-4">Welcome to BrickByClick</h1>
          <p className="text-xl mb-6">Your go to solution for managing construction projects with ease and efficiency. Follow the guide below to get started!</p>
          <div className="mt-10">
            <p className="font-semibold text-xl">1. Getting Started</p>
            <p className="mt-2 text-lg">To begin using BrickByClick, follow these simple steps:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Click on the "Sign Up" button to create an account using your email address.</li>
              <li>Once registered, you will recieve a confirmation email. Verify your email to activate your account.</li>
              <li>Log in with your email and password to start managing your projects.</li>
            </ul>
          </div>
          <div className="mt-10">
            <p className="font-semibold text-xl">2. Features Overview</p>
            <p className="mt-2 text-lg">Here's an overview of the main feautures available within the app:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>
                <strong>Dashboard:</strong> Your central hub for tracking project progress. Each project has a status indicator (blue dot) to show its progress. Click on any project for more detailed information.
                {/*add example image here */}
              </li>
              <li>
                <strong>Project:</strong> In this section, you can create new projects, assign tasks, set deadlines, and monitor the progress of each project. It’s your primary workspace for project management.
                {/*add example image here */}
              </li>
              <li>
                <strong>Analytics:</strong> Use this feature to view performance metrics for each of your projects, including completion rates, resource allocation, and overall timelines.
                {/*add example image here */}
              </li>
            </ul>
          </div>
            <div className="mt-10">
            <p className="font-semibold text-xl">3. Account Management</p>
            <p className="mt-2 text-lg">Manage your account settings, profile, and password with ease:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>
                <strong>Updating Your Profile:</strong> To edit your profile, click on your user icon in the top-right corner of the app. From the dropdown menu, select "Edit Profile" to update your information.
                {/*add example image here */}
              </li>
              <li>
                <strong>Password Reset:</strong> If you forget your password, simply click on the "Forgot Password?" link on the login page. Follow the instructions to reset your password via email.
              </li>
            </ul>
          </div>
          <div className="mt-10">
            <p className="font-semibold text-xl">3. Troubleshooting</p>
            <p className="mt-2 text-lg"> Here are some common issues and solutions:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>
                <strong>Login Problems:</strong> If you're having trouble logging in, ensure your email and password are correct. If you're still locked out, use the "Forgot Password?" option to reset your password.
              </li>
              <li>
                <strong>Data Not Saving:</strong> If your changes aren’t saving, check that your internet connection is stable. Also, ensure all required fields are filled before submitting.
              </li>
              <li>
                <strong>Slow Performance:</strong> Clear your browser cache or switch to another browser to see if that resolves the issue.
              </li>
            </ul>
            <p className="font-medium mt-4 mb-4 text-xl">Error Messages:</p>
            <ul className="list-disc ml-6">
              <li>
                <strong>Required Fields:</strong> Some areas of the app cannot be left blank. Ensure all required fields are filled before submitting.
              </li>
              <li>
                <strong>Invalid Input:</strong> If you receive an error about invalid input, double-check the format of your entries (e.g., email addresses, dates).
              </li>
            </ul>
          </div>
          <div className="mt-10">
            <p className="font-semibold text-xl">5. Contact Us</p>
            <p className="mt-2 text-lg">If you encouter any issues or need further assistance, feel free to reach out to our support team:</p>
            <p>
              Support Email:{" "}
              <a href="mailto:BrickByClick@gmail.com" className="text-blue-500 underline">
                BrickByClick@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
  );
}