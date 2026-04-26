import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { SpecialityCatalogItem, SpecialityCatalogForm, SpecialitySectionKey } from '../models';

const RESSOURCES_DATA = APP_DATA.features.ressources as {
  specialityCatalogItems: SpecialityCatalogItem[];
};

@Injectable({
  providedIn: 'root',
})
export class SpecialityCatalogService {
  private items: SpecialityCatalogItem[];
  private nextId: number;

  constructor() {
    this.items = structuredClone(RESSOURCES_DATA.specialityCatalogItems);
    this.nextId = this.items.length + 1;
  }

  getAll(): SpecialityCatalogItem[] {
    return [...this.items];
  }

  getByCategory(category: SpecialitySectionKey): SpecialityCatalogItem[] {
    return this.items.filter(item => item.category === category);
  }

  getById(id: string): SpecialityCatalogItem | undefined {
    return this.items.find(item => item.id === id);
  }

  create(form: SpecialityCatalogForm): SpecialityCatalogItem {
    const newItem: SpecialityCatalogItem = {
      id: `${this.nextId}`,
      category: form.category,
      name: form.name.trim(),
      domainName: form.domainName,
      status: form.status,
    };
    this.items.unshift(newItem);
    this.nextId += 1;
    return newItem;
  }

  update(id: string, form: SpecialityCatalogForm): SpecialityCatalogItem | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.items[index] = {
      ...this.items[index],
      name: form.name.trim(),
      category: form.category,
      domainName: form.domainName,
    };
    return this.items[index];
  }

  delete(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }

  getDomainOptions(): string[] {
    return [...new Set(
      this.items
        .filter(item => item.category === 'Domaines')
        .map(item => item.name)
    )];
  }
}
