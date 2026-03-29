import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      phoneOrEmail: ['', [Validators.required, this.phoneOrEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Custom validator for phone or email
  private phoneOrEmailValidator(control: any) {
    if (!control.value) {
      return null;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{8,}$/; // At least 8 digits

    if (emailPattern.test(control.value) || phonePattern.test(control.value.replace(/\D/g, ''))) {
      return null;
    }

    return { invalidPhoneOrEmail: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { phoneOrEmail, password } = this.loginForm.value;
      console.log('Login attempt:', { phoneOrEmail, password });
      // TODO: Implement authentication logic
    }
  }
}
