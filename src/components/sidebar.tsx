"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  FolderGit2,
  Mail,
  Settings,
  LayoutDashboard,
  History,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  role?: "user" | "admin";
}

export default function Sidebar() {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
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

  const publicLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "#about", label: "About", icon: User },
    { href: "#projects", label: "Projects", icon: FolderGit2 },
    { href: "#contact", label: "Contact", icon: Mail },
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const userLinks = [
    { href: "/riwayat", label: "Download History", icon: History },
  ];

  const renderLinks = (links: typeof publicLinks) => (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
        
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                : "text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Navigation
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {renderLinks(publicLinks)}
        
        {userProfile && (
          <>
            <div className="my-4 border-t border-slate-200 dark:border-slate-800" />
            {userProfile.role === "admin" ? (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Admin
                </div>
                {renderLinks(adminLinks)}
              </>
            ) : (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </div>
                {renderLinks(userLinks)}
              </>
            )}
          </>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 bottom-4 z-40 h-12 w-12 rounded-full shadow-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 border-slate-200 dark:border-slate-800">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}