import { Component, Input } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../../shared/imports/standalone-imports';
import { ListPageBase } from '../../../shared/components/base/list-page.base';
import {
  isAcademicYearFormValid,
  normalizeAcademicDateInput,
  type AcademicYearValidationErrors,
  validateAcademicYearForm,
} from '../../../shared/validation';
import { AcademicYear, AcademicYearForm, AcademicYearStatus } from '../models';
import { AcademicYearService } from '../services';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './academic-years.component.html',
  styleUrls: ['./academic-years.component.scss'],
})
export class AcademicYearsComponent extends ListPageBase<AcademicYear> {
  @Input() set externalSearchTerm(value: string) {
    this.onSearchChange(value ?? '');
  }

  readonly statusOptions: AcademicYearStatus[] = ['En cours', 'Clôturé'];
  academicYearForm: AcademicYearForm = {
    year: '',
    startDate: '',
    endDate: '',
  };
  academicYearFormSubmitted = false;

  openActionId: string | null = null;

  constructor(private academicYearService: AcademicYearService) {
    super();
  }

  protected getFilteredItems(): AcademicYear[] {
    return this.academicYearService.filterBySearchTerm(this.searchTerm);
  }

  get pagedAcademicYears(): AcademicYear[] {
    return this.pagedItems;
  }

  get academicYearErrors(): AcademicYearValidationErrors {
    return validateAcademicYearForm(
      this.academicYearForm.year,
      this.academicYearForm.startDate,
      this.academicYearForm.endDate
    );
  }

  get isAcademicYearFormValid(): boolean {
    return isAcademicYearFormValid(
      this.academicYearForm.year,
      this.academicYearForm.startDate,
      this.academicYearForm.endDate
    );
  }

  updateAcademicDate(field: 'startDate' | 'endDate', value: string): void {
    this.academicYearForm[field] = normalizeAcademicDateInput(value);
  }

  submitAcademicYear(): void {
    this.academicYearFormSubmitted = true;

    if (!this.isAcademicYearFormValid) {
      return;
    }

    this.academicYearService.create(this.academicYearForm);
    this.resetAcademicYearForm();
    this.page = 1;
  }

  setYearStatus(year: AcademicYear, status: AcademicYearStatus): void {
    this.academicYearService.updateStatus(year.id, status);
  }

  toggleActionMenu(year: AcademicYear): void {
    this.openActionId = this.openActionId === year.id ? null : year.id;
  }

  closeActionMenu(): void {
    this.openActionId = null;
  }

  private resetAcademicYearForm(): void {
    this.academicYearFormSubmitted = false;
    this.academicYearForm = {
      year: '',
      startDate: '',
      endDate: '',
    };
  }
}
