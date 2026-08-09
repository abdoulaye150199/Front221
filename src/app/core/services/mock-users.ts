import type { StoredUser } from './auth.service';

/**
 * Compte strictement réservé au mode de démonstration local.
 * Ce fichier est remplacé par `mock-users.prod.ts` dans tous les builds
 * de production.
 */
export const MOCK_USERS: StoredUser[] = [
  {
    id: 'admin-001',
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'admin@ecole221.sn',
    phone: '+221771234567',
    passwordHash: 'QWRtaW5AMTIzZWNvbGUyMjE=',
    salt: 'ecole221',
    role: 'Administrateur',
    userInitial: 'A',
  },
];
