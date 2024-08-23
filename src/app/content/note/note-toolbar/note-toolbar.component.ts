import { Component, ElementRef, input, model, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import MediumEditor from 'medium-editor';
import { NgxColorsModule } from 'ngx-colors';
import { CssVariables } from '../../../shared/css-variable-helper';

@Component({
  selector: 'app-note-toolbar',
  templateUrl: './note-toolbar.component.html',
  styleUrl: './note-toolbar.component.scss',
  standalone: true,
  imports: [MatIconModule, NgxColorsModule, FormsModule],
})
export class NoteToolbarComponent implements OnInit {
  public containerElement = input.required<ElementRef<HTMLElement>>();
  public noteColor = model.required<string>();
  protected readonly noteToolbar = viewChild.required<ElementRef<HTMLElement>>('noteToolbarEl');

  protected readonly colorPickerPalette = [
    '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9',
    '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9',
    '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2',
    '#ffccbc', '#d7ccc8', '#fafafa', '#cfd8dc', CssVariables.primaryColor
  ];

  public get isMediumEditorToolbarOpen(): boolean {
    const containerElement = this.containerElement().nativeElement;
    const editor = containerElement.querySelector<HTMLElement>('.medium-editor-toolbar');
    return editor?.classList.contains('open') ?? false;
  }

  ngOnInit(): void {
    this.setupMediumEditor();
    const noteToolbarBottom = this.getNoteToolbarBottom();
    this.toggleMediumToolbarOnKeyboardAppear(noteToolbarBottom);
    this.toggleCloseToolbarOnKeyboardAppear(noteToolbarBottom);
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

  private getNoteToolbarBottom(): number {
    const noteToolbar = this.noteToolbar().nativeElement;
    const noteToolbarStyles = getComputedStyle(noteToolbar);
    const noteToolbarBottom = noteToolbarStyles.getPropertyValue('bottom');
    const noteToolbarBottomValue = parseInt(noteToolbarBottom, 10);
    return noteToolbarBottomValue;
  }
  
  private toggleMediumToolbarOnKeyboardAppear(defaultBottom: number): void {
    visualViewport?.addEventListener('resize', (e) => {
      const viewportHeight = (e.target as VisualViewport).height;
      const noteForm = this.containerElement().nativeElement;
      const toolbar = noteForm.querySelector<HTMLElement>('.medium-editor-toolbar');
      if (!toolbar) throw new Error('Medium Editor toolbar not found');
      const toolbarHeight = toolbar.offsetHeight;
      const newToolbarTop = window.innerHeight - viewportHeight - toolbarHeight;
      toolbar.style.bottom = newToolbarTop < defaultBottom ?
        `${defaultBottom}px` : `${newToolbarTop}px`;
    });
  }

  private toggleCloseToolbarOnKeyboardAppear(defaultBottom: number): void {
    visualViewport?.addEventListener('resize', (e) => {
      const viewportHeight = (e.target as VisualViewport).height;
      const noteToolbar = this.noteToolbar().nativeElement;
      if (!noteToolbar) throw new Error('Note toolbar not found');
      const toolbarHeight = noteToolbar.offsetHeight;
      const newToolbarTop = window.innerHeight - viewportHeight - toolbarHeight;
      noteToolbar.style.bottom = newToolbarTop < defaultBottom ?
        `${defaultBottom}px` : `${newToolbarTop}px`;
    });
  }

  public onColorPickerOpen(): void {
    if (!visualViewport) return;
    const viewportHeight = visualViewport.height;
    const colorsPanel = document.querySelector<HTMLElement>('ngx-colors-panel');
    const openedSection = colorsPanel?.querySelector<HTMLElement>('.opened');
    if (!openedSection) throw new Error('Color panel not found');
    const noteToolbar = this.noteToolbar().nativeElement;
    
    const openedSectionObserver = new ResizeObserver(() => {
      const newPanelTop =
        window.innerHeight -
        viewportHeight -
        openedSection.offsetHeight / 2 +
        noteToolbar.offsetHeight / 2;
      const isDefaultPosition = window.innerHeight === viewportHeight;
      openedSection.style.translate = '0px ' + (isDefaultPosition ? 0 : -newPanelTop) + 'px';
      openedSectionObserver.disconnect();
    });
    openedSectionObserver.observe(openedSection);
  }

  public toggleMediumEditorToolbar(): void {
    const containerElement = this.containerElement().nativeElement;
    const editor = containerElement.querySelector<HTMLElement>('.medium-editor-toolbar');
    if (!editor) throw new Error('Medium Editor toolbar not found');
    if (editor.classList.contains('open')) editor.classList.remove('open');
    else editor.classList.add('open');
  }
}
