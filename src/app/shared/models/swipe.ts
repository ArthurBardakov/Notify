import { ISwipeDirections } from '../enums/swipe-directions';

export class Swipe {
  public Direction: ISwipeDirections;
  public Delta: number;
  public get IsTop(): boolean {
    return this.Direction === ISwipeDirections.Top;
  }
  public get IsBottom(): boolean {
    return this.Direction === ISwipeDirections.Bottom;
  }
  public get IsLeft(): boolean {
    return this.Direction === ISwipeDirections.Left;
  }
  public get IsRight(): boolean {
    return this.Direction === ISwipeDirections.Right;
  }

  constructor(direction: ISwipeDirections, delta: number) {
    this.Direction = direction;
    this.Delta = delta;
  }
}
