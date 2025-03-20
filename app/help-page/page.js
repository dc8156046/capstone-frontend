"use client";

import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HelpPage() {
  const signUpSlide = [
    {
      id: 1,
      title: "Sign Up",
      image: "/screenshots/newUser.png"
    },
    {
      id: 2,
      title: "Email Verification",
      image: "/screenshots/activeEmail.png"
    },
    {
      id: 3,
      title: "Login",
      image: "/screenshots/login.png"
    }
  ];

  const [currentSignUpIndex, setCurrentSignUpIndex] = useState(0);

  const nextSlide = () => {
    setCurrentSignUpIndex((prevIndex) => prevIndex === signUpSlide.length - 1 ? 0 : prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentSignUpIndex((prevIndex) => prevIndex === 0 ? signUpSlide.length - 1 : prevIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentSignUpIndex(index);
  };

  const currentSlide = signUpSlide[currentSignUpIndex];

  const featureSlides = [
    {
      id: 1,
      title: "Dashboard",
      image: "/screenshots/dash.png"
    },
    {
      id: 2,
      title: "New Project",
      image: "/screenshots/newProj.png"
    },
    {
      id: 3,
      title: "Analytics",
      image: "/screenshots/analytics.png"
    }
  ];

  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const nextFeatureSlide = () => {
    setCurrentFeatureIndex((prevIndex) => prevIndex === featureSlides.length - 1 ? 0 : prevIndex + 1);
  };

  const prevFeatureSlide = () => {
    setCurrentFeatureIndex((prevIndex) => prevIndex === 0 ? featureSlides.length - 1 : prevIndex - 1);
  };

  const goToFeatureSlide = (index) => {
    setCurrentFeatureIndex(index);
  };

  const currentFeatureSlide = featureSlides[currentFeatureIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Card className="rounded-none border-b shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="flex-1 px-6 py-10 max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-gray-600 hover:text-cyan-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {/* Intro */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to BrickByClick</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Your go-to solution for managing construction projects with ease and efficiency. Follow the guide below to get started!
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Getting Started</h2>
        <p className="text-gray-600 text-base mb-6 max-w-3xl">
            Here's a quick guide to getting started with the app:
        </p>
        <ul className="list-disc ml-6 mt-8 space-y-2 text-gray-600 text-base text-left max-w-2xl">
            <li>Click on the "Sign Up" button to create an account using your email address.</li>
            <li>Once registered, you will receive a confirmation email. Verify your email to activate your account.</li>
            <li>Log in with your email and password to start managing your projects.</li>
          </ul>

        {/* Slide Deck */}
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-8 transition-all w-full mt-16">
          <div className="relative w-full h-96 mb-6">
            <Image
              src={currentSlide.image}
              alt={currentSlide.title}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-md"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between w-full max-w-sm mb-6">
            <button
              onClick={prevSlide}
              className="px-5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
            >
              Previous
            </button>
            <button
              onClick={nextSlide}
              className="px-5 py-2 bg-cyan-800 text-white rounded-md hover:bg-cyan-700 transition"
            >
              Next
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center items-center gap-3 mt-4">
            {signUpSlide.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-3 w-3 rounded-full transition-all
                  ${index === currentSignUpIndex
                    ? "bg-cyan-800 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-16 space-y-16">
          {/* Features Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features Overview</h2>
            <p className="text-gray-600 text-base mb-6 max-w-3xl">
              Here's an overview of the main features available within the app:
            </p>
            <ul className="list-disc ml-6 space-y-4 text-gray-600 text-base">
              <li><strong>Dashboard:</strong> Your central hub for tracking project progress.</li>
              <li><strong>Project:</strong> Create new projects, assign tasks, set deadlines, and monitor progress.</li>
              <li><strong>Analytics:</strong> View performance metrics, completion rates, and resource allocation.</li>
            </ul>

            {/* Slide Deck */}
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-8 transition-all w-full mt-16">
              <div className="relative w-full h-96 mb-6">
                <Image
                  src={currentFeatureSlide.image}
                  alt={currentFeatureSlide.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-md"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between w-full max-w-sm mb-6">
                <button
                  onClick={prevFeatureSlide}
                  className="px-5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
                >
                  Previous
                </button>
                <button
                  onClick={nextFeatureSlide}
                  className="px-5 py-2 bg-cyan-800 text-white rounded-md hover:bg-cyan-700 transition"
                >
                  Next
                </button>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center items-center gap-3 mt-4">
                {featureSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToFeatureSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-3 w-3 rounded-full transition-all
                      ${index === currentFeatureIndex
                        ? "bg-cyan-800 scale-110"
                        : "bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Management</h2>
            <p className="text-gray-600 text-base mb-6 max-w-3xl">
              Manage your account settings, profile, and password with ease:
            </p>
            <ul className="list-disc ml-6 space-y-4 text-gray-600 text-base">
              <li><strong>Updating Your Profile:</strong> Click your user icon → "Edit Profile".</li>
              <li><strong>Password Reset:</strong> Click "Forgot Password?" on the login page.</li>
            </ul>
          </section>

          {/* Troubleshooting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Troubleshooting</h2>
            <p className="text-gray-600 text-base mb-6 max-w-3xl">
              Common issues and solutions:
            </p>
            <ul className="list-disc ml-6 space-y-4 text-gray-600 text-base">
              <li><strong>Login Problems:</strong> Check email/password or use "Forgot Password?".</li>
              <li><strong>Data Not Saving:</strong> Ensure a stable internet connection and complete required fields.</li>
              <li><strong>Slow Performance:</strong> Clear your browser cache or switch browsers.</li>
            </ul>
            <p className="text-lg font-medium mt-6 mb-4">Error Messages</p>
            <ul className="list-disc ml-6 space-y-4 text-gray-600 text-base">
              <li><strong>Required Fields:</strong> All fields must be filled before submitting.</li>
              <li><strong>Invalid Input:</strong> Check formats for email addresses and dates.</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 text-base mb-4 max-w-3xl">
              If you encounter any issues or need further assistance, reach out to our support team:
            </p>
            <a
              href="mailto:BrickByClick@gmail.com"
              className="text-cyan-800 hover:underline text-base font-medium"
            >
              BrickByClick@gmail.com
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
