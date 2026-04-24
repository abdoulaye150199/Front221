import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  /**
   * Login with phone, email or password
   */
  login(phoneOrEmail: string, password: string): AuthResponse {
    try {
      const users = this.getAllUsers();
      const user = users.find(
        (u) =>
          (u.email === phoneOrEmail || u.phone === phoneOrEmail) &&
          u.password === password
      );

      if (user) {
        // Store user in localStorage (excluding password)
        const { password: _, ...userWithoutPassword } = user as any;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword);

        return {
          success: true,
          user: userWithoutPassword,
        };
      }

      return {
        success: false,
        message: APP_DATA.errors.auth.invalidCredentials,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Une erreur est survenue lors de la connexion',
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('currentUser');
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
  private getAllUsers(): any[] {
    const allUsers: any[] = [];
    const usersData = APP_DATA.users as any;

    if (usersData && usersData.admin) {
      allUsers.push(...usersData.admin);
    }

    return allUsers;
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }
}
