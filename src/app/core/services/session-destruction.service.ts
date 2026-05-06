import { Injectable, NgZone, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Service pour gérer la destruction des sessions
 * - Logout automatique après inactivité
 * - Nettoyage complet des données sensibles
 * - Détection de fermeture de navigateur
 */
@Injectable({
  providedIn: 'root',
})
export class SessionDestructionService {
  private inactivityTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes
  private lastActivityTime = Date.now();
  private isCleaningUp = false;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    // Initialiser la surveillance seulement côté client
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSessionMonitoring();
    }
  }

  /**
   * Initialiser la surveillance de la session
   */
  private initializeSessionMonitoring(): void {
    // Listener pour l'inactivité
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', () => this.resetInactivityTimer());
      document.addEventListener('keydown', () => this.resetInactivityTimer());
      document.addEventListener('mousemove', () => this.resetInactivityTimer());
    });

    // Nettoyer la session avant fermeture
    window.addEventListener('beforeunload', () => this.performCleanup());
  }

  /**
   * Réinitialiser le timer d'inactivité
   */
  private resetInactivityTimer(): void {
    this.lastActivityTime = Date.now();

    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }

    this.inactivityTimeout = setTimeout(() => {
      this.handleInactivityLogout();
    }, this.INACTIVITY_TIME);
  }

  /**
   * Gérer le logout automatique après inactivité
   */
  private handleInactivityLogout(): void {
    if (this.authService.isAuthenticated()) {
      console.warn('Session expired due to inactivity');
      this.performCleanup();
      void this.router.navigate(['/auth/login'], {
        queryParams: { reason: 'session_expired' },
      });
    }
  }

  /**
   * Nettoyer complètement la session
   */
  private performCleanup(): void {
    if (this.isCleaningUp) {
      return; // Éviter les nettoyages multiples
    }

    this.isCleaningUp = true;

    // Arrêter le timer d'inactivité
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }

    // Logout du service d'auth
    this.authService.logout();

    // Nettoyer le sessionStorage complètement
    this.clearAllSessionData();

    // Nettoyer le localStorage (pour l'ancien AuthService)
    this.clearAllLocalStorageData();

    // Nettoyer les variables locales sensibles
    this.lastActivityTime = Date.now();
    this.isCleaningUp = false;
  }

  /**
   * Supprimer tous les données du sessionStorage
   */
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

    // Alternative: Nettoyer complètement
    // sessionStorage.clear();
  }

  /**
   * Supprimer les données d'authentification du localStorage
   */
  private clearAllLocalStorageData(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const keysToRemove = [
      'currentUser',
      'auth_token',
      'remember_me',
      'user_preferences',
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Forcer le logout et le nettoyage
   */
  forceLogout(): void {
    this.performCleanup();
    void this.router.navigate(['/auth/login']);
  }

  /**
   * Obtenir le temps d'inactivité restant (en secondes)
   */
  getRemainingInactivityTime(): number {
    const elapsed = Date.now() - this.lastActivityTime;
    const remaining = Math.max(0, Math.floor((this.INACTIVITY_TIME - elapsed) / 1000));
    return remaining;
  }

  /**
   * Obtenir le status de la session
   */
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
