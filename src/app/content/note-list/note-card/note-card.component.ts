import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotesStore } from '../../../state/notes.store';
import { NavService } from '../../../navbar/nav.service';
import { NotifyRoutes } from '../../../shared/enums/routes';
import { Note } from '../../../shared/models/note';

@Component({
    selector: 'app-note-card',
    templateUrl: './note-card.component.html',
    styleUrl: './note-card.component.scss',
    standalone: true,
    imports: [MatIconModule],
})
export class NoteCardComponent {
    public note = input.required<Note>();
    public readonly store = inject(NotesStore);
    private readonly navSrc = inject(NavService);
  
    protected goToNote(noteId: string): void {
      this.navSrc.toggleNavigationTo.next({
        route: NotifyRoutes.NEW_NOTE,
        extras: { queryParams: { id: noteId } } });
    }
}
