import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './navbar.component';
import { MatIcon } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import gsap from 'gsap';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

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
    const defaultIcon = component.Icons[component['currentPage']];
    const currentIcon = component['currentIcon']();
    expect(currentIcon).toBe(defaultIcon);
  });

  it('should switch to the next bubble on swipe left', async () => {
    component['currentPage'] = 2;
    fixture.componentRef.setInput('swipeLeft', {} as HammerInput);
    await fixture.whenStable();
    expect(component['currentPage']).toBe(3);
    expect(component['prevPage']).toBe(2);
    expect(component['currentIcon']()).toBe(component.Icons[3]);
  });

  it('should switch to the previous bubble on swipe right', async () => {
    component['currentPage'] = 2;
    fixture.componentRef.setInput('swipeRight', {} as HammerInput);
    await fixture.whenStable();
    expect(component['currentPage']).toBe(1);
    expect(component['prevPage']).toBe(2);
    expect(component['currentIcon']()).toBe(component.Icons[1]);
  });

  it('should call gsap.timeline() when triggering default icon', () => {
    const gsapSpy = spyOn(gsap, 'timeline').and.callThrough();
    component['triggerDefaultIcon']();
    expect(gsapSpy).toHaveBeenCalled();
  });

  it('should call gsap.timeline() when switching bubbles', () => {
    const gsapSpy = spyOn(gsap, 'timeline').and.callThrough();
    component.switchBubble(3);
    expect(gsapSpy).toHaveBeenCalled();
  });

  it('should correctly swap pages', () => {
    component['currentPage'] = 2;
    component['swapPages'](3);
    expect(component['prevPage']).toBe(2);
    expect(component['currentPage']).toBe(3);
  });

  it('should correctly calculate icon center', () => {
    component['iconCenter'] = jasmine.createSpy().and.callThrough();
    component.switchBubble(1);
    expect(component['iconCenter']).toHaveBeenCalledWith(1);
  });

  it('should call triggerDefaultIcon in ngAfterViewInit', () => {
    component['triggerDefaultIcon'] = jasmine.createSpy().and.callThrough();
    component.ngAfterViewInit();
    expect(component['triggerDefaultIcon']).toHaveBeenCalled();
  });

  it('should update currentIcon signal correctly', () => {
    component['swiped$'].next();
    expect(component['currentIcon']()).toBe(component['Icons'][component['currentPage']]);
  });

  it('should have mIcons populated after view init', () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    const matIcons = fixture.debugElement.queryAll(By.directive(MatIcon));
    const numberOfIcons = component['mIcons']().length;
    expect(numberOfIcons).toBe(matIcons.length);
  });
});
