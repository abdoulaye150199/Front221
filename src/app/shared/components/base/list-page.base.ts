import { parseAllowedNumberOption } from '../../validation';
import { calculateTotalPages, calculateStartIndex, calculateEndIndex } from '../../utils';

export abstract class ListPageBase<T> {
  searchTerm = '';
  page = 1;
  pageSize = 10;

  protected abstract getFilteredItems(): T[];

  get totalResults(): number {
    return this.getFilteredItems().length;
  }

  get totalPages(): number {
    return calculateTotalPages(this.totalResults, this.pageSize);
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedItems(): T[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.getFilteredItems().slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    return calculateStartIndex(this.totalResults, this.currentPage, this.pageSize);
  }

  get endIndex(): number {
    return calculateEndIndex(this.currentPage, this.pageSize, this.totalResults);
  }

  get canPrev(): boolean {
    return this.currentPage > 1;
  }

  get canNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.page = 1;
  }

  onPageSizeChange(value: string, validOptions: number[]): void {
    const pageSize = parseAllowedNumberOption(value, validOptions);
    if (pageSize === null) {
      return;
    }
    this.pageSize = pageSize;
    this.page = 1;
  }

  previousPage(): void {
    if (this.canPrev) {
      this.page -= 1;
    }
  }

  nextPage(): void {
    if (this.canNext) {
      this.page += 1;
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
