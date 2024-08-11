import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoteBottomNavbarComponent } from './note-bottom-navbar/note-bottom-navbar.component';
import { NavService } from '../../navbar/nav.service';
import { NotifyRoutes } from '../../shared/enums/routes';
import { NotesStore } from '../../state/notes.store';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoteBottomNavbarComponent],
})
export class NewNoteComponent {
  private readonly navSrc = inject(NavService);
  private readonly store = inject(NotesStore);
  public readonly noteTitle = new FormControl('');
  public readonly noteContent = new FormControl('');

  constructor() {
    this.store.addNote({
      id: uuidv4(),
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  public goToListPage(): void {
    this.navSrc.toggleNavigationTo.next(NotifyRoutes.LIST);
  }
}
