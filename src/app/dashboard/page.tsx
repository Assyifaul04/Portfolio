"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Folder, BarChart3, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface Stats {
  projects: number;
  followers: number;
  downloadsPending: number;
  downloadsApproved: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    followers: 0,
    downloadsPending: 0,
    downloadsApproved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [{ count: projects }, { count: followers }, { count: downloadsPending }, { count: downloadsApproved }] =
          await Promise.all([
            supabase.from("projects").select("*", { count: "exact" }),
            supabase.from("follows").select("*", { count: "exact" }),
            supabase.from("downloads").select("*", { count: "exact" }).eq("status", "pending"),
            supabase.from("downloads").select("*", { count: "exact" }).eq("status", "approved"),
          ]);

        setStats({
          projects: projects ?? 0,
          followers: followers ?? 0,
          downloadsPending: downloadsPending ?? 0,
          downloadsApproved: downloadsApproved ?? 0,
        });

        setLoading(false);
      } catch (err: any) {
        toast.error("Gagal ambil statistik: " + err.message);
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard Admin</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center gap-3">
            <Folder className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.projects}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center gap-3">
            <Users className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            <CardTitle>Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.followers}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center gap-3">
            <Download className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            <CardTitle>Downloads Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.downloadsPending}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center gap-3">
            <Download className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            <CardTitle>Downloads Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.downloadsApproved}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
