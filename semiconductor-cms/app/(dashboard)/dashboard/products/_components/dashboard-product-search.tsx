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
import { useState, useEffect } from "react";

interface DashboardProductSearchProps {
  categories: string[];
}

export function DashboardProductSearch({ categories }: DashboardProductSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (search === currentSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, searchParams, pathname, replace]);

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
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="搜索产品名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white"
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          defaultValue={searchParams.get("category") || "all"}
          onValueChange={handleCategoryChange}
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
