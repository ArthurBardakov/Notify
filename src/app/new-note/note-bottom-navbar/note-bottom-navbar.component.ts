import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-bottom-navbar',
  templateUrl: './note-bottom-navbar.component.html',
  styleUrl: './note-bottom-navbar.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class NoteBottomNavbarComponent {
  public readonly backClicked = output<void>();
}
