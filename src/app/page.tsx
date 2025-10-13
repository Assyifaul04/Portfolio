"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProfileCard from "@/components/profile-card";
import About from "@/components/about";
import Contact from "@/components/contact";
import Projects from "@/components/projects";
import FilterCard, { FilterState as FilterCardState } from "@/components/filter-card";
import TableCard from "@/components/table-card";
import { toast } from "sonner";
import GithubContributions from "@/components/GithubContributions";

// Interface untuk project, disesuaikan dengan database
interface ProjectFile {
  id: string;
  name: string;
  uploadDate: string;
  description?: string;
  tags?: string[];
  downloadCount?: number;
  image_url?: string;
  file_url?: string;
  type?: string[];
  language?: string[];
}

type FilterState = FilterCardState;

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showDetailView, setShowDetailView] = useState(false);
  const [allProjects, setAllProjects] = useState<ProjectFile[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectFile[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "All",
    language: "All",
    sortBy: "Last updated",
  });

  // Check session
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

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Gagal mengambil data proyek");
        const projects = await res.json();
        
        const transformed: ProjectFile[] = projects.map((project: any) => ({
          id: project.id,
          name: project.title,
          uploadDate: project.created_at,
          description: project.description ?? "",
          tags: project.tags ?? [],
          downloadCount: project.download_count ?? 0,
          image_url: project.image_url,
          file_url: project.file_url,
          type: project.type ?? [],
          language: project.language ?? [],
        }));
        
        setAllProjects(transformed);
        setFilteredProjects(transformed);
      } catch (err: any) {
        toast.error("Error: " + err.message);
      }
    }
    
    if (showDetailView) {
      fetchProjects();
    }
  }, [showDetailView]);

  // Apply filters
  useEffect(() => {
    let result = [...allProjects];

    if (filters.search) {
      result = result.filter((project) =>
        project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type !== "All") {
      result = result.filter((project) => 
        project.type?.includes(filters.type)
      );
    }

    if (filters.language !== "All") {
      result = result.filter((project) =>
        project.language?.includes(filters.language)
      );
    }

    switch (filters.sortBy) {
      case "Last updated":
      case "Recently created":
        result.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case "Name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Stars":
        result.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
        break;
    }

    setFilteredProjects(result);
  }, [filters, allProjects]);

  const handleToggleView = () => {
    setShowDetailView(!showDetailView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

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

      {!showDetailView ? (
        // === TAMPILAN NORMAL (Landing Page) ===
        <>
          <section id="projects-section" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* ProfileCard - Sticky di desktop, normal di mobile */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-20">
                  <ProfileCard />
                </div>
              </div>
              
              <div className="lg:col-span-3 space-y-6">
                {/* Projects Section */}
                <Projects />
                
                {/* GitHub Contributions */}
                <GithubContributions />
                
                {/* Tombol Lihat Selengkapnya */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleToggleView}
                    size="lg"
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 gap-2 px-8"
                  >
                    Lihat Selengkapnya
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <About />
          </section>

          <section className="py-16">
            <Contact />
          </section>

          <Footer />
        </>
      ) : (
        // === TAMPILAN DETAIL (GitHub Repository Style) ===
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Profile Card - Sticky di desktop, normal di mobile */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-20">
                <ProfileCard />
              </div>
            </div>

            {/* Area Konten Utama */}
            <div className="lg:col-span-3 space-y-4">
              {/* Header dengan Back Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    Repositories
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {filteredProjects.length} repositories
                  </p>
                </div>
                <Button
                  onClick={handleToggleView}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 dark:border-slate-800 gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              </div>

              {/* GitHub Contributions di Detail View */}
              <GithubContributions />

              {/* Filter Card */}
              <div className="w-full">
                <FilterCard onFilterChange={handleFilterChange} />
              </div>

              {/* Table Card */}
              <div className="w-full">
                <TableCard projects={filteredProjects} />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}