export type SpecialitySectionKey =
  | 'Domaines'
  | 'Mention'
  | 'Spécialité'
  | 'Cycle'
  | 'Niveau'
  | 'Semestres';

export interface SpecialityCatalogItem {
  id: string;
  category: SpecialitySectionKey;
  name: string;
  domainName?: string;
  mentionName?: string;
  cycleName?: string;
  semesterLevelName?: string;
  levelNames?: string[];
  durationLabel?: string;
  hourlyRateLabel?: string;
  documentItemsToProvide?: string[];
  documentItemsToWithdraw?: string[];
  currentSemesterLabel?: string;
  status: 'Actif' | 'Inactif';
}

export interface SpecialityCatalogState {
  items: SpecialityCatalogItem[];
  page: number;
  pageSize: number;
  activeTab: number;
  editingId: string | null;
  form: SpecialityCatalogForm;
}

export interface SpecialityCatalogForm {
  category: SpecialitySectionKey;
  name: string;
  domainName?: string;
  mentionName?: string;
  cycleName?: string;
  semesterLevelName?: string;
  levelNames?: string[];
  durationLabel?: string;
  hourlyRateLabel?: string;
  documentItemsToProvide?: string[];
  documentItemsToWithdraw?: string[];
  currentSemesterLabel?: string;
  status: 'Actif' | 'Inactif';
}
