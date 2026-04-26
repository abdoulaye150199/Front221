import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../../shared/imports/standalone-imports';
import { hasRequiredTextValues } from '../../../shared/validation';
import { SpecialityCatalogItem, SpecialityCatalogForm, SpecialitySectionKey } from '../models';
import { SpecialityCatalogService } from '../services';

@Component({
  selector: 'app-speciality-catalog',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './speciality-catalog.component.html',
  styleUrls: ['./speciality-catalog.component.scss'],
})
export class SpecialityCatalogComponent {
  readonly specialityTabs: SpecialitySectionKey[] = [
    'Domaines',
    'Mention',
    'Spécialité',
    'Cycle',
    'Niveau',
    'Semestres',
  ];

  specialityCatalogItems: SpecialityCatalogItem[] = [];
  specialityPage = 1;
  specialityPageSize = 5;
  activeSpecialityTab = 0;
  openSpecialityActionId: string | null = null;
  editingSpecialityItemId: string | null = null;
  nextSpecialityItemId = 1;

  specialityItemName = '';
  specialityDomainName = '';

  constructor(private specialityCatalogService: SpecialityCatalogService) {
    this.loadSpecialityCatalogItems();
  }

  private loadSpecialityCatalogItems(): void {
    this.specialityCatalogItems = this.specialityCatalogService.getAll();
    this.nextSpecialityItemId = this.specialityCatalogItems.length + 1;
  }

  get currentSpecialityCategory(): SpecialitySectionKey {
    return this.specialityTabs[this.activeSpecialityTab];
  }

  get isMentionSpecialityTab(): boolean {
    return this.currentSpecialityCategory === 'Mention';
  }

  get domainOptions(): string[] {
    return this.specialityCatalogService.getDomainOptions();
  }

  get currentSpecialityPlaceholder(): string {
    switch (this.currentSpecialityCategory) {
      case 'Domaines':
        return 'Domaine';
      case 'Mention':
        return 'Mention';
      case 'Spécialité':
        return 'Spécialité';
      case 'Cycle':
        return 'Cycle';
      case 'Niveau':
        return 'Niveau';
      case 'Semestres':
        return 'Semestre';
      default:
        return 'Nom';
    }
  }

  get filteredSpecialityCatalogItems(): SpecialityCatalogItem[] {
    return this.specialityCatalogService.getByCategory(this.currentSpecialityCategory);
  }

  get totalSpecialityItems(): number {
    return this.filteredSpecialityCatalogItems.length;
  }

  get totalSpecialityPages(): number {
    return Math.max(1, Math.ceil(this.totalSpecialityItems / this.specialityPageSize));
  }

  get currentSpecialityPage(): number {
    return Math.min(this.specialityPage, this.totalSpecialityPages);
  }

  get pagedSpecialityCatalogItems(): SpecialityCatalogItem[] {
    const start = (this.currentSpecialityPage - 1) * this.specialityPageSize;
    return this.filteredSpecialityCatalogItems.slice(start, start + this.specialityPageSize);
  }

  get specialityPages(): number[] {
    return Array.from({ length: this.totalSpecialityPages }, (_, index) => index + 1);
  }

  get specialityCanPrev(): boolean {
    return this.currentSpecialityPage > 1;
  }

  get specialityCanNext(): boolean {
    return this.currentSpecialityPage < this.totalSpecialityPages;
  }

  get isSpecialityFormValid(): boolean {
    if (this.isMentionSpecialityTab) {
      return hasRequiredTextValues(this.specialityDomainName, this.specialityItemName);
    }
    return hasRequiredTextValues(this.specialityItemName);
  }

  get isEditingSpecialityItem(): boolean {
    return this.editingSpecialityItemId !== null;
  }

  setActiveSpecialityTab(index: number): void {
    this.activeSpecialityTab = index;
    this.specialityPage = 1;
    this.resetSpecialityForm();
    this.openSpecialityActionId = null;
  }

  submitSpecialityItem(): void {
    if (!this.isSpecialityFormValid) {
      return;
    }

    const form: SpecialityCatalogForm = {
      category: this.currentSpecialityCategory,
      name: this.specialityItemName.trim(),
      domainName: this.isMentionSpecialityTab ? this.specialityDomainName : undefined,
      status: 'Actif',
    };

    if (this.editingSpecialityItemId) {
      this.specialityCatalogService.update(this.editingSpecialityItemId, form);
      this.resetSpecialityForm();
      this.loadSpecialityCatalogItems();
      return;
    }

    this.specialityCatalogService.create(form);
    this.resetSpecialityForm();
    this.loadSpecialityCatalogItems();
  }

  editSpecialityItem(item: SpecialityCatalogItem): void {
    this.openSpecialityActionId = null;
    this.editingSpecialityItemId = item.id;
    this.specialityItemName = item.name;
    this.specialityDomainName = item.domainName ?? '';
  }

  deleteSpecialityItem(itemId: string): void {
    this.openSpecialityActionId = null;
    this.specialityCatalogService.delete(itemId);
    if (this.editingSpecialityItemId === itemId) {
      this.resetSpecialityForm();
    }
    this.loadSpecialityCatalogItems();
    if (this.specialityPage > this.totalSpecialityPages) {
      this.specialityPage = this.totalSpecialityPages;
    }
  }

  cancelSpecialityEdition(): void {
    this.resetSpecialityForm();
  }

  toggleSpecialityActionMenu(itemId: string): void {
    this.openSpecialityActionId = this.openSpecialityActionId === itemId ? null : itemId;
  }

  setSpecialityPage(page: number): void {
    if (page >= 1 && page <= this.totalSpecialityPages) {
      this.specialityPage = page;
    }
  }

  previousSpecialityPage(): void {
    if (this.specialityCanPrev) {
      this.specialityPage -= 1;
    }
  }

  nextSpecialityPage(): void {
    if (this.specialityCanNext) {
      this.specialityPage += 1;
    }
  }

  setSpecialityPageSize(value: string): void {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && pageSize > 0) {
      this.specialityPageSize = pageSize;
      this.specialityPage = 1;
    }
  }

  private resetSpecialityForm(): void {
    this.editingSpecialityItemId = null;
    this.specialityItemName = '';
    this.specialityDomainName = '';
  }
}
