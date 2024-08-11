import { Injectable } from '@angular/core';
import { NotifyRoutes } from '../shared/enums/routes';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public readonly toggleNavigationTo = new Subject<NotifyRoutes>();
}
