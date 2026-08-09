import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

let accessToken: string | null = null;
let refreshToken: string | null = null;
const mockTokenService = {
  setTokens: vi.fn((access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
  }),
  getAccessToken: vi.fn(() => accessToken),
  getRefreshToken: vi.fn(() => refreshToken),
  isTokenExpired: vi.fn().mockReturnValue(false),
  clearAllSensitiveData: vi.fn(() => {
    accessToken = null;
    refreshToken = null;
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;

  beforeEach(() => {
    accessToken = null;
    refreshToken = null;
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();

    tokenService = mockTokenService as unknown as TokenService;
    service = new AuthService(tokenService, {} as HttpClient);
  });

  afterEach(() => {
    service.logout();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));

      expect(response.success).toBe(true);
      expect(response.user?.email).toBe('admin@ecole221.sn');
    });

    it('should fail login with invalid credentials', async () => {
      const response = await firstValueFrom(service.login('invalid@test.com', 'wrongpassword'));

      expect(response.success).toBe(false);
      expect(response.message).toContain('invalide');
    });

    it('should set tokens in tokenService when mockData is enabled', async () => {
      await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));

      expect(tokenService.setTokens).toHaveBeenCalledOnce();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return user after successful login', async () => {
      await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));

      expect(service.getCurrentUser()?.email).toBe('admin@ecole221.sn');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true after successful login', async () => {
      await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));

      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear user and tokens on logout', async () => {
      await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));
      service.logout();

      expect(service.getCurrentUser()).toBeNull();
      expect(tokenService.clearAllSensitiveData).toHaveBeenCalled();
    });
  });

  describe('getAccessToken / getRefreshToken', () => {
    it('should return tokens after login', async () => {
      await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));

      expect(service.getAccessToken()).toBeTruthy();
      expect(service.getRefreshToken()).toBeTruthy();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh token successfully when valid refresh token exists', async () => {
      await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));
      const response = await firstValueFrom(service.refreshAccessToken());

      expect(response.success).toBe(true);
      expect(response.tokens).toBeTruthy();
    });

    it('should fail when no refresh token', async () => {
      const response = await firstValueFrom(service.refreshAccessToken());

      expect(response.success).toBe(false);
      expect(response.message).toContain('Pas de token');
    });
  });
});
