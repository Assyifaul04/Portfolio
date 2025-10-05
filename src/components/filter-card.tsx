// components/filter-card.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

interface FilterCardProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  type: string;
  language: string;
  sortBy: string;
}

export default function FilterCard({ onFilterChange }: FilterCardProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "All",
    language: "All",
    sortBy: "Last updated",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Find a repository..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 h-9 text-sm"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Type Filter */}
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-[150px] h-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm">
            <span className="text-slate-700 dark:text-slate-300">Type: </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Publik">Public</SelectItem>
            <SelectItem value="Pribadi">Private</SelectItem>
            <SelectItem value="Sumber">Source</SelectItem>
            <SelectItem value="Diarsipkan">Archived</SelectItem>
            <SelectItem value="Dapat disponsori">Can be sponsored</SelectItem>
            <SelectItem value="Templat">Template</SelectItem>
          </SelectContent>
        </Select>

        {/* Language Filter */}
        <Select
          value={filters.language}
          onValueChange={(value) => handleFilterChange("language", value)}
        >
          <SelectTrigger className="w-[150px] h-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm">
            <span className="text-slate-700 dark:text-slate-300">Language: </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="TypeScript">TypeScript</SelectItem>
            <SelectItem value="JavaScript">JavaScript</SelectItem>
            <SelectItem value="Python">Python</SelectItem>
            <SelectItem value="Java">Java</SelectItem>
            <SelectItem value="Dart">Dart</SelectItem>
            <SelectItem value="PHP">PHP</SelectItem>
            <SelectItem value="Blade">Blade</SelectItem>
            <SelectItem value="C++">C++</SelectItem>
            <SelectItem value="HTML">HTML</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-[150px] h-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm">
            <span className="text-slate-700 dark:text-slate-300">Sort: </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Last updated">Last updated</SelectItem>
            <SelectItem value="Name">Name</SelectItem>
            <SelectItem value="Stars">Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}