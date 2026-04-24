import { Component } from '@angular/core';
import { APP_DATA } from '../../data';
import { SIDEBAR_IMPORTS } from '../../imports/standalone-imports';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
}

interface AcademicYearData {
  label: string;
  year: string;
}

interface SidebarData {
  navItems: NavItem[];
  academicYear: AcademicYearData;
}

const sidebarData = APP_DATA.shared.sidebar as SidebarData;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [...SIDEBAR_IMPORTS],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  readonly navItems = sidebarData.navItems;
  readonly academicYear = sidebarData.academicYear;
}
