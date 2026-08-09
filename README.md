# Ecole 221

Application Angular de gestion scolaire : tableau de bord, ressources
académiques, cours, référentiel, professeurs, planning, inscriptions et
paiements.

## Prérequis

- Node.js 20
- npm 10

## Installation et commandes

```bash
npm ci
npm start
```

Vérifications disponibles :

```bash
npm run build
npm run build:vercel
npm run test:ci
npm run test:coverage
npm run format:check
npm audit
```

## Architecture

```text
src/app/
├── core/       # authentification, session, guards et intercepteurs globaux
├── features/   # fonctionnalités métier chargées à la demande
└── shared/     # composants, modèles, validation et utilitaires réutilisables
```

- Les fonctionnalités applicatives sont lazy-loadées depuis `app.routes.ts`.
- Les composants de page sont standalone, encapsulés par les modules de
  routage des features.
- `AuthService` utilise les données de démonstration uniquement avec
  `environment.mockData: true`.
- La production utilise les endpoints `/auth/login` et `/auth/refresh` du
  backend configuré par `environment.apiUrl`.
- Le rendu SSR est effectué à la requête. Le build Vercel produit une
  application cliente statique.

## Environnements

Le build de production remplace automatiquement
`src/environments/environment.ts` par `environment.prod.ts`.

Les secrets ne doivent jamais être placés dans les fichiers d'environnement
Angular : leur contenu est public dans le bundle navigateur.

Le backend de production doit :

- vérifier les mots de passe côté serveur ;
- signer et valider les JWT ;
- appliquer l'autorisation sur chaque endpoint ;
- protéger le renouvellement de session, idéalement avec un cookie
  `HttpOnly`, `Secure` et `SameSite`;
- limiter les tentatives de connexion et journaliser les événements de
  sécurité.

## Qualité et accessibilité

La CI doit bloquer une livraison si le build ou les tests échouent. Les
contrôles manuels recommandés avant mise en production sont :

- audit Lighthouse sur mobile et desktop ;
- audit axe/WCAG 2.2 AA ;
- navigation complète au clavier et test lecteur d'écran ;
- tests E2E des parcours connexion, CRUD et déconnexion ;
- revue des budgets de bundle et des dépendances npm.

## Limites actuelles

Les données fonctionnelles hors authentification sont encore majoritairement
mockées en mémoire. Leur branchement à une API doit conserver les frontières
`features`/`core` et ajouter les tests d'intégration correspondants.
