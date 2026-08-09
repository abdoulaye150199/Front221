import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { jwtHttpInterceptor } from './jwt-http.interceptor';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

const mockTokenService = {
  getAccessToken: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  getRefreshToken: vi.fn(() => null),
  setTokens: vi.fn(),
};

const mockAuthService = {
  refreshAccessToken: vi.fn(() =>
    of({
      success: true,
      tokens: {
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        expiresIn: 900,
      },
    }),
  ),
  logout: vi.fn(),
};

describe('JwtHttpInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockTokenService.getAccessToken.mockReturnValue(null);
    mockTokenService.isTokenExpired.mockReturnValue(false);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtHttpInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: mockTokenService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when making a request with valid token', () => {
    it('should add Authorization header', () => {
      mockTokenService.getAccessToken.mockReturnValue('valid-token');

      const testUrl = 'https://api.example.com/data';
      http.get(testUrl).subscribe();

      const request = httpMock.expectOne(testUrl);
      expect(request.request.headers.get('Authorization')).toBe('Bearer valid-token');
      request.flush({ ok: true });
    });

    it('should not add a token when it is expired', () => {
      mockTokenService.getAccessToken.mockReturnValue('expired-token');
      mockTokenService.isTokenExpired.mockReturnValue(true);

      http.get('/api/data').subscribe();

      const request = httpMock.expectOne('/api/data');
      expect(request.request.headers.has('Authorization')).toBe(false);
      request.flush({ ok: true });
    });
  });

  describe('when the API returns 401', () => {
    it('should refresh the token and retry the request', () => {
      mockTokenService.getAccessToken.mockReturnValue('old-token');

      http.get('/api/protected').subscribe();

      const firstRequest = httpMock.expectOne('/api/protected');
      firstRequest.flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(mockAuthService.refreshAccessToken).toHaveBeenCalledOnce();
      const retriedRequest = httpMock.expectOne('/api/protected');
      expect(retriedRequest.request.headers.get('Authorization')).toBe('Bearer new-token');
      retriedRequest.flush({ ok: true });
    });
  });
});
