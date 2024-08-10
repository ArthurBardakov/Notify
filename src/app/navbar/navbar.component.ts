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
import { map, Observable, Subject } from 'rxjs';
import { outputFromObservable, toObservable, toSignal } from '@angular/core/rxjs-interop';
// do not remove the following import - tests complain if it's not there
import HammerInput from 'hammerjs';
import { MenuIcons } from './icons.enum';
import { Router } from '@angular/router';
import { NotifyRoutes } from '../shared/enums/routes';
import { NavbarService } from './navbar.service';

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
  private readonly navSrc = inject(NavbarService);
  private readonly mIcons = viewChildren(MatIcon);
  private readonly bblTranslateY = '-5%';
  private readonly swiped$ = new Subject<void>();
  public readonly Icons = Object.values(MenuIcons);

  protected readonly routes = Object.entries(NotifyRoutes).map(([key, value]) => ({ key, value }));
  protected currentRoute = NotifyRoutes.List;
  protected prevRoute: NotifyRoutes | undefined = undefined;

  protected readonly iconsRoutesMap = [
    { icon: MenuIcons.MENU, route: NotifyRoutes.Menu },
    { icon: MenuIcons.ACCOUNT, route: NotifyRoutes.ACCOUNT },
    { icon: MenuIcons.LIST, route: NotifyRoutes.List },
    { icon: MenuIcons.NOTIFICATIONS, route: NotifyRoutes.Notifications },
    { icon: MenuIcons.NEW_NOTE, route: NotifyRoutes.NewNote },
  ] as const;

  protected readonly currentIcon = toSignal(
    this.swiped$.pipe(
      map(() => this.iconsRoutesMap.find((route) => route.route === this.currentRoute)!.icon),
    ),
    { initialValue: MenuIcons.LIST },
  );

  public readonly currentPageIcon = outputFromObservable(
    toObservable(this.currentIcon).pipe(
      map((icon) => Object.entries(MenuIcons).find(([_, value]) => value === icon)?.[1]),
      map((key) => key as MenuIcons),
    ) as Observable<MenuIcons>,
  );

  private get currentRouteId(): number {
    return this.routes.findIndex((route) => route.value === this.currentRoute);
  }

  constructor() {
    effect(() => {
      const route = this.navSrc.toggleNavigationTo();
      if (!route) return;
      this.switchBubble(route);
    });

    effect(() => {
      const canSwipeLeft = !!this.swipeLeft() && this.currentRouteId < this.routes.length - 1;
      if (!canSwipeLeft) return;
      const nextRoute = this.routes[this.currentRouteId + 1].value;
      this.switchBubble(nextRoute);
    });

    effect(() => {
      const canSwipeRight = !!this.swipeRight() && this.currentRouteId > 0;
      if (!canSwipeRight) return;
      const prevRoute = this.routes[this.currentRouteId - 1].value;
      this.switchBubble(prevRoute);
    });
  }

  ngAfterViewInit(): void {
    this.triggerDefaultIcon();
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
    const isNewNoteRoute = route === NotifyRoutes.NewNote;
    const navigatePosition = isNewNoteRoute ? '-=0.2' : '0';
    untracked(() => this.swiped$.next());

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
