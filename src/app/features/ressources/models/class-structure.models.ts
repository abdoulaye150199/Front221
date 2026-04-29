export type ClassStructureTabKey = 'Classes' | 'Sous-classes';

export interface ClassCatalogItem {
  id: string;
  code: string;
  domainName: string;
  specialityName: string;
  levelName: string;
  className: string;
  subClassNames: string[];
  status: 'Actif' | 'Inactif';
}

export interface SubClassCatalogItem {
  id: string;
  classId: string;
  className: string;
  subClassName: string;
  currentSemesterLabel: string;
  status: 'Actif' | 'Inactif';
}

export interface ClassCatalogForm {
  code: string;
  domainName: string;
  specialityName: string;
  levelName: string;
  className: string;
  status: 'Actif' | 'Inactif';
}

export interface SubClassCatalogForm {
  classId: string;
  subClassName: string;
  currentSemesterLabel: string;
  status: 'Actif' | 'Inactif';
}
