"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Users, Mail, Calendar, Shield } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    email: "",
    name: "",
    role: "user",
    avatar_url: "",
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch data users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      showToast("Error loading users", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Create or Update
  const handleSave = async () => {
    try {
      const method = editingUser ? "PATCH" : "POST";
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menyimpan user");

      showToast(editingUser ? "User updated!" : "User created!", "success");
      setOpenDialog(false);
      setEditingUser(null);
      setForm({ email: "", name: "", role: "user", avatar_url: "" });
      fetchUsers();
    } catch (err) {
      showToast("Error menyimpan user", "error");
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus user ini?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus user");
      showToast("User deleted!", "success");
      fetchUsers();
    } catch {
      showToast("Error hapus user", "error");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor user accounts</p>
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                onClick={() => {
                  setEditingUser(null);
                  setForm({ email: "", name: "", role: "user", avatar_url: "" });
                }}
              >
                <Plus className="mr-2 h-5 w-5" /> Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingUser ? "Edit User" : "Create New User"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="font-medium">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={form.email}
                    disabled={!!editingUser}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {editingUser && (
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">
                    <Users className="inline h-4 w-4 mr-1" />
                    Full Name
                  </Label>
                  <Input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Role
                  </Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">Avatar URL</Label>
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    value={form.avatar_url}
                    onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  />
                </div>
                
                <Button 
                  onClick={handleSave} 
                  className="w-full"
                  size="lg"
                >
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl font-bold">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Admins</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {users.filter(u => u.role === 'admin').length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Regular Users</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {users.filter(u => u.role === 'user').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A list of all users in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-semibold text-sm">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-semibold text-sm">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-semibold text-sm">Role</th>
                      <th className="h-12 px-4 text-left align-middle font-semibold text-sm">Joined</th>
                      <th className="h-12 px-4 text-center align-middle font-semibold text-sm w-[120px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="h-24 text-center text-muted-foreground">
                          Loading...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="h-24 text-center py-8">
                          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground font-medium">No users found</p>
                          <p className="text-muted-foreground text-sm">Get started by creating a new user</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                {u.avatar_url ? (
                                  <img src={u.avatar_url} alt={u.name || ''} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                  <span className="text-xs font-semibold">
                                    {u.email.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              {u.email}
                            </div>
                          </td>
                          <td className="p-4 align-middle">{u.name || '-'}</td>
                          <td className="p-4 align-middle">
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                              {u.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                              {u.role}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(u.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingUser(u);
                                  setForm({
                                    email: u.email,
                                    name: u.name ?? "",
                                    role: u.role,
                                    avatar_url: u.avatar_url ?? "",
                                  });
                                  setOpenDialog(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(u.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}