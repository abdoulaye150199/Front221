import { signal } from '@angular/core';

export interface PaginatedState<T> {
  items: T[];
  page: number;
  pageSize: number;
  editingItemId: string | null;
  openActionId: string | null;
}

export class PaginatedFormState<TItem, TForm = never> {
  items: TItem[] = [];
  page = signal(1);
  pageSize: number;
  editingItemId: string | null = null;
  openActionId: string | null = null;
  form: TForm;
  private readonly createForm: (() => TForm) | null;

  constructor(pageSize: number = 5, createForm?: () => TForm) {
    this.pageSize = pageSize;
    this.createForm = createForm ?? null;
    this.form = createForm ? createForm() : (undefined as TForm);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.items.length / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page(), this.totalPages);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get canPrev(): boolean {
    return this.currentPage > 1;
  }

  get canNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get pagedItems(): TItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page.set(page);
    }
  }

  previousPage(): void {
    if (this.canPrev) {
      this.page.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.canNext) {
      this.page.update((p) => p + 1);
    }
  }

  setPageSize(value: string | number): void {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && pageSize > 0) {
      this.pageSize = pageSize;
      this.page.set(1);
    }
  }

  startEditing(itemId: string, form?: TForm): void {
    this.editingItemId = itemId;
    this.openActionId = null;
    if (form !== undefined) {
      this.form = form;
    }
  }

  stopEditing(resetForm: boolean = false): void {
    this.editingItemId = null;
    if (resetForm) {
      this.resetForm();
    }
  }

  toggleActionMenu(itemId: string): void {
    this.openActionId = this.openActionId === itemId ? null : itemId;
  }

  closeActionMenu(): void {
    this.openActionId = null;
  }

  setItems(items: TItem[]): void {
    this.items = items;
    if (this.page() > this.totalPages) {
      this.page.set(this.totalPages);
    }
  }

  setForm(form: TForm): void {
    this.form = form;
  }

  patchForm(patch: Partial<TForm>): void {
    this.form = { ...(this.form as object), ...(patch as object) } as TForm;
  }

  resetForm(): void {
    if (this.createForm) {
      this.form = this.createForm();
    }
  }

  reset(): void {
    this.page.set(1);
    this.editingItemId = null;
    this.openActionId = null;
    this.resetForm();
  }
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  pages: number[];
}

export function calculateTotalPages(totalResults: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalResults / pageSize));
}

export function calculateStartIndex(
  totalResults: number,
  currentPage: number,
  pageSize: number,
): number {
  if (totalResults === 0) return 0;
  return (currentPage - 1) * pageSize + 1;
}

export function calculateEndIndex(
  currentPage: number,
  pageSize: number,
  totalResults: number,
): number {
  if (totalResults === 0) return 0;
  return Math.min(currentPage * pageSize, totalResults);
}

export function createPaginationHandler(
  getTotalResults: () => number,
  getPageSize: () => number,
  getCurrentPage: () => number,
  setCurrentPage: (page: number) => void,
) {
  return {
    get totalPages(): number {
      return calculateTotalPages(getTotalResults(), getPageSize());
    },
    get canPrev(): boolean {
      return getCurrentPage() > 1;
    },
    get canNext(): boolean {
      return getCurrentPage() < this.totalPages;
    },
    previousPage(): void {
      if (this.canPrev) {
        setCurrentPage(getCurrentPage() - 1);
      }
    },
    nextPage(): void {
      if (this.canNext) {
        setCurrentPage(getCurrentPage() + 1);
      }
    },
    setPage(page: number): void {
      const totalPages = this.totalPages;
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
  };
}
