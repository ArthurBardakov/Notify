import { Component, ElementRef, inject, OnDestroy, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotesStore } from '../../state/notes.store';
import { Note } from '../../shared/models/note';
import { ActivatedRoute } from '@angular/router';
import { NoteToolbarComponent } from './note-toolbar/note-toolbar.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  host: { '(window:beforeunload)': 'ngOnDestroy()' },
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NoteToolbarComponent,
  ],
})
export class NoteComponent implements OnDestroy {
  protected readonly noteContentField = viewChild.required<ElementRef<HTMLElement>>('noteContentFieldEl');
  protected readonly noteTitle = viewChild.required<ElementRef<HTMLDivElement>>('noteTitleEl');
  protected readonly noteContent = viewChild.required<ElementRef<HTMLDivElement>>('noteContentEl');
  protected readonly noteToolbar = viewChild.required(NoteToolbarComponent);

  private readonly store = inject(NotesStore);

  private get noteTitleHtml(): string { return this.noteTitle().nativeElement.innerHTML; }
  private get noteContentHtml(): string { return this.noteContent().nativeElement.innerHTML; }
  private get noteColor(): string { return this.noteToolbar().noteColor(); }

  private get hasNoteChanged(): boolean {
    return this.currentNote.title !== this.noteTitleHtml ||
           this.currentNote.content !== this.noteContentHtml ||
           this.currentNote.hexColor !== this.noteColor;
  }

  private get isNewNote(): boolean {
    return this.currentNote.title === '' && this.currentNote.content === '';
  }

  protected readonly currentNote: Note;

  constructor() {
    const route = inject(ActivatedRoute);
    const noteId = route.snapshot.queryParamMap.get('id');
    if (!noteId) throw new Error('Note id not found');
    const storeNote = this.store.getNoteById(noteId);
    this.currentNote = storeNote ?? new Note(noteId)
  }

  ngOnDestroy(): void {
    this.updateNoteIfChanged();
    this.cleanupEmptyNote();
  }

  private updateNoteIfChanged(): void {
    if (!this.hasNoteChanged) return;
    if (!this.isNewNote) this.currentNote.updatedAt = new Date();    
    this.currentNote.title = this.noteTitleHtml;
    this.currentNote.content = this.noteContentHtml;
    this.currentNote.hexColor = this.noteColor;
    this.store.addNote(this.currentNote);
  }

  private cleanupEmptyNote(): void {
    const isNoteTitleEmpty = !this.noteTitleHtml.trim();
    const isNoteContentEmpty = !this.noteContentHtml.trim();
    const isNoteEmpty = isNoteTitleEmpty && isNoteContentEmpty;
    if (isNoteEmpty) this.store.deleteNote(this.currentNote.id);
  }
}
