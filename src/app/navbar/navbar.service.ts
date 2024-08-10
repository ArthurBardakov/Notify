import { Injectable, signal } from '@angular/core';
import { NotifyRoutes } from '../shared/enums/routes';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  public readonly toggleNavigationTo = signal<NotifyRoutes | undefined>(undefined);
}
