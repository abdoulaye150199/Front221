import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../../shared/imports/standalone-imports';
import { ListPageBase } from '../../../shared/components/base/list-page.base';
import { AcademicYear, AcademicYearStatus } from '../models';
import { AcademicYearService } from '../services';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './academic-years.component.html',
  styleUrls: ['./academic-years.component.scss'],
})
export class AcademicYearsComponent extends ListPageBase<AcademicYear> {
  readonly statusOptions: AcademicYearStatus[] = ['En cours', 'Terminé'];

  private academicYears: AcademicYear[] = [];
  openActionId: string | null = null;

  constructor(private academicYearService: AcademicYearService) {
    super();
    this.loadAcademicYears();
  }

  private loadAcademicYears(): void {
    this.academicYears = this.academicYearService.getAll();
  }

  protected getFilteredItems(): AcademicYear[] {
    return this.academicYearService.filterBySearchTerm(this.searchTerm);
  }

  get pagedAcademicYears(): AcademicYear[] {
    return this.pagedItems;
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
}
