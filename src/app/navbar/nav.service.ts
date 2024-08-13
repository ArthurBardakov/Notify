import { Injectable } from '@angular/core';
import { NotifyRoutes } from '../shared/enums/routes';
import { Subject } from 'rxjs';
import { NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public readonly toggleNavigationTo = new Subject<{ route: NotifyRoutes, extras?: NavigationExtras }>();
}
