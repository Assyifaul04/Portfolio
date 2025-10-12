"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GithubContributions() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/github/contributions")
      .then((res) => res.json())
      .then((data) => setData(data.data.user.contributionsCollection.contributionCalendar));
  }, []);

  if (!data) return <div>Loading GitHub activity...</div>;

  const days = data.weeks.flatMap((week: any) => week.contributionDays);

  return (
    <Card className="border-slate-300 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-base">GitHub Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-[2px] overflow-x-auto">
          {days.map((day: any, i: number) => (
            <div
              key={i}
              title={`${day.date} – ${day.contributionCount} contributions`}
              className={`w-3 h-3 rounded-sm ${
                day.contributionCount === 0
                  ? "bg-slate-200 dark:bg-slate-700"
                  : day.contributionCount < 3
                  ? "bg-green-200"
                  : day.contributionCount < 6
                  ? "bg-green-400"
                  : "bg-green-600"
              }`}
            ></div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Total: {data.totalContributions} contributions this year.
        </p>
      </CardContent>
    </Card>
  );
}
