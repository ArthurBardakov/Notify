import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ISwipeDirections } from '../enums/swipe-directions';
import { Swipe } from '../models/swipe';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public readonly OnNavigate: EventEmitter<void>;
  public readonly PageSwipe: EventEmitter<number>;
  private readonly swipe: Subject<Swipe>;
  public readonly Swipe: Observable<Swipe>;
  private readonly directionHandler: Map<string, ISwipeDirections>;
  public TotalPages!: number;
  public PrevPage: number;
  public CurrentPage: number;

  constructor() {
    this.CurrentPage = 0;
    this.PrevPage = -1;
    this.OnNavigate = new EventEmitter<void>();
    this.PageSwipe = new EventEmitter<number>();
    this.swipe = new Subject();
    this.Swipe = this.swipe.asObservable();
    this.directionHandler = new Map<string, ISwipeDirections>();
    this.directionHandler.set('top', ISwipeDirections.Top);
    this.directionHandler.set('bottom', ISwipeDirections.Bottom);
    this.directionHandler.set('left', ISwipeDirections.Left);
    this.directionHandler.set('right', ISwipeDirections.Right);
  }

  private getDirection(directions: any): ISwipeDirections {
    const keys = Object.keys(directions);
    const trueInd = Array.from<boolean>(Object.values(directions)).findIndex((v) => v);
    const key = keys[trueInd];
    return this.directionHandler.get(key) as ISwipeDirections;
  }

  public RegisterSwipe(e: Event): void {
    const event = e as any;
    const directions = event.detail.directions;
    const direction = this.getDirection(directions);
    const swipe = new Swipe(direction, undefined!);
    var x = event.detail.x;
    var y = event.detail.y;
    const swipeV = (swipe.IsLeft || swipe.IsRight ? y : x) as number[];
    const from = swipeV[0];
    const to = swipeV[1];
    const delta = from - to;
    swipe.Delta = delta;

    if (this.IsHorizontalSwipe(swipe)) {
      const page = swipe.IsRight ? this.CurrentPage - 1 : this.CurrentPage + 1;

      if (page >= 0 && page < this.TotalPages) {
        this.PageSwipe.emit(page);
      }
    }
    this.swipe.next(swipe);
  }

  private IsVerticalSwipe(swipe: Swipe): boolean {
    return swipe.IsTop || swipe.IsBottom;
  }

  private IsHorizontalSwipe(swipe: Swipe): boolean {
    return swipe.IsLeft || swipe.IsRight;
  }

  public SwapPages(page: number): void {
    this.PrevPage = this.CurrentPage;
    this.CurrentPage = page;
  }
}
