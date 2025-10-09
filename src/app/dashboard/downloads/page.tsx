"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle, Clock, Download, Filter, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DownloadItem {
  id: string;
  users: { email: string };
  projects: { title: string };
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface DownloadsPageProps {
  searchParams?: Record<string, string | string[]>;
}

export default function DownloadsPage({ searchParams }: DownloadsPageProps) {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const statusFilter = searchParams?.status ?? undefined;

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      let query = supabase.from("downloads").select("*, users(*), projects(*)");
      if (statusFilter) query = query.eq("status", statusFilter);

      const { data, error } = await query;
      if (error) throw error;
      setDownloads(data ?? []);
      setLoading(false);
    } catch (err: any) {
      toast.error("Gagal fetch downloads: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [statusFilter]);

  const handleUpdateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from("downloads")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Download ${status === "approved" ? "disetujui" : "ditolak"}`);
      fetchDownloads();
    } catch (err: any) {
      toast.error("Gagal update: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("downloads")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Download berhasil dihapus");
      fetchDownloads();
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case "rejected":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const stats = {
    total: downloads.length,
    pending: downloads.filter(d => d.status === "pending").length,
    approved: downloads.filter(d => d.status === "approved").length,
    rejected: downloads.filter(d => d.status === "rejected").length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Download</h1>
          <p className="text-muted-foreground mt-1">
            Kelola permintaan download dari pengguna
          </p>
        </div>
        <Download className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Download</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Pending
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Approved
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Rejected
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Download</CardTitle>
              <CardDescription>
                {statusFilter 
                  ? `Menampilkan download dengan status: ${statusFilter}`
                  : "Menampilkan semua permintaan download"
                }
              </CardDescription>
            </div>
            {statusFilter && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {statusFilter}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {downloads.length === 0 ? (
            <div className="text-center py-16">
              <Download className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Tidak ada data</h3>
              <p className="text-muted-foreground mt-2">
                Tidak ada download{" "}
                {statusFilter ? `dengan status ${statusFilter}` : "yang tersedia"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Pengguna</TableHead>
                    <TableHead>Judul Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">
                        {d.users?.email}
                      </TableCell>
                      <TableCell>{d.projects?.title}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(d.status)} className="flex items-center w-fit">
                          {getStatusIcon(d.status)}
                          {d.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(d.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {d.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                                onClick={() => handleUpdateStatus(d.id, "approved")}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Setuju
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-red-600 hover:text-red-700"
                                onClick={() => handleUpdateStatus(d.id, "rejected")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Tolak
                              </Button>
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Download</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data download ini?
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(d.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
  );
}