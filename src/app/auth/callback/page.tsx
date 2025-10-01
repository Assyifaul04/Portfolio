"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Jika dibuka dalam popup (window.opener tersedia)
    if (typeof window !== "undefined" && window.opener) {
      window.opener.postMessage("auth-success", window.location.origin);
      window.close();
      return;
    }

    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if ((session.user as any).role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Overlay blur background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800 opacity-50"></div>
      
      {/* Modal Card */}
      <div className="relative z-10 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md mx-4">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-block p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
            <svg
              className="w-12 h-12 text-slate-700 dark:text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24" 
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Memverifikasi Akun
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Mohon tunggu sebentar...
          </p>

          {/* Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-slate-700 dark:border-slate-300 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>

          {/* Progress indicator */}
          {/* <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-pulse delay-150"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
