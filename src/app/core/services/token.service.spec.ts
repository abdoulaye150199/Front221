import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TokenService } from './token.service';

function createToken(exp: number): string {
  const payload = btoa(JSON.stringify({ exp }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `header.${payload}.signature`;
}

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [TokenService] });
    service = TestBed.inject(TokenService);
  });

  it('stores and reads both tokens', () => {
    service.setTokens('access', 'refresh');

    expect(service.getAccessToken()).toBe('access');
    expect(service.getRefreshToken()).toBe('refresh');
    expect(service.isSessionActive()).toBe(true);
  });

  it('clears both tokens', () => {
    service.setTokens('access', 'refresh');
    service.clearTokens();

    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });

  it('recognizes a valid base64url token', () => {
    const token = createToken(Math.floor(Date.now() / 1000) + 60);

    expect(service.isTokenExpired(token)).toBe(false);
  });

  it('recognizes an expired token', () => {
    const token = createToken(Math.floor(Date.now() / 1000) - 60);

    expect(service.isTokenExpired(token)).toBe(true);
  });

  it('rejects malformed tokens and payloads', () => {
    expect(service.isTokenExpired('invalid')).toBe(true);
    expect(service.isTokenExpired('a.not-json.c')).toBe(true);
    expect(service.isTokenExpired(`a.${btoa('{}')}.c`)).toBe(true);
  });

  it('clears all known sensitive values', () => {
    service.setTokens('access', 'refresh');
    sessionStorage.setItem('user_data', '{}');
    localStorage.setItem('auth_token', 'legacy');

    service.clearAllSensitiveData();

    expect(sessionStorage.getItem('access_token')).toBeNull();
    expect(sessionStorage.getItem('refresh_token')).toBeNull();
    expect(sessionStorage.getItem('user_data')).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
