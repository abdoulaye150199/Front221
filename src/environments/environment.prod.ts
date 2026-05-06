// Configuration de l'environnement de production
// Ces valeurs sont utilisées pour le déploiement en production
export const environment = {
  production: true,
  // API endpoints (à modifier selon votre backend)
  apiUrl: 'https://api.ecole-221.com/v1',
  // Authentification
  auth: {
    tokenExpiry: 900, // 15 minutes en secondes
    refreshTokenExpiry: 604800, // 7 jours en secondes
  },
  // Application
  appName: 'Ecole-221',
  version: '1.0.0',
  // Features
  enableDebug: false,
  mockData: false, // Utiliser l'API réelle en production
};
