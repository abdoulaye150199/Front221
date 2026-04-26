import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthModule } from '../auth-module';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: Pick<AuthService, 'login'>;
  let router: Pick<Router, 'navigate'>;

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
    };
    router = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [AuthModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form as invalid', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should toggle the password field type', () => {
    expect(component.passwordFieldType).toBe('password');

    component.togglePasswordVisibility();

    expect(component.passwordFieldType).toBe('text');
  });

  it('should navigate to dashboard when login succeeds', () => {
    vi.mocked(authService.login).mockReturnValue(of({ success: true }));
    component.loginForm.setValue({
      phoneOrEmail: 'admin@ecole221.com',
      password: 'admin123',
    });

    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('admin@ecole221.com', 'admin123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loginError).toBeNull();
    expect(component.isLoading).toBe(false);
  });

  it('should expose the backend error when login fails', () => {
    vi.mocked(authService.login).mockReturnValue(of({ success: false, message: 'Identifiants invalides' }));
    component.loginForm.setValue({
      phoneOrEmail: 'admin@ecole221.com',
      password: 'wrong-password',
    });

    component.onLogin();

    expect(component.loginError).toBe('Identifiants invalides');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should show a generic error when login throws', () => {
    vi.mocked(authService.login).mockReturnValue(throwError(() => new Error('Network error')));
    component.loginForm.setValue({
      phoneOrEmail: 'admin@ecole221.com',
      password: 'admin123',
    });

    component.onLogin();

    expect(component.loginError).toBe('Une erreur est survenue lors de la connexion');
    expect(component.isLoading).toBe(false);
  });
});
