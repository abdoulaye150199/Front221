import { Component, Input, inject } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { hasRequiredTextValues } from '@shared/validation';
import {
  ClassCatalogForm,
  ClassCatalogItem,
  ClassStructureTabKey,
  SubClassCatalogForm,
  SubClassCatalogItem,
} from '../../models';
import { ClassStructureService } from '../../services/class-structure.service';
import { PaginatedFormState } from './helpers/paginated-form-state';

@Component({
  selector: 'app-class-structure',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './class-structure.component.html',
  styleUrls: ['./class-structure.component.scss'],
})
export class ClassStructureComponent {
  private readonly classStructureService = inject(ClassStructureService);

  readonly tabs: ClassStructureTabKey[] = ['Classes', 'Sous-classes'];
  activeTabIndex = 0;

  readonly classState = new PaginatedFormState<ClassCatalogItem>(3);
  readonly subClassState = new PaginatedFormState<SubClassCatalogItem>(5);

  // Class form state
  selectedDomainName = '';
  selectedSpecialityName = '';
  selectedLevelName = '';
  classCode = '';
  className = '';

  // SubClass form state
  selectedClassId = '';
  subClassName = '';
  selectedSemester = '';

  @Input() set activeTab(index: number) {
    this.setActiveTab(index, true);
  }

  constructor() {
    this.loadData();
  }

  get isClassTab(): boolean {
    return this.currentTab === 'Classes';
  }

  get currentTab(): ClassStructureTabKey {
    return this.tabs[this.activeTabIndex];
  }

  get domainOptions(): string[] {
    return this.classStructureService.getDomainOptions();
  }

  get specialityOptions(): string[] {
    return this.classStructureService.getSpecialityOptions(this.selectedDomainName);
  }

  get levelOptions(): string[] {
    return this.classStructureService.getLevelOptions();
  }

  get semesterOptions(): string[] {
    return this.classStructureService.getSemesterOptions();
  }

  get classOptions(): Array<{ id: string; label: string }> {
    return this.classStructureService.getClassOptions();
  }

  get filteredClassItems(): ClassCatalogItem[] {
    return this.classState.items;
  }

  get filteredSubClassItems(): SubClassCatalogItem[] {
    return this.subClassState.items;
  }

  get pagedClassItems(): ClassCatalogItem[] {
    return this.classState.pagedItems;
  }

  get pagedSubClassItems(): SubClassCatalogItem[] {
    return this.subClassState.pagedItems;
  }

  get classPages(): number[] {
    return this.classState.pages;
  }

  get subClassPages(): number[] {
    return this.subClassState.pages;
  }

  get canPrevClassPage(): boolean {
    return this.classState.canPrev;
  }

  get canNextClassPage(): boolean {
    return this.classState.canNext;
  }

  get canPrevSubClassPage(): boolean {
    return this.subClassState.canPrev;
  }

  get canNextSubClassPage(): boolean {
    return this.subClassState.canNext;
  }

  get totalClassPages(): number {
    return this.classState.totalPages;
  }

  get totalSubClassPages(): number {
    return this.subClassState.totalPages;
  }

  get isClassFormValid(): boolean {
    return hasRequiredTextValues(
      this.selectedDomainName,
      this.selectedSpecialityName,
      this.selectedLevelName,
      this.classCode,
      this.className
    );
  }

  get isSubClassFormValid(): boolean {
    return hasRequiredTextValues(this.selectedClassId, this.subClassName);
  }

  get isEditingClass(): boolean {
    return this.classState.editingItemId !== null;
  }

  get isEditingSubClass(): boolean {
    return this.subClassState.editingItemId !== null;
  }

  setActiveTab(index: number, skipIfUnchanged = false): void {
    const nextTabIndex = this.clampTabIndex(index);
    if (skipIfUnchanged && this.activeTabIndex === nextTabIndex) {
      return;
    }

    this.activeTabIndex = nextTabIndex;
    this.classState.reset();
    this.subClassState.reset();
    this.resetForms();
  }

  onDomainChange(domainName: string): void {
    this.selectedDomainName = domainName;
    if (!this.specialityOptions.includes(this.selectedSpecialityName)) {
      this.selectedSpecialityName = '';
    }
  }

  submitClass(): void {
    if (!this.isClassFormValid) {
      return;
    }

    const form: ClassCatalogForm = {
      code: this.classCode,
      domainName: this.selectedDomainName,
      specialityName: this.selectedSpecialityName,
      levelName: this.selectedLevelName,
      className: this.className,
      status: 'Actif',
    };

    if (this.classState.editingItemId) {
      this.classStructureService.updateClass(this.classState.editingItemId, form);
    } else {
      this.classStructureService.createClass(form);
    }

    this.classState.reset();
    this.resetClassForm();
    this.loadData();
  }

  submitSubClass(): void {
    if (!this.isSubClassFormValid) {
      return;
    }

    const form: SubClassCatalogForm = {
      classId: this.selectedClassId,
      subClassName: this.subClassName,
      currentSemesterLabel: this.selectedSemester || this.semesterOptions[0] || 'Semestre 1',
      status: 'Actif',
    };

    if (this.subClassState.editingItemId) {
      this.classStructureService.updateSubClass(this.subClassState.editingItemId, form);
    } else {
      this.classStructureService.createSubClass(form);
    }

    this.subClassState.reset();
    this.resetSubClassForm();
    this.loadData();
  }

  editClass(item: ClassCatalogItem): void {
    this.classState.startEditing(item.id);
    this.selectedDomainName = item.domainName;
    this.selectedSpecialityName = item.specialityName;
    this.selectedLevelName = item.levelName;
    this.classCode = item.code;
    this.className = item.className;
  }

  deleteClass(itemId: string): void {
    this.classState.closeActionMenu();
    this.classStructureService.deleteClass(itemId);
    if (this.classState.editingItemId === itemId) {
      this.resetClassForm();
      this.classState.stopEditing();
    }
    this.loadData();
  }

  editSubClass(item: SubClassCatalogItem): void {
    this.subClassState.startEditing(item.id);
    this.selectedClassId = item.classId;
    this.subClassName = item.subClassName;
    this.selectedSemester = item.currentSemesterLabel;
  }

  deleteSubClass(itemId: string): void {
    this.subClassState.closeActionMenu();
    this.classStructureService.deleteSubClass(itemId);
    if (this.subClassState.editingItemId === itemId) {
      this.resetSubClassForm();
      this.subClassState.stopEditing();
    }
    this.loadData();
  }

  cancelEdition(): void {
    this.resetForms();
    this.classState.stopEditing();
    this.subClassState.stopEditing();
  }

  toggleClassActionMenu(itemId: string): void {
    this.classState.toggleActionMenu(itemId);
  }

  toggleSubClassActionMenu(itemId: string): void {
    this.subClassState.toggleActionMenu(itemId);
  }

  setClassPage(page: number): void {
    this.classState.setPage(page);
  }

  setSubClassPage(page: number): void {
    this.subClassState.setPage(page);
  }

  previousClassPage(): void {
    this.classState.previousPage();
  }

  nextClassPage(): void {
    this.classState.nextPage();
  }

  previousSubClassPage(): void {
    this.subClassState.previousPage();
  }

  nextSubClassPage(): void {
    this.subClassState.nextPage();
  }

  setClassPageSize(value: string): void {
    this.classState.setPageSize(value);
  }

  setSubClassPageSize(value: string): void {
    this.subClassState.setPageSize(value);
  }

  private loadData(): void {
    this.classState.items = this.classStructureService.getClassItems();
    this.subClassState.items = this.classStructureService.getSubClassItems();
  }

  private resetForms(): void {
    this.resetClassForm();
    this.resetSubClassForm();
  }

  private resetClassForm(): void {
    this.selectedDomainName = '';
    this.selectedSpecialityName = '';
    this.selectedLevelName = '';
    this.classCode = '';
    this.className = '';
  }

  private resetSubClassForm(): void {
    this.selectedClassId = '';
    this.subClassName = '';
    this.selectedSemester = '';
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
