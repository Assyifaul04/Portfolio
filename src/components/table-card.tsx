// components/table-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Circle, Clock, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status?: "completed" | "ongoing" | "planned";
  image_url?: string;
  file_url?: string;
  downloadCount?: number;
  tags?: string[];
  uploadDate: string;
}

interface TableCardProps {
  projects?: Project[];
}

// Helper untuk warna language tag
const languageColor = (lang?: string): string => {
  const normalized = lang?.toLowerCase().trim();
  switch (normalized) {
    case "next.js":
    case "nextjs":
      return "bg-slate-900";
    case "typescript":
    case "ts":
      return "bg-blue-500";
    case "javascript":
    case "js":
      return "bg-yellow-400";
    case "python":
      return "bg-blue-600";
    case "go":
    case "golang":
      return "bg-cyan-400";
    case "java":
      return "bg-orange-500";
    case "php":
      return "bg-indigo-500";
    case "blade":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const statusConfig = {
  completed: {
    label: "Public",
    className: "border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300",
  },
  ongoing: {
    label: "In Progress",
    className: "border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300",
  },
  planned: {
    label: "Private",
    className: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300",
  },
};

export default function TableCard({ projects = [] }: TableCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [downloadStatuses, setDownloadStatuses] = useState<Record<string, any>>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Updated today";
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 30) return `Updated ${diffDays} days ago`;
    if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)} months ago`;
    return `Updated on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const handleRequestDownload = async (fileId: string) => {
    try {
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
      setDownloadStatuses((prev) => ({ ...prev, [fileId]: { status: "pending" } }));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getDownloadButton = (project: Project) => {
    const status = downloadStatuses[project.id];

    if (!status) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRequestDownload(project.id)}
          className="h-7 px-2 text-slate-500 hover:text-slate-700"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
      );
    }

    if (status.status === "pending") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-500">
              <Clock className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-medium">Pending Approval</p>
              </div>
              <p className="text-xs text-muted-foreground">Your download request is being processed</p>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    if (status.status === "approved") {
      return (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </Button>
      );
    }

    return null;
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400">No repositories found</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-950">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${
            index !== projects.length - 1 ? "border-b border-slate-200 dark:border-slate-800" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left: Project Info */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Title and Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  {project.name}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0 ${statusConfig[project.status || "completed"].className}`}
                >
                  {statusConfig[project.status || "completed"].label}
                </Badge>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {project.description}
                </p>
              )}

              {/* Footer: Language, Stars, Forks, Updated */}
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                {project.tags && project.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className={`h-3 w-3 rounded-full ${languageColor(project.tags[0])}`} />
                    <span>{project.tags[0]}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  <span>{project.downloadCount || 0}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" />
                  <span>{project.downloadCount || 0}</span>
                </div>
                
                <span>{formatDate(project.uploadDate)}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {getDownloadButton(project)}
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs border-slate-300 dark:border-slate-700"
              >
                <Star className="h-3.5 w-3.5 mr-1" />
                Star
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}