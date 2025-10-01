"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  role?: "user" | "admin";
}

export default function Navbar() {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ambil data user dari Supabase table 'users' berdasarkan email NextAuth
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

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
    setUserProfile(null);
    router.push("/auth/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-50/95 dark:bg-slate-950/95 shadow-lg backdrop-blur-md"
          : "bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm"
      }`}
    >
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center space-x-2 text-2xl font-bold text-slate-900 dark:text-slate-100"
            >
              Syn_Taxx
            </Link>

            {/* Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex space-x-1">
                {["about", "projects", "contact"].map((section) => (
                  <NavigationMenuItem key={section}>
                    <Button
                      asChild
                      variant="ghost"
                      className="relative overflow-hidden group hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 text-slate-700 dark:text-slate-300"
                    >
                      <Link href={`#${section}`} className="relative z-10">
                        <span className="capitalize">{section}</span>
                      </Link>
                    </Button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Avatar with Username */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-4 px-3 py-2 h-auto rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {userProfile?.name || "Guest"}
                    </span>
                    <Avatar className="h-9 w-9 ring-2 ring-slate-300 dark:ring-slate-700 transition-all duration-300">
                      <AvatarImage
                        src={userProfile?.avatar_url || "/avatar-placeholder.png"}
                      />
                      <AvatarFallback className="bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                        {userProfile?.name?.[0] || "ST"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl"
              >
                {!userProfile ? (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="text-slate-700 dark:text-slate-300">
                      Login
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <div className="px-2 py-2 mb-1 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {userProfile.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {userProfile.email}
                      </p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="text-slate-700 dark:text-slate-300">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout} className="text-red-600 dark:text-red-400">
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}