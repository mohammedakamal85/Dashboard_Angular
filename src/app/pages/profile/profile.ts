import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthState } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscription!: Subscription;

  authState!: AuthState;
  isAdmin = false;
  isCustomer = false;

  ngOnInit(): void {
    this.subscription = this.authService.authState$.subscribe((state) => {
      this.authState = state;
      this.isAdmin = state.role === 'admin';
      this.isCustomer = state.role === 'customer';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
