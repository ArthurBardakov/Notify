import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.scss',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
})
export class NewNoteComponent {}
