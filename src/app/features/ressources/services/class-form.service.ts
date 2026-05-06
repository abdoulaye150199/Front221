import { Injectable } from '@angular/core';
import { hasRequiredTextValues } from '@shared/validation';
import {
  ClassCatalogForm,
  ClassCatalogItem,
  SubClassCatalogForm,
  SubClassCatalogItem,
} from '../models';

export interface ClassFormState {
  selectedDomainName: string;
  selectedSpecialityName: string;
  selectedLevelName: string;
  classCode: string;
  className: string;
}

export interface SubClassFormState {
  selectedClassId: string;
  subClassName: string;
  selectedSemester: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassFormService {
  // Class form state
  classFormState: ClassFormState = {
    selectedDomainName: '',
    selectedSpecialityName: '',
    selectedLevelName: '',
    classCode: '',
    className: ''
  };

  // SubClass form state
  subClassFormState: SubClassFormState = {
    selectedClassId: '',
    subClassName: '',
    selectedSemester: ''
  };

  // Getters for class form
  get isClassFormValid(): boolean {
    return hasRequiredTextValues(
      this.classFormState.selectedDomainName,
      this.classFormState.selectedSpecialityName,
      this.classFormState.selectedLevelName,
      this.classFormState.classCode,
      this.classFormState.className
    );
  }

  // Getters for subclass form
  get isSubClassFormValid(): boolean {
    return hasRequiredTextValues(
      this.subClassFormState.selectedClassId,
      this.subClassFormState.subClassName
    );
  }

  // Reset methods
  resetClassForm(): void {
    this.classFormState = {
      selectedDomainName: '',
      selectedSpecialityName: '',
      selectedLevelName: '',
      classCode: '',
      className: ''
    };
  }

  resetSubClassForm(): void {
    this.subClassFormState = {
      selectedClassId: '',
      subClassName: '',
      selectedSemester: ''
    };
  }

  resetForms(): void {
    this.resetClassForm();
    this.resetSubClassForm();
  }

  // Populate form from item
  populateClassForm(item: ClassCatalogItem): void {
    this.classFormState.selectedDomainName = item.domainName;
    this.classFormState.selectedSpecialityName = item.specialityName;
    this.classFormState.selectedLevelName = item.levelName;
    this.classFormState.classCode = item.code;
    this.classFormState.className = item.className;
  }

  populateSubClassForm(item: SubClassCatalogItem): void {
    this.subClassFormState.selectedClassId = item.classId;
    this.subClassFormState.subClassName = item.subClassName;
    this.subClassFormState.selectedSemester = item.currentSemesterLabel;
  }

  // Create form objects
  createClassForm(): ClassCatalogForm {
    return {
      code: this.classFormState.classCode,
      domainName: this.classFormState.selectedDomainName,
      specialityName: this.classFormState.selectedSpecialityName,
      levelName: this.classFormState.selectedLevelName,
      className: this.classFormState.className,
      status: 'Actif'
    };
  }

  createSubClassForm(): SubClassCatalogForm {
    return {
      classId: this.subClassFormState.selectedClassId,
      subClassName: this.subClassFormState.subClassName,
      currentSemesterLabel: this.subClassFormState.selectedSemester || 'Semestre 1',
      status: 'Actif'
    };
  }
}