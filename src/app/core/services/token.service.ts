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

  
  getAccessToken(): string | null {
    if (!this.hasStorage()) {
      return null;
    }
    return sessionStorage.getItem(this.accessTokenKey);
  }

  
  getRefreshToken(): string | null {
    if (!this.hasStorage()) {
      return null;
    }
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  
  isTokenExpired(token: string): boolean {
    try {
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true;
      }

      const encodedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (encodedPayload.length % 4)) % 4);
      const payload: unknown = JSON.parse(atob(encodedPayload + padding));
      if (
        !payload ||
        typeof payload !== 'object' ||
        !('exp' in payload) ||
        typeof payload.exp !== 'number'
      ) {
        return true;
      }
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  }

  
  clearTokens(): void {
    if (this.hasStorage()) {
      sessionStorage.removeItem(this.accessTokenKey);
      sessionStorage.removeItem(this.refreshTokenKey);
    }
  }

  
  clearAllSensitiveData(): void {
    if (this.hasStorage()) {
      
      sessionStorage.removeItem(this.accessTokenKey);
      sessionStorage.removeItem(this.refreshTokenKey);
      
      sessionStorage.removeItem('user_data');
      sessionStorage.removeItem('auth_session');
      sessionStorage.removeItem('device_id');
    }

    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('remember_me');
      localStorage.removeItem('user_preferences');
    }
  }

  
  isSessionActive(): boolean {
    return this.hasStorage() && sessionStorage.length > 0;
  }

  
  private hasStorage(): boolean {
    return typeof sessionStorage !== 'undefined';
  }
}
