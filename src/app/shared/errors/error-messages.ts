import { APP_DATA } from '../data';

interface AuthErrorMessages {
  phoneOrEmailRequired: string;
  phoneOrEmailInvalid: string;
  passwordRequired: string;
  passwordMinLengthTemplate: string;
  invalidCredentials: string;
}

const authErrorMessages = APP_DATA.errors.auth as AuthErrorMessages;
const passwordMinLength = APP_DATA.validation.auth.rules.passwordMinLength;

export const AUTH_ERROR_MESSAGES = {
  ...authErrorMessages,
  passwordMinLength: authErrorMessages.passwordMinLengthTemplate.replace(
    '{min}',
    String(passwordMinLength)
  ),
};
