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

// Define the BeforeInstallPromptEvent interface if it's not available in your TypeScript environment
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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
  private installPrompt?: BeforeInstallPromptEvent | null = null;
  private installButton!: HTMLElement;


  ngOnInit() {
    this.setupHammerSwipes();
    this.setupDevelopmentMobileConsole();
  }

  ngAfterViewInit(): void {
    const installButton = document.querySelector("#install");
    console.log(installButton);
    

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      this.installPrompt = event as BeforeInstallPromptEvent;
      console.log(event);
      
      installButton?.removeAttribute("hidden");
    });
    
  }

  async triggerInstallPrompt() {
    if (this.installPrompt) {
      // Show the install prompt
      await this.installPrompt.prompt();
      // Wait for the user to respond to the prompt
      const userChoice = await this.installPrompt.userChoice;
      console.log(`User choice: ${userChoice.outcome}`);
      // Clear the saved prompt since it can't be used again
      this.installPrompt = null;
    } else {
      console.log('Install prompt not available');
    }
  }


  disableInAppInstallPrompt() {
    this.installPrompt = null;
    this.installButton.setAttribute("hidden", "");
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
