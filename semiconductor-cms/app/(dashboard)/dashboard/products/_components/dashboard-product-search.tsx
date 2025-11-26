"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProductSearchProps {
  categories: string[];
}

export function DashboardProductSearch({ categories }: DashboardProductSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 max-w-sm flex gap-2 relative">
        <div className="relative flex-1">
          <Input
            placeholder="搜索产品名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-white pr-10"
          />
          {search && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button 
          onClick={handleSearch} 
          variant="secondary"
          disabled={isPending}
          className="min-w-[3rem]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>
      <div className="w-full sm:w-48">
        <Select
          defaultValue={searchParams.get("category") || "all"}
          onValueChange={handleCategoryChange}
          disabled={isPending}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
