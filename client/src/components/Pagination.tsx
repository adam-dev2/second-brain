import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  itemLabel?: string; // e.g. "cards", "sections" — defaults to "items"
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Build page number windows: always show first, last, current ± 1
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    pages.push(1);

    if (range[0] > 2) pages.push("...");
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2">
      {/* Item count */}
      <p className="text-xs text-neutral-500 tabular-nums">
        Showing{" "}
        <span className="text-neutral-300 font-medium">{startItem}–{endItem}</span>{" "}
        of{" "}
        <span className="text-neutral-300 font-medium">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          aria-label="First page"
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Prev page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 text-center text-xs text-neutral-600 select-none"
              >
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                className={`w-8 h-8 text-xs rounded-md font-medium transition-all duration-150 ${
                  page === currentPage
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronRight size={15} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          aria-label="Last page"
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;