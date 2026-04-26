import { FormControl } from '@angular/forms';

import { phoneOrEmailValidator } from './phone-or-email.validator';

describe('phoneOrEmailValidator', () => {
  const validator = phoneOrEmailValidator();

  it('should accept empty values so required validation can handle them', () => {
    expect(validator(new FormControl(''))).toBeNull();
  });

  it('should accept a valid email address', () => {
    expect(validator(new FormControl('admin@ecole221.com'))).toBeNull();
  });

  it('should accept a valid phone number with formatting characters', () => {
    expect(validator(new FormControl('+221 77 123 45 67'))).toBeNull();
  });

  it('should reject an invalid identifier', () => {
    expect(validator(new FormControl('not-a-login'))).toEqual({ invalidPhoneOrEmail: true });
  });
});
