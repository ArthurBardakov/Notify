import { Routes } from '@angular/router';
import { NotifyRoutes } from './shared/enums/routes';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: NotifyRoutes.Menu,
    loadComponent: () => import('./content/menu/menu.component').then((m) => m.MenuComponent),
  },
  {
    path: NotifyRoutes.List,
    loadComponent: () => import('./content/list/list.component').then((m) => m.ListComponent),
  },
  {
    path: NotifyRoutes.NewNote,
    loadComponent: () => import('./content/new-note/new-note.component').then((m) => m.NewNoteComponent),
  },
];
