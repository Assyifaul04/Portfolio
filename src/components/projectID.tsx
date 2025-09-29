"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  FileText, 
  Download, 
  Instagram,
  Play,
  Music,
  CheckCircle2,
  Clock,
  HardDrive,
  TrendingDown,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProjectDetail {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  description?: string;
  tags?: string[];
  downloadCount?: number;
}

export default function ProjectID() {
  const { id } = useParams(); // ambil id dari url
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [requirements, setRequirements] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
  });

  const allCompleted = Object.values(requirements).every(Boolean);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        const projectData: ProjectDetail = {
          id: data.id,
          name: data.name,
          size: data.size,
          uploadDate: data.uploadDate || new Date().toISOString(),
          description: data.description || "Deskripsi belum tersedia.",
          tags: data.tags || ["React", "Next.js", "TypeScript"],
          downloadCount: data.downloadCount || 0,
        };
        setProject(projectData);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Gagal ambil data: " + err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDownload = async () => {
    if (!project) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/download?id=${project.id}&agree=true`);
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = project.name;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Download berhasil");
      setRequirements({ instagram: false, tiktok: false, youtube: false });
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
      <section className="max-w-3xl mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center bg-slate-50 dark:bg-slate-950">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 w-fit mx-auto mb-4">
          <AlertCircle className="h-16 w-16 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">Proyek tidak ditemukan</h3>
        <p className="text-slate-500 dark:text-slate-500 mt-2">ID proyek yang Anda cari tidak tersedia</p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-950">
      {/* Header dengan tombol kembali */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Detail Proyek</h1>
      </div>

      <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
              <FileText className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
                {project.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
            {project.description}
          </p>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(project.uploadDate)}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <HardDrive className="h-5 w-5" />
                <span>{(project.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-5 w-5" />
                <span>{project.downloadCount}</span>
              </div>
            </div>
          </div>

          {/* Persyaratan Follow */}
          <div className="mt-6 p-6 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              Selesaikan persyaratan berikut:
            </h4>
            <div className="space-y-3">
              {[
                { key: "instagram", url: "https://instagram.com/username", label: "Follow Instagram", icon: Instagram, color: "bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800" },
                { key: "tiktok", url: "https://tiktok.com/@username", label: "Follow TikTok", icon: Music, color: "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700" },
                { key: "youtube", url: "https://youtube.com/channel/yourchannel", label: "Subscribe YouTube", icon: Play, color: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800" },
              ].map(({ key, url, label, icon: Icon, color }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center justify-center gap-3 w-full p-4 rounded-lg text-center font-medium transition-all duration-300
                    ${requirements[key as keyof typeof requirements] 
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700"
                      : `${color} text-white hover:shadow-lg hover:scale-105`}
                  `}
                  onClick={() =>
                    setRequirements((prev) => ({ ...prev, [key]: true }))
                  }
                >
                  {requirements[key as keyof typeof requirements] ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      {label} - Selesai
                    </>
                  ) : (
                    <>
                      <Icon className="h-5 w-5" />
                      {label}
                    </>
                  )}
                </a>
              ))}
            </div>

            <Button
              onClick={handleDownload}
              className={`w-full font-bold py-4 text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                allCompleted
                  ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              }`}
              disabled={!allCompleted}
            >
              {allCompleted ? (
                <>
                  <Download className="h-5 w-5" />
                  Download Sekarang!
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5" />
                  Selesaikan semua persyaratan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}