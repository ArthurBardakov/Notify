import { AfterViewInit, Component, effect, input, untracked, viewChildren } from '@angular/core';
import gsap from 'gsap';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { map, Observable, Subject } from 'rxjs';
import { outputFromObservable, toObservable, toSignal } from '@angular/core/rxjs-interop';
// do not remove the following import - tests complain if it's not there
import HammerInput from 'hammerjs';
import { MenuIcons } from './icons.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  standalone: true,
  imports: [MatIconModule],
})
export class NavBarComponent implements AfterViewInit {
  public readonly swipeLeft = input.required<HammerInput | undefined>();
  public readonly swipeRight = input.required<HammerInput | undefined>();
  private readonly mIcons = viewChildren(MatIcon);
  private readonly bblTranslateY = '-5%';
  private readonly swiped$ = new Subject<void>();
  public readonly Icons = Object.values(MenuIcons);
  protected currentPage = 2;
  private prevPage = -1;

  protected readonly currentIcon = toSignal(
    this.swiped$.pipe(map(() => this.Icons[this.currentPage])),
    { initialValue: this.Icons[this.currentPage] },
  );

  public readonly currentPageEvent = outputFromObservable(
    toObservable(this.currentIcon).pipe(
      map((icon) => Object.entries(MenuIcons).find(([_, value]) => value === icon)?.[1]),
      map((key) => key as MenuIcons),
    ) as Observable<MenuIcons>,
  );

  constructor() {
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

  ngAfterViewInit(): void {
    this.triggerDefaultIcon();
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
    untracked(() => this.swiped$.next());

    gsap
      .timeline()
      .to(`#m_icon${this.prevPage}`, { opacity: 1, duration: 0.2 }, 0)
      .to(`#m_icon${this.currentPage}`, { opacity: 0, duration: 0.2 }, 0)
      .to('.bg_bubble', { x: iconCenter, ease: bblEase, duration: 0.4 }, 0)
      .to('.bg_bubble_inner', { y: '-40px', ease: bblEase, duration: 0.2 }, 0)
      .to('.bg_bubble_inner', { y: this.bblTranslateY, duration: 0.4 }, '>');
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
