import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './navbar.component';
import { MatIcon } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import gsap from 'gsap';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { NotifyRoutes } from '../shared/enums/routes';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct default icon', () => {
    const defaultIcon = component['iconsRoutesMap'].find(
      (route) => route.route === component['currentRoute'],
    )!.icon;
    const currentIcon = component['currentIcon']();
    expect(currentIcon).toBe(defaultIcon);
  });

  it('should switch to the next bubble on swipe left', async () => {
    fixture.componentRef.setInput('swipeLeft', {} as HammerInput);
    await fixture.whenStable();
    expect(component['currentRoute']).toBe(NotifyRoutes.NOTIFICATIONS);
    expect(component['prevRoute']).toBe(NotifyRoutes.LIST);
  });

  it('should switch to the previous bubble on swipe right', async () => {
    fixture.componentRef.setInput('swipeRight', {} as HammerInput);
    await fixture.whenStable();
    expect(component['currentRoute']).toBe(NotifyRoutes.ACCOUNT);
    expect(component['prevRoute']).toBe(NotifyRoutes.LIST);
  });

  it('should call gsap.timeline() when triggering default icon', () => {
    const gsapSpy = spyOn(gsap, 'timeline').and.callThrough();
    component['triggerDefaultIcon']();
    expect(gsapSpy).toHaveBeenCalled();
  });

  it('should call gsap.timeline() when switching bubbles', () => {
    const gsapSpy = spyOn(gsap, 'timeline').and.callThrough();
    component.switchBubble(NotifyRoutes.NOTIFICATIONS);
    expect(gsapSpy).toHaveBeenCalled();
  });

  it('should correctly swap routes', () => {
    component['currentRoute'] = NotifyRoutes.LIST;
    component['swapRoutes'](NotifyRoutes.NOTIFICATIONS);
    expect(component['prevRoute']).toBe(NotifyRoutes.LIST);
    expect(component['currentRoute']).toBe(NotifyRoutes.NOTIFICATIONS);
  });

  it('should correctly calculate icon center', () => {
    component['iconCenter'] = jasmine.createSpy().and.callThrough();
    component.switchBubble(NotifyRoutes.ACCOUNT);
    expect(component['iconCenter']).toHaveBeenCalledWith(NotifyRoutes.ACCOUNT);
  });

  it('should call triggerDefaultIcon in ngAfterViewInit', () => {
    component['triggerDefaultIcon'] = jasmine.createSpy().and.callThrough();
    component.ngAfterViewInit();
    expect(component['triggerDefaultIcon']).toHaveBeenCalled();
  });

  it('should update currentIcon signal correctly', () => {
    component['currentRoute'] = NotifyRoutes.MENU;
    component['swiped$'].next();
    const currentIcon = component['iconsRoutesMap'].find(
      (route) => route.route === component['currentRoute'],
    )!.icon;
    expect(component['currentIcon']()).toBe(currentIcon);
  });

  it('should have mIcons populated after view init', () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    const matIcons = fixture.debugElement.queryAll(By.directive(MatIcon));
    const numberOfIcons = component['mIcons']().length;
    expect(numberOfIcons).toBe(matIcons.length);
  });
});
