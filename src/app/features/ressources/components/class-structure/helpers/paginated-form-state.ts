/**
 * Generic helper to manage pagination and form state for a collection of items
 */
export class PaginatedFormState<T> {
  items: T[] = [];
  page = 1;
  pageSize: number;

  openActionId: string | null = null;
  editingItemId: string | null = null;

  constructor(defaultPageSize: number) {
    this.pageSize = defaultPageSize;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.items.length / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedItems(): T[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get canPrev(): boolean {
    return this.currentPage > 1;
  }

  get canNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
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

  setPageSize(value: string): void {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && pageSize > 0) {
      this.pageSize = pageSize;
      this.page = 1;
    }
  }

  toggleActionMenu(itemId: string): void {
    this.openActionId = this.openActionId === itemId ? null : itemId;
  }

  closeActionMenu(): void {
    this.openActionId = null;
  }

  startEditing(itemId: string): void {
    this.editingItemId = itemId;
    this.closeActionMenu();
  }

  stopEditing(): void {
    this.editingItemId = null;
  }

  isEditing(itemId: string): boolean {
    return this.editingItemId === itemId;
  }

  reset(): void {
    this.page = 1;
    this.stopEditing();
    this.closeActionMenu();
  }
}
