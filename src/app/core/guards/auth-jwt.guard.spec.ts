import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '@angular/router';
import { AuthGuard, authGuard } from './auth-jwt.guard';
import { AuthService } from '../services/auth.service';

// Mock du service d'authentification
const mockAuthService = {
  isAuthenticated: vi.fn()
};

// Mock du router
const mockRouter = {
  navigate: vi.fn()
};

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    // Reset mocks before each test
    mockAuthService.isAuthenticated.mockReset();
    mockRouter.navigate.mockReset();

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate (class guard)', () => {
    it('should return true when user is authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const result = guard.canActivate(null as any, null as any);

      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const state = { url: '/dashboard' } as any;

      const result = guard.canActivate(null as any, state);

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/dashboard' } });
    });
  });

  describe('authGuard (function guard)', () => {
    it('should return true when user is authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const result = authGuard(null as any, null as any);

      expect(result).toBe(true);
    });

    it('should return false and redirect when user is not authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const state = { url: '/dashboard' } as any;

      const result = authGuard(null as any, state);

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/dashboard' } });
    });
  });
});
