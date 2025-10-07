"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Instagram,
  Loader2,
  Music,
  Play,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Definisi tipe data
interface ProjectFile {
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

interface DownloadStatus {
  project_id: string;
  status: "pending" | "approved" | "rejected";
}

// Helper function untuk warna language
const languageColor = (lang?: string): string => {
  const normalized = lang?.toLowerCase().trim();
  switch (normalized) {
    case "next.js":
    case "nextjs":
      return "bg-slate-500";
    case "golang":
    case "go":
      return "bg-cyan-400";
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

export default function Projects() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [downloadStatuses, setDownloadStatuses] = useState<
    Record<string, DownloadStatus>
  >({});
  const [imagePopoverOpen, setImagePopoverOpen] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<Record<string, number>>({});
  const [downloading, setDownloading] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

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

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Gagal mengambil data proyek");
        const projects = await res.json();

        const transformed = projects.map((project: any) => ({
          id: project.id,
          name: project.title,
          size: project.file_url ? 1024 * 1024 * 5 : 0,
          uploadDate: project.created_at,
          description: project.description ?? "",
          tags: project.tags ?? [],
          downloadCount: project.download_count ?? 0,
          image_url: project.image_url,
          file_url: project.file_url,
        }));
        setFiles(transformed);

        if (session?.user?.email) {
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
        }
      } catch (err: any) {
        toast.error("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  const handleProjectClick = (fileId: string) => {
    const currentCount = clickCount[fileId] || 0;

    if (currentCount === 0) {
      setImagePopoverOpen(fileId);
      setClickCount({ ...clickCount, [fileId]: 1 });
      setTimeout(() => {
        setClickCount((prev) => ({ ...prev, [fileId]: 0 }));
      }, 500);
    } else if (currentCount === 1) {
      router.push(`/projects/${fileId}`);
      setClickCount({ ...clickCount, [fileId]: 0 });
      setImagePopoverOpen(null);
    }
  };

  const handleRequestDownload = async (
    fileId: string,
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
        body: JSON.stringify({ project_id: fileId, status: "pending" }),
      });
      if (!response.ok) throw new Error("Gagal mengirim permintaan");
      toast.success("Permintaan berhasil dikirim");
      setDownloadStatuses((prev) => ({
        ...prev,
        [fileId]: { project_id: fileId, status: "pending" },
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

      setDownloading(projectId);

      // Toast loading
      const toastId = toast.loading("Mengunduh file...");

      // Simulasi delay untuk animasi
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Panggil endpoint /api/projects/[id]
      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) throw new Error("Gagal mengunduh file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update toast menjadi success
      toast.success("Download berhasil!", { id: toastId });

      // Set notification for navbar
      if (session?.user?.email) {
        localStorage.setItem(
          `download_notification_${session.user.email}`,
          "true"
        );
        // Trigger storage event untuk update navbar
        window.dispatchEvent(new Event("storage"));
      }

      setRequirements({ instagram: false, tiktok: false, youtube: false });
      setSelectedFile(null);
      setDownloading(null);
    } catch (err: any) {
      toast.error("Gagal download: " + err.message);
      setDownloading(null);
    }
  };

  const getDownloadButton = (file: ProjectFile) => {
    const downloadStatus = downloadStatuses[file.id];

    if (!downloadStatus) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-slate-500 hover:text-slate-700"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleRequestDownload(file.id, e);
          }}
          title="Download"
        >
          <Download className="h-4 w-4 mr-1" />
          <span className="text-xs">Download</span>
        </Button>
      );
    }

    if (downloadStatus.status === "pending") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-amber-500 hover:text-amber-700"
              title="Menunggu Persetujuan"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-xs">Pending</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-64">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-medium">Menunggu Persetujuan</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Permintaan download Anda sedang diproses
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
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-500 hover:text-red-700"
              title="Permintaan Ditolak"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Rejected</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-64">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm font-medium">Permintaan Ditolak</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Maaf, permintaan download Anda tidak dapat disetujui
              </p>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    if (downloadStatus.status === "approved") {
      return (
        <Popover
          open={selectedFile === file.id}
          onOpenChange={(open) => {
            if (!open) setSelectedFile(null);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-emerald-600 hover:text-emerald-700"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedFile(selectedFile === file.id ? null : file.id);
              }}
              title="Download Disetujui - Klik untuk mulai"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span className="text-xs">download</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            className="w-80"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-medium">Download Disetujui</p>
              </div>

              <div className="space-y-3 rounded-lg border bg-muted/50 p-3">
                <p className="text-xs font-medium text-foreground">
                  Selesaikan persyaratan untuk lanjut:
                </p>
                <div className="space-y-2">
                  {socialLinks.map(({ key, url, label, icon: Icon }) => {
                    const isCompleted =
                      requirements[key as keyof typeof requirements];
                    return (
                      <div
                        key={key}
                        className={`flex w-full items-center justify-between rounded-md p-2 text-xs font-medium transition-colors ${
                          isCompleted
                            ? "cursor-default bg-emerald-500/10 text-emerald-600"
                            : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
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
                          <Icon className="h-4 w-4" /> {label}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFinalDownload(
                      file.file_url || "",
                      file.name,
                      file.id
                    );
                  }}
                  disabled={!allCompleted || downloading === file.id}
                  className="w-full"
                  size="sm"
                >
                  {downloading === file.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : allCompleted ? (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download Now
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" /> Selesaikan Semua
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

  if (loading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-[100px] w-full rounded-md" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[140px] w-full rounded-md" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header Card */}
      <Card className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal text-slate-700 dark:text-slate-200">
            Assyifaul04 /{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              README.md
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center text-center pb-3 border-b border-slate-300 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Ngoding Dulu, Jagonya Belakangan!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header untuk Pinned Projects */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-normal text-slate-700 dark:text-slate-300">
          Pinned
        </h3>
        <Link href="#" className="text-sm text-blue-600 hover:underline">
          Customize your pins
        </Link>
      </div>

      {/* Grid Projects */}
      <div className="grid gap-4 md:grid-cols-2">
        {files.map((file) => (
          <Card
            key={file.id}
            className="flex flex-col border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  {file.image_url ? (
                    <Popover
                      open={imagePopoverOpen === file.id}
                      onOpenChange={(open) => {
                        if (!open) setImagePopoverOpen(null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <span
                          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate cursor-pointer text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleProjectClick(file.id);
                          }}
                        >
                          {file.name}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" side="top">
                        <img
                          src={file.image_url}
                          alt={file.name}
                          className="rounded-md object-cover w-full"
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Link
                      href={`/projects/${file.id}`}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate cursor-pointer text-sm"
                    >
                      {file.name}
                    </Link>
                  )}
                </div>
                {downloadStatuses[file.id] && (
                  <Badge
                    variant="outline"
                    className={`text-xs flex-shrink-0 ${
                      downloadStatuses[file.id].status === "pending"
                        ? "border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950"
                        : downloadStatuses[file.id].status === "approved"
                        ? "border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                        : "border-red-300 text-red-600 bg-red-50 dark:bg-red-950"
                    }`}
                  >
                    {downloadStatuses[file.id].status === "pending"
                      ? "Pending"
                      : downloadStatuses[file.id].status === "approved"
                      ? "Approved"
                      : "Rejected"}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                {file.description || "No description available"}
              </p>

              <div className="flex w-full items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  {file.tags && file.tags.length > 0 && (
                    <>
                      <span
                        className={`h-3 w-3 rounded-full ${languageColor(
                          file.tags[0]
                        )}`}
                        title={file.tags[0]}
                      />
                      <span>{file.tags[0]}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center gap-1"
                    title="Download Count"
                  >
                    <Download className="h-4 w-4" />
                    <span>{file.downloadCount ?? 0}</span>
                  </div>
                  {getDownloadButton(file)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {files.length === 0 && !loading && (
        <div className="py-20 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-xl font-semibold text-slate-700 dark:text-slate-300">
            Belum Ada Proyek
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Proyek yang diunggah akan muncul di sini.
          </p>
        </div>
      )}
    </section>
  );
}