import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavService } from '../../../navbar/nav.service';
import { NotifyRoutes } from '../../../shared/enums/routes';
import { Note } from '../../../shared/interfaces/note';
import { DatePipe, NgStyle } from '@angular/common';

@Component({
    selector: 'app-note-card',
    templateUrl: './note-card.component.html',
    styleUrl: './note-card.component.scss',
    standalone: true,
    imports: [MatIconModule, DatePipe, NgStyle],
})
export class NoteCardComponent {
    public note = input.required<Note>();
    public readonly deleteClicked = output<string>();
    private readonly navSrc = inject(NavService);
  
    protected goToNote(noteId: string): void {
      this.navSrc.toggleNavigationTo.next({
        route: NotifyRoutes.NOTE,
        extras: { queryParams: { id: noteId } } });
    }
}
