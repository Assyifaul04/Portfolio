"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Plus,
  Trash,
  Download,
  Image as ImageIcon,
  FileArchive,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  image_url: string | null;
  tags: string[] | null;
  download_count: number;
  created_at: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [fileFile, setFileFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchProjects() {
    setLoading(true);
    const res = await fetch("/api/projects", { credentials: "include" });
    if (!res.ok) return console.error("GET Projects Error:", await res.json());
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    if (fileFile) formData.append("file", fileFile);
    if (imageFile) formData.append("image", imageFile);

    if (editingId) {
      // PATCH metadata only
      await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: editingId,
          title,
          description,
          tags: tags.split(","),
          file_url: "",
          image_url: "",
        }),
      });
    } else {
      // POST new project
      await fetch("/api/projects", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
    }

    setTitle("");
    setDescription("");
    setTags("");
    setFileFile(null);
    setImageFile(null);
    setEditingId(null);
    setIsOpen(false);
    fetchProjects();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchProjects();
  }

  function handleEdit(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTags(project.tags?.join(",") || "");
    setIsOpen(true);
  }

  function handleNewProject() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTags("");
    setFileFile(null);
    setImageFile(null);
    setIsOpen(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Projects
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your project files and resources
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleNewProject}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] dark:bg-slate-900 dark:border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-slate-100">
                  {editingId ? "Edit Project" : "Create New Project"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-slate-300 focus:border-slate-500 min-h-[100px] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="file"
                    className="text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <FileArchive className="h-4 w-4" />
                    Project File (ZIP)
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".zip"
                    onChange={(e) => setFileFile(e.target.files?.[0] || null)}
                    className="border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="image"
                    className="text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Project Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="e.g. react, typescript, nextjs"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Separate tags with commas
                  </p>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
                >
                  {editingId ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Table Card */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/50">
            <CardTitle className="text-slate-900 dark:text-slate-100">
              All Projects
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              A list of all your projects including their details and download
              statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500 dark:text-slate-400">
                  Loading projects...
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                <FileArchive className="h-12 w-12 mb-3 text-slate-300 dark:text-slate-600" />
                <p>No projects yet</p>
                <p className="text-sm">
                  Create your first project to get started
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Title
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Image
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        File
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Tags
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Downloads
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p) => (
                      <TableRow
                        key={p.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-800"
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          {p.title}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {p.description}
                        </TableCell>
                        <TableCell>
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="w-16 h-16 object-cover rounded-md border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-700">
                              <ImageIcon className="h-6 w-6 text-slate-400 dark:text-slate-600" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {p.file_url ? (
                            <a
                              href={p.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 underline underline-offset-2"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-sm">
                              No file
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {p.tags && p.tags.length > 0 ? (
                              p.tags.map((t, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                  {t}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 text-sm">
                                No tags
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Download className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {p.download_count}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(p)}
                              className="border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(p.id)}
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
