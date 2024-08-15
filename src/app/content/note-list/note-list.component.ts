import { Component, inject } from '@angular/core';
import { NotesStore } from '../../state/notes.store';
import { MatIconModule } from '@angular/material/icon';
import { SortNotesByDatePipe } from './sort-notes.pipe';
import { NoteCardComponent } from './note-card/note-card.component';
import { NoteComponent } from "../note/note.component";

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
  standalone: true,
  imports: [MatIconModule, SortNotesByDatePipe, NoteCardComponent, NoteComponent],
})
export class NoteListComponent {
  public readonly store = inject(NotesStore);
}
