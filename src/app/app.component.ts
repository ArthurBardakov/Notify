import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './navbar/navbar.component';
import Hammer from 'hammerjs';
// do not remove the following import - tests complain if it's not there
import HammerInput from 'hammerjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  private readonly contentElement = viewChild.required<ElementRef<HTMLElement>>('content');
  public readonly swipeLeft = signal<HammerInput | undefined>(undefined);
  public readonly swipeRight = signal<HammerInput | undefined>(undefined);

  ngAfterViewInit(): void {
    const contentElement = this.contentElement().nativeElement;
    const hammer = new Hammer(contentElement);
    hammer.on('swipeleft', (event) => this.swipeLeft.set(event));
    hammer.on('swiperight', (event) => this.swipeRight.set(event));
  }
}
