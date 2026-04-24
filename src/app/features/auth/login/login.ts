import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_ERROR_MESSAGES } from '../../../shared/errors';
import { AUTH_VALIDATION_RULES, phoneOrEmailValidator } from '../../../shared/validation';
import { AuthService } from '../../../core/services/auth.service';

interface LoginFormModel {
  phoneOrEmail: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  readonly validationMessages = AUTH_ERROR_MESSAGES;
  loginForm: FormGroup<LoginFormModel>;
  showPassword = false;
  isLoading = false;
  loginError: string | null = null;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;

    try {
      const credentials = this.loginForm.getRawValue();
      const response = this.authService.login(credentials.phoneOrEmail, credentials.password);

      if (response.success) {
        // Redirect to dashboard on successful login
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = response.message || 'Erreur de connexion';
      }
    } catch (error) {
      this.loginError = 'Une erreur est survenue lors de la connexion';
    } finally {
      this.isLoading = false;
    }
  }
}
