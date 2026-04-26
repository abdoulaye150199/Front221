import { TestBed } from '@angular/core/testing';

import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  it('should return copies of filter options', () => {
    const options = service.getFilterOptions();
    const originalLength = service.getFilterOptions().specialites.length;

    options.specialites.pop();

    expect(service.getFilterOptions().specialites.length).toBe(originalLength);
  });

  it('should filter courses by search term and criteria', () => {
    const courses = service.getCourses();
    const firstCourse = courses[0];

    const filteredCourses = service.filterCourses(courses, {
      searchTerm: firstCourse.professor,
      specialite: firstCourse.specialite,
      niveau: firstCourse.niveau,
      classe: firstCourse.classe,
      semestre: firstCourse.semestre,
    });

    expect(filteredCourses.length).toBeGreaterThan(0);
    expect(filteredCourses.every((course) => course.professor === firstCourse.professor)).toBe(true);
    expect(filteredCourses.every((course) => course.specialite === firstCourse.specialite)).toBe(true);
  });

  it('should keep all courses when filters are set to all values and search is empty', () => {
    const courses = service.getCourses();

    const filteredCourses = service.filterCourses(courses, {
      searchTerm: '   ',
      specialite: 'toutes',
      niveau: 'tous',
      classe: 'toutes',
      semestre: 'tous',
    });

    expect(filteredCourses.length).toBe(courses.length);
  });
});
