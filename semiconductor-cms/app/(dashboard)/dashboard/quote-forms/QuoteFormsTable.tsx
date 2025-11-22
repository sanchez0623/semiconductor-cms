"use client";

import { useState, useEffect } from "react";
import { Pagination } from "../_components/Pagination";
import { LoadingSpinner } from "../_components/LoadingSpinner";
import { ErrorMessage } from "../_components/ErrorMessage";

interface QuoteForm {
  id: string;
  name: string;
  email: string;
  company?: string;
  product_id?: string;
  details?: string;
  created_at: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function QuoteFormsTable() {
  const [data, setData] = useState<QuoteForm[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/quote-forms?page=${page}&pageSize=${pagination.pageSize}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quote forms");
      }

      const result = await response.json();
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  if (isLoading && data.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && data.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchData(1)} />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No quote forms found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((form) => (
              <tr
                key={form.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {form.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {form.email}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {form.company || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {form.product_id || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                  {form.details || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(form.created_at).toLocaleString("zh-CN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
