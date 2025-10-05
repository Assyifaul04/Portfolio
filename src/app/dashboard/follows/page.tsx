"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, Activity, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

interface Follow {
  id: string;
  platform: string;
  is_followed: boolean;
  users?: {
    name?: string;
    email?: string;
  };
  created_at?: string;
}

export default function FollowsDashboardPage() {
  const [follows, setFollows] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFollows = () => {
    setLoading(true);
    fetch("/api/follows")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setFollows(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFollows();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/follows/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete follow");
      }

      toast.success("Follow deleted successfully");
      fetchFollows();
    } catch (error) {
      toast.error("Failed to delete follow");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const stats = Object.entries(
    follows.reduce((acc: Record<string, number>, curr) => {
      const platform = curr.platform || "Unknown";
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {})
  ).map(([platform, total]) => ({ platform, total }));

  const totalFollows = follows.length;
  const activeFollows = follows.filter(f => f.is_followed).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Follows Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor and analyze social media follows across platforms
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Follows
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalFollows}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Active Follows
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {activeFollows}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Platforms
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Platform Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : stats.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 dark:text-slate-400">No data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#cbd5e1" 
                    className="dark:stroke-slate-800"
                  />
                  <XAxis 
                    dataKey="platform" 
                    tick={{ fill: "#64748b" }}
                    className="dark:fill-slate-400"
                  />
                  <YAxis 
                    tick={{ fill: "#64748b" }}
                    className="dark:fill-slate-400"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={{ fill: "#f1f5f9" }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#3b82f6" 
                    radius={[8, 8, 0, 0]}
                    className="dark:fill-blue-500"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Follows List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : follows.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  No follows data yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Follow data will appear here once users interact with your platform
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                        Platform
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                        User
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                        Date
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {follows.map((item) => (
                      <TableRow 
                        key={item.id}
                        className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                          {item.platform}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">
                          {item.users?.name || "-"}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {item.users?.email || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              item.is_followed
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                            }
                          >
                            {item.is_followed ? "Followed" : "Unfollowed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                disabled={deletingId === item.id}
                              >
                                {deletingId === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-900 dark:text-slate-100">
                                  Delete Follow Record
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                  Are you sure you want to delete this follow record for{" "}
                                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {item.users?.name || item.users?.email}
                                  </span>{" "}
                                  on <span className="font-semibold capitalize">{item.platform}</span>? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-slate-200 dark:border-slate-800">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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