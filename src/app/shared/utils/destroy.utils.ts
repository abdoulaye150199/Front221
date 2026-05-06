import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Base class for components that need to manage subscriptions
 * Automatically handles cleanup on component destruction
 *
 * @example
 * export class MyComponent extends DestroyBase {
 *   constructor(private service: MyService) {
 *     super();
 *   }
 *
 *   ngOnInit() {
 *     this.service.getData()
 *       .pipe(takeUntil(this.destroy$))
 *       .subscribe(data => this.myData = data);
 *   }
 * }
 */
@Injectable()
export class DestroyBase implements OnDestroy {
  protected readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/**
 * Mixin function to add destroy$ to any component
 * Use when you can't extend DestroyBase
 * 
 * @example
 * const MyMixin = createDestroyMixin(MyComponent);
 */
export function createDestroyMixin<T extends { ngOnDestroy?(): void }>(
  component: T
): T & { destroy$: Subject<void>; ngOnDestroy(): void } {
  const destroy$ = new Subject<void>();
  const originalNgOnDestroy = component.ngOnDestroy?.bind(component);

  return {
    ...component,
    destroy$,
    ngOnDestroy(this: any): void {
      originalNgOnDestroy?.();
      destroy$.next();
      destroy$.complete();
    },
  };
}

/**
 * Utility to unsubscribe from a subscription manually
 * @deprecated - Use takeUntil() with destroy$ instead
 * 
 * @example
 * const sub = this.service.getData().subscribe(...);
 * this.unsubscribeFrom(sub);
 */
export function unsubscribeFrom(...subscriptions: any[]): void {
  subscriptions.forEach(sub => {
    if (sub && typeof sub.unsubscribe === 'function') {
      sub.unsubscribe();
    }
  });
}
