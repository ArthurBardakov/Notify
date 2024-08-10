import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoteBottomNavbarComponent } from './note-bottom-navbar/note-bottom-navbar.component';
import { NavbarService } from '../navbar/navbar.service';
import { NotifyRoutes } from '../shared/enums/routes';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.scss',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, NoteBottomNavbarComponent],
})
export class NewNoteComponent {
  private readonly navSrc = inject(NavbarService);

  public goToListPage(): void {
    this.navSrc.toggleNavigationTo.set(NotifyRoutes.List);
  }
}
