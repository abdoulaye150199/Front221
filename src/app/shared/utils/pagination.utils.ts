export interface PaginationState {
  page: number;
  pageSize: number;
  totalResults: number;
}

export interface PaginationConfig {
  pageSizeOptions?: number[];
}

export function calculateTotalPages(totalResults: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalResults / pageSize));
}

export function calculateCurrentPage(page: number, totalPages: number): number {
  return Math.min(page, totalPages);
}

export function calculateStartIndex(totalResults: number, currentPage: number, pageSize: number): number {
  if (totalResults === 0) return 0;
  return (currentPage - 1) * pageSize + 1;
}

export function calculateEndIndex(currentPage: number, pageSize: number, totalResults: number): number {
  if (totalResults === 0) return 0;
  return Math.min(currentPage * pageSize, totalResults);
}

export function canGoPrev(currentPage: number): boolean {
  return currentPage > 1;
}

export function canGoNext(currentPage: number, totalPages: number): boolean {
  return currentPage < totalPages;
}

export function generatePageNumbers(totalPages: number): number[] {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}
