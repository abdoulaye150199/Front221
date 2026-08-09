import type { StoredUser } from './auth.service';

/**
 * Aucun identifiant de démonstration ne doit être livré dans les bundles
 * de production.
 */
export const MOCK_USERS: StoredUser[] = [];
