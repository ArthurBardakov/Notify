import { Component, inject } from '@angular/core';
import { NotesStore } from '../../state/notes.store';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true,
  imports: [],
})
export class ListComponent {
  public readonly store = inject(NotesStore);
}
