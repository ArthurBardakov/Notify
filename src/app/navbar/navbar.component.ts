import { Component, viewChildren } from '@angular/core';
import gsap from 'gsap';
import { NavigationService } from '../shared/services/navigation.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  standalone: true,
  imports: [MatIconModule],
})
export class NavBarComponent {
  private readonly mIcons = viewChildren(MatIcon);
  private readonly bblEase = 'power2.out';
  private bblTranslateY = '-5%';
  public readonly Icons = [
    'menu_open',
    'bookmark',
    'add_circle',
    'notifications',
    'account_circle',
  ];

  constructor(public navSrc: NavigationService) {
    this.navSrc.TotalPages = this.Icons.length;
    this.navSrc.CurrentPage = 2;
    this.navSrc.PageSwipe.subscribe((page: number) => this.SwitchBubble(page));
    queueMicrotask(() => this.triggerDefaultIcon());
  }

  private triggerDefaultIcon(): void {
    const bodyElement = document.querySelector('body') as HTMLElement;
    const computedBodyStyles = window.getComputedStyle(bodyElement);
    const bgColor = computedBodyStyles.getPropertyValue('--bg-color');
    const defaultIcon = this.navSrc.CurrentPage;
    const iconCenter = this.iconCenter(defaultIcon);

    gsap
      .timeline({ delay: 0.5 })
      .set(`#m_icon${defaultIcon}`, { opacity: 0 }, 0)
      .set('.bg_bubble', { x: iconCenter, opacity: 1 }, 0)
      .to('#bg_bubble_outer', { y: '10%', ease: 'back.inOut(3)', duration: 1 }, 0)
      .to('#bg_bubble_inner', { y: this.bblTranslateY, ease: 'back.inOut(3)', duration: 1 }, 0)
      .to(
        '#bg_bubble_inner',
        {
          boxShadow: `${bgColor} 0px 0px 20px 9px`,
          ease: 'back.in(2)',
          duration: 0.95,
        },
        0,
      );
    // .to('#bg_bubble_outer', { boxShadow: '#38355800 0px 0px 20px 9px', ease: 'back.in(2)', duration: 1 }, 0);
  }

  public SwitchBubble(page: number): void {
    this.navSrc.SwapPages(page);
    const iconCenter = this.iconCenter(page);

    gsap
      .timeline()
      .to(`#m_icon${this.navSrc.PrevPage}`, { opacity: 1, duration: 0.2 }, 0)
      .to(`#m_icon${this.navSrc.CurrentPage}`, { opacity: 0, duration: 0.2 }, 0)
      .to('.bg_bubble', { x: iconCenter, ease: this.bblEase, duration: 0.4 }, 0)
      // .to('#bg_bubble_inner', { boxShadow: '#383558 0px 0px 10px 7px', duration: 0.2 }, 0)
      .to('#bg_bubble_inner', { translateY: '-40px', ease: this.bblEase, duration: 0.2 }, 0)
      .to('#bg_bubble_inner', { translateY: this.bblTranslateY, duration: 0.4 }, '>');
    // .to('#bg_bubble_inner', { boxShadow: '#383558 0px 0px 20px 13px', duration: 0.4 }, '-=0.1');
  }

  private iconCenter(page: number): number {
    const icon = this.mIcons()[page]._elementRef.nativeElement;
    const iconRect = icon.getClientRects()[0];
    return iconRect.x + iconRect.width / 2;
  }
}
