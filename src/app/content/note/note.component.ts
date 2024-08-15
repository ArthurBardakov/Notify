import { AfterViewInit, Component, ElementRef, HostListener, inject, input, OnDestroy, OnInit, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoteBottomNavbarComponent } from './note-bottom-navbar/note-bottom-navbar.component';
import { NotesStore } from '../../state/notes.store';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../../shared/models/note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoteBottomNavbarComponent],
})
export class NoteComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly noteId = input<string | undefined>(undefined ,{ alias: 'id' });
  protected readonly noteTextarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('noteTextarea');
  private readonly store = inject(NotesStore);
  private readonly nonNullBuilder = inject(NonNullableFormBuilder);
  public readonly noteTitle = this.nonNullBuilder.control('');
  public readonly noteContent = this.nonNullBuilder.control('');
  
  private currentNote: Note = {
    id: uuidv4(),
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: undefined,
    deletedAt: undefined,
  };

  ngOnInit(): void {
    if (this.noteId()) {
      const storeNote = this.store.getNoteById(this.noteId()!);
      if (!storeNote) throw new Error('Note not found');
      this.currentNote = storeNote;
      this.noteTitle.setValue(storeNote.title || '');
      this.noteContent.setValue(storeNote.content || '');
    } else this.store.addNote(this.currentNote);
  }
  
  ngAfterViewInit(): void {
    const contentElement = this.noteTextarea().nativeElement;
    new Hammer(contentElement);
  }

  @HostListener('window:beforeunload')
  public onBeforeUnload(): void {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.updateNoteIfChanged();
    this.cleanupEmptyNote();
  }

  private updateNoteIfChanged(): void {
    if (this.currentNote.title === this.noteTitle.value &&
        this.currentNote.content === this.noteContent.value) return;

    this.currentNote.updatedAt = new Date();
    this.currentNote.title = this.noteTitle.value;
    this.currentNote.content = this.noteContent.value;
    this.store.updateNote(this.currentNote);
  }

  private cleanupEmptyNote(): void {
    const isNoteTitleEmpty = !this.noteTitle.value?.trim();
    const isNoteContentEmpty = !this.noteContent.value?.trim();
    const isNoteEmpty = isNoteTitleEmpty && isNoteContentEmpty;
    if (isNoteEmpty) this.store.deleteNote(this.currentNote.id);
  }
}
