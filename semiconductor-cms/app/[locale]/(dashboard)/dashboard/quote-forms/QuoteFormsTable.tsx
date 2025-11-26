"use client";

import { useState, useEffect } from "react";
import { Pagination } from "../_components/Pagination";
import { LoadingSpinner } from "../_components/LoadingSpinner";
import { ErrorMessage } from "../_components/ErrorMessage";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTranslations, useLocale } from "next-intl";

interface QuoteForm {
  id: string;
  name: string;
  email: string;
  company?: string;
  product_id?: string;
  details?: string;
  created_at: string;
  handled?: boolean;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function QuoteFormsTable() {
  const t = useTranslations('QuoteForms');
  const locale = useLocale();
  const [data, setData] = useState<QuoteForm[]>([]);
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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  const fetchData = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = `/api/quote-forms?page=${page}&pageSize=${pagination.pageSize}`;
      if (filter === "handled") {
        url += "&handled=true";
      } else if (filter === "unhandled") {
        url += "&handled=false";
      }

      const response = await fetch(url);

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
  }, [filter]);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as "all" | "handled" | "unhandled");
  };

  const handleMarkAsHandled = (id: string) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmHandle = async () => {
    const id = confirmDialog.id;
    if (!id) return;

    setProcessingId(id);
    try {
      const response = await fetch("/api/quote-forms", {
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
      setConfirmDialog({ isOpen: false, id: null });
    } catch (err) {
      console.error("Error updating status:", err);
      alert(t('failedToUpdate'));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, id: null })}
        onConfirm={confirmHandle}
        title={t('confirmHandle')}
        description={t('confirmHandleDesc')}
        isLoading={!!processingId}
      />
      <div className="flex justify-end">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="block w-40 rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
        >
          <option value="all">{t('all')}</option>
          <option value="unhandled">{t('unhandled')}</option>
          <option value="handled">{t('handled')}</option>
        </select>
      </div>

      {isLoading && data.length === 0 ? (
        <LoadingSpinner />
      ) : error && data.length === 0 ? (
        <ErrorMessage message={error} onRetry={() => fetchData(1)} />
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 shadow-sm">
          {t('noForms')}
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 via-indigo-50 to-slate-50 border-b-2 border-indigo-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-24">
                    {t('status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-24">
                    {t('actions')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('name')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('email')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('company')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('productId')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('details')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('submitted')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((form) => (
                  <tr
                    key={form.id}
                    className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent transition-all duration-200 border-l-4 border-transparent hover:border-indigo-400"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {form.handled ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-green-100 text-green-700 shadow-sm">
                          {t('statusHandled')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 shadow-sm animate-pulse">
                          {t('statusUnhandled')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!form.handled && (
                        <button
                          onClick={() => handleMarkAsHandled(form.id)}
                          disabled={processingId === form.id}
                          className="relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                        >
                          {processingId === form.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t('processing')}
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {t('handle')}
                            </>
                          )}
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
                      {form.company || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {form.product_id || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate" title={form.details}>
                      {form.details || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(form.created_at).toLocaleString(locale === 'zh' ? "zh-CN" : "en-US")}
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
