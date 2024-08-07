import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { NavBarComponent } from './navbar/navbar.component';
import Hammer from 'hammerjs';
// do not remove the following import - tests complain if it's not there
import HammerInput from 'hammerjs';
import { MenuIcons } from './navbar/icons.enum';
import { NewNoteComponent } from './new-note/new-note.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent, NewNoteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  private readonly contentElement = viewChild.required<ElementRef<HTMLElement>>('content');
  public readonly swipeLeft = signal<HammerInput | undefined>(undefined);
  public readonly swipeRight = signal<HammerInput | undefined>(undefined);
  protected readonly currentPageEvent = signal<MenuIcons | undefined>(undefined);
  protected readonly isNewNoteEvent = computed(
    () => this.currentPageEvent() === MenuIcons.ADD_NOTE,
  );

  ngAfterViewInit(): void {
    const contentElement = this.contentElement().nativeElement;
    const hammer = new Hammer(contentElement);
    hammer.on('swipeleft', (event) => this.swipeLeft.set(event));
    hammer.on('swiperight', (event) => this.swipeRight.set(event));
  }
}
