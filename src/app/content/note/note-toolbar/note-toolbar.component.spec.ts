import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteToolbarComponent } from './note-toolbar.component';

describe('NoteToolbarComponent', () => {
  let component: NoteToolbarComponent;
  let fixture: ComponentFixture<NoteToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
