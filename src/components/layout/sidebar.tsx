// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Folder,
  BarChart3,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  UserCog,
  Settings,
  HelpCircle,
  Menu,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  role?: "user" | "admin";
}

// === MAIN NAVIGATION ===
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
    href: "/dashboard/follows",
    icon: BarChart3,
  },
  {
    name: "Downloads",
    href: "/dashboard/downloads",
    icon: Download,
  },
];

// === SUB NAVIGATION downloads ===
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
    href: "/dashboard/users",
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

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setMounted(true);

    const fetchUserProfile = async () => {
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (error) {
        console.error("Gagal fetch user:", error);
        return;
      }

      setUserProfile(data);
    };

    fetchUserProfile();
  }, [session]);

  const userName = userProfile?.name ?? session?.user?.name ?? "Admin";
  const userEmail = userProfile?.email ?? session?.user?.email ?? "admin@email.com";

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
          onClick={onClose}
        >
          <Link href={item.href}>
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </Link>
        </Button>
      );
    });

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2" onClick={onClose}>
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
          {/* Main Navigation */}
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

      {/* User Profile Section - Bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-9 w-9 ring-2 ring-slate-300 dark:ring-slate-700">
                  <AvatarImage src={userProfile?.avatar_url || "/avatar-placeholder.png"} />
                  <AvatarFallback className="bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                    {userProfile?.name?.[0] || "ST"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            align="end"
            side="top"
          >
            <DropdownMenuLabel className="text-slate-900 dark:text-slate-100">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />

            {/* Theme Toggle */}
            {mounted && (
              <DropdownMenuItem
                className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </DropdownMenuItem>
            )}

            {/* Notifications */}
            <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </div>
                <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500 border-0">
                  3
                </Badge>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />

            {userProfile?.role === "admin" && (
              <Link href="/dashboard" onClick={onClose}>
                <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
            )}

            <Link href="/" onClick={onClose}>
              <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>

            <Link href="/settings" onClick={onClose}>
              <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 border-slate-200 dark:border-slate-800">
            <SidebarContent onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 flex-col border-r border-slate-200 dark:border-slate-800">
        <SidebarContent />
      </div>
    </>
  );
}