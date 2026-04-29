import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import {
  ClassCatalogForm,
  ClassCatalogItem,
  SubClassCatalogForm,
  SubClassCatalogItem,
} from '../models';

const REFERENTIEL_DATA = APP_DATA.features.referentiel as {
  domainOptions?: Array<{ label: string }>;
  specialiteOptions?: Array<{ label: string }>;
  niveauOptions?: Array<{ label: string }>;
  semestreOptions?: Array<{ label: string }>;
};

@Injectable({
  providedIn: 'root',
})
export class ClassStructureService {
  private classItems: ClassCatalogItem[];
  private subClassItems: SubClassCatalogItem[];
  private nextClassId: number;
  private nextSubClassId: number;

  constructor() {
    const seededClassItems = this.buildSeedClassItems();
    const seededSubClassItems = this.buildSeedSubClassItems(seededClassItems);
    this.classItems = this.syncClassSubClasses(seededClassItems, seededSubClassItems);
    this.subClassItems = seededSubClassItems;
    this.nextClassId = this.classItems.length + 1;
    this.nextSubClassId = this.subClassItems.length + 1;
  }

  getClassItems(): ClassCatalogItem[] {
    return [...this.classItems];
  }

  getSubClassItems(): SubClassCatalogItem[] {
    return [...this.subClassItems];
  }

  getDomainOptions(): string[] {
    return (REFERENTIEL_DATA.domainOptions ?? [])
      .map(option => option.label)
      .filter(Boolean);
  }

  getSpecialityOptions(_domainName?: string): string[] {
    return (REFERENTIEL_DATA.specialiteOptions ?? [])
      .map(option => this.normalizeSpecialityLabel(option.label))
      .filter(Boolean);
  }

  getLevelOptions(): string[] {
    return (REFERENTIEL_DATA.niveauOptions ?? [])
      .map(option => option.label)
      .filter(Boolean);
  }

  getSemesterOptions(): string[] {
    return (REFERENTIEL_DATA.semestreOptions ?? [])
      .map(option => option.label)
      .filter(label => label !== 'Tous les semestres');
  }

  getClassOptions(): Array<{ id: string; label: string }> {
    return this.classItems
      .filter(item => item.status === 'Actif')
      .map(item => ({ id: item.id, label: item.className }));
  }

  createClass(form: ClassCatalogForm): ClassCatalogItem {
    const newItem: ClassCatalogItem = {
      id: `${this.nextClassId}`,
      code: form.code.trim(),
      domainName: form.domainName,
      specialityName: form.specialityName,
      levelName: form.levelName,
      className: form.className.trim(),
      subClassNames: [],
      status: form.status,
    };

    this.classItems.unshift(newItem);
    this.nextClassId += 1;
    return newItem;
  }

  updateClass(id: string, form: ClassCatalogForm): ClassCatalogItem | undefined {
    const index = this.classItems.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }

    const updatedClass: ClassCatalogItem = {
      ...this.classItems[index],
      code: form.code.trim(),
      domainName: form.domainName,
      specialityName: form.specialityName,
      levelName: form.levelName,
      className: form.className.trim(),
    };

    this.classItems[index] = updatedClass;
    this.subClassItems = this.subClassItems.map(item =>
      item.classId === id ? { ...item, className: updatedClass.className } : item
    );
    this.classItems = this.syncClassSubClasses(this.classItems, this.subClassItems);
    return this.classItems[index];
  }

  deleteClass(id: string): boolean {
    const initialLength = this.classItems.length;
    this.classItems = this.classItems.filter(item => item.id !== id);
    this.subClassItems = this.subClassItems.filter(item => item.classId !== id);
    this.classItems = this.syncClassSubClasses(this.classItems, this.subClassItems);
    return this.classItems.length < initialLength;
  }

  createSubClass(form: SubClassCatalogForm): SubClassCatalogItem | undefined {
    const parentClass = this.classItems.find(item => item.id === form.classId);
    if (!parentClass) {
      return undefined;
    }

    const newItem: SubClassCatalogItem = {
      id: `${this.nextSubClassId}`,
      classId: form.classId,
      className: parentClass.className,
      subClassName: form.subClassName.trim(),
      currentSemesterLabel: form.currentSemesterLabel,
      status: form.status,
    };

    this.subClassItems.unshift(newItem);
    this.nextSubClassId += 1;
    this.classItems = this.syncClassSubClasses(this.classItems, this.subClassItems);
    return newItem;
  }

  updateSubClass(id: string, form: SubClassCatalogForm): SubClassCatalogItem | undefined {
    const index = this.subClassItems.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }

    const parentClass = this.classItems.find(item => item.id === form.classId);
    if (!parentClass) {
      return undefined;
    }

    this.subClassItems[index] = {
      ...this.subClassItems[index],
      classId: form.classId,
      className: parentClass.className,
      subClassName: form.subClassName.trim(),
      currentSemesterLabel: form.currentSemesterLabel,
    };
    this.classItems = this.syncClassSubClasses(this.classItems, this.subClassItems);
    return this.subClassItems[index];
  }

  deleteSubClass(id: string): boolean {
    const initialLength = this.subClassItems.length;
    this.subClassItems = this.subClassItems.filter(item => item.id !== id);
    this.classItems = this.syncClassSubClasses(this.classItems, this.subClassItems);
    return this.subClassItems.length < initialLength;
  }

  private buildSeedClassItems(): ClassCatalogItem[] {
    const domainName = this.getDomainOptions()[0] ?? 'Sciences et Technologies';
    const specialityName = this.getSpecialityOptions(domainName)[0] ?? 'Développement Web/Mobile';

    return [
      {
        id: '1',
        code: 'LDWM1',
        domainName,
        specialityName,
        levelName: 'Licence 1',
        className: 'Licence 1 Développement Web/Mobile',
        subClassNames: [],
        status: 'Actif',
      },
      {
        id: '2',
        code: 'LDWM2',
        domainName,
        specialityName,
        levelName: 'Licence 2',
        className: 'Licence 2 Développement Web/Mobile',
        subClassNames: [],
        status: 'Actif',
      },
      {
        id: '3',
        code: 'LDWM3',
        domainName,
        specialityName,
        levelName: 'Licence 3',
        className: 'Licence 3 Développement Web/Mobile',
        subClassNames: [],
        status: 'Actif',
      },
      {
        id: '4',
        code: 'MDIA1',
        domainName,
        specialityName: this.getSpecialityOptions(domainName)[1] ?? 'Data & IA',
        levelName: 'Master 1',
        className: 'Master 1 Data & IA',
        subClassNames: [],
        status: 'Actif',
      },
    ];
  }

  private buildSeedSubClassItems(classItems: ClassCatalogItem[]): SubClassCatalogItem[] {
    const semester = this.getSemesterOptions()[0] ?? 'Semestre 1';

    return [
      {
        id: '1',
        classId: classItems[0]?.id ?? '1',
        className: classItems[0]?.className ?? 'Licence 1 Développement Web/Mobile',
        subClassName: 'Licence 1 Développement Web/Mobile B',
        currentSemesterLabel: semester,
        status: 'Actif',
      },
      {
        id: '2',
        classId: classItems[0]?.id ?? '1',
        className: classItems[0]?.className ?? 'Licence 1 Développement Web/Mobile',
        subClassName: 'Licence 1 Développement Web/Mobile C',
        currentSemesterLabel: semester,
        status: 'Actif',
      },
      {
        id: '3',
        classId: classItems[1]?.id ?? '2',
        className: classItems[1]?.className ?? 'Licence 2 Développement Web/Mobile',
        subClassName: 'Licence 2 Développement Web/Mobile A',
        currentSemesterLabel: semester,
        status: 'Actif',
      },
      {
        id: '4',
        classId: classItems[3]?.id ?? '4',
        className: classItems[3]?.className ?? 'Master 1 Data & IA',
        subClassName: 'Master 1 Data & IA A',
        currentSemesterLabel: semester,
        status: 'Actif',
      },
    ];
  }

  private syncClassSubClasses(
    classItems: ClassCatalogItem[],
    subClassItems: SubClassCatalogItem[]
  ): ClassCatalogItem[] {
    return classItems.map(item => ({
      ...item,
      subClassNames: subClassItems
        .filter(subClass => subClass.classId === item.id)
        .map(subClass => subClass.subClassName),
    }));
  }

  private normalizeSpecialityLabel(label: string): string {
    if (label === 'Développement Web Mobile') {
      return 'Développement Web/Mobile';
    }

    return label;
  }
}
