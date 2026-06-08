import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

/**
 * ========== BASE LAYERS ==========
 * Foundation imports - single responsibility
 */
export const BASE_IMPORTS = [CommonModule] as const;
export const ROUTER_IMPORTS = [RouterModule] as const;
export const FORMS_IMPORTS = [FormsModule] as const;

/**
 * ========== MATERIAL LAYERS ==========
 * Individual Material module imports - allows fine-grained composition
 */
export const MATERIAL_ICON_IMPORTS = [MatIconModule] as const;
export const MATERIAL_BUTTON_IMPORTS = [MatButtonModule] as const;
export const MATERIAL_MENU_IMPORTS = [MatMenuModule] as const;
export const MATERIAL_DIVIDER_IMPORTS = [MatDividerModule] as const;
export const MATERIAL_TABS_IMPORTS = [MatTabsModule] as const;

/**
 * ========== COMPOSITE IMPORTS ==========
 * Composed from base and material layers - eliminates duplication
 */
export const COMMON_IMPORTS = BASE_IMPORTS;

export const ICON_IMPORTS = [...BASE_IMPORTS, ...MATERIAL_ICON_IMPORTS] as const;

export const ACTION_IMPORTS = [...ICON_IMPORTS, ...MATERIAL_BUTTON_IMPORTS] as const;

export const FORM_ACTION_IMPORTS = [...ACTION_IMPORTS, ...FORMS_IMPORTS] as const;

export const LIST_FILTER_IMPORTS = [
  ...BASE_IMPORTS,
  ...FORMS_IMPORTS,
  ...MATERIAL_ICON_IMPORTS,
] as const;

export const PAGINATION_IMPORTS = [...ACTION_IMPORTS] as const;

export const HEADER_IMPORTS = [
  ...ACTION_IMPORTS,
  ...MATERIAL_MENU_IMPORTS,
  ...MATERIAL_DIVIDER_IMPORTS,
] as const;

export const SIDEBAR_IMPORTS = [...BASE_IMPORTS, ...ROUTER_IMPORTS, ...ACTION_IMPORTS] as const;
