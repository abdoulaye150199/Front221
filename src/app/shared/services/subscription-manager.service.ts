import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

/**
 * Service helper for managing subscriptions in components
 * Provides a centralized way to manage cleanup of RxJS subscriptions
 *
 * @example
 * @Injectable()
 * export class MyService {
 *   private subscriptionManager = inject(SubscriptionManagerService);
 *
 *   subscribeToData() {
 *     this.service.getData()
 *       .pipe(takeUntil(this.subscriptionManager.destroy$))
 *       .subscribe(data => this.handleData(data));
 *   }
 *
 *   ngOnDestroy() {
 *     this.subscriptionManager.destroy$.next();
 *     this.subscriptionManager.destroy$.complete();
 *   }
 * }
 */
@Injectable()
export class SubscriptionManagerService {
  private readonly subscriptions: Subscription[] = [];
  private readonly destroy$ = new Subject<void>();

  /**
   * Get the destroy$ subject to use with takeUntil operator
   */
  getDestroySignal(): Subject<void> {
    return this.destroy$;
  }

  /**
   * Add a subscription to be tracked
   */
  track(subscription: Subscription): Subscription {
    this.subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Unsubscribe from all tracked subscriptions
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions.length = 0;
  }

  /**
   * Clean up all subscriptions and complete destroy stream
   */
  cleanup(): void {
    this.unsubscribeAll();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
