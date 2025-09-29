"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  HardDrive,
  Instagram,
  Music,
  Play,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProjectFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  description?: string;
  tags?: string[];
  downloadCount?: number;
}

export default function Projects() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const router = useRouter();
  const socialLinks = [
    {
      key: "instagram",
      url: process.env.NEXT_PUBLIC_INSTAGRAM,
      label: "Follow Instagram",
      icon: Instagram,
      color:
        "bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800",
    },
    {
      key: "tiktok",
      url: process.env.NEXT_PUBLIC_TIKTOK,
      label: "Follow TikTok",
      icon: Music,
      color:
        "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700",
    },
    {
      key: "youtube",
      url: process.env.NEXT_PUBLIC_YOUTUBE,
      label: "Subscribe YouTube",
      icon: Play,
      color:
        "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
    },
  ];

  const [requirements, setRequirements] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
  });

  const allCompleted = Object.values(requirements).every(Boolean);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/list`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        const transformedData = data.map((file: any) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          uploadDate: file.uploadDate,
          description: file.description ?? "",
          tags: file.tags ?? [],
          downloadCount: file.downloadCount ?? 0,
        }));
        setFiles(transformedData);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Gagal ambil data: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/download?id=${fileId}&agree=true`
      );
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Download berhasil");
      setRequirements({ instagram: false, tiktok: false, youtube: false });
      setSelectedFile(null);
    } catch (err: any) {
      toast.error("Gagal download: " + err.message);
    }
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
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
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="max-w-5xl mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-950"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-300 dark:to-slate-400 bg-clip-text text-transparent mb-4">
          Proyek Terbaru
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Koleksi proyek web development terbaik dengan teknologi modern dan
          fitur lengkap
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {files.map((file) => (
          <Card
            key={file.id}
            className="group hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 shadow-md hover:-translate-y-2 bg-white dark:bg-slate-900 hover:shadow-slate-200 dark:hover:shadow-slate-800/25"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors line-clamp-2">
                    {file.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {file.description}
                  </CardDescription>
                </div>
                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {file.tags?.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(file.uploadDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-4 w-4" />
                    <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-4 w-4" />
                    <span>{file.downloadCount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleViewProject(file.id)}
                  variant="outline"
                  className="w-full flex items-center gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                >
                  <Eye className="h-4 w-4" />
                  Lihat Detail
                </Button>

                {!selectedFile || selectedFile !== file.id ? (
                  <Button
                    onClick={() => setSelectedFile(file.id)}
                    className="w-full flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    Download Project
                  </Button>
                ) : (
                  <div className="mt-4 p-4 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Selesaikan persyaratan berikut:
                    </h4>
                    <div className="space-y-3">
                      {socialLinks.map(
                        ({ key, url, label, icon: Icon, color }) => (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                              flex items-center justify-center gap-2 w-full p-3 rounded-lg text-center font-medium transition-all duration-300
                              ${
                                requirements[key as keyof typeof requirements]
                                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700"
                                  : `${color} text-white hover:shadow-lg hover:scale-105`
                              }
                            `}
                            onClick={() =>
                              setRequirements((prev) => ({
                                ...prev,
                                [key]: true,
                              }))
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
                        )
                      )}
                    </div>

                    <Button
                      onClick={() => handleDownload(file.id, file.name)}
                      className={`w-full font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
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
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-20">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 w-fit mx-auto mb-4">
            <FileText className="h-16 w-16 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Belum ada proyek
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            Proyek akan muncul di sini setelah diupload
          </p>
        </div>
      )}
    </section>
  );
}
