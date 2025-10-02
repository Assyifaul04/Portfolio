"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
import {
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface DownloadItem {
  id: string;
  projects: { title: string; image_url?: string };
  status: "pending" | "approved" | "rejected";
  created_at: string;
  file_url?: string;
}

export default function RiwayatDownload() {
  const { data: session } = useSession();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const fetchDownloads = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/downloads?userId=${session.user.email}`);
      if (!res.ok) throw new Error("Gagal fetch downloads");
      const data = await res.json();
      setDownloads(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [session]);

  const handleDownload = (fileUrl?: string, projectTitle?: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = projectTitle || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started successfully!");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: {
        icon: CheckCircle2,
        label: "Approved",
        className:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      },
      pending: {
        icon: Clock,
        label: "Pending",
        className:
          "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      },
      rejected: {
        icon: XCircle,
        label: "Rejected",
        className:
          "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`${config.className} flex items-center gap-1 w-fit`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getActionButton = (download: DownloadItem) => {
    const status = download.status.toLowerCase();
  
    switch (status) {
      case "approved":
        if (download.file_url) {
          return (
            <Button
              size="sm"
              onClick={() =>
                handleDownload(download.file_url, download.projects?.title)
              }
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-900"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          );
        } else {
          return (
            <Button
              size="sm"
              disabled
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2 animate-pulse" />
              Waiting for file
            </Button>
          );
        }
  
      case "pending":
        return (
          <Button
            size="sm"
            disabled
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 cursor-not-allowed"
          >
            <Clock className="h-4 w-4 mr-2 animate-pulse" />
            Waiting
          </Button>
        );
  
      case "rejected":
        return (
          <Button
            size="sm"
            disabled
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 cursor-not-allowed"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejected
          </Button>
        );
  
      default:
        return null; // kalau status aneh
    }
  };
  

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <AlertCircle className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Authentication Required
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
              Please sign in to view your download history
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-64 animate-pulse"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-96 animate-pulse"></div>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"
                ></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-4 mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Download History
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Track and manage all your download requests
        </p>
      </div>

      {downloads.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <FileText className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No Downloads Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
              Your download history will appear here once you request a project
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl">All Requests</CardTitle>
            <CardDescription>
              {downloads.length} total download{" "}
              {downloads.length === 1 ? "request" : "requests"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      Project
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      Request Date
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.map((d) => (
                    <TableRow
                      key={d.id}
                      className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-slate-50">
                              {d.projects?.title || "Unknown Project"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(d.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="h-4 w-4" />
                          {formatDate(d.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getActionButton(d)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
