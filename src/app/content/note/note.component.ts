import { Component, ElementRef, inject, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotesStore } from '../../state/notes.store';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../../shared/interfaces/note';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteToolbarComponent } from './note-toolbar/note-toolbar.component';
import { CssVariables } from '../../shared/css-variable-helper';

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
export class NoteComponent implements OnInit, OnDestroy {
  protected readonly noteId = input<string | undefined>(undefined, { alias: 'id' });

  protected readonly noteContentField = viewChild.required<ElementRef<HTMLElement>>('noteContentFieldEl');
  protected readonly noteTitle = viewChild.required<ElementRef<HTMLDivElement>>('noteTitleEl');
  protected readonly noteContent = viewChild.required<ElementRef<HTMLDivElement>>('noteContentEl');

  protected readonly selectedNoteColor = signal<string>(CssVariables.backgroundColor);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(NotesStore);

  private get noteTitleHtml(): string { return this.noteTitle().nativeElement.innerHTML; }
  private get noteContentHtml(): string { return this.noteContent().nativeElement.innerHTML; }

  protected currentNote: Note = {
    id: uuidv4(),
    title: '',
    content: '',
    hexColor: CssVariables.backgroundColor,
    createdAt: new Date(),
    updatedAt: undefined,
    deletedAt: undefined,
  };

  ngOnInit(): void {
    this.setNoteIdWhenNewNote();
    this.initializeOrAddNote();
  }

  private setNoteIdWhenNewNote(): void {
    if (this.noteId()) return;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.currentNote.id },
      queryParamsHandling: "merge",
    });
  }

  private initializeOrAddNote(): void {
    const storeNote = this.store.getNoteById(this.noteId()!);
    if (!storeNote) this.store.addNote(this.currentNote);
    this.currentNote = storeNote || this.currentNote;
  }

  ngOnDestroy(): void {
    this.updateNoteIfChanged();
    this.cleanupEmptyNote();
  }

  private updateNoteIfChanged(): void {
    if (this.currentNote.title === this.noteTitleHtml &&
        this.currentNote.content === this.noteContentHtml &&
        this.currentNote.hexColor === this.selectedNoteColor()) return;

    if (this.noteId()) this.currentNote.updatedAt = new Date();
    this.currentNote.title = this.noteTitleHtml;
    this.currentNote.content = this.noteContentHtml;
    this.currentNote.hexColor = this.selectedNoteColor();
    this.store.updateNote(this.currentNote);
  }

  private cleanupEmptyNote(): void {
    const isNoteTitleEmpty = !this.noteContentHtml.trim();
    const isNoteContentEmpty = !this.noteContentHtml.trim();
    const isNoteEmpty = isNoteTitleEmpty && isNoteContentEmpty;
    if (isNoteEmpty) this.store.deleteNote(this.currentNote.id);
  }
}
