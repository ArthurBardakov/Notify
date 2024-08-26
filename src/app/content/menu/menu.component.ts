import { Component, OnInit } from '@angular/core';
import { BeforeInstallPromptEvent } from '../../shared/interfaces/ibefore-install.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  imports: [],
})
export class MenuComponent implements OnInit {
  private installPrompt?: BeforeInstallPromptEvent | null = null;
  public isInstallBtnDisabled = true;

  ngOnInit(): void {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      this.installPrompt = event as BeforeInstallPromptEvent;
      this.isInstallBtnDisabled = false;
    });

    window.addEventListener("appinstalled", () => {
      this.installPrompt = null;
      this.isInstallBtnDisabled = true;
    });
  }
  
  public async triggerInstallPrompt(): Promise<void> {
    if (!this.installPrompt) return console.log('Install prompt not available');
    await this.installPrompt.prompt();
    const userChoice = await this.installPrompt.userChoice;
    console.log(`User choice: ${userChoice.outcome}`);
    // Clear the saved prompt since it can't be used again
    this.installPrompt = null;
  }
}
