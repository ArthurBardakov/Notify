import { Component, inject } from '@angular/core';
import { NotesStore } from '../../state/notes.store';
import { MatIconModule } from '@angular/material/icon';
import { SortNotesByDatePipe } from './sort-notes.pipe';
import { NoteCardComponent } from './note-card/note-card.component';
import { NoteComponent } from "../note/note.component";
import { GroupNotesByDatePipe } from './group-notes.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
  standalone: true,
  imports: [
    MatIconModule,
    SortNotesByDatePipe,
    NoteCardComponent,
    NoteComponent,
    GroupNotesByDatePipe,
    DatePipe,
  ],
})
export class NoteListComponent {
  public readonly store = inject(NotesStore);
}
