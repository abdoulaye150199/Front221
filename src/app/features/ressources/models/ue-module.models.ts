export type UeModuleTabKey = "Type d'U.E" | "U.E (Unité d'enseignement)" | 'Module';

export interface UeTypeCatalogItem {
  id: string;
  code: string;
  title: string;
  mentionNames: string[];
  moduleNames: string[];
  status: 'Actif' | 'Inactif';
}

export interface UeCatalogItem {
  id: string;
  code: string;
  title: string;
  mentionNames: string[];
  status: 'Actif' | 'Inactif';
}

export interface ModuleCatalogItem {
  id: string;
  ueId: string;
  code: string;
  name: string;
  ueTitles: string[];
  status: 'Actif' | 'Inactif';
}

export interface UeTypeCatalogForm {
  title: string;
  status: 'Actif' | 'Inactif';
}

export interface UeCatalogForm {
  code: string;
  title: string;
  mentionName: string;
  status: 'Actif' | 'Inactif';
}

export interface ModuleCatalogForm {
  ueId: string;
  code: string;
  name: string;
  status: 'Actif' | 'Inactif';
}
