"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Music,
  Play,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  file_url?: string;
  download_count?: number;
  tags?: string[];
  uploadDate: string;
  type?: string[];
  language?: string[];
}

interface TableCardProps {
  projects?: Project[];
}

interface DownloadStatus {
  project_id: string;
  status: "pending" | "approved" | "rejected";
}

// Helper untuk warna language tag (tidak ada perubahan)
const languageColor = (lang?: string): string => {
  const normalized = lang?.toLowerCase().trim();
  switch (normalized) {
    case "next.js":
    case "nextjs":
      return "bg-slate-900 dark:bg-slate-100";
    case "golang":
    case "go":
      return "bg-cyan-500";
    case "typescript":
    case "ts":
      return "bg-blue-500";
    case "javascript":
    case "js":
      return "bg-yellow-400";
    case "java":
      return "bg-orange-500";
    case "dart":
      return "bg-teal-500";
    case "blade":
      return "bg-red-500";
    case "html":
      return "bg-orange-600";
    case "css":
      return "bg-blue-400";
    case "python":
    case "py":
      return "bg-blue-600";
    case "php":
      return "bg-indigo-500";
    case "ruby":
      return "bg-red-600";
    case "rust":
      return "bg-orange-700";
    case "c++":
    case "cpp":
      return "bg-pink-500";
    case "c#":
    case "csharp":
      return "bg-purple-600";
    default:
      return "bg-gray-500";
  }
};

const statusConfig = {
  completed: {
    label: "Public",
    icon: BookOpen,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  },
  ongoing: {
    label: "In Progress",
    icon: Circle,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
  },
  planned: {
    label: "Private",
    icon: Circle,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  },
};

export default function TableCard({ projects = [] }: TableCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [downloadStatuses, setDownloadStatuses] = useState<
    Record<string, DownloadStatus>
  >({});
  const [imagePopoverOpen, setImagePopoverOpen] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<Record<string, number>>({});

  const socialLinks = [
    {
      key: "instagram",
      url: process.env.NEXT_PUBLIC_INSTAGRAM,
      label: "Instagram",
      icon: Instagram,
    },
    {
      key: "tiktok",
      url: process.env.NEXT_PUBLIC_TIKTOK,
      label: "TikTok",
      icon: Music,
    },
    {
      key: "youtube",
      url: process.env.NEXT_PUBLIC_YOUTUBE,
      label: "YouTube",
      icon: Play,
    },
  ];

  const [requirements, setRequirements] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
  });
  const allCompleted = Object.values(requirements).every(Boolean);

  useEffect(() => {
    async function fetchDownloadStatuses() {
      if (session?.user?.email) {
        try {
          const downloadRes = await fetch(
            `/api/downloads?userId=${session.user.email}`
          );
          if (downloadRes.ok) {
            const downloads = await downloadRes.json();
            const statusMap: Record<string, DownloadStatus> = {};
            downloads.forEach((d: any) => {
              statusMap[d.project_id] = {
                project_id: d.project_id,
                status: d.status,
              };
            });
            setDownloadStatuses(statusMap);
          }

          const followsRes = await fetch(
            `/api/follows?userId=${session.user.email}`
          );
          if (followsRes.ok) {
            const follows = await followsRes.json();
            const mapFollow: any = {};
            follows.forEach((f: any) => {
              mapFollow[f.platform] = f.is_followed;
            });
            setRequirements((prev) => ({ ...prev, ...mapFollow }));
          }
        } catch (err: any) {
          console.error("Error fetching statuses:", err);
        }
      }
    }
    fetchDownloadStatuses();
  }, [session]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Updated today";
    if (diffDays < 30) return `Updated ${diffDays} days ago`;
    if (diffDays < 365)
      return `Updated ${Math.floor(diffDays / 30)} months ago`;
    return `Updated on ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  };

  const handleProjectClick = (projectId: string) => {
    const currentCount = clickCount[projectId] || 0;
    if (currentCount === 0) {
      setImagePopoverOpen(projectId);
      setClickCount({ ...clickCount, [projectId]: 1 });
      setTimeout(() => {
        setClickCount((prev) => ({ ...prev, [projectId]: 0 }));
      }, 500);
    } else if (currentCount === 1) {
      router.push(`/projects/${projectId}`);
      setClickCount({ ...clickCount, [projectId]: 0 });
      setImagePopoverOpen(null);
    }
  };

  const handleRequestDownload = async (
    projectId: string,
    e?: React.MouseEvent
  ) => {
    try {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (!session?.user?.email) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }
      const response = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, status: "pending" }),
      });
      if (!response.ok) throw new Error("Gagal mengirim permintaan");
      toast.success("Permintaan berhasil dikirim");
      setDownloadStatuses((prev) => ({
        ...prev,
        [projectId]: { project_id: projectId, status: "pending" },
      }));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFinalDownload = async (
    fileUrl: string,
    filename: string,
    projectId: string
  ) => {
    try {
      if (!allCompleted) {
        toast.error("Selesaikan semua persyaratan terlebih dahulu");
        return;
      }

      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Gagal mengambil file dari server");
      const data = await res.json().catch(() => ({}));
      const downloadLink = data?.file_url || fileUrl;
      if (!downloadLink) throw new Error("File URL tidak ditemukan");

      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = filename || "project";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("Download dimulai!");

      setClickCount((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] || 0) + 1,
      }));

      setRequirements({ instagram: false, tiktok: false, youtube: false });
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mendownload file: " + err.message);
    }
  };

  // getDownloadButton & Logika lain tidak ada perubahan...
  const getDownloadButton = (project: Project) => {
    const downloadStatus = downloadStatuses[project.id];
    if (!downloadStatus) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-medium border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={(e) => handleRequestDownload(project.id, e)}
          title="Request Download"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Request
        </Button>
      );
    }
    if (downloadStatus.status === "pending") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
              title="Menunggu Persetujuan"
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Pending
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-72">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                  <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                </div>
                <p className="text-sm font-semibold">Menunggu Persetujuan</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Permintaan download Anda sedang diproses. Kami akan meninjau dan
                memberikan akses segera.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    if (downloadStatus.status === "rejected") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium border-red-300 text-red-700 dark:border-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              title="Permintaan Ditolak"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              Rejected
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-72">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                  <AlertCircle className="h-4 w-4 text-red-700 dark:text-red-400" />
                </div>
                <p className="text-sm font-semibold">Permintaan Ditolak</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Maaf, permintaan download Anda tidak dapat disetujui saat ini.
                Silakan hubungi admin untuk informasi lebih lanjut.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    if (downloadStatus.status === "approved") {
      return (
        <Popover
          open={selectedFile === project.id}
          onOpenChange={(open) => {
            if (!open) setSelectedFile(null);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedFile(
                  selectedFile === project.id ? null : project.id
                );
              }}
              title="Download Disetujui - Klik untuk mulai"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Download
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            className="w-80"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-semibold">Download Approved</p>
              </div>
              <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4">
                <p className="text-xs font-semibold text-foreground">
                  Complete requirements to proceed:
                </p>
                <div className="space-y-2">
                  {socialLinks.map(({ key, url, label, icon: Icon }) => {
                    const isCompleted =
                      requirements[key as keyof typeof requirements];
                    return (
                      <div
                        key={key}
                        className={`flex w-full items-center justify-between rounded-md p-3 text-xs font-medium transition-all ${
                          isCompleted
                            ? "cursor-default bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
                            : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        }`}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!isCompleted && session?.user?.email) {
                            setRequirements((p) => ({ ...p, [key]: true }));
                            await fetch("/api/follows", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                user_id: session.user.email,
                                platform: key,
                                is_followed: true,
                              }),
                            });
                            window.open(url!, "_blank", "noopener,noreferrer");
                          }
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" /> Follow {label}
                        </span>
                        {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    );
                  })}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFinalDownload(
                      project.file_url || "",
                      project.name,
                      project.id
                    );
                  }}
                  disabled={!allCompleted}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  size="sm"
                >
                  {allCompleted ? (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download Now
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" /> Complete All
                      Requirements
                    </>
                  )}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    return null;
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            No repositories found
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-950">
      {projects.map((project, index) => {
        // [FIX 3] Logika untuk menentukan status berdasarkan 'type'
        let statusKey: "completed" | "planned" | "ongoing" = "completed"; // Default 'Public'
        if (project.type?.includes("Pribadi")) {
          statusKey = "planned"; // Jika 'Private'
        }
        const currentStatus = statusConfig[statusKey];
        const StatusIcon = currentStatus.icon;

        return (
          <div
            key={project.id}
            className={`px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${
              index !== projects.length - 1
                ? "border-b border-slate-200 dark:border-slate-800"
                : ""
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                    {project.image_url ? (
                      <Popover
                        open={imagePopoverOpen === project.id}
                        onOpenChange={(open) => {
                          if (!open) setImagePopoverOpen(null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <h3
                            className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              handleProjectClick(project.id);
                            }}
                          >
                            {project.name} {/* Menggunakan project.name */}
                          </h3>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0" side="top">
                          <img
                            src={project.image_url}
                            alt={project.name}
                            className="rounded-md object-cover w-full"
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Link href={`/projects/${project.id}`}>
                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          {project.name} {/* Menggunakan project.name */}
                        </h3>
                      </Link>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs px-2.5 py-0.5 font-medium ${currentStatus.className}`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {currentStatus.label}
                  </Badge>
                </div>

                {project.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center gap-5 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <span
                        className={`h-3 w-3 rounded-full ${languageColor(
                          project.tags[0]
                        )}`}
                      />
                      <span>{project.tags[0]}</span>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-1.5"
                    title="Download Count"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {(project.download_count ?? 0) +
                        (clickCount[project.id] || 0)}
                    </span>

                    {/* Menggunakan project.downloadCount */}
                  </div>
                  <span className="text-slate-500 dark:text-slate-500">
                    {formatDate(project.uploadDate)}
                  </span>{" "}
                  {/* Menggunakan project.uploadDate */}
                </div>
              </div>
              <div className="flex items-start pt-1">
                {getDownloadButton(project)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
