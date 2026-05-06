// Configuration de l'environnement de développement
// Ces valeurs sont utilisées pour le développement local
export const environment = {
  production: false,
  // API endpoints
  apiUrl: 'http://localhost:3000/api',
  // Authentification
  auth: {
    tokenExpiry: 900, // 15 minutes en secondes
    refreshTokenExpiry: 604800, // 7 jours en secondes
  },
  // Application
  appName: 'Ecole-221',
  version: '1.0.0',
  // Features
  enableDebug: true,
  mockData: true, // Utiliser les données mockées (APP_DATA)
};
