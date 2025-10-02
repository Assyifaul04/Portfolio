"use client";

// Impor komponen yang diperlukan dari shadcn/ui dan pustaka lainnya
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Clock, Download, FileText, Instagram, Music, Play, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

// Definisi tipe data untuk proyek dan status unduhan
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

// Fungsi helper untuk memberikan warna pada tag bahasa
const languageColor = (lang?: string): string => {
  switch (lang?.toLowerCase()) {
    case "next.js": return "bg-slate-300";
    case "golang": return "bg-cyan-400";
    case "typescript": return "bg-blue-500";
    case "javascript": return "bg-yellow-400";
    default: return "bg-gray-500";
  }
};

export default function Projects() {
  // State management dan hooks (tidak ada perubahan fungsi)
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [downloadStatuses, setDownloadStatuses] = useState<Record<string, DownloadStatus>>({});
  const { data: session } = useSession();
  const router = useRouter();
  
  const socialLinks = [
    { key: "instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM, label: "Instagram", icon: Instagram },
    { key: "tiktok", url: process.env.NEXT_PUBLIC_TIKTOK, label: "TikTok", icon: Music },
    { key: "youtube", url: process.env.NEXT_PUBLIC_YOUTUBE, label: "YouTube", icon: Play },
  ];
  
  const [requirements, setRequirements] = useState({ instagram: false, tiktok: false, youtube: false });
  const allCompleted = Object.values(requirements).every(Boolean);

  // Efek untuk mengambil data proyek saat komponen dimuat
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
          downloadCount: project.downloadCount ?? 0,
          image_url: project.image_url,
          file_url: project.file_url,
        }));
        setFiles(transformed);

        if (session?.user?.email) {
          const downloadRes = await fetch(`/api/downloads?userId=${session.user.email}`);
          if (downloadRes.ok) {
            const downloads = await downloadRes.json();
            const statusMap: Record<string, DownloadStatus> = {};
            downloads.forEach((d: any) => { statusMap[d.project_id] = { project_id: d.project_id, status: d.status }; });
            setDownloadStatuses(statusMap);
          }
          
          const followsRes = await fetch(`/api/follows?userId=${session.user.email}`);
          if (followsRes.ok) {
            const follows = await followsRes.json();
            const mapFollow: any = {};
            follows.forEach((f: any) => { mapFollow[f.platform] = f.is_followed; });
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

  // Handler untuk meminta unduhan (fungsi tidak diubah)
  const handleRequestDownload = async (fileId: string) => {
    try {
      if (!session?.user?.email) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }
      const response = await fetch("/api/downloads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: fileId, status: "pending" }),
      });
      if (!response.ok) throw new Error("Gagal mengirim permintaan");
      toast.success("Permintaan berhasil dikirim");
      setDownloadStatuses((prev) => ({ ...prev, [fileId]: { project_id: fileId, status: "pending" } }));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Handler untuk unduhan final setelah syarat terpenuhi (fungsi tidak diubah)
  const handleFinalDownload = async (fileUrl: string, filename: string) => {
    try {
      if (!allCompleted) {
        toast.error("Selesaikan semua persyaratan terlebih dahulu");
        return;
      }
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download dimulai!");
      setRequirements({ instagram: false, tiktok: false, youtube: false });
      setSelectedFile(null);
    } catch (err: any) {
      toast.error("Gagal download: " + err.message);
    }
  };

  // Fungsi untuk merender tombol unduhan berdasarkan status
  const getDownloadButton = (file: ProjectFile) => {
    const downloadStatus = downloadStatuses[file.id];

    if (!downloadStatus) {
      return (
        <Button onClick={() => handleRequestDownload(file.id)} className="w-full">
          <Download className="mr-2 h-4 w-4" /> Request Download
        </Button>
      );
    }
    if (downloadStatus.status === "pending") {
      return (
        <Button disabled variant="outline" className="w-full cursor-not-allowed">
          <Clock className="mr-2 h-4 w-4" /> Menunggu Persetujuan
        </Button>
      );
    }
    if (downloadStatus.status === "rejected") {
      return (
        <Button disabled variant="destructive" className="w-full cursor-not-allowed">
          <AlertCircle className="mr-2 h-4 w-4" /> Permintaan Ditolak
        </Button>
      );
    }
    if (downloadStatus.status === "approved") {
      if (selectedFile !== file.id) {
        return (
          <Button onClick={() => setSelectedFile(file.id)} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mulai Download
          </Button>
        );
      }
      return (
        <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-medium text-foreground">Selesaikan persyaratan untuk lanjut:</p>
          <div className="space-y-2">
            {socialLinks.map(({ key, url, label, icon: Icon }) => {
              const isCompleted = requirements[key as keyof typeof requirements];
              return (
                <a key={key} href={url!} target="_blank" rel="noopener noreferrer"
                  className={`flex w-full items-center justify-between rounded-md p-2 text-sm font-medium transition-colors ${
                    isCompleted ? "cursor-default bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                  onClick={async () => {
                    if (!isCompleted && session?.user?.email) {
                      setRequirements((p) => ({ ...p, [key]: true }));
                      await fetch("/api/follows", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: session.user.email, platform: key, is_followed: true }) });
                    }
                  }}
                >
                  <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
                  {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </a>
              );
            })}
          </div>
          <Button onClick={() => handleFinalDownload(file.file_url || "", file.name)} disabled={!allCompleted} className="w-full">
            {allCompleted ? <><Download className="mr-2 h-4 w-4" /> Download Now</> : <><Clock className="mr-2 h-4 w-4" /> Selesaikan Semua</>}
          </Button>
        </div>
      );
    }
    return null;
  };

  // Tampilan loading state dengan komponen Skeleton
  if (loading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-[125px] w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[220px] w-full" />)}
        </div>
      </section>
    );
  }

  // Tampilan utama komponen
  return (
    <section className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Assyifaul04/README.md</CardTitle></CardHeader>
        <CardContent><p>Selamat datang di profil saya! Jelajahi proyek-proyek di bawah ini.</p></CardContent>
      </Card>
      
      <h3 className="text-lg font-semibold">Pinned Projects</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {files.map((file) => (
          <Card key={file.id} className="flex flex-col">
            <div className="flex-grow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Link href={`/projects/${file.id}`} className="flex cursor-pointer items-center gap-2 text-blue-500 hover:underline">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {file.name}
                        </Link>
                      </PopoverTrigger>
                      {file.image_url && (
                        <PopoverContent className="w-80 p-0">
                          <img src={file.image_url} alt={file.name} className="rounded-md object-cover" />
                        </PopoverContent>
                      )}
                    </Popover>
                  </CardTitle>
                  <Badge variant="outline">Public</Badge>
                </div>
                <CardDescription className="line-clamp-2 pt-2">
                  {file.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>{getDownloadButton(file)}</CardContent>
            </div>
            <CardFooter className="text-xs text-muted-foreground">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  {file.tags && file.tags.length > 0 && (
                    <>
                      <span className={`h-3 w-3 rounded-full ${languageColor(file.tags[0])}`} />
                      <span>{file.tags[0]}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>{file.downloadCount ?? 0}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {files.length === 0 && !loading && (
        <div className="py-20 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">Belum Ada Proyek</h3>
          <p className="text-muted-foreground">Proyek yang diunggah akan muncul di sini.</p>
        </div>
      )}
    </section>
  );
}