import { Component, ElementRef, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import MediumEditor from 'medium-editor';
import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'app-note-toolbar',
  templateUrl: './note-toolbar.component.html',
  styleUrl: './note-toolbar.component.scss',
  standalone: true,
  imports: [MatIconModule, NgxColorsModule, FormsModule],
})
export class NoteToolbarComponent implements OnInit {
  public containerElement = input.required<ElementRef<HTMLElement>>();
  protected selectedNoteColor = "#ffffff";

  public get isMediumEditorToolbarOpen(): boolean {
    const containerElement = this.containerElement().nativeElement;
    const editor = containerElement.querySelector<HTMLElement>('.medium-editor-toolbar');
    return editor?.classList.contains('open') ?? false;
  }

  ngOnInit(): void {
    this.setupMediumEditor();
    this.toggleMediumToolbarOnKeyboardAppear();
  }

  private setupMediumEditor(): void {
    const containerElement = this.containerElement().nativeElement;
    new MediumEditor(containerElement, {
      elementsContainer: containerElement,
      disableEditing: true,
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'unorderedlist'],
        static: true,  // Makes the toolbar always visible
        sticky: true,  // Keeps the toolbar at the top when scrolling
        updateOnEmptySelection: true  // Allows the toolbar to remain visible even when nothing is selected
      },
    });
  }
  
  private toggleMediumToolbarOnKeyboardAppear(): void {
    visualViewport?.addEventListener('resize', (e) => {
      const viewportHeight = (e.target as VisualViewport).height;
      const noteForm = this.containerElement().nativeElement;
      const toolbar = noteForm.querySelector<HTMLElement>('.medium-editor-toolbar');
      if (!toolbar) throw new Error('Medium Editor toolbar not found');
      const toolbarHeight = toolbar.offsetHeight;
      const newToolbarTop = window.innerHeight - viewportHeight - toolbarHeight;
      toolbar.style.bottom = newToolbarTop < 10 ? '10px' : `${newToolbarTop}px`;
    });
  }

  public toggleMediumEditorToolbar(): void {
    const containerElement = this.containerElement().nativeElement;
    const editor = containerElement.querySelector<HTMLElement>('.medium-editor-toolbar');
    if (!editor) throw new Error('Medium Editor toolbar not found');
    if (editor.classList.contains('open')) editor.classList.remove('open');
    else editor.classList.add('open');
  }
}
