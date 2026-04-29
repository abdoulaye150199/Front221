import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import {
  ModuleCatalogForm,
  ModuleCatalogItem,
  UeCatalogForm,
  UeCatalogItem,
  UeTypeCatalogForm,
  UeTypeCatalogItem,
} from '../models';

interface UeSeedModule {
  id: string;
  name: string;
}

interface UeSeedItem {
  id: string;
  code: string;
  title: string;
  modules: UeSeedModule[];
}

const REFERENTIEL_DATA = APP_DATA.features.referentiel as {
  mentionOptions?: Array<{ label: string }>;
  domainOptions?: Array<{ label: string }>;
  modalModules?: Array<{ label: string; value: string }>;
  ueList?: UeSeedItem[];
};

@Injectable({
  providedIn: 'root',
})
export class UeModuleService {
  private ueTypeItems: UeTypeCatalogItem[];
  private ueItems: UeCatalogItem[];
  private moduleItems: ModuleCatalogItem[];
  private nextUeTypeId: number;
  private nextUeId: number;
  private nextModuleId: number;

  constructor() {
    this.ueTypeItems = this.buildUeTypeItems();
    this.ueItems = this.buildUeItems();
    this.moduleItems = this.buildModuleItems();
    this.nextUeTypeId = this.ueTypeItems.length + 1;
    this.nextUeId = this.ueItems.length + 1;
    this.nextModuleId = this.moduleItems.length + 1;
  }

  getUeTypeItems(): UeTypeCatalogItem[] {
    return [...this.ueTypeItems];
  }

  getUeItems(): UeCatalogItem[] {
    return [...this.ueItems];
  }

  getModuleItems(): ModuleCatalogItem[] {
    return [...this.moduleItems];
  }

  getMentionOptions(): string[] {
    return [...new Set([
      ...(REFERENTIEL_DATA.mentionOptions ?? []).map(option => option.label).filter(Boolean),
      ...this.getDerivedMentionLabels(),
    ])];
  }

  getUeOptions(): Array<{ id: string; label: string }> {
    return this.ueItems
      .filter(item => item.status === 'Actif')
      .map(item => ({ id: item.id, label: item.title }));
  }

  createUeType(form: UeTypeCatalogForm): UeTypeCatalogItem {
    const mentionNames = this.getMentionOptions().slice(0, 2);
    const moduleNames = this.getModuleSeedOptions().slice(0, 2);
    const newItem: UeTypeCatalogItem = {
      id: `ue-type-${this.nextUeTypeId}`,
      code: this.buildUeCode(form.title, this.nextUeTypeId),
      title: form.title.trim(),
      mentionNames,
      moduleNames,
      status: form.status,
    };

    this.ueTypeItems.unshift(newItem);
    this.nextUeTypeId += 1;
    return newItem;
  }

  updateUeType(id: string, form: UeTypeCatalogForm): UeTypeCatalogItem | undefined {
    const index = this.ueTypeItems.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }

    this.ueTypeItems[index] = {
      ...this.ueTypeItems[index],
      title: form.title.trim(),
    };
    return this.ueTypeItems[index];
  }

  deleteUeType(id: string): boolean {
    const initialLength = this.ueTypeItems.length;
    this.ueTypeItems = this.ueTypeItems.filter(item => item.id !== id);
    return this.ueTypeItems.length < initialLength;
  }

  createUe(form: UeCatalogForm): UeCatalogItem {
    const newItem: UeCatalogItem = {
      id: `ue-${this.nextUeId}`,
      code: form.code.trim(),
      title: form.title.trim(),
      mentionNames: [form.mentionName],
      status: form.status,
    };

    this.ueItems.unshift(newItem);
    this.nextUeId += 1;
    return newItem;
  }

  updateUe(id: string, form: UeCatalogForm): UeCatalogItem | undefined {
    const index = this.ueItems.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }

    this.ueItems[index] = {
      ...this.ueItems[index],
      code: form.code.trim(),
      title: form.title.trim(),
      mentionNames: [form.mentionName],
    };

    this.moduleItems = this.moduleItems.map(item =>
      item.ueId === id ? { ...item, ueTitles: [this.ueItems[index].title] } : item
    );

    return this.ueItems[index];
  }

  deleteUe(id: string): boolean {
    const initialLength = this.ueItems.length;
    this.ueItems = this.ueItems.filter(item => item.id !== id);
    this.moduleItems = this.moduleItems.filter(item => item.ueId !== id);
    return this.ueItems.length < initialLength;
  }

  createModule(form: ModuleCatalogForm): ModuleCatalogItem | undefined {
    const parentUe = this.ueItems.find(item => item.id === form.ueId);
    if (!parentUe) {
      return undefined;
    }

    const newItem: ModuleCatalogItem = {
      id: `module-${this.nextModuleId}`,
      ueId: form.ueId,
      code: form.code.trim(),
      name: form.name.trim(),
      ueTitles: [parentUe.title],
      status: form.status,
    };

    this.moduleItems.unshift(newItem);
    this.nextModuleId += 1;
    return newItem;
  }

  updateModule(id: string, form: ModuleCatalogForm): ModuleCatalogItem | undefined {
    const index = this.moduleItems.findIndex(item => item.id === id);
    if (index === -1) {
      return undefined;
    }

    const parentUe = this.ueItems.find(item => item.id === form.ueId);
    if (!parentUe) {
      return undefined;
    }

    this.moduleItems[index] = {
      ...this.moduleItems[index],
      ueId: form.ueId,
      code: form.code.trim(),
      name: form.name.trim(),
      ueTitles: [parentUe.title],
    };
    return this.moduleItems[index];
  }

  deleteModule(id: string): boolean {
    const initialLength = this.moduleItems.length;
    this.moduleItems = this.moduleItems.filter(item => item.id !== id);
    return this.moduleItems.length < initialLength;
  }

  private buildUeTypeItems(): UeTypeCatalogItem[] {
    const mentionPresets = this.buildMentionPresets();

    return (REFERENTIEL_DATA.ueList ?? []).map((item, index) => ({
      id: item.id,
      code: item.code,
      title: item.title,
      mentionNames: mentionPresets[index % mentionPresets.length],
      moduleNames: item.modules.map(module => module.name),
      status: 'Actif',
    }));
  }

  private buildUeItems(): UeCatalogItem[] {
    const mentionPresets = this.buildMentionPresets();

    return (REFERENTIEL_DATA.ueList ?? []).map((item, index) => ({
      id: item.id,
      code: item.code,
      title: item.title,
      mentionNames: mentionPresets[index % mentionPresets.length],
      status: 'Actif',
    }));
  }

  private buildModuleItems(): ModuleCatalogItem[] {
    return (REFERENTIEL_DATA.ueList ?? []).flatMap(item =>
      item.modules.map((module, index) => ({
        id: `${item.id}-${module.id}`,
        ueId: item.id,
        code: this.buildModuleCode(module.name, index + 1),
        name: module.name,
        ueTitles: [item.title],
        status: 'Actif' as const,
      }))
    );
  }

  private buildMentionPresets(): string[][] {
    const mentionOptions = this.getMentionOptions();
    const [first = 'Informatique', second = 'Gestion', third = 'Droit'] = mentionOptions;

    return [
      [first, second, third],
      [first, second],
      [first],
    ];
  }

  private getDerivedMentionLabels(): string[] {
    const derived: string[] = [];
    const hasGestion = (REFERENTIEL_DATA.domainOptions ?? []).some(
      option => option.label === 'Sciences de Gestion'
    );
    const hasDroit = (REFERENTIEL_DATA.modalModules ?? []).some(
      option => option.label === 'Droit public'
    );

    if (hasGestion) {
      derived.push('Gestion');
    }

    if (hasDroit) {
      derived.push('Droit');
    }

    return derived;
  }

  private getModuleSeedOptions(): string[] {
    return (REFERENTIEL_DATA.modalModules ?? [])
      .map(option => option.label)
      .filter(label => label !== 'Sélectionner');
  }

  private buildUeCode(title: string, suffix: number): string {
    const compact = title
      .normalize('NFD')
      .replace(/[^\w\s-]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map(chunk => chunk[0]?.toUpperCase() ?? '')
      .join('');

    return `UE-${compact || 'NEW'}${suffix}`;
  }

  private buildModuleCode(name: string, suffix: number): string {
    const compact = name
      .normalize('NFD')
      .replace(/[^\w\s-]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(chunk => chunk.slice(0, 2).toUpperCase())
      .join('');

    return `M-${compact || 'MD'}${suffix}`;
  }
}
