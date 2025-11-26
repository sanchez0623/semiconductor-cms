import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const t = useTranslations('Common');
  const [inputPage, setInputPage] = useState("");

  const handleGoToPage = () => {
    const page = parseInt(inputPage, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setInputPage("");
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
      {/* Page Info */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        {t('pageInfo', { current: currentPage, total: totalPages })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="dark:border-slate-700 dark:text-slate-300"
        >
          {t('previous')}
        </Button>

        {/* Page Input */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={totalPages}
            placeholder={t('pagePlaceholder')}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyPress={handleInputKeyPress}
            disabled={isLoading}
            className="w-20 h-9 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToPage}
            disabled={!inputPage || isLoading}
            className="dark:border-slate-700 dark:text-slate-300"
          >
            {t('go')}
          </Button>
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="dark:border-slate-700 dark:text-slate-300"
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
