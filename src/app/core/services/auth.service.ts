import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { APP_DATA } from '../../shared/data';

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
}

interface StoredUser extends User {
  password: string;
}

interface AppUsersData {
  admin?: StoredUser[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'currentUser';
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Login with phone, email or password
   */
  login(phoneOrEmail: string, password: string): Observable<AuthResponse> {
    try {
      const normalizedIdentifier = phoneOrEmail.trim().toLowerCase();
      const users = this.getAllUsers();
      const user = users.find(
        (u) =>
          (u.email.toLowerCase() === normalizedIdentifier || u.phone === phoneOrEmail.trim()) &&
          u.password === password
      );

      if (user) {
        const userWithoutPassword = this.toUser(user);
        this.persistUser(userWithoutPassword);

        return of({
          success: true,
          user: userWithoutPassword,
        });
      }

      return of({
        success: false,
        message: APP_DATA.errors.auth.invalidCredentials,
      });
    } catch {
      return of({
        success: false,
        message: 'Une erreur est survenue lors de la connexion',
      });
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    if (this.hasStorage()) {
      localStorage.removeItem(this.storageKey);
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get all users from app-data
   */
  private getAllUsers(): StoredUser[] {
    const usersData = APP_DATA.users as AppUsersData | undefined;
    return usersData?.admin ? [...usersData.admin] : [];
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    if (!this.hasStorage()) {
      return null;
    }

    try {
      const user = localStorage.getItem(this.storageKey);
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
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
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

  private hasStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private isUser(value: unknown): value is User {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Record<string, unknown>;
    return (
      typeof candidate['id'] === 'string' &&
      typeof candidate['firstName'] === 'string' &&
      typeof candidate['lastName'] === 'string' &&
      typeof candidate['email'] === 'string' &&
      typeof candidate['phone'] === 'string' &&
      typeof candidate['role'] === 'string' &&
      typeof candidate['userInitial'] === 'string'
    );
  }
}
