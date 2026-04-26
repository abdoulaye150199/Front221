import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should authenticate a user with valid email credentials', async () => {
    const response = await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));

    expect(response.success).toBe(true);
    expect(response.user).toEqual({
      id: 'admin-001',
      firstName: 'Amadou',
      lastName: 'Diallo',
      email: 'admin@ecole221.sn',
      phone: '+221771234567',
      role: 'Administrateur',
      userInitial: 'A',
    });

    expect(localStorage.getItem('currentUser')).toContain('admin@ecole221.sn');
    expect(localStorage.getItem('currentUser')).not.toContain('password');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should reject invalid credentials', async () => {
    const response = await firstValueFrom(service.login('admin@ecole221.sn', 'wrong-password'));

    expect(response.success).toBe(false);
    expect(response.message).toBe('Email/téléphone ou mot de passe invalide.');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear the current user on logout', async () => {
    await firstValueFrom(service.login('admin@ecole221.sn', 'Admin@123'));
    service.logout();

    expect(service.getCurrentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should restore a valid user from local storage', () => {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: 'admin-001',
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'admin@ecole221.sn',
        phone: '+221771234567',
        role: 'Administrateur',
        userInitial: 'A',
      })
    );

    const restoredService = new AuthService();
    expect(restoredService.getCurrentUser()?.email).toBe('admin@ecole221.sn');
  });
});
