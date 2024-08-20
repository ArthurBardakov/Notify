import { Component, ElementRef, inject, input, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotesStore } from '../../state/notes.store';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../../shared/interfaces/note';
import { ActivatedRoute, Router } from '@angular/router';
import MediumEditor from 'medium-editor';

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
  ],
})
export class NoteComponent implements OnInit, OnDestroy {
  protected readonly noteId = input<string | undefined>(undefined, { alias: 'id' });
  protected readonly noteForm = viewChild.required<ElementRef<HTMLFormElement>>('noteForm');
  protected readonly noteTitle = viewChild.required<ElementRef<HTMLDivElement>>('noteTitle');
  protected readonly noteContent = viewChild.required<ElementRef<HTMLDivElement>>('noteContent');
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(NotesStore);

  private get noteTitleHtml(): string { return this.noteTitle().nativeElement.innerHTML; }
  private get noteContentHtml(): string { return this.noteContent().nativeElement.innerHTML; }
  
  protected currentNote: Note = {
    id: uuidv4(),
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: undefined,
    deletedAt: undefined,
  };

  ngOnInit(): void {
    this.setNoteIdWhenNewNote();
    this.initializeOrAddNote();
    this.setupMediumEditor();
    this.noteTitle().nativeElement.focus();
  }

  private setupMediumEditor(): void {
    const containerElement = this.noteForm().nativeElement;
    new MediumEditor(containerElement, {
      elementsContainer: containerElement,
      disableEditing: true,
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        static: true,  // Makes the toolbar always visible
        sticky: true,  // Keeps the toolbar at the top when scrolling
        updateOnEmptySelection: true  // Allows the toolbar to remain visible even when nothing is selected
      },
    });
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
        this.currentNote.content === this.noteContentHtml) return;

    if (this.noteId()) this.currentNote.updatedAt = new Date();
    this.currentNote.title = this.noteTitleHtml;
    this.currentNote.content = this.noteContentHtml;
    this.store.updateNote(this.currentNote);
  }

  private cleanupEmptyNote(): void {
    const isNoteTitleEmpty = !this.noteContentHtml.trim();
    const isNoteContentEmpty = !this.noteContentHtml.trim();
    const isNoteEmpty = isNoteTitleEmpty && isNoteContentEmpty;
    if (isNoteEmpty) this.store.deleteNote(this.currentNote.id);
  }
}
