import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './layout/nav/nav';
import { Footer } from './layout/footer/footer';
import { SideMenu } from './layout/side-menu/side-menu';
import { ScrollToTopService } from './services/scroll-to-top.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, SideMenu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private scrollToTopService = inject(ScrollToTopService);

  ngOnInit(): void {}
}
