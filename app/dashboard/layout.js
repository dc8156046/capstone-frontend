"use client";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { Sidebar } from "@/components/sidebar";
import Logo from "@/components/logo";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { CircleHelp } from "lucide-react";
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <Link href="/dashboard" className="mr-4 hidden md:flex">
            <Logo />
          </Link>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/dashboard/help-page">
            <button>
              <CircleHelp />
            </button>
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-shrink-0 border-r bg-background">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1">
          <div className="container mx-auto py-6 px-4">{children}</div>
        </main>
      </div>

      {/* Footer - 放在主flex容器之外 */}
      <Footer />
    </div>
  );
}
