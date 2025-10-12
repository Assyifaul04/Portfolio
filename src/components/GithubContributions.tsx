"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
};

type Repository = {
  name: string;
  owner: string;
  contributions: number;
};

type ContributionStats = {
  commits: number;
  issues: number;
  pullRequests: number;
  codeReview: number;
};

type ContributionsData = {
  calendar: ContributionCalendar;
  repositories: Repository[];
  stats: ContributionStats;
};

export default function GithubContributions() {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<ContributionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showSettings, setShowSettings] = useState(false);

  // Generate years array (current year and 4 years back)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    async function fetchContributions() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/github/contributions?year=${selectedYear}`);
       
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengambil data kontribusi.");
        }
        
        const apiData = await response.json();
       
        const contributionCollection = apiData?.data?.user?.contributionsCollection;
        if (!contributionCollection) {
          throw new Error("Struktur data dari API tidak valid.");
        }

        // Extract repositories
        const repos: Repository[] = contributionCollection.commitContributionsByRepository
          ?.slice(0, 3)
          .map((item: any) => ({
            name: item.repository.name,
            owner: item.repository.owner.login,
            contributions: item.contributions.totalCount
          })) || [];

        // Extract stats
        const stats: ContributionStats = {
          commits: contributionCollection.totalCommitContributions || 0,
          issues: contributionCollection.totalIssueContributions || 0,
          pullRequests: contributionCollection.totalPullRequestContributions || 0,
          codeReview: contributionCollection.totalPullRequestReviewContributions || 0,
        };

        setData({
          calendar: contributionCollection.contributionCalendar,
          repositories: repos,
          stats
        });
        
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchContributions();
  }, [selectedYear]);

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-slate-600 dark:text-slate-400">
              Loading GitHub activity...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="py-8">
          <div className="text-red-600 dark:text-red-400">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }
 
  if (!data || !data.calendar) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="py-8">
          <div className="text-slate-600 dark:text-slate-400">
            Data kontribusi tidak ditemukan.
          </div>
        </CardContent>
      </Card>
    );
  }

  const { calendar, repositories, stats } = data;
  const days = calendar.weeks.flatMap((week) => week.contributionDays);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get month labels
  const monthLabels: { month: string; col: number }[] = [];
  let lastMonth = -1;
  calendar.weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const date = new Date(firstDay.date);
      const currentMonth = date.getMonth();
      if (currentMonth !== lastMonth) {
        monthLabels.push({ month: months[currentMonth], col: weekIndex });
        lastMonth = currentMonth;
      }
    }
  });

  // Calculate contribution levels
  const maxContributions = Math.max(...days.map(d => d.contributionCount), 1);
  const getContributionLevel = (count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800";
    const percentage = count / maxContributions;
    if (percentage < 0.25) return "bg-green-300 dark:bg-green-900";
    if (percentage < 0.5) return "bg-green-400 dark:bg-green-700";
    if (percentage < 0.75) return "bg-green-500 dark:bg-green-600";
    return "bg-green-600 dark:bg-green-500";
  };

  const dayLabels = ["Mon", "Wed", "Fri"];

  // Calculate stats percentages
  const totalActivity = stats.commits + stats.issues + stats.pullRequests + stats.codeReview;
  const getPercentage = (value: number) => totalActivity > 0 ? (value / totalActivity) * 100 : 0;

  const statsData = [
    { label: "Commits", value: stats.commits, percentage: getPercentage(stats.commits), color: "bg-green-500" },
    { label: "Pull requests", value: stats.pullRequests, percentage: getPercentage(stats.pullRequests), color: "bg-blue-500" },
    { label: "Code review", value: stats.codeReview, percentage: getPercentage(stats.codeReview), color: "bg-purple-500" },
    { label: "Issues", value: stats.issues, percentage: getPercentage(stats.issues), color: "bg-orange-500" },
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              {calendar.totalContributions} contributions in {selectedYear === currentYear ? 'the last year' : selectedYear}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contribution settings
            </Button>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-20 h-7 text-xs bg-blue-600 text-white border-0 hover:bg-blue-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {showSettings && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Contribution settings: Activity overview, Private contributions visibility, and more.
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Contribution Graph */}
        <div className="mb-6">
          <div className="relative">
            {/* Month labels */}
            <div className="flex mb-2 ml-8">
              {monthLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-xs text-slate-600 dark:text-slate-400"
                  style={{ 
                    position: 'absolute',
                    left: `${label.col * 13 + 32}px`
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>
            
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 mr-2">
                <div className="h-3"></div>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-3 flex items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400 w-6">
                      {i === 1 ? "Mon" : i === 3 ? "Wed" : i === 5 ? "Fri" : ""}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Contribution grid */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {calendar.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.contributionDays.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        title={`${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}: ${day.contributionCount} contributions`}
                        className={`w-3 h-3 rounded-sm border border-slate-200 dark:border-slate-900 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer hover:scale-110 ${getContributionLevel(day.contributionCount)}`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <a href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
                Learn how we count contributions
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-900 border border-slate-200 dark:border-slate-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700 border border-slate-200 dark:border-slate-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600 border border-slate-200 dark:border-slate-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500 border border-slate-200 dark:border-slate-900"></div>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">More</span>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Activity overview
          </h3>
          
          <div className="space-y-4">
            {/* Contributed repositories */}
            {repositories.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-0.5 text-slate-600 dark:text-slate-400 flex-shrink-0">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-900 dark:text-slate-100">
                    Contributed to{" "}
                    {repositories.map((repo, index) => (
                      <span key={index}>
                        <a 
                          href={`https://github.com/${repo.owner}/${repo.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {repo.owner}/{repo.name}
                        </a>
                        {index < repositories.length - 2 && ", "}
                        {index === repositories.length - 2 && " and "}
                      </span>
                    ))}
                    {repositories.length > 3 && (
                      <span className="text-slate-600 dark:text-slate-400">
                        {" "}and {repositories.length - 3} other {repositories.length - 3 === 1 ? 'repository' : 'repositories'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contribution stats visualization */}
            {totalActivity > 0 && (
              <div className="space-y-3">
                {statsData.map((stat, index) => (
                  stat.value > 0 && (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">{stat.label}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{stat.value}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
            
            {totalActivity === 0 && (
              <div className="text-sm text-slate-600 dark:text-slate-400 py-4 text-center">
                No contributions recorded for this period.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}