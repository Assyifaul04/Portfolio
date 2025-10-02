// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Folder,
  BarChart3,
  Users,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  UserCog,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// === MAIN NAVIGATION (sesuai DB) ===
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: Folder,
  },
  {
    name: "Followers",
    href: "/dashboard/followers",
    icon: BarChart3,
  },
  {
    name: "Downloads",
    href: "/dashboard/downloads",
    icon: Download,
  },
];

// === SUB NAVIGATION khusus downloads ===
const downloadsNav = [
  {
    name: "Pending",
    href: "/dashboard/downloads/pending",
    icon: Clock,
  },
  {
    name: "Approved",
    href: "/dashboard/downloads/approved",
    icon: CheckCircle,
  },
  {
    name: "Rejected",
    href: "/dashboard/downloads/rejected",
    icon: XCircle,
  },
];

// === SETTINGS & SUPPORT ===
const settings = [
  {
    name: "User Roles",
    href: "/dashboard/users/roles",
    icon: UserCog,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderNav = (items: typeof navigation) =>
    items.map((item) => {
      const isActive = pathname === item.href;
      return (
        <Button
          key={item.name}
          asChild
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            isActive
              ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Link href={item.href}>
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </Link>
        </Button>
      );
    });

  return (
    <div className="flex h-full w-64 flex-col bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center">
            <span className="text-slate-100 dark:text-slate-900 font-bold text-sm">
              ST
            </span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Syn_Taxx
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {/* Overview */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Main
            </h3>
            <nav className="space-y-1">{renderNav(navigation)}</nav>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Downloads Submenu */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Downloads
            </h3>
            <nav className="space-y-1">{renderNav(downloadsNav)}</nav>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Settings */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Admin
            </h3>
            <nav className="space-y-1">{renderNav(settings)}</nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
