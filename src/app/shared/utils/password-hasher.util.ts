/**
 * Utilitaire pour générer les données utilisateurs avec mots de passe hachés
 * À utiliser une fois pour migrer les données existantes
 */

// Simple hash function pour la démo (EN PRODUCTION: utiliser bcrypt côté serveur)
function simpleHashPassword(password: string, salt: string = 'ecole221'): string {
  return btoa(password + salt);
}

/**
 * Données utilisateurs avec mots de passe hachés
 */
export const generateHashedUsers = () => {
  const saltKey = 'ecole221';

  return {
    admin: [
      {
        id: 'admin-001',
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'admin@ecole221.sn',
        phone: '221701234567',
        passwordHash: simpleHashPassword('Admin@123', saltKey),
        salt: saltKey,
        role: 'Administrateur',
        userInitial: 'A',
      },
    ],
  };
};

/**
 * Fonction pour mettre à jour les mots de passe existants
 * Appeler une seule fois pour migrer les données
 */
export function migratePasswordsToHashed(): void {
  const hashedUsersData = generateHashedUsers();
  // Cette fonction serait appelée lors du démarrage pour initialiser les données
  console.log('Users data with hashed passwords:', hashedUsersData);
}
