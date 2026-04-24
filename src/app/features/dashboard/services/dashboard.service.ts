import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { DashboardData } from '../models/dashboard.models';

const dashboardData = APP_DATA.features.dashboard as DashboardData;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  getDashboardData(): DashboardData {
    return structuredClone(dashboardData);
  }
}
