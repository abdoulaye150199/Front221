import { Injectable } from '@angular/core';

export interface BaseEntity {
  id: string;
}

export interface CreateForm {}

export interface UpdateForm {}

@Injectable({ providedIn: 'root' })
export class CrudService<T extends BaseEntity, C extends CreateForm, U extends UpdateForm> {
  protected items: T[] = [];
  protected nextId: number = 1;

  constructor() {
    this.items = this.getInitialItems();
    this.nextId = this.items.length + 1;
  }

  protected getInitialItems(): T[] {
    return [];
  }

  getAll(): T[] {
    return [...this.items];
  }

  getById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  create(form: C): T {
    const newItem = this.enrichItem(form, this.generateId());
    this.items.unshift(newItem);
    this.nextId += 1;
    return newItem;
  }

  update(id: string, form: U): T | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.items[index] = this.updateItem(this.items[index], form);
    return this.items[index];
  }

  delete(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }

  protected generateId(): string {
    return `${this.nextId}`;
  }

  protected enrichItem(form: C, id: string): T {
    return { ...form, id } as unknown as T;
  }

  protected updateItem(item: T, form: U): T {
    return { ...item, ...form };
  }

  protected filterByCategory(items: T[], category: string, categoryField: keyof T = 'category' as keyof T): T[] {
    return items.filter(item => item[categoryField] === category);
  }

  protected getUniqueOptions(items: T[], field: keyof T, filter?: (item: T) => boolean): string[] {
    return [...new Set(
      items
        .filter(item => !filter || filter(item))
        .map(item => item[field] as string)
        .filter(Boolean)
    )];
  }
}

export function createCrudHandlers<T extends BaseEntity, C extends CreateForm, U extends UpdateForm>(
  service: CrudService<T, C, U>
) {
  return {
    getAll: () => service.getAll(),
    getById: (id: string) => service.getById(id),
    create: (form: C) => service.create(form),
    update: (id: string, form: U) => service.update(id, form),
    delete: (id: string) => service.delete(id),
  };
}