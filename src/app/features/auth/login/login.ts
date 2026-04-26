import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AUTH_ERROR_MESSAGES } from '../../../shared/errors';
import { AUTH_VALIDATION_RULES } from '../../../shared/validation';
import { AuthService } from '../../../core/services/auth.service';
import { phoneOrEmailValidator } from '../validators/phone-or-email.validator';
import { LOGIN_ICONS } from './login.icons';

interface LoginFormModel {
  phoneOrEmail: FormControl<string>;
  password: FormControl<string>;
}

interface LoginIconsViewModel {
  google: SafeHtml;
  email: SafeHtml;
  password: SafeHtml;
  passwordEye: SafeHtml;
  error: SafeHtml;
  features: {
    secure: SafeHtml;
    tracking: SafeHtml;
    dashboard: SafeHtml;
  };
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  readonly validationMessages = AUTH_ERROR_MESSAGES;
  readonly icons: LoginIconsViewModel;
  readonly loginForm: FormGroup<LoginFormModel>;
  showPassword = false;
  isLoading = false;
  loginError: string | null = null;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.icons = this.createSafeIcons();
    this.loginForm = this.fb.group({
      phoneOrEmail: ['', [Validators.required, phoneOrEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(AUTH_VALIDATION_RULES.passwordMinLength)]],
    });
  }

  get phoneOrEmailControl(): FormControl<string> {
    return this.loginForm.controls.phoneOrEmail;
  }

  get passwordControl(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  get passwordFieldType(): 'password' | 'text' {
    return this.showPassword ? 'text' : 'password';
  }

  get phoneOrEmailErrorMessage(): string {
    if (!this.phoneOrEmailControl.touched || !this.phoneOrEmailControl.errors) {
      return '';
    }

    if (this.phoneOrEmailControl.hasError('required')) {
      return this.validationMessages.phoneOrEmailRequired;
    }

    if (this.phoneOrEmailControl.hasError('invalidPhoneOrEmail')) {
      return this.validationMessages.phoneOrEmailInvalid;
    }

    return '';
  }

  get passwordErrorMessage(): string {
    if (!this.passwordControl.touched || !this.passwordControl.errors) {
      return '';
    }

    if (this.passwordControl.hasError('required')) {
      return this.validationMessages.passwordRequired;
    }

    if (this.passwordControl.hasError('minlength')) {
      return this.validationMessages.passwordMinLength;
    }

    return '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;
    const credentials = this.loginForm.getRawValue();

    this.authService
      .login(credentials.phoneOrEmail, credentials.password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            void this.router.navigate(['/dashboard']);
            return;
          }

          this.loginError = response.message ?? 'Erreur de connexion';
        },
        error: () => {
          this.loginError = 'Une erreur est survenue lors de la connexion';
        },
      });
  }

  private createSafeIcons(): LoginIconsViewModel {
    return {
      google: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.google),
      email: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.email),
      password: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.password),
      passwordEye: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.passwordEye),
      error: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.error),
      features: {
        secure: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.features.secure),
        tracking: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.features.tracking),
        dashboard: this.sanitizer.bypassSecurityTrustHtml(LOGIN_ICONS.features.dashboard),
      },
    };
  }
}
