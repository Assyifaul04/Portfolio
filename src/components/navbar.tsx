"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { useTheme } from "next-themes";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Ensure theme is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ambil data user dari Supabase
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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm"
            : "bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center text-xl font-semibold text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span>@syn_taxx</span>
              </Link>

              {/* Desktop Menu */}
              <NavigationMenu className="hidden md:flex ml-4">
                <NavigationMenuList className="flex items-center gap-2">
                  {["about", "projects", "contact"].map((section) => (
                    <NavigationMenuItem key={section}>
                      <Button
                        asChild
                        variant="ghost"
                        className="h-8 px-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-md"
                      >
                        <Link href={`#${section}`}>
                          <span className="capitalize">{section}</span>
                        </Link>
                      </Button>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Menu (Hamburger) */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-64 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  >
                    <nav className="flex flex-col gap-1 mt-8">
                      {["about", "projects", "contact"].map((section) => (
                        <Link
                          key={section}
                          href={`#${section}`}
                          className="px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 capitalize"
                        >
                          {section}
                        </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Login Button atau Avatar with Dropdown */}
              {!userProfile ? (
                <Button
                  asChild
                  variant="default"
                  className="h-9 px-4 text-sm font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <Avatar className="h-8 w-8 ring-1 ring-slate-300 dark:ring-slate-700 group-hover:ring-slate-400 dark:group-hover:ring-slate-600 transition-all">
                        <AvatarImage
                          src={userProfile?.avatar_url || "/avatar-placeholder.png"}
                        />
                        <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium">
                          {userProfile?.name?.[0] || "ST"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                        {userProfile.name || "User"}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {userProfile.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {userProfile.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

                    {userProfile.role === "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard"
                            className="text-slate-700 dark:text-slate-200 text-sm cursor-pointer"
                          >
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/settings"
                            className="text-slate-700 dark:text-slate-200 text-sm cursor-pointer"
                          >
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                      </>
                    )}

                    {userProfile.role !== "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/riwayat"
                            className="text-slate-700 dark:text-slate-200 text-sm cursor-pointer"
                          >
                            Download History
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                      </>
                    )}

                    {/* Account Menu Item - Trigger Delete Dialog */}
                    <DropdownMenuItem
                      onSelect={() => setDeleteDialogOpen(true)}
                      className="text-slate-700 dark:text-slate-200 text-sm cursor-pointer"
                    >
                      Account
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

                    {/* Theme Toggle */}
                    {mounted && (
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setTheme(theme === "dark" ? "light" : "dark");
                        }}
                        className="text-slate-700 dark:text-slate-200 text-sm cursor-pointer flex items-center gap-2"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="h-4 w-4" />
                            <span>Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4" />
                            <span>Dark Mode</span>
                          </>
                        )}
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}