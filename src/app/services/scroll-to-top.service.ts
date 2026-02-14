import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// handle automatic scroll to top on route changes
@Injectable({
  providedIn: 'root',
})
export class ScrollToTopService {
  constructor(private router: Router) {
    this.initializeScrollToTop();
  }

  // Initialize scroll-to-top on every navigation end
  private initializeScrollToTop(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.scrollToTop();
    });
  }

  // Scroll to top with smooth behavior
  scrollToTop(): void {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.scrollTop = 0;
    } else {
      // Fallback for window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
