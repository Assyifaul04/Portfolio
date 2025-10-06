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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  Plus,
  Trash,
  Download,
  Image as ImageIcon,
  FileArchive,
} from "lucide-react";
import { toast } from "sonner";

type Project = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  image_url: string | null;
  tags: string[] | null;
  type: string[] | null;
  language: string[] | null;
  sort: string;
  download_count: number;
  created_at: string;
  admin_id: string;
};

const TYPE_OPTIONS = [
  "AII",
  "Publik",
  "Pribadi",
  "Sumber",
  "Diarsipkan",
  "Dapat disponsori",
  "Templat",
];

const LANGUAGE_OPTIONS = [
  "All",
  "TypeScript",
  "Blade",
  "Java",
  "Dart",
  "Python",
  "JavaScript",
  "C++",
  "HTML",
  "PHP",
];

const SORT_OPTIONS = [
  "Last updated",
  "Most downloaded",
  "Alphabetical",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sort, setSort] = useState("Last updated");
  const [fileFile, setFileFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchProjects() {
    setLoading(true);
    const res = await fetch("/api/projects", { credentials: "include" });
    if (!res.ok) {
      toast.error("Failed to fetch projects");
      console.error("GET Projects Error:", await res.json());
      setLoading(false);
      return;
    }
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  }

  function toggleLanguage(lang: string) {
    setSelectedLanguages((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  }

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("type", selectedTypes.join(","));
    formData.append("language", selectedLanguages.join(","));
    formData.append("sort", sort);
  
    // Jika file/image baru dipilih
    if (fileFile) formData.append("file", fileFile);
    if (imageFile) formData.append("image", imageFile);
  
    if (editingId) formData.append("id", editingId);
  
    const res = await fetch("/api/projects", {
      method: editingId ? "PATCH" : "POST",
      body: formData,
      credentials: "include",
    });
  
    if (!res.ok) {
      toast.error(editingId ? "Failed to update project" : "Failed to create project");
      console.error(await res.json());
      return;
    }
  
    toast.success(editingId ? "Project updated successfully" : "Project created successfully");
    resetForm();
    setIsOpen(false);
    fetchProjects();
  }
  

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const res = await fetch(`/api/projects?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      toast.error("Failed to delete project");
      console.error("Delete error:", await res.json());
      return;
    }

    toast.success("Project deleted successfully");
    fetchProjects();
  }

  function handleEdit(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTags(project.tags?.join(", ") || "");
    setSelectedTypes(project.type || []);
    setSelectedLanguages(project.language || []);
    setSort(project.sort || "Last updated");
    setIsOpen(true);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTags("");
    setSelectedTypes([]);
    setSelectedLanguages([]);
    setSort("Last updated");
    setFileFile(null);
    setImageFile(null);
  }

  function handleNewProject() {
    resetForm();
    setIsOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your project files and resources
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewProject}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Project" : "Create New Project"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                {!editingId && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="file" className="flex items-center gap-2">
                        <FileArchive className="h-4 w-4" />
                        Project File (ZIP)
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".zip"
                        onChange={(e) => setFileFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Files cannot be changed after creation
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Project Image
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Images cannot be changed after creation
                      </p>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Type *</Label>
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                      {TYPE_OPTIONS.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select one or more types
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Language *</Label>
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang}`}
                            checked={selectedLanguages.includes(lang)}
                            onCheckedChange={() => toggleLanguage(lang)}
                          />
                          <label
                            htmlFor={`lang-${lang}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {lang}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select one or more languages
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort">Sort Order *</Label>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. react, typescript, nextjs"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!title || !description || selectedTypes.length === 0 || selectedLanguages.length === 0}
                  className="w-full"
                >
                  {editingId ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>
              A list of all your projects including their details and download statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading projects...</div>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileArchive className="h-12 w-12 mb-3 opacity-30" />
                <p>No projects yet</p>
                <p className="text-sm">Create your first project to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold">Image</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Language</TableHead>
                      <TableHead className="font-semibold">Tags</TableHead>
                      <TableHead className="font-semibold">Sort</TableHead>
                      <TableHead className="font-semibold">Downloads</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {p.description}
                        </TableCell>
                        <TableCell>
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center border">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {p.type && p.type.length > 0 ? (
                              p.type.map((t, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {t}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {p.language && p.language.length > 0 ? (
                              p.language.map((l, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {l}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {p.tags && p.tags.length > 0 ? (
                              p.tags.map((t, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {t}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{p.sort}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Download className="h-3.5 w-3.5" />
                            <span className="font-medium">{p.download_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {p.file_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={p.file_url} target="_blank" rel="noreferrer">
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(p)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(p.id)}
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