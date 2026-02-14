import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: 'admin' | 'customer' | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Static admin user
  private readonly ADMIN_USER: User = {
    id: 'admin-001',
    email: 'admin@dashboard.com',
    name: 'Admin User',
    role: 'admin',
  };

  private readonly ADMIN_PASSWORD = 'Admin@123456';

  // Local Storage key
  private readonly STORAGE_KEY = 'auth_user';

  // BehaviorSubjects for state management
  private authStateSubject = new BehaviorSubject<AuthState>(this.loadInitialState());
  public authState$: Observable<AuthState> = this.authStateSubject.asObservable();

  constructor() {
    this.initializeAuthState();
  }

  // Load initial auth state from localStorage or default
  private loadInitialState(): AuthState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        return {
          user,
          isAuthenticated: true,
          role: user.role,
        };
      }
    } catch (error) {
      console.warn('Failed to load auth state from localStorage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }

    return {
      user: null,
      isAuthenticated: false,
      role: null,
    };
  }

  // Initialize auth state on service creation
  private initializeAuthState(): void {
    const state = this.loadInitialState();
    this.authStateSubject.next(state);
  }

  // Get current auth state
  getCurrentState(): AuthState {
    return this.authStateSubject.value;
  }

  // Login with email and password
  login(email: string, password: string): boolean {
    // Check if admin credentials
    if (email === this.ADMIN_USER.email && password === this.ADMIN_PASSWORD) {
      this.setAuthState(this.ADMIN_USER);
      return true;
    }

    // Check localStorage for registered customer users
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const user = registeredUsers.find((u: any) => u.email === email && u.password === password);

      if (user) {
        // Create user object without storing password
        const { password: _, ...userWithoutPassword } = user;
        this.setAuthState(userWithoutPassword);
        return true;
      }
    } catch (error) {
      console.warn('Failed to check registered users:', error);
    }

    return false;
  }

  // Register a new customer user
  register(email: string, password: string, name: string): boolean {
    try {
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      if (registeredUsers.some((u: any) => u.email === email)) {
        console.warn('User already exists:', email);
        return false;
      }

      // Create new user
      const newUser = {
        id: `customer-${Date.now()}`,
        email,
        name,
        password,
        role: 'customer' as const,
      };

      // Save to localStorage
      registeredUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

      // Auto-login the new user
      const { password: _, ...userWithoutPassword } = newUser;
      this.setAuthState(userWithoutPassword);

      return true;
    } catch (error) {
      console.warn('Failed to register user:', error);
      return false;
    }
  }

  // Logout current user
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.authStateSubject.next({
      user: null,
      isAuthenticated: false,
      role: null,
    });
  }

  // Set auth state and persist to localStorage
  private setAuthState(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to save auth state to localStorage:', error);
    }

    this.authStateSubject.next({
      user,
      isAuthenticated: true,
      role: user.role,
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  // Check if user has specific role
  hasRole(role: 'admin' | 'customer'): boolean {
    return this.authStateSubject.value.role === role;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Get current user
  getUser(): User | null {
    return this.authStateSubject.value.user;
  }

  // Get current role
  getRole(): 'admin' | 'customer' | null {
    return this.authStateSubject.value.role;
  }
}
