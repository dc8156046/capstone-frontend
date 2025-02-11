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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
    submenu: [
      {
        title: "User List",
        href: "/dashboard/users",
      },
      {
        title: "Permissions",
        href: "/dashboard/users/permissions",
      },
    ],
  },
  {
    title: "Project",
    icon: FileText,
    submenu: [
      {
        title: "Project List",
        href: "/dashboard/project",
      },
    ],
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
            {sidebarNavItems.map((item) =>
              item.submenu ? (
                <Collapsible
                  key={item.title}
                  open={openMenus.has(item.href)}
                  onOpenChange={() => toggleMenu(item.href)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-md font-medium rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      "transition-colors duration-200",
                      pathname.startsWith("/dashboard/users") ||
                        pathname.startsWith("/dashboard/project")
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {item.title}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center py-2 px-4 text-md rounded-md",
                          "hover:bg-accent hover:text-accent-foreground",
                          "transition-colors duration-200",
                          pathname === subItem.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
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
              )
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
