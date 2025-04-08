"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    title: "Project",
    icon: FileText,
    href: "/dashboard/project",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState(
    new Set(["/dashboard/users", "/dashboard/project"])
  );

  const toggleMenu = (path) => {
    const newOpenMenus = new Set(openMenus);
    if (newOpenMenus.has(path)) {
      newOpenMenus.delete(path);
    } else {
      newOpenMenus.add(path);
    }
    setOpenMenus(newOpenMenus);
  };

  return (
    <nav className="space-y-2 py-4 ">
      <div className="px-3 py-2">
        <div className="space-y-1">
          <nav className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-md font-medium rounded-md",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-200",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}
