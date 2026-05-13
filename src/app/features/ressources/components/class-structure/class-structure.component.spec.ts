import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ClassStructureComponent } from './class-structure.component';
import { ClassStructureService } from '../../services/class-structure.service';

describe('ClassStructureComponent', () => {
  let component: ClassStructureComponent;
  let service: ClassStructureService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ClassStructureService],
    });

    service = TestBed.inject(ClassStructureService);
    component = TestBed.runInInjectionContext(() => new ClassStructureComponent());
  });

  it('should create a class and reset the class form state', () => {
    const initialCount = service.getClassItems().length;
    const domain = component.domainOptions[0] ?? 'Sciences et Technologies';

    component.onDomainChange(domain);
    component.updateClassForm({
      specialityName: component.specialityOptions[0] ?? 'Développement Web/Mobile',
      levelName: component.levelOptions[0] ?? 'Licence 1',
      code: 'LTEST',
      className: 'Classe test',
    });

    component.submitClass();

    const [createdClass] = service.getClassItems();
    expect(service.getClassItems()).toHaveLength(initialCount + 1);
    expect(createdClass.className).toBe('Classe test');
    expect(component.classForm.className).toBe('');
    expect(component.isEditingClass).toBe(false);
  });

  it('should populate and save the class edition through the shared state form', () => {
    const item = service.getClassItems()[0];

    component.editClass(item);
    expect(component.classForm.className).toBe(item.className);

    component.updateClassForm({ className: 'Licence 1 Développement Web/Mobile Premium' });
    component.submitClass();

    expect(service.getClassItems().find(classItem => classItem.id === item.id)?.className).toBe(
      'Licence 1 Développement Web/Mobile Premium'
    );
    expect(component.isEditingClass).toBe(false);
  });

  it('should create a subclass with the selected semester', () => {
    component.setActiveTab(1);

    const classOption = component.classOptions[0];
    const semester = component.semesterOptions[1] ?? component.semesterOptions[0] ?? 'Semestre 1';

    component.updateSubClassForm({
      classId: classOption.id,
      subClassName: 'Sous-classe test',
    });
    component.setSubClassSemester(semester);

    component.submitSubClass();

    const [createdSubClass] = service.getSubClassItems();
    expect(createdSubClass.subClassName).toBe('Sous-classe test');
    expect(createdSubClass.currentSemesterLabel).toBe(semester);
    expect(component.subClassForm.subClassName).toBe('');
    expect(component.isEditingSubClass).toBe(false);
  });
});
