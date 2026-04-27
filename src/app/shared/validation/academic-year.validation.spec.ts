import { describe, expect, it } from 'vitest';
import {
  formatAcademicYearDate,
  formatAcademicYearLabel,
  isAcademicYearFormValid,
  normalizeAcademicDateInput,
  validateAcademicYearForm,
} from './academic-year.validation';

describe('academic year validation', () => {
  it('should accept a valid academic year payload', () => {
    expect(isAcademicYearFormValid('2024-2025', '07/10/2024', '31/07/2025')).toBe(true);
  });

  it('should reject an invalid school year format', () => {
    expect(validateAcademicYearForm('2024/2025', '07/10/2024', '31/07/2025').year).toBe(
      'Utilisez le format AAAA-AAAA.'
    );
  });

  it('should reject non-consecutive years', () => {
    expect(validateAcademicYearForm('2024-2027', '07/10/2024', '31/07/2025').year).toBe(
      'L’année scolaire doit couvrir deux années consécutives.'
    );
  });

  it('should reject a closing date earlier than the opening date', () => {
    expect(validateAcademicYearForm('2024-2025', '07/10/2024', '31/07/2024').endDate).toBe(
      'La date de fermeture doit être postérieure à la date d’ouverture.'
    );
  });

  it('should reject dates that do not match the selected school year', () => {
    const errors = validateAcademicYearForm('2024-2025', '07/10/2023', '31/07/2026');

    expect(errors.startDate).toBe(
      'La date d’ouverture doit appartenir à la première année saisie.'
    );
    expect(errors.endDate).toBe(
      'La date de fermeture doit appartenir à la deuxième année saisie.'
    );
  });

  it('should format stored values for display', () => {
    expect(formatAcademicYearLabel('2024 - 2025')).toBe('2024-2025');
    expect(formatAcademicYearDate('2024-10-07')).toBe('07/10/2024');
  });

  it('should reject invalid display date formats', () => {
    expect(validateAcademicYearForm('2024-2025', '2024/10/07', '31/07/2025').startDate).toBe(
      'Utilisez le format JJ/MM/AAAA pour la date d’ouverture.'
    );
  });

  it('should reject impossible calendar dates', () => {
    expect(validateAcademicYearForm('2024-2025', '31/02/2024', '31/07/2025').startDate).toBe(
      'Utilisez le format JJ/MM/AAAA pour la date d’ouverture.'
    );
  });

  it('should normalize typed date input', () => {
    expect(normalizeAcademicDateInput('07102024')).toBe('07/10/2024');
    expect(normalizeAcademicDateInput('07a10b2024')).toBe('07/10/2024');
  });
});
