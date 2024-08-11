import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  untracked,
  viewChildren,
} from '@angular/core';
import gsap from 'gsap';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { map, Subject, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
// do not remove the following import - tests complain if it's not there
import HammerInput from 'hammerjs';
import { MenuIcons } from './icons.enum';
import { Router } from '@angular/router';
import { NotifyRoutes } from '../shared/enums/routes';
import { NavService } from './nav.service';

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
  private readonly router = inject(Router);
  private readonly navSrc = inject(NavService);
  private readonly mIcons = viewChildren(MatIcon);
  private readonly bblTranslateY = '-5%';
  private readonly swiped$ = new Subject<void>();
  public readonly Icons = Object.values(MenuIcons);

  protected readonly routes = Object.entries(NotifyRoutes).map(([key, value]) => ({ key, value }));
  protected currentRoute = NotifyRoutes.LIST;
  protected prevRoute: NotifyRoutes | undefined = undefined;

  protected readonly iconsRoutesMap = [
    { icon: MenuIcons.MENU, route: NotifyRoutes.MENU },
    { icon: MenuIcons.ACCOUNT, route: NotifyRoutes.ACCOUNT },
    { icon: MenuIcons.LIST, route: NotifyRoutes.LIST },
    { icon: MenuIcons.NOTIFICATIONS, route: NotifyRoutes.NOTIFICATIONS },
    { icon: MenuIcons.NEW_NOTE, route: NotifyRoutes.NEW_NOTE },
  ] as const;

  protected readonly currentIcon = toSignal(
    this.swiped$.pipe(
      map(() => this.iconsRoutesMap.find((route) => route.route === this.currentRoute)!.icon),
    ),
    { initialValue: MenuIcons.LIST },
  );

  private get currentRouteId(): number {
    return this.routes.findIndex((route) => route.value === this.currentRoute);
  }

  constructor() {
    this.triggerBubbleSwitchFromOutside();
    this.registerSwipeLeft();
    this.registerSwipeRight();
  }

  ngAfterViewInit(): void {
    this.triggerDefaultIcon();
  }

  private triggerBubbleSwitchFromOutside(): void {
    this.navSrc.toggleNavigationTo.pipe(
      takeUntilDestroyed(),
      tap((route) => this.switchBubble(route)))
    .subscribe();
  }

  private registerSwipeLeft(): void {
    effect(() => {
      const isLastRoute = this.currentRouteId < this.routes.length - 1;
      const canSwipeLeft = !!this.swipeLeft() && isLastRoute;
      if (!canSwipeLeft) return;
      const nextRoute = this.routes[this.currentRouteId + 1].value;
      untracked(() => this.switchBubble(nextRoute));
    });
  }

  private registerSwipeRight(): void {
    effect(() => {
      const canSwipeRight = !!this.swipeRight() && this.currentRouteId > 0;
      if (!canSwipeRight) return;
      const prevRoute = this.routes[this.currentRouteId - 1].value;
      untracked(() => this.switchBubble(prevRoute));
    });
  }

  private triggerDefaultIcon(): void {
    const bodyElement = document.querySelector('body') as HTMLElement;
    const computedBodyStyles = window.getComputedStyle(bodyElement);
    const bgColor = computedBodyStyles.getPropertyValue('--bg-color');
    const iconCenter = this.iconCenter(this.currentRoute);

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
      .set(`#m_icon${this.currentRoute}`, { opacity: 0 }, 1);
  }

  public switchBubble(route: NotifyRoutes): void {
    this.swapRoutes(route);
    const iconCenter = this.iconCenter(route);
    const bblEase = 'power2.out';
    const isNewNoteRoute = route === NotifyRoutes.NEW_NOTE;
    const navigatePosition = isNewNoteRoute ? '-=0.2' : '0';
    this.swiped$.next();

    gsap
      .timeline()
      .to(`#m_icon${this.prevRoute}`, { opacity: 1, duration: 0.2 }, 0)
      .to(`#m_icon${this.currentRoute}`, { opacity: 0, duration: 0.2 }, 0)
      .to('.bg_bubble', { x: iconCenter, ease: bblEase, duration: 0.4 }, 0)
      .to('.bg_bubble_inner', { y: '-40px', ease: bblEase, duration: 0.2 }, 0)
      .to('.bg_bubble_inner', { y: this.bblTranslateY, duration: 0.4 }, '>')
      .to(this, { onStart: () => this.navigateTo(route) }, navigatePosition);
  }

  private swapRoutes(route: NotifyRoutes) {
    this.prevRoute = this.currentRoute;
    this.currentRoute = route;
  }

  private iconCenter(route: NotifyRoutes): number {
    const icon = this.mIcons().find(
      (icon) => icon._elementRef.nativeElement.id === `m_icon${route}`,
    )?._elementRef.nativeElement;
    if (!icon) throw new Error('Icon not found');
    const iconRect = icon.getClientRects()[0];
    return iconRect.x + iconRect.width / 2;
  }

  private navigateTo(route: NotifyRoutes): void {
    this.router.navigate(['/' + route]);
  }
}
