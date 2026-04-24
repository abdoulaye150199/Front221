import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import {
  CourseCardComponent,
  EventCardComponent,
  HeaderComponent,
  ListFiltersComponent,
  NumberPaginationComponent,
  SidebarComponent,
  StatCardComponent,
} from '../components';

export const MAIN_LAYOUT_IMPORTS = [CommonModule, RouterModule, HeaderComponent, SidebarComponent] as const;
export const LIST_PAGE_IMPORTS = [
  CommonModule,
  MatIconModule,
  MatButtonModule,
  ListFiltersComponent,
  NumberPaginationComponent,
] as const;
export const DASHBOARD_IMPORTS = [
  CommonModule,
  MatIconModule,
  MatButtonModule,
  MatTabsModule,
  StatCardComponent,
  EventCardComponent,
  CourseCardComponent,
] as const;
