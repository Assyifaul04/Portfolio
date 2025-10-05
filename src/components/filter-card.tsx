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
  category: string;
  status: string;
  sortBy: string;
}

export default function FilterCard({ onFilterChange }: FilterCardProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
    sortBy: "newest",
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
        {/* Type/Category */}
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm">
            <span className="text-slate-700 dark:text-slate-300">Type: </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Language/Status */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm">
            <span className="text-slate-700 dark:text-slate-300">Status: </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm">
            <span className="text-slate-700 dark:text-slate-300">Sort: </span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
          </SelectContent>
        </Select>

        {/* New Button */}
        <Button 
          size="sm" 
          className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <span className="text-lg leading-none">+</span>
          New
        </Button>
      </div>
    </div>
  );
}