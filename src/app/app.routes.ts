import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('./content/list/list.component').then((m) => m.ListComponent),
  },
  {
    path: 'new-note',
    loadComponent: () => import('./content/new-note/new-note.component').then((m) => m.NewNoteComponent),
  },
];
