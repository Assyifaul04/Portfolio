"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileArchive,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: string;
  fileUrl: string;
  tags: string[];
  description?: string;
  longDescription?: string;
  downloadCount: number;
}

export default function ProjectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Project[]>([]);
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");

  // Fetch project list
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data: Project[] = await res.json();
      setUploadedFiles(
        data.map((p) => {
          let formattedDate = "";
          if (p.uploadDate) {
            const d = new Date(p.uploadDate);
            if (!isNaN(d.getTime())) {
              formattedDate = d.toISOString().split("T")[0];
            }
          }

          return {
            ...p,
            size: +(p.size || 0),
            uploadDate: formattedDate || "",
            tags:
              typeof p.tags === "string"
                ? p.tags.split(",").map((tag) => tag.trim())
                : Array.isArray(p.tags)
                ? p.tags
                : [],
          };
        })
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Upload file
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first");

    setMessage("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);
    formData.append("description", description);
    formData.append("longDescription", longDescription);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const newProject: Project = {
        id: data.id,
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "Processing",
        fileUrl: data.fileUrl,
        tags: ["React", "Next.js"],
        description: description,
        longDescription: longDescription,
        downloadCount: 0,
      };

      // Tambahkan project baru ke state
      setUploadedFiles([newProject, ...uploadedFiles]);

      // ❌ Reset semua field hanya setelah berhasil upload
      setFile(null);
      setMessage("");
      setDescription("");
      setLongDescription("");

      toast.success("File uploaded successfully");
    } catch (err: any) {
      setMessage("");
      toast.error(`Upload Failed: ${err.message}`);
    }
  };

  // Delete file from UI
  const handleDelete = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
    toast.success("File deleted successfully");
  };

  // Download file
  const handleDownload = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = project.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" /> Processing
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Project Manager
        </h1>
        <p className="text-lg text-slate-600">
          Upload and manage your project files with ease
        </p>

        {/* Upload Section */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <FileArchive className="h-6 w-6 text-slate-700" /> Upload File
            </CardTitle>
            <CardDescription>
              Select and upload your project files (ZIP format only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              {/* File Input */}
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              {/* Tags Input */}
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              {/* Description Input */}
              <textarea
                placeholder="Project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              {/* Long Description Input */}
              <textarea
                placeholder="Project long description"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6"
              >
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>

            {file && (
              <Alert className="border-slate-200 bg-slate-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Selected: <span className="font-medium">{file.name}</span> (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Files Table */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Manage your uploaded project files
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {uploadedFiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        File Name
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Size
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Upload Date
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Description
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <FileArchive className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          <span className="font-medium text-slate-900 truncate">
                            {file.name}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {file.uploadDate}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(file.status)}
                        </td>
                        <td className="py-4 px-6 text-slate-600 truncate max-w-xs">
                          {file.description || "-"}
                        </td>
                        <td className="py-4 px-6 flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-6">
                <FileArchive className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  No files uploaded yet
                </h3>
                <p className="text-slate-500">
                  Upload your first project file to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
