import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  lastScrollTop = 0;
  isHeaderHidden = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('aos').then(AOS => AOS.default.init({
        duration: 1000,
        once: true,
        mirror: false
      }));
      window.scrollTo(0, 0);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > this.lastScrollTop) {
      this.isHeaderHidden = true;
    } else {
      this.isHeaderHidden = false;
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    document.body.classList.toggle('no-scroll', this.isMenuOpen);
  }
}
