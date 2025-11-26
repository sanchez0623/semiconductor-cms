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
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SiteProductSearchProps {
  categories: string[];
}

export function SiteProductSearch({ categories }: SiteProductSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
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
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
      <div className="flex-1 flex gap-2">
        <Input
          placeholder="搜索产品名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white/5 border-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
        />
        <Button 
          onClick={handleSearch}
          className="bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full sm:w-48">
        <Select
          defaultValue={searchParams.get("category") || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="bg-white/5 border-slate-800 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
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
