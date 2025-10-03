"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProfileCard from "@/components/profile-card";
import About from "@/components/about";
import Contact from "@/components/contact";
import Projects from "@/components/projects";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  // --- LOGIKA TIDAK DIUBAH ---
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (error) throw error;
        if (profile?.role === "admin") {
          router.push("/dashboard");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pt-16">
      <Navbar />
  
      {/* Profile + Projects */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>
          <div className="lg:col-span-3">
            <Projects />
          </div>
        </div>
      </section>
  
      {/* About */}
      <section className="py-16">
        <About />
      </section>
  
      {/* Contact */}
      <section className="py-16">
        <Contact />
      </section>
  
      {/* Footer */}
      <Footer />
    </main>
  );
  
}