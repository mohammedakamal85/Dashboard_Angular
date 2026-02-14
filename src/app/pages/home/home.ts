import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, AuthState } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private subscription!: Subscription;

  authState!: AuthState;

  ngOnInit(): void {
    this.subscription = this.authService.authState$.subscribe((state) => {
      this.authState = state;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
