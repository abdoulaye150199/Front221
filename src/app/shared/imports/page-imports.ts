import {
  CourseCardComponent,
  EventCardComponent,
  HeaderComponent,
  ListFiltersComponent,
  NumberPaginationComponent,
  SidebarComponent,
  StatCardComponent,
} from '../components';
import {
  ACTION_IMPORTS,
  BASE_IMPORTS,
  MATERIAL_TABS_IMPORTS,
  ROUTER_IMPORTS,
} from './standalone-imports';



export const MAIN_LAYOUT_IMPORTS = [
  ...BASE_IMPORTS,
  ...ROUTER_IMPORTS,
  HeaderComponent,
  SidebarComponent,
] as const;

export const LIST_PAGE_IMPORTS = [
  ...ACTION_IMPORTS,
  ListFiltersComponent,
  NumberPaginationComponent,
] as const;

export const DASHBOARD_IMPORTS = [
  ...ACTION_IMPORTS,
  ...MATERIAL_TABS_IMPORTS,
  StatCardComponent,
  EventCardComponent,
  CourseCardComponent,
] as const;
