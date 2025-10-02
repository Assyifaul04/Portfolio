"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Jika dibuka dalam popup
    if (typeof window !== "undefined" && window.opener) {
      window.opener.postMessage("auth-success", window.location.origin);
      window.close();
      return;
    }

    // Jika bukan popup, jalankan redirect normal
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    router.push((session.user as any).role === "admin" ? "/dashboard" : "/");
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="mb-8">
          <svg className="w-20 h-20 mx-auto" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
            />
            <defs>
              <clipPath id="clip">
                <path
                  fill="#4285F4"
                  d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                />
              </clipPath>
            </defs>
            <g clipPath="url(#clip)">
              <path fill="#FBBC05" d="M0 37V11l17 13z" />
              <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
              <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
              <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
            </g>
          </svg>
        </div>

        <div className="relative inline-block">
          <svg className="w-16 h-16 animate-spin" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              strokeWidth="4"
              stroke="#e5e7eb"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              strokeWidth="4"
              stroke="#4285F4"
              strokeDasharray="31.4 94.2"
              strokeLinecap="round"
              style={{
                animation: "colorRotate 2s linear infinite",
              }}
            />
          </svg>
          <style jsx>{`
            @keyframes colorRotate {
              0% {
                stroke: #4285f4;
              }
              25% {
                stroke: #ea4335;
              }
              50% {
                stroke: #fbbc05;
              }
              75% {
                stroke: #34a853;
              }
              100% {
                stroke: #4285f4;
              }
            }
          `}</style>
        </div>

        <p className="mt-8 text-slate-600 text-lg">Memverifikasi Akun</p>
        <p className="mt-2 text-slate-400 text-sm">Mohon tunggu sebentar...</p>
      </div>
    </div>
  );
}
