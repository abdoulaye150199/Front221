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
import { PaginatedFormState } from '@shared/utils/pagination.utils';

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

  readonly classState = new PaginatedFormState<ClassCatalogItem, ClassCatalogForm>(
    3,
    () => this.createClassForm()
  );
  readonly subClassState = new PaginatedFormState<SubClassCatalogItem, SubClassCatalogForm>(
    5,
    () => this.createSubClassForm()
  );

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
    return this.classStructureService.getSpecialityOptions(this.classState.form.domainName);
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

  get isClassFormValid(): boolean {
    return hasRequiredTextValues(
      this.classState.form.domainName,
      this.classState.form.specialityName,
      this.classState.form.levelName,
      this.classState.form.code,
      this.classState.form.className
    );
  }

  get isSubClassFormValid(): boolean {
    return hasRequiredTextValues(
      this.subClassState.form.classId,
      this.subClassState.form.subClassName,
      this.subClassState.form.currentSemesterLabel
    );
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
  }

  onDomainChange(domainName: string): void {
    const nextSpeciality = this.classStructureService
      .getSpecialityOptions(domainName)
      .includes(this.classState.form.specialityName)
      ? this.classState.form.specialityName
      : '';

    this.classState.patchForm({
      domainName,
      specialityName: nextSpeciality,
    });
  }

  updateClassForm(patch: Partial<ClassCatalogForm>): void {
    this.classState.patchForm(patch);
  }

  updateSubClassForm(patch: Partial<SubClassCatalogForm>): void {
    this.subClassState.patchForm(patch);
  }

  setSubClassSemester(value: string): void {
    this.subClassState.patchForm({ currentSemesterLabel: value });
  }

  get classForm(): ClassCatalogForm {
    return this.classState.form;
  }

  get subClassForm(): SubClassCatalogForm {
    return this.subClassState.form;
  }

  submitClass(): void {
    if (!this.isClassFormValid) {
      return;
    }
    const form = { ...this.classState.form };

    if (this.classState.editingItemId) {
      this.classStructureService.updateClass(this.classState.editingItemId, form);
    } else {
      this.classStructureService.createClass(form);
    }

    this.classState.reset();
    this.loadData();
  }

  submitSubClass(): void {
    if (!this.isSubClassFormValid) {
      return;
    }

    const form = {
      ...this.subClassState.form,
      currentSemesterLabel:
        this.subClassState.form.currentSemesterLabel || this.semesterOptions[0] || 'Semestre 1',
    };

    if (this.subClassState.editingItemId) {
      this.classStructureService.updateSubClass(this.subClassState.editingItemId, form);
    } else {
      this.classStructureService.createSubClass(form);
    }

    this.subClassState.reset();
    this.loadData();
  }

  editClass(item: ClassCatalogItem): void {
    this.classState.startEditing(item.id, {
      code: item.code,
      domainName: item.domainName,
      specialityName: item.specialityName,
      levelName: item.levelName,
      className: item.className,
      status: item.status,
    });
  }

  deleteClass(itemId: string): void {
    this.classState.closeActionMenu();
    this.classStructureService.deleteClass(itemId);
    if (this.classState.editingItemId === itemId) {
      this.classState.stopEditing(true);
    }
    this.loadData();
  }

  editSubClass(item: SubClassCatalogItem): void {
    this.subClassState.startEditing(item.id, {
      classId: item.classId,
      subClassName: item.subClassName,
      currentSemesterLabel: item.currentSemesterLabel,
      status: item.status,
    });
  }

  deleteSubClass(itemId: string): void {
    this.subClassState.closeActionMenu();
    this.classStructureService.deleteSubClass(itemId);
    if (this.subClassState.editingItemId === itemId) {
      this.subClassState.stopEditing(true);
    }
    this.loadData();
  }

  cancelEdition(): void {
    this.classState.stopEditing(true);
    this.subClassState.stopEditing(true);
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
    this.classState.setItems(this.classStructureService.getClassItems());
    this.subClassState.setItems(this.classStructureService.getSubClassItems());
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

  private createClassForm(): ClassCatalogForm {
    return {
      code: '',
      domainName: '',
      specialityName: '',
      levelName: '',
      className: '',
      status: 'Actif',
    };
  }

  private createSubClassForm(): SubClassCatalogForm {
    return {
      classId: '',
      subClassName: '',
      currentSemesterLabel: this.semesterOptions[0] ?? 'Semestre 1',
      status: 'Actif',
    };
  }
}
