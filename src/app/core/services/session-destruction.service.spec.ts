import { TestBed } from '@angular/core/testing';
import { NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SessionDestructionService } from './session-destruction.service';
import { AuthService } from './auth.service';

// Mock services
const mockAuthService = {
  isAuthenticated: vi.fn(() => true),
  logout: vi.fn(),
};

const mockRouter = {
  navigate: vi.fn(),
};

describe('SessionDestructionService', () => {
  let service: SessionDestructionService;
  let authService: AuthService;
  let router: Router;
  let ngZone: NgZone;

  const mockPlatformId = 'browser';

  beforeEach(() => {
    // Clear any existing timers
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        SessionDestructionService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: mockPlatformId },
      ],
    });

    service = TestBed.inject(SessionDestructionService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
  });

  afterEach(() => {
    vi.useRealTimers();
    service['performCleanup']();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSessionStatus', () => {
    it('should return session status object', () => {
      const status = service.getSessionStatus();

      expect(status).toHaveProperty('isActive');
      expect(status).toHaveProperty('remainingTime');
      expect(status).toHaveProperty('lastActivity');
      expect(typeof status.isActive).toBe('boolean');
      expect(typeof status.remainingTime).toBe('number');
      expect(status.lastActivity instanceof Date).toBe(true);
    });
  });

  describe('getRemainingInactivityTime', () => {
    it('should return remaining time in seconds', () => {
      const remaining = service.getRemainingInactivityTime();

      expect(typeof remaining).toBe('number');
      expect(remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe('forceLogout', () => {
    it('should call authService.logout and navigate to login', () => {
      service.forceLogout();

      expect(authService.logout).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('session monitoring', () => {
    it('should handle inactivity timeout', async () => {
      // Set last activity to more than 30 minutes ago
      service['lastActivityTime'] = Date.now() - 31 * 60 * 1000;

      // Manually trigger the inactivity handler
      service['handleInactivityLogout']();

      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
