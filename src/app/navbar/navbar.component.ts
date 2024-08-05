import { Component, effect, input, viewChildren } from '@angular/core';
import gsap from 'gsap';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  standalone: true,
  imports: [MatIconModule],
})
export class NavBarComponent {
  public readonly swipeLeft = input.required<HammerInput | undefined>();
  public readonly swipeRight = input.required<HammerInput | undefined>();
  private readonly mIcons = viewChildren(MatIcon);
  private readonly bblTranslateY = '-5%';
  protected currentPage = 2;
  private prevPage = -1;
  public readonly Icons = [
    'menu_open',
    'bookmark',
    'add_circle',
    'notifications',
    'account_circle',
  ] as const;

  constructor() {
    queueMicrotask(() => this.triggerDefaultIcon());

    effect(() => {
      let canSwipeLeft = this.currentPage < this.Icons.length - 1;
      canSwipeLeft = !!this.swipeLeft() && canSwipeLeft;
      if (canSwipeLeft) this.switchBubble(this.currentPage + 1);
    });

    effect(() => {
      const canSwipeRight = !!this.swipeRight() && this.currentPage > 0;
      if (canSwipeRight) this.switchBubble(this.currentPage - 1);
    });
  }

  private triggerDefaultIcon(): void {
    const bodyElement = document.querySelector('body') as HTMLElement;
    const computedBodyStyles = window.getComputedStyle(bodyElement);
    const bgColor = computedBodyStyles.getPropertyValue('--bg-color');
    const defaultIcon = this.currentPage;
    const iconCenter = this.iconCenter(defaultIcon);

    gsap
      .timeline({ delay: 0.5 })
      .set('.bg_bubble', { x: iconCenter, opacity: 1 }, 0)
      .to('.bg_bubble_outer', { y: '10%', ease: 'back.inOut(3)', duration: 1 }, 0)
      .to('.bg_bubble_inner', { y: this.bblTranslateY, ease: 'back.inOut(3)', duration: 1 }, 0)
      .to(
        '.bg_bubble_inner',
        {
          boxShadow: `${bgColor} 0px 0px 20px 9px`,
          duration: 1,
        },
        0,
      )
      .set(`#m_icon${defaultIcon}`, { opacity: 0 }, 1);
  }

  public switchBubble(page: number): void {
    this.swapPages(page);
    const iconCenter = this.iconCenter(page);
    const bblEase = 'power2.out';

    gsap
      .timeline()
      .to(`#m_icon${this.prevPage}`, { opacity: 1, duration: 0.2 }, 0)
      .to(`#m_icon${this.currentPage}`, { opacity: 0, duration: 0.2 }, 0)
      .to('.bg_bubble', { x: iconCenter, ease: bblEase, duration: 0.4 }, 0)
      .to('.bg_bubble_inner', { translateY: '-40px', ease: bblEase, duration: 0.2 }, 0)
      .to('.bg_bubble_inner', { translateY: this.bblTranslateY, duration: 0.4 }, '>');
  }

  private swapPages(page: number) {
    this.prevPage = this.currentPage;
    this.currentPage = page;
  }

  private iconCenter(page: number): number {
    const icon = this.mIcons()[page]._elementRef.nativeElement;
    const iconRect = icon.getClientRects()[0];
    return iconRect.x + iconRect.width / 2;
  }
}
