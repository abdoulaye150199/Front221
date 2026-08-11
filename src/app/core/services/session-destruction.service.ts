import { Injectable, NgZone, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class SessionDestructionService implements OnDestroy {
  private inactivityTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly INACTIVITY_TIME = 30 * 60 * 1000; 
  private lastActivityTime = Date.now();
  private isCleaningUp = false;
  private platformId = inject(PLATFORM_ID);
  private readonly handleActivity = () => this.resetInactivityTimer();
  private readonly handleBeforeUnload = () => this.performCleanup();

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) {
    
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSessionMonitoring();
    }
  }

  
  private initializeSessionMonitoring(): void {
    
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', this.handleActivity, { passive: true });
      document.addEventListener('keydown', this.handleActivity);
      document.addEventListener('mousemove', this.handleActivity, { passive: true });
    });

    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.resetInactivityTimer();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.removeEventListener('click', this.handleActivity);
    document.removeEventListener('keydown', this.handleActivity);
    document.removeEventListener('mousemove', this.handleActivity);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
  }

  
  private resetInactivityTimer(): void {
    this.lastActivityTime = Date.now();

    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }

    this.inactivityTimeout = setTimeout(() => {
      this.handleInactivityLogout();
    }, this.INACTIVITY_TIME);
  }

  
  private handleInactivityLogout(): void {
    if (this.authService.isAuthenticated()) {
      console.warn('Session expired due to inactivity');
      this.performCleanup();
      void this.router.navigate(['/auth/login'], {
        queryParams: { reason: 'session_expired' },
      });
    }
  }

  
  private performCleanup(): void {
    if (this.isCleaningUp) {
      return; 
    }

    this.isCleaningUp = true;

    
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }

    
    this.authService.logout();

    
    this.clearAllSessionData();

    
    this.clearAllLocalStorageData();

    
    this.lastActivityTime = Date.now();
    this.isCleaningUp = false;
  }

  
  private clearAllSessionData(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    const keysToRemove = [
      'access_token',
      'refresh_token',
      'user_data',
      'auth_session',
      'device_id',
    ];

    keysToRemove.forEach((key) => {
      sessionStorage.removeItem(key);
    });

    
    
  }

  
  private clearAllLocalStorageData(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const keysToRemove = ['currentUser', 'auth_token', 'remember_me', 'user_preferences'];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  
  forceLogout(): void {
    this.performCleanup();
    void this.router.navigate(['/auth/login']);
  }

  
  getRemainingInactivityTime(): number {
    const elapsed = Date.now() - this.lastActivityTime;
    const remaining = Math.max(0, Math.floor((this.INACTIVITY_TIME - elapsed) / 1000));
    return remaining;
  }

  
  getSessionStatus(): {
    isActive: boolean;
    remainingTime: number;
    lastActivity: Date;
  } {
    return {
      isActive: this.authService.isAuthenticated(),
      remainingTime: this.getRemainingInactivityTime(),
      lastActivity: new Date(this.lastActivityTime),
    };
  }
}
