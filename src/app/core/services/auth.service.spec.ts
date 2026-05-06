import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { APP_DATA } from '../../shared/data';

// Mock du TokenService
const mockTokenService = {
  setTokens: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue(null),
  getRefreshToken: vi.fn().mockReturnValue(null),
  isTokenExpired: vi.fn().mockReturnValue(false),
  clearAllSensitiveData: vi.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;

  beforeEach(() => {
    // Nettoyer le storage avant chaque test
    sessionStorage.clear();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: TokenService, useValue: mockTokenService }
      ]
    });
    service = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    service.logout();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      const phoneOrEmail = 'admin@ecole-221.com';
      const password = 'password123';

      const result = service.login(phoneOrEmail, password);
      result.subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.user).toBeTruthy();
        expect(response.user?.email).toBe(phoneOrEmail);
      });
    });

    it('should fail login with invalid credentials', () => {
      const phoneOrEmail = 'invalid@test.com';
      const password = 'wrongpassword';

      const result = service.login(phoneOrEmail, password);
      result.subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.message).toContain('invalide');
      });
    });

    it('should set tokens in tokenService when mockData is enabled', () => {
      const phoneOrEmail = 'admin@ecole-221.com';
      const password = 'password123';

      const result = service.login(phoneOrEmail, password);
      result.subscribe(() => {
        expect(tokenService.setTokens).toHaveBeenCalled();
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return user after successful login', () => {
      const phoneOrEmail = 'admin@ecole-221.com';
      const password = 'password123';

      service.login(phoneOrEmail, password).subscribe(() => {
        const user = service.getCurrentUser();
        expect(user).toBeTruthy();
        expect(user?.email).toBe(phoneOrEmail);
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true after successful login', () => {
      service.login('admin@ecole-221.com', 'password123').subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
      });
    });
  });

  describe('logout', () => {
    it('should clear user and tokens on logout', () => {
      // Login first
      service.login('admin@ecole-221.com', 'password123').subscribe(() => {
        // Then logout
        service.logout();

        expect(service.getCurrentUser()).toBeNull();
        expect(tokenService.clearAllSensitiveData).toHaveBeenCalled();
      });
    });
  });

  describe('getAccessToken / getRefreshToken', () => {
    it('should return tokens after login', () => {
      service.login('admin@ecole-221.com', 'password123').subscribe(() => {
        expect(service.getAccessToken()).toBeTruthy();
        // Note: refresh token may not be set in all scenarios
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh token successfully when valid refresh token exists', () => {
      // Login to get tokens
      service.login('admin@ecole-221.com', 'password123').subscribe(() => {
        const result = service.refreshAccessToken();
        result.subscribe(response => {
          expect(response.success).toBe(true);
          expect(response.tokens).toBeTruthy();
        });
      });
    });

    it('should fail when no refresh token', () => {
      const result = service.refreshAccessToken();
      result.subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.message).toContain('Pas de token');
      });
    });
  });
});
