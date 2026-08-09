import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { MOCK_USERS } from './mock-users';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  userInitial: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  tokens?: JwtTokens | null;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

/**
 * Service d'authentification unifié
 * Gère l'authentification locale et les tokens JWT (démo)
 *
 * NOTE: En production, l'authentification doit être gérée par un backend sécurisé.
 * - Le hachage de mot de passe doit se faire côté serveur (bcrypt)
 * - Les JWT doivent être signés avec un secret sécurisé
 * - Les credentials ne doivent jamais être stockés côté client
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly tokenService: TokenService,
    private readonly http: HttpClient,
  ) {
    this.validateStoredToken();
  }

  /**
   * Login avec email/téléphone et mot de passe
   * Retourne une réponse avec JWT tokens (en mode démo)
   */
  login(phoneOrEmail: string, password: string): Observable<AuthResponse> {
    if (!environment.mockData) {
      return this.http
        .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
          identifier: phoneOrEmail.trim(),
          password,
        })
        .pipe(
          tap((response) => this.applySuccessfulAuthentication(response)),
          catchError((error: HttpErrorResponse) =>
            of({
              success: false,
              message:
                error.status === 401
                  ? 'Email/téléphone ou mot de passe invalide'
                  : 'Service de connexion momentanément indisponible',
            }),
          ),
        );
    }

    try {
      const normalizedIdentifier = phoneOrEmail.trim().toLowerCase();
      const users = this.getAllUsers();

      // Trouver l'utilisateur
      const user = users.find(
        (u) => u.email.toLowerCase() === normalizedIdentifier || u.phone === phoneOrEmail.trim(),
      );

      if (!user) {
        return of({
          success: false,
          message: 'Email/téléphone ou mot de passe invalide',
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = this.verifyPassword(password, user.passwordHash, user.salt);
      if (!isPasswordValid) {
        return of({
          success: false,
          message: 'Email/téléphone ou mot de passe invalide',
        });
      }

      // Créer les tokens JWT (uniquement en mode démo/mock)
      const tokens = environment.mockData ? this.generateJwtTokens(user) : null;
      const userWithoutPassword = this.toUser(user);

      // Sauvegarder les tokens et l'utilisateur (uniquement en démo)
      if (tokens) {
        this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
      }
      this.persistUser(userWithoutPassword);

      return of({
        success: true,
        user: userWithoutPassword,
        tokens,
      });
    } catch {
      return of({
        success: false,
        message: 'Une erreur est survenue lors de la connexion',
      });
    }
  }

  /**
   * Logout utilisateur
   * Détruit complètement la session et les données sensibles
   */
  logout(): void {
    this.tokenService.clearAllSensitiveData();
    this.currentUserSubject.next(null);
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return false;
    }
    return !this.tokenService.isTokenExpired(token);
  }

  /**
   * Récupérer le token d'accès actuel
   */
  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  /**
   * Récupérer le refresh token
   */
  getRefreshToken(): string | null {
    return this.tokenService.getRefreshToken();
  }

  /**
   * Rafraîchir le token d'accès
   * En production, cela appellerait un endpoint backend
   */
  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return of({
        success: false,
        message: 'Pas de token de rafraîchissement',
      });
    }

    if (!environment.mockData) {
      return this.http
        .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
        .pipe(
          tap((response) => this.applySuccessfulAuthentication(response)),
          catchError(() => {
            this.logout();
            return of({
              success: false,
              message: 'La session a expiré',
            });
          }),
        );
    }

    try {
      const user = this.currentUserSubject.value;
      if (!user) {
        return of({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      const users = this.getAllUsers();
      const storedUser = users.find((u) => u.id === user.id);

      if (!storedUser) {
        return of({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      // En mode démo, générer de nouveaux tokens
      const newTokens = environment.mockData ? this.generateJwtTokens(storedUser) : null;
      if (newTokens) {
        this.tokenService.setTokens(newTokens.accessToken, newTokens.refreshToken);
      }

      return of({
        success: true,
        user: user,
        tokens: newTokens ?? undefined,
      });
    } catch {
      return of({
        success: false,
        message: 'Erreur lors du rafraîchissement du token',
      });
    }
  }

  /**
   * Générer des tokens JWT (mode démo uniquement)
   * En production, les tokens sont générés par le backend
   */
  private generateJwtTokens(user: StoredUser): JwtTokens {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiry = environment.auth.tokenExpiry;
    const refreshTokenExpiry = environment.auth.refreshTokenExpiry;

    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      iat: now,
      exp: now + accessTokenExpiry,
    };

    const refreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
      iat: now,
      exp: now + refreshTokenExpiry,
    };

    return {
      accessToken: this.createJwt(accessTokenPayload),
      refreshToken: this.createJwt(refreshTokenPayload),
      expiresIn: accessTokenExpiry,
    };
  }

  /**
   * Créer un JWT factice (démo uniquement)
   * En production, utiliser une librairie JWT côté backend
   */
  private createJwt(payload: Record<string, unknown>): string {
    const header = { alg: 'HS256', typ: 'JWT' };

    // Encodage base64url (simulé avec btoa pour la démo)
    const headerEncoded = btoa(JSON.stringify(header));
    const payloadEncoded = btoa(JSON.stringify(payload));

    // Valeur opaque de démonstration, sans secret embarqué.
    const signature = btoa(`${String(payload['sub'])}.${String(payload['iat'])}`);

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  /**
   * Vérifier le mot de passe
   * NOTE: En production, cette vérification doit se faire côté serveur
   */
  private verifyPassword(password: string, hash: string, salt: string): boolean {
    // Implémentation simple pour la démo (base64 n'est PAS un hachage sécurisé)
    // EN PRODUCTION: Utiliser bcrypt côté serveur uniquement
    const simpleHash = btoa(password + salt);
    return simpleHash === hash;
  }

  /**
   * Convertir StoredUser en User sans mot de passe
   */
  private toUser(user: StoredUser): User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      userInitial: user.userInitial,
    };
  }

  /**
   * Récupérer tous les utilisateurs depuis APP_DATA
   */
  private getAllUsers(): StoredUser[] {
    return MOCK_USERS;
  }

  /**
   * Récupérer l'utilisateur depuis le sessionStorage
   */
  private getUserFromStorage(): User | null {
    if (!this.hasStorage()) {
      return null;
    }

    try {
      const user = sessionStorage.getItem('user_data');
      if (!user) {
        return null;
      }

      const parsedUser: unknown = JSON.parse(user);
      return this.isUser(parsedUser) ? parsedUser : null;
    } catch {
      return null;
    }
  }

  /**
   * Persister l'utilisateur dans sessionStorage
   */
  private persistUser(user: User): void {
    if (this.hasStorage()) {
      sessionStorage.setItem('user_data', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private applySuccessfulAuthentication(response: AuthResponse): void {
    if (!response.success || !response.user || !response.tokens) {
      return;
    }

    this.tokenService.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    this.persistUser(response.user);
  }

  /**
   * Valider le token stocké
   */
  private validateStoredToken(): void {
    const token = this.tokenService.getAccessToken();
    if (token && this.tokenService.isTokenExpired(token)) {
      this.logout();
    }
  }

  /**
   * Type guard pour User
   */
  private isUser(value: unknown): value is User {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const obj = value as Record<string, unknown>;
    return (
      typeof obj['id'] === 'string' &&
      typeof obj['firstName'] === 'string' &&
      typeof obj['lastName'] === 'string' &&
      typeof obj['email'] === 'string' &&
      typeof obj['phone'] === 'string' &&
      typeof obj['role'] === 'string'
    );
  }

  /**
   * Vérifier si le stockage est disponible
   */
  private hasStorage(): boolean {
    return typeof sessionStorage !== 'undefined';
  }
}
