import { Routes } from '@angular/router';
import { NotifyRoutes } from './shared/enums/routes';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: NotifyRoutes.MENU,
    loadComponent: () => import('./content/menu/menu.component').then((m) => m.MenuComponent),
  },
  {
    path: NotifyRoutes.ACCOUNT,
    loadComponent: () =>
      import('./content/account/account.component').then((m) => m.AccountComponent),
  },
  {
    path: NotifyRoutes.LIST,
    loadComponent: () => import('./content/note-list/note-list.component').then((m) => m.NoteListComponent),
  },
  {
    path: NotifyRoutes.NOTIFICATIONS,
    loadComponent: () =>
      import('./content/notifications/notifications.component').then(
        (m) => m.NotificationsComponent,
      ),
  },
  {
    path: NotifyRoutes.NEW_NOTE,
    loadComponent: () =>
      import('./content/note/note.component').then((m) => m.NoteComponent),
  },
  { path: '**', redirectTo: NotifyRoutes.LIST },
];
