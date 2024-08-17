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
import { NavigationExtras, Router } from '@angular/router';
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
  private readonly mainBubbleY = '-5%';
  private readonly backBubbleY = '10%';
  private readonly swiped$ = new Subject<void>();

  protected readonly routes = Object.entries(NotifyRoutes).map(([key, value]) => ({ key, value }));
  protected currentRoute = Object.values(NotifyRoutes)
    .find((route) => location.pathname.endsWith(route)) ?? NotifyRoutes.LIST;
  protected prevRoute: NotifyRoutes | undefined = undefined;

  protected readonly iconsRoutesMap = [
    { icon: 'menu_open', route: NotifyRoutes.MENU },
    { icon: 'account_circle', route: NotifyRoutes.ACCOUNT },
    { icon: 'view_list', route: NotifyRoutes.LIST },
    { icon: 'notifications', route: NotifyRoutes.NOTIFICATIONS },
    { icon: 'add_circle', route: NotifyRoutes.NEW_NOTE },
  ] as const;

  private getIconByRoute(route: NotifyRoutes): string {
    return this.iconsRoutesMap.find((icon) => icon.route === route)!.icon;
  }

  protected readonly currentIcon = toSignal(
    this.swiped$.pipe(map(() => this.getIconByRoute(this.currentRoute))),
    { initialValue: this.getIconByRoute(this.currentRoute) },
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
    this.navSrc.toggleNavigationTo
      .pipe(
        takeUntilDestroyed(),
        tap((nav) => this.switchBubble(nav.route, nav.extras)),
      )
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
      .set('.blur_bubble', { x: iconCenter, opacity: 1 }, 0)
      .to('.blur_bubble_outer', { y: this.backBubbleY, ease: 'back.inOut(3)', duration: 1 }, 0)
      .to('.blur_bubble_inner, .main_bubble', { y: this.mainBubbleY, ease: 'back.inOut(3)', duration: 1 }, 0)
      .to('.blur_bubble_inner', { boxShadow: `${bgColor} 0px 0px 20px 9px`, duration: 1, }, 0)
      .set(`#m_icon${this.currentRoute}`, { opacity: 0 }, "-=0.5");
  }

  public switchBubble(route: NotifyRoutes, extras?: NavigationExtras): void {
    if (route === this.currentRoute) return;
    this.swapRoutes(route);
    const iconCenter = this.iconCenter(route);
    const bblEase = 'power2.out';
    this.swiped$.next();
    this.router.navigate(['/' + route], extras);

    gsap
      .timeline()
      .to(`#m_icon${this.prevRoute}`, { opacity: 1, duration: 0.2 }, 0)
      .to(`#m_icon${this.currentRoute}`, { opacity: 0, duration: 0.2 }, 0)
      .to('.blur_bubble', { x: iconCenter, ease: bblEase, duration: 0.4 }, 0)
      .to('.blur_bubble_outer', { y: '-35px', ease: bblEase, duration: 0.2 }, 0)
      .to('.blur_bubble_inner, .main_bubble', { y: '-40px', ease: bblEase, duration: 0.2 }, 0)
      .to('.blur_bubble_inner, .main_bubble', { y: this.mainBubbleY, duration: 0.4 }, '>')
      .to('.blur_bubble_outer', { y: this.backBubbleY, duration: 0.4 }, '<');
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
}
