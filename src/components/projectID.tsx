"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar, 
  Download, 
  Instagram,
  Play,
  Music,
  CheckCircle2,
  Clock,
  HardDrive,
  Star,
  GitFork,
  ArrowLeft,
  Eye,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProjectDetail {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  description?: string;
  tags?: string[];
  downloadCount?: number;
  image_url?: string;
  file_url?: string;
}

const languageColor = (lang?: string): string => {
  const normalized = lang?.toLowerCase().trim();
  const colors: Record<string, string> = {
    "next.js": "bg-slate-500",
    "nextjs": "bg-slate-500",
    "golang": "bg-cyan-400",
    "go": "bg-cyan-400",
    "typescript": "bg-blue-500",
    "ts": "bg-blue-500",
    "javascript": "bg-yellow-400",
    "js": "bg-yellow-400",
    "java": "bg-orange-500",
    "dart": "bg-teal-500",
    "blade": "bg-red-500",
    "html": "bg-orange-600",
    "css": "bg-blue-400",
    "python": "bg-blue-600",
    "py": "bg-blue-600",
    "php": "bg-indigo-500",
    "ruby": "bg-red-600",
    "rust": "bg-orange-700",
    "c++": "bg-pink-500",
    "cpp": "bg-pink-500",
    "c#": "bg-purple-600",
    "csharp": "bg-purple-600",
  };
  return colors[normalized || ""] || "bg-gray-500";
};

export default function ProjectID() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
  const [showDownloadPopover, setShowDownloadPopover] = useState(false);
  
  const socialLinks = [
    { key: "instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM, label: "Instagram", icon: Instagram },
    { key: "tiktok", url: process.env.NEXT_PUBLIC_TIKTOK, label: "TikTok", icon: Music },
    { key: "youtube", url: process.env.NEXT_PUBLIC_YOUTUBE, label: "YouTube", icon: Play },
  ];

  const [requirements, setRequirements] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
  });

  const allCompleted = Object.values(requirements).every(Boolean);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Proyek tidak ditemukan");
        
        const data = await res.json();
        const projectData: ProjectDetail = {
          id: data.id,
          name: data.title || "Untitled Project",
          size: data.size || 0,
          uploadDate: data.created_at || new Date().toISOString(),
          description: data.description || "Deskripsi belum tersedia.",
          tags: data.tags || [],
          downloadCount: data.downloadCount || 0,
          image_url: data.image_url,
          file_url: data.file_url,
        };
        setProject(projectData);

        // Cek status download
        if (session?.user?.email) {
          const downloadRes = await fetch(`/api/downloads?userId=${session.user.email}`);
          if (downloadRes.ok) {
            const downloads = await downloadRes.json();
            const found = downloads.find((d: any) => d.project_id === id);
            if (found) {
              setDownloadStatus(found.status);
            }
          }

          // Cek status follows
          const followsRes = await fetch(`/api/follows?userId=${session.user.email}`);
          if (followsRes.ok) {
            const follows = await followsRes.json();
            const mapFollow: any = {};
            follows.forEach((f: any) => { mapFollow[f.platform] = f.is_followed; });
            setRequirements((prev) => ({ ...prev, ...mapFollow }));
          }
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, session]);

  const handleRequestDownload = async () => {
    try {
      if (!session?.user?.email) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, status: "pending" }),
      });

      if (!response.ok) throw new Error("Gagal mengirim permintaan");
      
      toast.success("Permintaan berhasil dikirim");
      setDownloadStatus("pending");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFinalDownload = async () => {
    if (!allCompleted) {
      toast.error("Selesaikan semua persyaratan terlebih dahulu");
      return;
    }

    if (!project?.file_url) {
      toast.error("File tidak tersedia");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = project.file_url;
      link.download = project.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download dimulai!");
      setRequirements({ instagram: false, tiktok: false, youtube: false });
      setShowDownloadPopover(false);
    } catch (err: any) {
      toast.error("Gagal download: " + err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">
          Proyek tidak ditemukan
        </h3>
        <p className="text-slate-500 mt-2">ID proyek yang Anda cari tidak tersedia</p>
        <Button onClick={() => router.back()} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <span className="text-slate-400">/</span>
        <span className="text-slate-600">Projects</span>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">{project.name}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-4">
          {/* Project Header */}
          <Card className="border-slate-300 dark:border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {project.name}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Badge variant="secondary" className="text-xs">Public</Badge>
                    {project.tags && project.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <span className={`h-2 w-2 rounded-full ${languageColor(tag)} mr-1.5`} />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{project.downloadCount || 0}</span>
                  <span className="text-slate-500">stars</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{project.downloadCount || 0}</span>
                  <span className="text-slate-500">forks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{(project.downloadCount || 0) * 3}</span>
                  <span className="text-slate-500">watching</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* README/Description */}
          <Card className="border-slate-300 dark:border-slate-700">
            <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">README.md</h2>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {project.image_url && (
                <img 
                  src={project.image_url} 
                  alt={project.name}
                  className="w-full rounded-md border border-slate-200 dark:border-slate-800 mb-4"
                />
              )}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-4">
          {/* About */}
          <Card className="border-slate-300 dark:border-slate-700">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-semibold">About</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">Created {formatDate(project.uploadDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <HardDrive className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">{(project.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <Separator />
              
              {/* Download Status & Button */}
              {downloadStatus === "none" && (
                <Button 
                  onClick={handleRequestDownload}
                  className="w-full"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Request Download
                </Button>
              )}

              {downloadStatus === "pending" && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Pending Approval</span>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-500">
                    Your request is being processed
                  </p>
                </div>
              )}

              {downloadStatus === "rejected" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-1">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Request Rejected</span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-500">
                    Your download request was not approved
                  </p>
                </div>
              )}

              {downloadStatus === "approved" && (
                <Popover open={showDownloadPopover} onOpenChange={setShowDownloadPopover}>
                  <PopoverTrigger asChild>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Download Approved
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" side="left">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <p className="text-sm font-medium">Complete Requirements</p>
                      </div>
                      
                      <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
                        {socialLinks.map(({ key, url, label, icon: Icon }) => {
                          const isCompleted = requirements[key as keyof typeof requirements];
                          return (
                            <div
                              key={key}
                              className={`flex w-full items-center justify-between rounded-md p-2 text-xs font-medium transition-colors ${
                                isCompleted 
                                  ? "cursor-default bg-emerald-500/10 text-emerald-600" 
                                  : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                              }`}
                              onClick={async () => {
                                if (!isCompleted && session?.user?.email) {
                                  setRequirements((p) => ({ ...p, [key]: true }));
                                  await fetch("/api/follows", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      user_id: session.user.email,
                                      platform: key,
                                      is_followed: true
                                    })
                                  });
                                  window.open(url!, '_blank', 'noopener,noreferrer');
                                }
                              }}
                            >
                              <span className="flex items-center gap-2">
                                <Icon className="h-4 w-4" /> {label}
                              </span>
                              {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                            </div>
                          );
                        })}
                        
                        <Button 
                          onClick={handleFinalDownload}
                          disabled={!allCompleted}
                          className="w-full mt-2"
                          size="sm"
                        >
                          {allCompleted ? (
                            <>
                              <Download className="mr-2 h-4 w-4" /> Download Now
                            </>
                          ) : (
                            <>
                              <Clock className="mr-2 h-4 w-4" /> Complete All
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </CardContent>
          </Card>

          {/* Languages */}
          {project.tags && project.tags.length > 0 && (
            <Card className="border-slate-300 dark:border-slate-700">
              <CardHeader className="pb-3">
                <h3 className="text-sm font-semibold">Languages</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.tags.map((tag, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${languageColor(tag)}`} />
                      <span className="text-slate-700 dark:text-slate-300">{tag}</span>
                    </div>
                    <span className="text-slate-500">100%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}