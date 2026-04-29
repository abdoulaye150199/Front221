import { Component, Input } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { hasRequiredTextValues } from '@shared/validation';
import { SpecialityCatalogItem, SpecialityCatalogForm, SpecialitySectionKey } from '../../models';
import { SpecialityCatalogService } from '../../services';

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
  specialityMentionName = '';
  specialityLevelName = '';
  specialityDurationLabel = '';
  specialityHourlyRateLabel = '';
  specialityCycleName = '';

  @Input() set activeTabIndex(index: number) {
    this.setActiveSpecialityTab(index, true);
  }

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

  get isSpecialityTab(): boolean {
    return this.currentSpecialityCategory === 'Spécialité';
  }

  get isCycleTab(): boolean {
    return this.currentSpecialityCategory === 'Cycle';
  }

  get isLevelTab(): boolean {
    return this.currentSpecialityCategory === 'Niveau';
  }

  get isSemesterTab(): boolean {
    return this.currentSpecialityCategory === 'Semestres';
  }

  get domainOptions(): string[] {
    return this.getOptionsForCategory('Domaines');
  }

  get mentionOptions(): string[] {
    return this.getOptionsForCategory('Mention');
  }

  get levelOptions(): string[] {
    return this.getOptionsForCategory('Niveau');
  }

  get cycleDurationOptions(): string[] {
    return this.getOptionsForCategory('Cycle');
  }

  get hourlyRateOptions(): string[] {
    return this.getOptionsForCategory('Cycle');
  }

  get cycleOptions(): string[] {
    return this.getOptionsForCategory('Cycle');
  }

  get semesterOptions(): string[] {
    return this.getOptionsForCategory('Semestres');
  }

  get semesterDurationOptions(): string[] {
    return this.getOptionsForCategory('Semestres');
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

  /**
   * Generic method to get options based on category to reduce code duplication
   * @param category The specialty section key
   * @returns Array of string options for the given category
   */
  private getOptionsForCategory(category: SpecialitySectionKey): string[] {
    switch (category) {
      case 'Domaines':
        return this.specialityCatalogService.getDomainOptions();
      case 'Mention':
        return this.specialityDomainName ? 
          this.specialityCatalogService.getMentionOptions(this.specialityDomainName) : [];
      case 'Spécialité':
        return []; // Handled elsewhere
      case 'Cycle':
        return this.specialityCatalogService.getCycleOptions();
      case 'Niveau':
        return this.specialityCatalogService.getLevelOptions();
      case 'Semestres':
        return this.specialityCatalogService.getSemesterOptions();
      default:
        return [];
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

  /**
   * TrackBy function for ngFor loops to improve performance
   * @param index Index of the item
   * @param item The item object
   * @returns Unique identifier for the item
   */
  trackById(index: number, item: any): any {
    if (item && typeof item === 'object' && 'id' in item) {
      return (item as SpecialityCatalogItem).id;
    }
    // For primitive types (string, number), return the item itself
    return item;
  }

  get specialityCanPrev(): boolean {
    return this.currentSpecialityPage > 1;
  }

  get specialityCanNext(): boolean {
    return this.currentSpecialityPage < this.totalSpecialityPages;
  }

  get isSpecialityFormValid(): boolean {
    if (this.isCycleTab) {
      return hasRequiredTextValues(
        this.specialityItemName,
        this.specialityDurationLabel,
        this.specialityHourlyRateLabel
      );
    }

    if (this.isLevelTab) {
      return hasRequiredTextValues(this.specialityCycleName, this.specialityItemName);
    }

    if (this.isSemesterTab) {
      return hasRequiredTextValues(
        this.specialityLevelName,
        this.specialityItemName,
        this.specialityDurationLabel
      );
    }

    if (this.isSpecialityTab) {
      return hasRequiredTextValues(
        this.specialityDomainName,
        this.specialityMentionName,
        this.specialityLevelName,
        this.specialityItemName
      );
    }

    if (this.isMentionSpecialityTab) {
      return hasRequiredTextValues(this.specialityDomainName, this.specialityItemName);
    }
    return hasRequiredTextValues(this.specialityItemName);
  }

  get isEditingSpecialityItem(): boolean {
    return this.editingSpecialityItemId !== null;
  }

  setActiveSpecialityTab(index: number, skipIfUnchanged = false): void {
    const nextTabIndex = this.clampSpecialityTabIndex(index);
    if (skipIfUnchanged && this.activeSpecialityTab === nextTabIndex) {
      return;
    }

    this.activeSpecialityTab = nextTabIndex;
    this.specialityPage = 1;
    this.resetSpecialityForm();
    this.openSpecialityActionId = null;
  }

  /**
   * Submits the specialty form based on the active tab
   * Handles both creation and update of specialty items
   * Resets the form and reloads items after submission
   */
  submitSpecialityItem(): void {
    if (!this.isSpecialityFormValid) {
      return;
    }

    const form: SpecialityCatalogForm = {
      category: this.currentSpecialityCategory,
      name: this.specialityItemName.trim(),
      domainName: this.isMentionSpecialityTab || this.isSpecialityTab ? this.specialityDomainName : undefined,
      mentionName: this.isSpecialityTab ? this.specialityMentionName : undefined,
      cycleName: this.isLevelTab ? this.specialityCycleName : undefined,
      semesterLevelName: this.isSemesterTab ? this.specialityLevelName : undefined,
      levelNames: this.isSpecialityTab ? [this.specialityLevelName] : undefined,
      durationLabel: this.isCycleTab || this.isSemesterTab ? this.specialityDurationLabel : undefined,
      hourlyRateLabel: this.isCycleTab ? this.specialityHourlyRateLabel : undefined,
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

  /**
   * Populates the form with data from an existing item for editing
   * @param item The specialty catalog item to edit
   */
  editSpecialityItem(item: SpecialityCatalogItem): void {
    this.openSpecialityActionId = null;
    this.editingSpecialityItemId = item.id;
    this.specialityItemName = item.name;
    this.specialityDomainName = item.domainName ?? '';
    this.specialityMentionName = item.mentionName ?? '';
    this.specialityLevelName = item.levelNames?.[0] ?? item.semesterLevelName ?? '';
    this.specialityDurationLabel = item.durationLabel ?? '';
    this.specialityHourlyRateLabel = item.hourlyRateLabel ?? '';
    this.specialityCycleName = item.cycleName ?? '';
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

  onSpecialityDomainChange(domainName: string): void {
    this.specialityDomainName = domainName;
    if (!this.mentionOptions.includes(this.specialityMentionName)) {
      this.specialityMentionName = '';
    }
  }

  private resetSpecialityForm(): void {
    this.editingSpecialityItemId = null;
    this.specialityItemName = '';
    this.specialityDomainName = '';
    this.specialityMentionName = '';
    this.specialityLevelName = '';
    this.specialityDurationLabel = '';
    this.specialityHourlyRateLabel = '';
    this.specialityCycleName = '';
  }

  private clampSpecialityTabIndex(index: number): number {
    if (index < 0) {
      return 0;
    }

    if (index >= this.specialityTabs.length) {
      return this.specialityTabs.length - 1;
    }

    return index;
  }
}
