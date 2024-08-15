import { Component, inject } from '@angular/core';
import { NotesStore } from '../../state/notes.store';
import { MatIconModule } from '@angular/material/icon';
import { NotifyRoutes } from '../../shared/enums/routes';
import { NavService } from '../../navbar/nav.service';

@Component({
  selector: 'app-list',
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class NoteListComponent {
  public readonly store = inject(NotesStore);
  private readonly navSrc = inject(NavService);

  protected goToNote(noteId: string): void {
    this.navSrc.toggleNavigationTo.next({
      route: NotifyRoutes.NEW_NOTE,
      extras: { queryParams: { id: noteId } } });
  }
}
