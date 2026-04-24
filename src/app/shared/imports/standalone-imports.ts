import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

export const COMMON_IMPORTS = [CommonModule] as const;
export const ICON_IMPORTS = [CommonModule, MatIconModule] as const;
export const ACTION_IMPORTS = [CommonModule, MatIconModule, MatButtonModule] as const;
export const FORM_ACTION_IMPORTS = [CommonModule, FormsModule, MatIconModule, MatButtonModule] as const;
export const LIST_FILTER_IMPORTS = [CommonModule, FormsModule, MatIconModule] as const;
export const PAGINATION_IMPORTS = [CommonModule, MatButtonModule, MatIconModule] as const;
export const HEADER_IMPORTS = [
  CommonModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatDividerModule,
] as const;
export const SIDEBAR_IMPORTS = [CommonModule, RouterModule, MatIconModule, MatButtonModule] as const;
