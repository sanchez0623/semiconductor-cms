"use client";

import { useState, useEffect } from "react";
import { Pagination } from "../_components/Pagination";
import { LoadingSpinner } from "../_components/LoadingSpinner";
import { ErrorMessage } from "../_components/ErrorMessage";

interface ContactForm {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
  handled?: boolean;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function ContactFormsTable() {
  const [data, setData] = useState<ContactForm[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "handled" | "unhandled">("all");

  const fetchData = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = `/api/contact-forms?page=${page}&pageSize=${pagination.pageSize}`;
      if (filter === "handled") {
        url += "&handled=true";
      } else if (filter === "unhandled") {
        url += "&handled=false";
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch contact forms");
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
  }, [filter]);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as "all" | "handled" | "unhandled");
  };

  const handleMarkAsHandled = async (id: string) => {
    if (!confirm("确定要将此条目标记为已处理吗？")) {
      return;
    }

    setProcessingId(id);
    try {
      const response = await fetch("/api/contact-forms", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, handled: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, handled: true } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="block w-40 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        >
          <option value="all">全部</option>
          <option value="unhandled">未处理</option>
          <option value="handled">已处理</option>
        </select>
      </div>

      {isLoading && data.length === 0 ? (
        <LoadingSpinner />
      ) : error && data.length === 0 ? (
        <ErrorMessage message={error} onRetry={() => fetchData(1)} />
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
          No contact forms found
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Message
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {form.handled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已处理
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          未处理
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!form.handled && (
                        <button
                          onClick={() => handleMarkAsHandled(form.id)}
                          disabled={processingId === form.id}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
                        >
                          {processingId === form.id ? "处理中..." : "处理"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {form.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {form.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {form.subject || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate" title={form.message}>
                      {form.message}
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
      )}
    </div>
  );
}
