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

  classItems: ClassCatalogItem[] = [];
  subClassItems: SubClassCatalogItem[] = [];
  activeTabIndex = 0;

  classPage = 1;
  classPageSize = 3;
  subClassPage = 1;
  subClassPageSize = 5;

  openClassActionId: string | null = null;
  openSubClassActionId: string | null = null;
  editingClassId: string | null = null;
  editingSubClassId: string | null = null;

  selectedDomainName = '';
  selectedSpecialityName = '';
  selectedLevelName = '';
  classCode = '';
  className = '';

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
    return this.classItems;
  }

  get filteredSubClassItems(): SubClassCatalogItem[] {
    return this.subClassItems;
  }

  get pagedClassItems(): ClassCatalogItem[] {
    return this.getPagedItems(this.filteredClassItems, this.currentClassPage, this.classPageSize);
  }

  get pagedSubClassItems(): SubClassCatalogItem[] {
    return this.getPagedItems(this.filteredSubClassItems, this.currentSubClassPage, this.subClassPageSize);
  }

  get currentClassPage(): number {
    return this.getCurrentPage(this.classPage, this.totalClassPages);
  }

  get currentSubClassPage(): number {
    return this.getCurrentPage(this.subClassPage, this.totalSubClassPages);
  }

  get totalClassPages(): number {
    return this.getTotalPages(this.filteredClassItems.length, this.classPageSize);
  }

  get totalSubClassPages(): number {
    return this.getTotalPages(this.filteredSubClassItems.length, this.subClassPageSize);
  }

  get classPages(): number[] {
    return this.getPages(this.totalClassPages);
  }

  get subClassPages(): number[] {
    return this.getPages(this.totalSubClassPages);
  }

  get canPrevClassPage(): boolean {
    return this.canPrev(this.currentClassPage);
  }

  get canNextClassPage(): boolean {
    return this.canNext(this.currentClassPage, this.totalClassPages);
  }

  get canPrevSubClassPage(): boolean {
    return this.canPrev(this.currentSubClassPage);
  }

  get canNextSubClassPage(): boolean {
    return this.canNext(this.currentSubClassPage, this.totalSubClassPages);
  }

  private getPagedItems<T>(items: T[], currentPage: number, pageSize: number): T[] {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }

  private getCurrentPage(page: number, totalPages: number): number {
    return Math.min(page, totalPages);
  }

  private getTotalPages(itemCount: number, pageSize: number): number {
    return Math.max(1, Math.ceil(itemCount / pageSize));
  }

  private getPages(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  private canPrev(page: number): boolean {
    return page > 1;
  }

  private canNext(page: number, totalPages: number): boolean {
    return page < totalPages;
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
    return this.editingClassId !== null;
  }

  get isEditingSubClass(): boolean {
    return this.editingSubClassId !== null;
  }

  setActiveTab(index: number, skipIfUnchanged = false): void {
    const nextTabIndex = this.clampTabIndex(index);
    if (skipIfUnchanged && this.activeTabIndex === nextTabIndex) {
      return;
    }

    this.activeTabIndex = nextTabIndex;
    this.openClassActionId = null;
    this.openSubClassActionId = null;
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

    if (this.editingClassId) {
      this.classStructureService.updateClass(this.editingClassId, form);
    } else {
      this.classStructureService.createClass(form);
    }

    this.classPage = 1;
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

    if (this.editingSubClassId) {
      this.classStructureService.updateSubClass(this.editingSubClassId, form);
    } else {
      this.classStructureService.createSubClass(form);
    }

    this.subClassPage = 1;
    this.resetSubClassForm();
    this.loadData();
  }

  editClass(item: ClassCatalogItem): void {
    this.openClassActionId = null;
    this.editingClassId = item.id;
    this.selectedDomainName = item.domainName;
    this.selectedSpecialityName = item.specialityName;
    this.selectedLevelName = item.levelName;
    this.classCode = item.code;
    this.className = item.className;
  }

  deleteClass(itemId: string): void {
    this.openClassActionId = null;
    this.classStructureService.deleteClass(itemId);
    if (this.editingClassId === itemId) {
      this.resetClassForm();
    }
    this.loadData();
  }

  editSubClass(item: SubClassCatalogItem): void {
    this.openSubClassActionId = null;
    this.editingSubClassId = item.id;
    this.selectedClassId = item.classId;
    this.subClassName = item.subClassName;
    this.selectedSemester = item.currentSemesterLabel;
  }

  deleteSubClass(itemId: string): void {
    this.openSubClassActionId = null;
    this.classStructureService.deleteSubClass(itemId);
    if (this.editingSubClassId === itemId) {
      this.resetSubClassForm();
    }
    this.loadData();
  }

  cancelEdition(): void {
    this.resetForms();
  }

  toggleClassActionMenu(itemId: string): void {
    this.openClassActionId = this.openClassActionId === itemId ? null : itemId;
  }

  toggleSubClassActionMenu(itemId: string): void {
    this.openSubClassActionId = this.openSubClassActionId === itemId ? null : itemId;
  }

  setClassPage(page: number): void {
    this.changePage(page, this.totalClassPages, nextPage => {
      this.classPage = nextPage;
    });
  }

  setSubClassPage(page: number): void {
    this.changePage(page, this.totalSubClassPages, nextPage => {
      this.subClassPage = nextPage;
    });
  }

  previousClassPage(): void {
    this.changePageDelta(this.currentClassPage, this.totalClassPages, nextPage => {
      this.classPage = nextPage;
    }, -1);
  }

  nextClassPage(): void {
    this.changePageDelta(this.currentClassPage, this.totalClassPages, nextPage => {
      this.classPage = nextPage;
    }, 1);
  }

  previousSubClassPage(): void {
    this.changePageDelta(this.currentSubClassPage, this.totalSubClassPages, nextPage => {
      this.subClassPage = nextPage;
    }, -1);
  }

  nextSubClassPage(): void {
    this.changePageDelta(this.currentSubClassPage, this.totalSubClassPages, nextPage => {
      this.subClassPage = nextPage;
    }, 1);
  }

  setClassPageSize(value: string): void {
    const pageSize = this.parsePageSize(value);
    if (pageSize === null) {
      return;
    }

    this.classPageSize = pageSize;
    this.classPage = 1;
  }

  setSubClassPageSize(value: string): void {
    const pageSize = this.parsePageSize(value);
    if (pageSize === null) {
      return;
    }

    this.subClassPageSize = pageSize;
    this.subClassPage = 1;
  }

  private changePage(page: number, totalPages: number, apply: (page: number) => void): void {
    if (page >= 1 && page <= totalPages) {
      apply(page);
    }
  }

  private changePageDelta(
    currentPage: number,
    totalPages: number,
    apply: (page: number) => void,
    delta: number
  ): void {
    const nextPage = currentPage + delta;
    if (nextPage >= 1 && nextPage <= totalPages) {
      apply(nextPage);
    }
  }

  private parsePageSize(value: string): number | null {
    const pageSize = Number(value);
    return Number.isNaN(pageSize) || pageSize <= 0 ? null : pageSize;
  }

  private loadData(): void {
    this.classItems = this.classStructureService.getClassItems();
    this.subClassItems = this.classStructureService.getSubClassItems();
  }

  private resetForms(): void {
    this.resetClassForm();
    this.resetSubClassForm();
  }

  private resetClassForm(): void {
    this.editingClassId = null;
    this.selectedDomainName = '';
    this.selectedSpecialityName = '';
    this.selectedLevelName = '';
    this.classCode = '';
    this.className = '';
  }

  private resetSubClassForm(): void {
    this.editingSubClassId = null;
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
