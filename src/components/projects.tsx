"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, Eye, FileText } from "lucide-react";
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
        const transformedData = data.map((file: any, index: number) => ({
          id: file.id || `project-${index + 1}`,
          name: file.name,
          size: file.size,
          uploadDate: file.uploadDate || new Date().toISOString(),
          description: file.description || "Proyek web development dengan fitur lengkap",
          tags: file.tags || ["React", "Next.js", "TypeScript"],
          downloadCount: file.downloadCount || Math.floor(Math.random() * 100),
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/download?id=${fileId}&agree=true`);
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
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Proyek Terbaru
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Koleksi proyek web development terbaik dengan teknologi modern dan fitur lengkap
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {files.map((file) => (
          <Card key={file.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {file.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {file.description}
                  </CardDescription>
                </div>
                <FileText className="h-6 w-6 text-blue-500 mt-1" />
              </div>

              <div className="flex flex-wrap gap-2">
                {file.tags?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(file.uploadDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  <span>↓ {file.downloadCount}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleViewProject(file.id)}
                  variant="outline"
                  className="w-full flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Eye className="h-4 w-4" />
                  Lihat Detail
                </Button>

                {!selectedFile || selectedFile !== file.id ? (
                  <Button
                    onClick={() => setSelectedFile(file.id)}
                    className="w-full flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    Download Project
                  </Button>
                ) : (
                  <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 space-y-4">
                    <h4 className="font-semibold text-blue-800 mb-3 text-center">🎯 Selesaikan persyaratan berikut:</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'instagram', url: 'https://instagram.com/username', label: '📸 Follow Instagram', color: 'from-pink-500 to-purple-500' },
                        { key: 'tiktok', url: 'https://tiktok.com/@username', label: '🎵 Follow TikTok', color: 'from-gray-800 to-gray-900' },
                        { key: 'youtube', url: 'https://youtube.com/channel/yourchannel', label: '🎬 Subscribe YouTube', color: 'from-red-500 to-red-600' }
                      ].map(({ key, url, label, color }) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            block w-full p-3 rounded-lg text-center font-medium transition-all duration-300
                            ${requirements[key as keyof typeof requirements] 
                              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                              : `bg-gradient-to-r ${color} text-white hover:shadow-lg hover:scale-105`
                            }
                          `}
                          onClick={() => setRequirements((prev) => ({ ...prev, [key]: true }))}
                        >
                          {requirements[key as keyof typeof requirements] ? `✅ ${label} - Selesai` : label}
                        </a>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleDownload(file.id, file.name)}
                      className={`w-full font-bold py-3 rounded-lg transition-all duration-300 ${
                        allCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!allCompleted}
                    >
                      {allCompleted ? "🚀 Download Sekarang!" : "⏳ Selesaikan semua persyaratan"}
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
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada proyek</h3>
          <p className="text-gray-500">Proyek akan muncul di sini setelah diupload</p>
        </div>
      )}
    </section>
  );
}
