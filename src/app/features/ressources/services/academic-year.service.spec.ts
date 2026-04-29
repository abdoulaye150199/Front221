import { describe, expect, it, beforeEach } from 'vitest';

import { AcademicYearService } from './academic-year.service';

describe('AcademicYearService', () => {
  let service: AcademicYearService;

  beforeEach(() => {
    service = new AcademicYearService();
  });

  it('should load academic years', () => {
    const allAcademicYears = service.getAll();

    expect(Array.isArray(allAcademicYears)).toBe(true);
    expect(allAcademicYears.length).toBeGreaterThanOrEqual(0);
  });

  it('should return an academic year by id', () => {
    const [firstYear] = service.getAll();

    expect(service.getById(firstYear.id)).toEqual(firstYear);
  });

  it('should filter academic years by search term', () => {
    const [firstYear] = service.getAll();
    const filtered = service.filterBySearchTerm(firstYear.year);

    expect(filtered.some(item => item.id === firstYear.id)).toBe(true);
  });

  it('should create a new academic year', () => {
    const form = {
      year: '2028-2029',
      startDate: '07/10/2028',
      endDate: '31/07/2029',
    };

    const created = service.create(form);

    expect(created.id).toBeTruthy();
    expect(created.year).toBe('2028-2029');
    expect(service.getById(created.id)).toEqual(created);
  });

  it('should update the status of an academic year', () => {
    const [firstYear] = service.getAll();

    service.updateStatus(firstYear.id, 'Clôturé');

    expect(service.getById(firstYear.id)?.status).toBe('Clôturé');
  });
});
