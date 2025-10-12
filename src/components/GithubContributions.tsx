// Lokasi: contoh: components/GithubContributions.tsx

"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Sesuaikan path jika perlu

// Definisikan tipe data untuk keamanan dan auto-complete
type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string; // GitHub API menyediakan warna, lebih baik pakai ini
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
};

export default function GithubContributions() {
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch("/api/github/contributions");
        
        // 1. Cek jika respon dari API route kita tidak sukses
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengambil data kontribusi.");
        }

        const data = await response.json();
        
        // 2. Pastikan data yang diterima sesuai struktur yang diharapkan
        const contributionData = data?.data?.user?.contributionsCollection?.contributionCalendar;
        if (!contributionData) {
            throw new Error("Struktur data dari API tidak valid.");
        }

        setCalendar(contributionData);

      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, []);

  if (isLoading) {
    return <div>Loading GitHub activity...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!calendar) {
    return <div>Data kontribusi tidak ditemukan.</div>
  }

  const days = calendar.weeks.flatMap((week) => week.contributionDays);

  return (
    <Card className="border-slate-300 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-base">GitHub Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-1 overflow-x-auto pb-2">
          {days.map((day, i) => (
            <div
              key={i}
              title={`${day.date} – ${day.contributionCount} contributions`}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: day.color }}
            ></div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Total: {calendar.totalContributions} contributions this year.
        </p>
      </CardContent>
    </Card>
  );
}