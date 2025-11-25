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

  const fetchData = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/contact-forms?page=${page}&pageSize=${pagination.pageSize}`
      );

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
  }, []);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleMarkAsHandled = async (id: string) => {
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

  if (isLoading && data.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && data.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchData(1)} />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No contact forms found
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
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
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
                  {form.subject || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                  {form.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(form.created_at).toLocaleString("zh-CN")}
                </td>
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!form.handled && (
                    <button
                      onClick={() => handleMarkAsHandled(form.id)}
                      disabled={processingId === form.id}
                      className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    >
                      {processingId === form.id ? "处理中..." : "处理"}
                    </button>
                  )}
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
