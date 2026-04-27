import { hasTextValue } from './validation.utils';

export interface AcademicYearValidationErrors {
  year: string | null;
  startDate: string | null;
  endDate: string | null;
}

const SCHOOL_YEAR_PATTERN = /^(\d{4})\s*-\s*(\d{4})$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

interface ParsedAcademicDate {
  day: string;
  month: string;
  year: string;
  timestamp: number;
}

function normalizeSchoolYear(value: string): string {
  return value.trim().replace(/\s+/g, '');
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export function normalizeAcademicDateInput(value: string): string {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
  const day = digitsOnly.slice(0, 2);
  const month = digitsOnly.slice(2, 4);
  const year = digitsOnly.slice(4, 8);

  return [day, month, year].filter(Boolean).join('/');
}

function parseAcademicDate(value: string): ParsedAcademicDate | null {
  const trimmedValue = value.trim();

  if (ISO_DATE_PATTERN.test(trimmedValue)) {
    const [year, month, day] = trimmedValue.split('-');
    const dayNumber = Number(day);
    const monthNumber = Number(month);
    const yearNumber = Number(year);

    if (
      monthNumber < 1 ||
      monthNumber > 12 ||
      dayNumber < 1 ||
      dayNumber > getDaysInMonth(monthNumber, yearNumber)
    ) {
      return null;
    }

    const timestamp = new Date(yearNumber, monthNumber - 1, dayNumber).getTime();
    return { day, month, year, timestamp };
  }

  const displayMatch = trimmedValue.match(DISPLAY_DATE_PATTERN);
  if (!displayMatch) {
    return null;
  }

  const [, day, month, year] = displayMatch;
  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);

  if (
    monthNumber < 1 ||
    monthNumber > 12 ||
    dayNumber < 1 ||
    dayNumber > getDaysInMonth(monthNumber, yearNumber)
  ) {
    return null;
  }

  const timestamp = new Date(yearNumber, monthNumber - 1, dayNumber).getTime();
  return { day, month, year, timestamp };
}

export function formatAcademicYearLabel(value: string): string {
  const normalizedValue = normalizeSchoolYear(value);
  const match = normalizedValue.match(SCHOOL_YEAR_PATTERN);

  if (!match) {
    return normalizedValue;
  }

  return `${match[1]}-${match[2]}`;
}

export function formatAcademicYearDate(value: string): string {
  const parsedDate = parseAcademicDate(value);
  if (!parsedDate) {
    return value;
  }

  return `${parsedDate.day}/${parsedDate.month}/${parsedDate.year}`;
}

export function validateAcademicYearForm(
  year: string,
  startDate: string,
  endDate: string
): AcademicYearValidationErrors {
  const errors: AcademicYearValidationErrors = {
    year: null,
    startDate: null,
    endDate: null,
  };

  const normalizedYear = normalizeSchoolYear(year);
  const schoolYearMatch = normalizedYear.match(SCHOOL_YEAR_PATTERN);
  const parsedStartDate = parseAcademicDate(startDate);
  const parsedEndDate = parseAcademicDate(endDate);

  if (!hasTextValue(year)) {
    errors.year = 'L’année scolaire est obligatoire.';
  } else if (!schoolYearMatch) {
    errors.year = 'Utilisez le format AAAA-AAAA.';
  } else if (Number(schoolYearMatch[2]) !== Number(schoolYearMatch[1]) + 1) {
    errors.year = 'L’année scolaire doit couvrir deux années consécutives.';
  }

  if (!hasTextValue(startDate)) {
    errors.startDate = 'La date d’ouverture est obligatoire.';
  } else if (!parsedStartDate) {
    errors.startDate = 'Utilisez le format JJ/MM/AAAA pour la date d’ouverture.';
  }

  if (!hasTextValue(endDate)) {
    errors.endDate = 'La date de fermeture est obligatoire.';
  } else if (!parsedEndDate) {
    errors.endDate = 'Utilisez le format JJ/MM/AAAA pour la date de fermeture.';
  }

  if (!errors.startDate && !errors.endDate && parsedStartDate && parsedEndDate
    && parsedStartDate.timestamp >= parsedEndDate.timestamp) {
    errors.endDate = 'La date de fermeture doit être postérieure à la date d’ouverture.';
  }

  if (schoolYearMatch && !errors.startDate && parsedStartDate
    && parsedStartDate.year !== schoolYearMatch[1]) {
    errors.startDate = 'La date d’ouverture doit appartenir à la première année saisie.';
  }

  if (schoolYearMatch && !errors.endDate && parsedEndDate
    && parsedEndDate.year !== schoolYearMatch[2]) {
    errors.endDate = 'La date de fermeture doit appartenir à la deuxième année saisie.';
  }

  return errors;
}

export function isAcademicYearFormValid(
  year: string,
  startDate: string,
  endDate: string
): boolean {
  const errors = validateAcademicYearForm(year, startDate, endDate);

  return !errors.year && !errors.startDate && !errors.endDate;
}
