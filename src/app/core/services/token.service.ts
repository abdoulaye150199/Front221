import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';
  setTokens(accessToken: string, refreshToken: string): void {
    if (this.hasStorage()) {
      sessionStorage.setItem(this.accessTokenKey, accessToken);
      sessionStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  /**
   * Récupérer le token d'accès
   */
  getAccessToken(): string | null {
    if (!this.hasStorage()) {
      return null;
    }
    return sessionStorage.getItem(this.accessTokenKey);
  }

  /**
   * Récupérer le refresh token
   */
  getRefreshToken(): string | null {
    if (!this.hasStorage()) {
      return null;
    }
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Vérifier si le token est expiré
   */
  isTokenExpired(token: string): boolean {
    try {
      // Décoder le JWT (format: header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true;
      }

      const payload = JSON.parse(atob(parts[1]));
      const expirationTime = payload.exp * 1000; // convertir en ms
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  }

  /**
   * Supprimer tous les tokens
   */
  clearTokens(): void {
    if (this.hasStorage()) {
      sessionStorage.removeItem(this.accessTokenKey);
      sessionStorage.removeItem(this.refreshTokenKey);
    }
  }

  /**
   * Supprimer toutes les données sensibles du stockage
   */
  clearAllSensitiveData(): void {
    if (this.hasStorage()) {
      // Supprimer les tokens
      sessionStorage.removeItem(this.accessTokenKey);
      sessionStorage.removeItem(this.refreshTokenKey);
      // Supprimer les données utilisateur
      sessionStorage.removeItem('user_data');
      sessionStorage.removeItem('auth_session');
      sessionStorage.removeItem('device_id');
    }

    // Aussi nettoyer localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('remember_me');
      localStorage.removeItem('user_preferences');
    }
  }

  /**
   * Vérifier si l'utilisateur a une session active
   */
  isSessionActive(): boolean {
    return this.hasStorage() && sessionStorage.length > 0;
  }

  /**
   * Supprimer tous les tokens
   */
  private hasStorage(): boolean {
    return typeof sessionStorage !== 'undefined';
  }
}
