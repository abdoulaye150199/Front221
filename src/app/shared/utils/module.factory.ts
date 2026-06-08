import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Configuration for creating a feature module
 * Reduces boilerplate by providing a factory function for common patterns
 */
export interface FeatureModuleConfig {
  name: string;
  component: Type<any>;
  routingModule: Type<any>;
}

/**
 * Factory function to create a standard feature module class
 * Eliminates repetitive NgModule boilerplate across features
 *
 * @example
 * // Before - 10 lines of boilerplate
 * @NgModule({
 *   declarations: [],
 *   imports: [CommonModule, DashboardRoutingModule, DashboardComponent],
 * })
 * export class DashboardModule {}
 *
 * // After - Single line (can be declared inline or extracted)
 * export class DashboardModule extends createFeatureModule('Dashboard', DashboardComponent, DashboardRoutingModule) {}
 *
 * // Or use directly in exports
 * export const DashboardModule = createFeatureModule('Dashboard', DashboardComponent, DashboardRoutingModule);
 */
export function createFeatureModule(
  config: FeatureModuleConfig
): Type<any> {
  @NgModule({
    declarations: [],
    imports: [CommonModule, config.routingModule, config.component],
  })
  class FeatureModule {}

  Object.defineProperty(FeatureModule, 'name', { value: `${config.name}Module` });
  return FeatureModule;
}

/**
 * Factory function to create a standard routing module class
 * Eliminates repetitive NgModule routing boilerplate
 *
 * @example
 * const routes: Routes = [...];
 * export class CoursRoutingModule extends createRoutingModule(routes) {}
 *
 * // Or more concisely:
 * export const CoursRoutingModule = createRoutingModule(routes);
 */
export function createRoutingModule(routes: Routes): Type<any> {
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  class RoutingModule {}

  return RoutingModule;
}
