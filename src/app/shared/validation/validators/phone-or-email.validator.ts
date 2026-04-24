import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{8,}$/;

export function phoneOrEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = `${control.value ?? ''}`.trim();

    if (!value) {
      return null;
    }

    const normalizedPhone = value.replace(/\D/g, '');
    const isValid = EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(normalizedPhone);

    return isValid ? null : { invalidPhoneOrEmail: true };
  };
}
