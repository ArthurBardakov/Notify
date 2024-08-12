import { Component, inject } from '@angular/core';
import { NotesStore } from '../../state/notes.store';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NotifyRoutes } from '../../shared/enums/routes';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class ListComponent {
  public readonly store = inject(NotesStore);
  private readonly router = inject(Router);

  protected goToNote(noteId: string): void {
    this.router.navigate(['/' + NotifyRoutes.NEW_NOTE], { queryParams: { id: noteId } });
  }
}
