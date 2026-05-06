/**
 * Constantes de l'application
 * Centralise toutes les valeurs magiques et chaînes de caractères utilisées dans l'application
 */

// === Statuts ===
export const STATUS_ACTIF = 'Actif' as const;
export const STATUS_INACTIF = 'Inactif' as const;

// === Tailles de page par défaut ===
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

// === Titres des onglets (Ressources) ===
export const TAB_TITLES = {
  ACADEMIC_YEARS: 'Années académiques',
  SPECIALITY_CATALOG: 'Domaines & spécialités',
  CLASS_STRUCTURE: 'Classes & sous-classes',
  UE_MODULE: 'UE & modules',
  PARAMETERS: 'Paramètres',
} as const;

// === Routes ===
export const ROUTES = {
  LOGIN: '/auth/login',
  DASHBOARD: '/dashboard',
  RESSOURCES: '/ressources',
  COURS: '/cours',
  REFERENTIEL: '/referentiel',
  PROFESSEURS: '/professeurs',
  PLANNING: '/planning',
  INSCRIPTIONS: '/inscriptions',
  PAIEMENT: '/paiement',
} as const;

// === Messages d'erreur ===
export const ERROR_MESSAGES = {
  DEFAULT: 'Une erreur est survenue',
  AUTH: {
    INVALID_CREDENTIALS: 'Email/téléphone ou mot de passe invalide',
    SESSION_EXPIRED: 'Votre session a expiré',
    TOKEN_REFRESH_FAILED: 'Échec du rafraîchissement du token',
  },
  NETWORK: 'Erreur de connexion au serveur',
} as const;

// === Validation ===
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_MIN_LENGTH: 8,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\d{8,}$/,
} as const;

// === Storage keys ===
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'currentUser',
  USER_DATA: 'user_data',
} as const;

// === Token expiry (seconds) ===
export const TOKEN_EXPIRY = {
  ACCESS: 15 * 60, // 15 minutes
  REFRESH: 7 * 24 * 60 * 60, // 7 jours
} as const;
