"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface DashboardStatsData {
  newsCount: number;
  productsCount: number;
  unreadContactForms: number;
  unhandledQuoteForms: number;
}

export function DashboardStats() {
  const t = useTranslations('Dashboard');
  const [data, setData] = useState<DashboardStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
        {t('failedToLoadStats', { error })}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label={t('newsCount')}
        value={data?.newsCount}
        isLoading={isLoading}
      />
      <StatCard
        label={t('productsCount')}
        value={data?.productsCount}
        isLoading={isLoading}
      />
      <StatCard
        label={t('unreadContactForms')}
        value={data?.unreadContactForms}
        isLoading={isLoading}
        highlight={data?.unreadContactForms ? data.unreadContactForms > 0 : false}
      />
      <StatCard
        label={t('unhandledQuoteForms')}
        value={data?.unhandledQuoteForms}
        isLoading={isLoading}
        highlight={data?.unhandledQuoteForms ? data.unhandledQuoteForms > 0 : false}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  isLoading,
  highlight = false,
}: {
  label: string;
  value?: number;
  isLoading: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm transition-all hover:shadow-md">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="mt-2">
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
        ) : (
          <p
            className={`text-2xl font-semibold ${
              highlight ? "text-indigo-600" : "text-slate-900"
            }`}
          >
            {value ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}
