import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.scss',
  standalone: true,
  imports: [MatInputModule],
})
export class NewNoteComponent {}
