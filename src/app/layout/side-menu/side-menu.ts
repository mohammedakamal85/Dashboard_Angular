import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, AuthState } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css',
})
export class SideMenu implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscription!: Subscription;

  // Desktop View
  isCollapsed = false;

  // Mobile View
  isMenuOpen = false;

  // Track if we're on mobile
  isMobile = false;

  authState!: AuthState;

  ngOnInit(): void {
    this.subscription = this.authService.authState$.subscribe((state) => {
      this.authState = state;
    });

    // Check initial screen size
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 480;
    // Close menu when transitioning to desktop
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void {
    if (this.isMobile) {
      // Mobile: open/close
      this.isMenuOpen = !this.isMenuOpen;
    } else {
      // Desktop: collapse/expand
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeMenu(): void {
    if (this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  closeOverlay(): void {
    this.closeMenu();
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
