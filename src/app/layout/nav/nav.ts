import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, AuthState } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit, OnDestroy {
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
