"use client";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleGoogleSignIn = () => {
    setIsLoading(true);

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "/api/auth/signin/google?callbackUrl=/auth/callback",
      "googleLogin",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data === "auth-success") {
        setIsLoading(false);
        popup?.close();
        // refresh session atau redirect ke homepage
        window.location.href = "/"; // bisa ganti router.push("/") jika pakai next/navigation
      }
    };

    window.addEventListener("message", handleMessage, { once: true });
  };

  const handleEmailSignIn = () => {
    alert(`Login dengan email: ${email}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <h1 className="text-4xl font-serif font-bold text-center text-slate-900 dark:text-slate-100">
        Selamat Datang! <br />
        Di Profile Izza
      </h1>
      <p className="text-center text-slate-600 dark:text-slate-400 mt-2 mb-10">
        Silahkan login
      </p>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg w-full max-w-md p-8 border border-slate-200 dark:border-slate-800">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex items-center justify-center w-full gap-3 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? "Memuat..." : "Lanjutkan dengan Google"}
        </button>

        <div className="flex items-center my-4">
          <span className="flex-grow h-px bg-slate-300 dark:bg-slate-700"></span>
          <span className="px-2 text-slate-500 dark:text-slate-400 text-sm">
            ATAU
          </span>
          <span className="flex-grow h-px bg-slate-300 dark:bg-slate-700"></span>
        </div>

        <input
          type="email"
          placeholder="Masukkan email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg mb-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
        <button
          onClick={handleEmailSignIn}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all"
        >
          Lanjutkan dengan email
        </button>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
          Dengan melanjutkan, Anda mengakui{" "}
          <a href="#" className="underline">
            Kebijakan Privasi
          </a>
        </p>
      </div>
    </div>
  );
}
