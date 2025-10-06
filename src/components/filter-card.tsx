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
import { Search, X } from "lucide-react";
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

  const clearSearch = () => {
    handleFilterChange("search", "");
  };

  const hasActiveFilters = filters.type !== "All" || filters.language !== "All" || filters.search !== "";

  const clearAllFilters = () => {
    const resetFilters = {
      search: "",
      type: "All",
      language: "All",
      sortBy: "Last updated",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
        <Input
          placeholder="Find a repository..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-9 pr-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 h-10 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
        />
        {filters.search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Left: Type and Language Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Type Filter */}
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger className="w-auto min-w-[130px] h-8 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 dark:text-slate-400">Type:</span>
                <SelectValue className="text-slate-900 dark:text-slate-100" />
              </div>
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
            <SelectTrigger className="w-auto min-w-[130px] h-8 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 dark:text-slate-400">Language:</span>
                <SelectValue className="text-slate-900 dark:text-slate-100" />
              </div>
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
              <SelectItem value="Go">Go</SelectItem>
              <SelectItem value="Rust">Rust</SelectItem>
              <SelectItem value="Next.js">Next.js</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Right: Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-auto min-w-[150px] h-8 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-900">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 dark:text-slate-400">Sort:</span>
              <SelectValue className="text-slate-900 dark:text-slate-100" />
            </div>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="Last updated">Last updated</SelectItem>
            <SelectItem value="Name">Name</SelectItem>
            <SelectItem value="Stars">Stars</SelectItem>
            <SelectItem value="Recently created">Recently created</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Search: "{filters.search}"
                <button
                  onClick={clearSearch}
                  className="hover:text-blue-900 dark:hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.type !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Type: {filters.type}
                <button
                  onClick={() => handleFilterChange("type", "All")}
                  className="hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.language !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Language: {filters.language}
                <button
                  onClick={() => handleFilterChange("language", "All")}
                  className="hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}