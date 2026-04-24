import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModule } from '../auth-module';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModule],
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
});
