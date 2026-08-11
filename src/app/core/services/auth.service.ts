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

  
  login(phoneOrEmail: string, password: string): Observable<AuthResponse> {
    if (this.shouldUseOfflineDemoAuth()) {
      return of(this.createOfflineDemoSession(phoneOrEmail));
    }

    if (!environment.mockData) {
      return this.http
        .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
          identifier: phoneOrEmail.trim(),
          password,
        })
        .pipe(
          tap((response) => this.applySuccessfulAuthentication(response)),
          catchError((error: HttpErrorResponse) =>
            error.status === 0
              ? of(this.createOfflineDemoSession(phoneOrEmail))
              : of({
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

      
      const user = users.find(
        (u) => u.email.toLowerCase() === normalizedIdentifier || u.phone === phoneOrEmail.trim(),
      );

      if (!user) {
        return of({
          success: false,
          message: 'Email/téléphone ou mot de passe invalide',
        });
      }

      
      const isPasswordValid = this.verifyPassword(password, user.passwordHash, user.salt);
      if (!isPasswordValid) {
        return of({
          success: false,
          message: 'Email/téléphone ou mot de passe invalide',
        });
      }

      
      const tokens = environment.mockData ? this.generateJwtTokens(user) : null;
      const userWithoutPassword = this.toUser(user);

      
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

  
  logout(): void {
    this.tokenService.clearAllSensitiveData();
    this.currentUserSubject.next(null);
  }

  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  
  isAuthenticated(): boolean {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return false;
    }
    return !this.tokenService.isTokenExpired(token);
  }

  
  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  
  getRefreshToken(): string | null {
    return this.tokenService.getRefreshToken();
  }

  
  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return of({
        success: false,
        message: 'Pas de token de rafraîchissement',
      });
    }

    if (this.shouldUseOfflineDemoAuth()) {
      return this.refreshOfflineDemoSession();
    }

    if (!environment.mockData) {
      return this.http
        .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
        .pipe(
          tap((response) => this.applySuccessfulAuthentication(response)),
          catchError((error: HttpErrorResponse) =>
            error.status === 0
              ? this.refreshOfflineDemoSession()
              : this.handleExpiredSession(),
          ),
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

  
  private createJwt(payload: Record<string, unknown>): string {
    const header = { alg: 'HS256', typ: 'JWT' };

    
    const headerEncoded = btoa(JSON.stringify(header));
    const payloadEncoded = btoa(JSON.stringify(payload));

    
    const signature = btoa(`${String(payload['sub'])}.${String(payload['iat'])}`);

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  
  private verifyPassword(password: string, hash: string, salt: string): boolean {
    
    
    const simpleHash = btoa(password + salt);
    return simpleHash === hash;
  }

  
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

  
  private getAllUsers(): StoredUser[] {
    return MOCK_USERS;
  }

  private shouldUseOfflineDemoAuth(): boolean {
    if (environment.mockData) {
      return true;
    }

    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const apiOrigin = new URL(environment.apiUrl, window.location.origin).origin;
      return window.location.hostname.endsWith('vercel.app') && apiOrigin !== window.location.origin;
    } catch {
      return false;
    }
  }

  private createOfflineDemoSession(identifier: string): AuthResponse {
    const demoUser = this.createOfflineDemoStoredUser(identifier);
    const user = this.toUser(demoUser);
    const tokens = this.generateJwtTokens(demoUser);

    this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
    this.persistUser(user);

    return {
      success: true,
      user,
      tokens,
      message: 'Connexion hors ligne activée',
    };
  }

  private refreshOfflineDemoSession(): Observable<AuthResponse> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return of({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    const demoUser: StoredUser = {
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone,
      role: currentUser.role,
      userInitial: currentUser.userInitial,
      passwordHash: '',
      salt: '',
    };

    const tokens = this.generateJwtTokens(demoUser);
    this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);

    return of({
      success: true,
      user: currentUser,
      tokens,
    });
  }

  private handleExpiredSession(): Observable<AuthResponse> {
    this.logout();
    return of({
      success: false,
      message: 'La session a expiré',
    });
  }

  private createOfflineDemoStoredUser(identifier: string): StoredUser {
    const normalizedIdentifier = identifier.trim();
    const localPart = normalizedIdentifier.includes('@')
      ? normalizedIdentifier.split('@')[0]
      : normalizedIdentifier;
    const cleanedName = this.toDisplayName(localPart);
    const firstName = cleanedName.split(' ')[0] ?? 'Utilisateur';
    const lastName = cleanedName.split(' ').slice(1).join(' ') || 'Démo';
    const email = normalizedIdentifier.includes('@')
      ? normalizedIdentifier.toLowerCase()
      : `${cleanedName.toLowerCase().replace(/\s+/g, '.')}@ecole221.local`;
    const phone = normalizedIdentifier.includes('@') ? '+221700000000' : normalizedIdentifier;

    return {
      id: `offline-${cleanedName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'user'}`,
      firstName,
      lastName,
      email,
      phone,
      role: 'Administrateur',
      userInitial: firstName.charAt(0).toUpperCase() || 'E',
      passwordHash: '',
      salt: '',
    };
  }

  private toDisplayName(value: string): string {
    const words = value
      .replace(/[._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);

    if (words.length === 0) {
      return 'Utilisateur Demo';
    }

    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  
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

  
  private validateStoredToken(): void {
    const token = this.tokenService.getAccessToken();
    if (token && this.tokenService.isTokenExpired(token)) {
      this.logout();
    }
  }

  
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

  
  private hasStorage(): boolean {
    return typeof sessionStorage !== 'undefined';
  }
}
