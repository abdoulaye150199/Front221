import { Component, Input, inject } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { hasRequiredTextValues } from '@shared/validation';
import {
  ModuleCatalogForm,
  ModuleCatalogItem,
  UeCatalogForm,
  UeCatalogItem,
  UeModuleTabKey,
  UeTypeCatalogForm,
  UeTypeCatalogItem,
} from '../../models';
import { UeModuleService } from '../../services/ue-module.service';

@Component({
  selector: 'app-ue-module',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './ue-module.component.html',
  styleUrls: ['./ue-module.component.scss'],
})
export class UeModuleComponent {
  private readonly ueModuleService = inject(UeModuleService);

  readonly tabs: UeModuleTabKey[] = ["Type d'U.E", "U.E (Unité d'enseignement)", 'Module'];

  ueTypeItems: UeTypeCatalogItem[] = [];
  ueItems: UeCatalogItem[] = [];
  moduleItems: ModuleCatalogItem[] = [];
  activeTabIndex = 0;

  openTypeActionId: string | null = null;
  openUeActionId: string | null = null;
  openModuleActionId: string | null = null;
  editingTypeId: string | null = null;
  editingUeId: string | null = null;
  editingModuleId: string | null = null;

  ueTypeTitle = '';
  ueCode = '';
  ueTitle = '';
  selectedMentionName = '';
  selectedUeId = '';
  moduleCode = '';
  moduleName = '';

  page = 1;
  pageSize = 5;

  @Input() set activeTab(index: number) {
    this.setActiveTab(index, true);
  }

  constructor() {
    this.loadData();
  }

  get isUeTypeTab(): boolean {
    return this.currentTab === "Type d'U.E";
  }

  get isUeTab(): boolean {
    return this.currentTab === "U.E (Unité d'enseignement)";
  }

  get isModuleTab(): boolean {
    return this.currentTab === 'Module';
  }

  get currentTab(): UeModuleTabKey {
    return this.tabs[this.activeTabIndex];
  }

  get mentionOptions(): string[] {
    return this.ueModuleService.getMentionOptions();
  }

  get ueOptions(): Array<{ id: string; label: string }> {
    return this.ueModuleService.getUeOptions();
  }

  get pagedItems(): Array<UeTypeCatalogItem | UeCatalogItem | ModuleCatalogItem> {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.currentItems.slice(start, start + this.pageSize);
  }

  get currentItems(): Array<UeTypeCatalogItem | UeCatalogItem | ModuleCatalogItem> {
    if (this.isUeTypeTab) {
      return this.ueTypeItems;
    }

    if (this.isUeTab) {
      return this.ueItems;
    }

    return this.moduleItems;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.currentItems.length / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
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

  get isTypeFormValid(): boolean {
    return hasRequiredTextValues(this.ueTypeTitle);
  }

  get isUeFormValid(): boolean {
    return hasRequiredTextValues(this.selectedMentionName, this.ueCode, this.ueTitle);
  }

  get isModuleFormValid(): boolean {
    return hasRequiredTextValues(this.selectedUeId, this.moduleCode, this.moduleName);
  }

  get isEditing(): boolean {
    return this.editingTypeId !== null || this.editingUeId !== null || this.editingModuleId !== null;
  }

  setActiveTab(index: number, skipIfUnchanged = false): void {
    const nextTabIndex = this.clampTabIndex(index);
    if (skipIfUnchanged && this.activeTabIndex === nextTabIndex) {
      return;
    }

    this.activeTabIndex = nextTabIndex;
    this.page = 1;
    this.closeMenus();
    this.resetForms();
  }

  submit(): void {
    if (this.isUeTypeTab) {
      this.submitUeType();
      return;
    }

    if (this.isUeTab) {
      this.submitUe();
      return;
    }

    this.submitModule();
  }

  editType(item: UeTypeCatalogItem): void {
    this.openTypeActionId = null;
    this.editingTypeId = item.id;
    this.ueTypeTitle = item.title;
  }

  editUe(item: UeCatalogItem): void {
    this.openUeActionId = null;
    this.editingUeId = item.id;
    this.ueCode = item.code;
    this.ueTitle = item.title;
    this.selectedMentionName = item.mentionNames[0] ?? '';
  }

  editModule(item: ModuleCatalogItem): void {
    this.openModuleActionId = null;
    this.editingModuleId = item.id;
    this.selectedUeId = item.ueId;
    this.moduleCode = item.code;
    this.moduleName = item.name;
  }

  deleteType(id: string): void {
    this.openTypeActionId = null;
    this.ueModuleService.deleteUeType(id);
    if (this.editingTypeId === id) {
      this.resetForms();
    }
    this.loadData();
  }

  deleteUe(id: string): void {
    this.openUeActionId = null;
    this.ueModuleService.deleteUe(id);
    if (this.editingUeId === id) {
      this.resetForms();
    }
    this.loadData();
  }

  deleteModule(id: string): void {
    this.openModuleActionId = null;
    this.ueModuleService.deleteModule(id);
    if (this.editingModuleId === id) {
      this.resetForms();
    }
    this.loadData();
  }

  cancelEdition(): void {
    this.resetForms();
  }

  toggleTypeActionMenu(id: string): void {
    this.openTypeActionId = this.openTypeActionId === id ? null : id;
  }

  toggleUeActionMenu(id: string): void {
    this.openUeActionId = this.openUeActionId === id ? null : id;
  }

  toggleModuleActionMenu(id: string): void {
    this.openModuleActionId = this.openModuleActionId === id ? null : id;
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

  getChipTone(index: number): string {
    const tones = ['blue', 'green', 'yellow'];
    return tones[index % tones.length];
  }

  private loadData(): void {
    this.ueTypeItems = this.ueModuleService.getUeTypeItems();
    this.ueItems = this.ueModuleService.getUeItems();
    this.moduleItems = this.ueModuleService.getModuleItems();
  }

  private submitUeType(): void {
    if (!this.isTypeFormValid) {
      return;
    }

    const form: UeTypeCatalogForm = {
      title: this.ueTypeTitle,
      status: 'Actif',
    };

    if (this.editingTypeId) {
      this.ueModuleService.updateUeType(this.editingTypeId, form);
    } else {
      this.ueModuleService.createUeType(form);
    }

    this.page = 1;
    this.resetForms();
    this.loadData();
  }

  private submitUe(): void {
    if (!this.isUeFormValid) {
      return;
    }

    const form: UeCatalogForm = {
      code: this.ueCode,
      title: this.ueTitle,
      mentionName: this.selectedMentionName,
      status: 'Actif',
    };

    if (this.editingUeId) {
      this.ueModuleService.updateUe(this.editingUeId, form);
    } else {
      this.ueModuleService.createUe(form);
    }

    this.page = 1;
    this.resetForms();
    this.loadData();
  }

  private submitModule(): void {
    if (!this.isModuleFormValid) {
      return;
    }

    const form: ModuleCatalogForm = {
      ueId: this.selectedUeId,
      code: this.moduleCode,
      name: this.moduleName,
      status: 'Actif',
    };

    if (this.editingModuleId) {
      this.ueModuleService.updateModule(this.editingModuleId, form);
    } else {
      this.ueModuleService.createModule(form);
    }

    this.page = 1;
    this.resetForms();
    this.loadData();
  }

  private closeMenus(): void {
    this.openTypeActionId = null;
    this.openUeActionId = null;
    this.openModuleActionId = null;
  }

  private resetForms(): void {
    this.editingTypeId = null;
    this.editingUeId = null;
    this.editingModuleId = null;
    this.ueTypeTitle = '';
    this.ueCode = '';
    this.ueTitle = '';
    this.selectedMentionName = '';
    this.selectedUeId = '';
    this.moduleCode = '';
    this.moduleName = '';
  }

  private clampTabIndex(index: number): number {
    if (index < 0) {
      return 0;
    }

    if (index >= this.tabs.length) {
      return this.tabs.length - 1;
    }

    return index;
  }
}
