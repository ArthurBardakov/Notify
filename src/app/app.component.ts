import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { NavBarComponent } from './navbar/navbar.component';
import Hammer from 'hammerjs';
// do not remove the following import - tests complain if it's not there
import HammerInput from 'hammerjs';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import eruda from 'eruda';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavBarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly contentElement = viewChild.required<ElementRef<HTMLElement>>('content');
  
  private readonly deviceService = inject(DeviceDetectorService);

  public readonly swipeLeft = signal<HammerInput | undefined>(undefined);
  public readonly swipeRight = signal<HammerInput | undefined>(undefined);

  ngOnInit() {
    this.setupHammerSwipes();
    this.setupDevelopmentMobileConsole();
  }

  private setupHammerSwipes(): void {
    const contentElement = this.contentElement().nativeElement;
    const hammer = new Hammer(contentElement);
    hammer.on('swipeleft', (event) => this.swipeLeft.set(event));
    hammer.on('swiperight', (event) => this.swipeRight.set(event));
  }

  private setupDevelopmentMobileConsole(): void {
    if (environment.production) return;
    if (!this.deviceService.isMobile()) return;

    const el = document.createElement('div');
    document.body.appendChild(el);
    eruda.init({
        container: el,
        tool: ['console', 'elements']
    });
  }
}
