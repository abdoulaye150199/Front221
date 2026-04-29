import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { SpecialityCatalogItem, SpecialityCatalogForm, SpecialitySectionKey } from '../models';

const RESSOURCES_DATA = APP_DATA.features.ressources as {
  specialityCatalogItems: SpecialityCatalogItem[];
  levelOptions?: string[];
  semesterOptions?: string[];
};

@Injectable({
  providedIn: 'root',
})
export class SpecialityCatalogService {
  private items: SpecialityCatalogItem[];
  private nextId: number;

  constructor() {
    this.items = this.hydrateSpecialityItems(structuredClone(RESSOURCES_DATA.specialityCatalogItems));
    this.nextId = this.items.length + 1;
  }

  getAll(): SpecialityCatalogItem[] {
    return [...this.items];
  }

  getByCategory(category: SpecialitySectionKey): SpecialityCatalogItem[] {
    return this.items.filter(item => item.category === category);
  }

  getById(id: string): SpecialityCatalogItem | undefined {
    return this.items.find(item => item.id === id);
  }

  create(form: SpecialityCatalogForm): SpecialityCatalogItem {
    const newItem = this.enrichCatalogItem({
      id: `${this.nextId}`,
      category: form.category,
      name: form.name.trim(),
      domainName: form.domainName,
      mentionName: form.mentionName,
      cycleName: form.cycleName,
      semesterLevelName: form.semesterLevelName,
      levelNames: form.levelNames ? [...form.levelNames] : undefined,
      durationLabel: form.durationLabel,
      hourlyRateLabel: form.hourlyRateLabel,
      documentItemsToProvide: form.documentItemsToProvide ? [...form.documentItemsToProvide] : undefined,
      documentItemsToWithdraw: form.documentItemsToWithdraw ? [...form.documentItemsToWithdraw] : undefined,
      currentSemesterLabel: form.currentSemesterLabel,
      status: form.status,
    });
    this.items.unshift(newItem);
    this.nextId += 1;
    return newItem;
  }

  update(id: string, form: SpecialityCatalogForm): SpecialityCatalogItem | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.items[index] = this.enrichCatalogItem({
      ...this.items[index],
      name: form.name.trim(),
      category: form.category,
      domainName: form.domainName,
      mentionName: form.mentionName,
      cycleName: form.cycleName,
      semesterLevelName: form.semesterLevelName,
      levelNames: form.levelNames ? [...form.levelNames] : undefined,
      durationLabel: form.durationLabel,
      hourlyRateLabel: form.hourlyRateLabel,
      documentItemsToProvide: form.documentItemsToProvide ? [...form.documentItemsToProvide] : undefined,
      documentItemsToWithdraw: form.documentItemsToWithdraw ? [...form.documentItemsToWithdraw] : undefined,
      currentSemesterLabel: form.currentSemesterLabel,
      status: this.items[index].status,
    });
    return this.items[index];
  }

  delete(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }

  getDomainOptions(): string[] {
    return [...new Set(
      this.items
        .filter(item => item.category === 'Domaines' && item.status === 'Actif')
        .map(item => item.name)
    )];
  }

  getMentionOptions(domainName?: string): string[] {
    return [...new Set(
      this.items
        .filter(item => item.category === 'Mention' && item.status === 'Actif')
        .filter(item => !domainName || item.domainName === domainName)
        .map(item => item.name)
    )];
  }

  getLevelOptions(): string[] {
    const configuredLevels = RESSOURCES_DATA.levelOptions?.filter(Boolean) ?? [];
    if (configuredLevels.length > 0) {
      return [...new Set(configuredLevels)];
    }

    return [...new Set(
      this.items
        .filter(item => item.category === 'Niveau' && item.status === 'Actif')
        .map(item => item.name)
    )];
  }

  getCycleDurationOptions(): string[] {
    return [...new Set([
      '1 année',
      '2 années',
      '3 années',
      ...this.items
        .filter(item => item.category === 'Cycle' && item.durationLabel)
        .map(item => item.durationLabel as string),
    ])];
  }

  getHourlyRateOptions(): string[] {
    return [...new Set([
      '10 000 F',
      '20 000 F',
      '30 000 F',
      ...this.items
        .filter(item => item.category === 'Cycle' && item.hourlyRateLabel)
        .map(item => item.hourlyRateLabel as string),
    ])];
  }

  getCycleOptions(): string[] {
    return [...new Set(
      this.items
        .filter(item => item.category === 'Cycle' && item.status === 'Actif')
        .map(item => item.name)
    )];
  }

  getSemesterOptions(): string[] {
    return [...new Set(
      [
        ...(RESSOURCES_DATA.semesterOptions?.filter(Boolean) ?? []),
        ...this.items
        .filter(item => item.category === 'Semestres' && item.status === 'Actif')
        .map(item => item.name),
      ]
    )];
  }

  getSemesterDurationOptions(): string[] {
    return [...new Set([
      '5 mois',
      '6 mois',
      ...this.items
        .filter(item => item.category === 'Semestres' && item.durationLabel)
        .map(item => item.durationLabel as string),
    ])];
  }

  private hydrateSpecialityItems(items: SpecialityCatalogItem[]): SpecialityCatalogItem[] {
    const activeMentions = items.filter(
      item => item.category === 'Mention' && item.status === 'Actif'
    );
    const domainFallback = items.find(
      item => item.category === 'Domaines' && item.status === 'Actif'
    )?.name;
    const levelOptions = this.getConfiguredLevelOptions(items);
    const levelPresets = [
      ['Licence', 'Master 1'],
      ['Master 1', 'Master 2'],
      ['Licence', 'Master 2'],
    ];

    let specialityIndex = 0;

    return items.map(item => {
      if (item.category !== 'Spécialité') {
        return this.enrichCatalogItem(item);
      }

      const fallbackMention = activeMentions.length > 0
        ? activeMentions[specialityIndex % activeMentions.length]
        : undefined;
      const fallbackLevels = levelPresets[specialityIndex % levelPresets.length]
        .filter(level => levelOptions.includes(level));
      specialityIndex += 1;

      return this.enrichCatalogItem({
        ...item,
        domainName: item.domainName ?? fallbackMention?.domainName ?? domainFallback,
        mentionName: item.mentionName ?? fallbackMention?.name,
        levelNames: item.levelNames?.length
          ? [...new Set(item.levelNames)]
          : fallbackLevels.length > 0
            ? fallbackLevels
            : levelOptions.slice(0, 1),
      });
    });
  }

  private getConfiguredLevelOptions(items: SpecialityCatalogItem[]): string[] {
    const configuredLevels = RESSOURCES_DATA.levelOptions?.filter(Boolean) ?? [];
    if (configuredLevels.length > 0) {
      return [...new Set(configuredLevels)];
    }

    return [...new Set(
      items
        .filter(item => item.category === 'Niveau' && item.status === 'Actif')
        .map(item => item.name)
    )];
  }

  private getCycleDefaults(cycleName: string): { durationLabel: string; hourlyRateLabel: string } {
    switch (cycleName.trim()) {
      case 'Licence':
        return { durationLabel: '3 années', hourlyRateLabel: '10 000 F' };
      case 'Master':
        return { durationLabel: '2 années', hourlyRateLabel: '20 000 F' };
      case 'Doctorat':
        return { durationLabel: '2 années', hourlyRateLabel: '30 000 F' };
      default:
        return { durationLabel: '1 année', hourlyRateLabel: '10 000 F' };
    }
  }

  private enrichCatalogItem(item: SpecialityCatalogItem): SpecialityCatalogItem {
    if (item.category === 'Cycle') {
      const cycleDefaults = this.getCycleDefaults(item.name);
      return {
        ...item,
        durationLabel: item.durationLabel ?? cycleDefaults.durationLabel,
        hourlyRateLabel: item.hourlyRateLabel ?? cycleDefaults.hourlyRateLabel,
      };
    }

    if (item.category === 'Niveau') {
      const levelDefaults = this.getLevelDefaults(item.name, item.cycleName);
      return {
        ...item,
        cycleName: item.cycleName ?? levelDefaults.cycleName,
        documentItemsToProvide: item.documentItemsToProvide?.length
          ? [...new Set(item.documentItemsToProvide)]
          : levelDefaults.documentItemsToProvide,
        documentItemsToWithdraw: item.documentItemsToWithdraw?.length
          ? [...new Set(item.documentItemsToWithdraw)]
          : levelDefaults.documentItemsToWithdraw,
        currentSemesterLabel: item.currentSemesterLabel ?? levelDefaults.currentSemesterLabel,
      };
    }

    if (item.category === 'Semestres') {
      const semesterDefaults = this.getSemesterDefaults(item.name, item.semesterLevelName);
      return {
        ...item,
        semesterLevelName: item.semesterLevelName ?? semesterDefaults.semesterLevelName,
        durationLabel: item.durationLabel ?? semesterDefaults.durationLabel,
      };
    }

    return item;
  }

  private getLevelDefaults(
    levelName: string,
    cycleName?: string
  ): {
    cycleName: string;
    documentItemsToProvide: string[];
    documentItemsToWithdraw: string[];
    currentSemesterLabel: string;
  } {
    const normalizedLevelName = levelName.trim();
    const resolvedCycleName = cycleName ?? this.inferCycleNameFromLevel(normalizedLevelName);

    if (normalizedLevelName.startsWith('Master')) {
      return {
        cycleName: resolvedCycleName,
        documentItemsToProvide: [
          'Extrait de naissance',
          "4 photos d'identité",
          'Photocopie dernier diplôme obtenu',
        ],
        documentItemsToWithdraw: [
          'Relevé de notes semestre 2',
          'Attestation de réussite',
        ],
        currentSemesterLabel: 'Semestre 1',
      };
    }

    if (normalizedLevelName.startsWith('Doctorat')) {
      return {
        cycleName: resolvedCycleName,
        documentItemsToProvide: [
          'Extrait de naissance',
          "4 photos d'identité",
          'Photocopie dernier diplôme obtenu',
        ],
        documentItemsToWithdraw: [
          'Relevé de notes semestre 2',
          'Attestation de réussite',
          'Relevé de notes semestre 1',
        ],
        currentSemesterLabel: 'Semestre 1',
      };
    }

    return {
      cycleName: resolvedCycleName,
      documentItemsToProvide: [
        'Extrait de naissance',
        "4 photos d'identité",
        'Photocopie dernier diplôme obtenu',
      ],
      documentItemsToWithdraw: [
        'Bulletin de notes semestre 2',
        'Attestation de réussite',
      ],
      currentSemesterLabel: normalizedLevelName.endsWith('2') ? 'Semestre 2' : 'Semestre 1',
    };
  }

  private inferCycleNameFromLevel(levelName: string): string {
    if (levelName.startsWith('Master')) {
      return 'Master';
    }

    if (levelName.startsWith('Doctorat')) {
      return 'Doctorat';
    }

    return 'Licence';
  }

  private getSemesterDefaults(
    semesterName: string,
    semesterLevelName?: string
  ): {
    semesterLevelName: string;
    durationLabel: string;
  } {
    const availableLevels = RESSOURCES_DATA.levelOptions?.filter(Boolean) ?? ['Licence', 'Master 1', 'Master 2'];
    const fallbackLevel = semesterLevelName ?? availableLevels[0] ?? 'Licence';
    const normalizedSemesterName = semesterName.trim();

    if (normalizedSemesterName === 'Session intensive') {
      return {
        semesterLevelName: semesterLevelName ?? availableLevels[1] ?? fallbackLevel,
        durationLabel: '6 mois',
      };
    }

    return {
      semesterLevelName: fallbackLevel,
      durationLabel: '5 mois',
    };
  }
}
