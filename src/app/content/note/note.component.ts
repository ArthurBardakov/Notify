import { AfterViewInit, Component, effect, ElementRef, HostListener, inject, input, OnDestroy, OnInit, untracked, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoteBottomNavbarComponent } from './note-bottom-navbar/note-bottom-navbar.component';
import { NotesStore } from '../../state/notes.store';
import { v4 as uuidv4 } from 'uuid';
import { merge } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
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
    updatedAt: null,
  };

  private readonly noteUpdated = toSignal(merge(
    this.noteTitle.valueChanges,
    this.noteContent.valueChanges));
  
  constructor() {
    this.setupNoteUpdate();
  }
  
  private setupNoteUpdate(): void {
    effect(() => {
      this.noteUpdated();
      this.currentNote.title = this.noteTitle.value;
      this.currentNote.content = this.noteContent.value;
      this.currentNote.updatedAt = new Date();
      untracked(() => this.store.updateNote(this.currentNote));
    });
  }

  ngOnInit(): void {
    if (this.noteId()) {
      const storeNote = this.store.getNoteById(this.noteId()!);
      if (!storeNote) throw new Error('Note not found');
      this.currentNote = storeNote;
      this.noteTitle.setValue(storeNote.title || '');
      this.noteContent.setValue(storeNote.content || '');
    } else this.store.addNote(this.currentNote);
  }

  @HostListener('window:beforeunload')
  public onBeforeUnload(): void {
    this.cleanupEmptyNote();
  }

  ngAfterViewInit(): void {
    const contentElement = this.noteTextarea().nativeElement;
    new Hammer(contentElement);
  }

  ngOnDestroy(): void {
    this.cleanupEmptyNote();
  }

  private cleanupEmptyNote(): void {
    const isNoteTitleEmpty = !this.noteTitle.value?.trim();
    const isNoteContentEmpty = !this.noteContent.value?.trim();
    const isNoteEmpty = isNoteTitleEmpty && isNoteContentEmpty;
    if (isNoteEmpty) this.store.deleteNote(this.currentNote.id);
  }
}
