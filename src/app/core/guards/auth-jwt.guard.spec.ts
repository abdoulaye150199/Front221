import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuard, authGuard } from './auth-jwt.guard';
import { AuthService } from '../services/auth.service';

// Mock du service d'authentification
const mockAuthService = {
  isAuthenticated: vi.fn(),
};

// Mock du router
const mockRouter = {
  createUrlTree: vi.fn(),
};

describe('AuthGuard', () => {
  let guard: AuthGuard;
  beforeEach(() => {
    mockAuthService.isAuthenticated.mockReset();
    mockRouter.createUrlTree.mockReset();
    mockRouter.createUrlTree.mockReturnValue({ redirect: true } as unknown as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate (class guard)', () => {
    it('should return true when user is authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const result = guard.canActivate(
        {} as ActivatedRouteSnapshot,
        { url: '/dashboard' } as RouterStateSnapshot,
      );

      expect(result).toBe(true);
      expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const result = guard.canActivate(
        {} as ActivatedRouteSnapshot,
        { url: '/dashboard' } as RouterStateSnapshot,
      );

      expect(result).toEqual({ redirect: true });
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/auth/login'], {
        queryParams: { returnUrl: '/dashboard' },
      });
    });
  });

  describe('authGuard (function guard)', () => {
    it('should return true when user is authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, { url: '/dashboard' } as RouterStateSnapshot),
      );

      expect(result).toBe(true);
    });

    it('should return a login UrlTree when user is not authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, { url: '/dashboard' } as RouterStateSnapshot),
      );

      expect(result).toEqual({ redirect: true });
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/auth/login'], {
        queryParams: { returnUrl: '/dashboard' },
      });
    });
  });
});
