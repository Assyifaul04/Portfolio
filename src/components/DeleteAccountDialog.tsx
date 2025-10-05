"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  userEmail,
}: DeleteAccountDialogProps) {
  // Generate kode saat dialog dibuka
  const [deleteCode] = useState(() => 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15)
  );
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!inputCode.trim()) {
      setError("Masukkan kode terlebih dahulu");
      return;
    }

    // Validasi kode
    if (inputCode.trim() !== deleteCode) {
      setError("Kode tidak valid. Pastikan Anda copy paste dengan benar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/delete-code", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleteCode,
          providedCode: inputCode.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus akun");
      }

      // Logout dan redirect
      await signOut({ callbackUrl: "/auth/login" });
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInputCode("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Delete account
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Warning Box */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              This will permanently delete the{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {userEmail || "account"}
              </span>{" "}
              and remove all of its data from our servers.
            </p>
          </div>

          {/* Code Verification */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Verification code
              </Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please type{" "}
                <code className="relative rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {deleteCode}
                </code>{" "}
                to confirm
              </p>
            </div>
            
            <Input
              placeholder="Enter verification code"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                setError("");
              }}
              className={`h-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                error 
                  ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500 dark:focus-visible:ring-red-500" 
                  : "border-slate-300 dark:border-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600"
              }`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={loading || !inputCode.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete account"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}