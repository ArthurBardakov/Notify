import { Pipe, PipeTransform } from '@angular/core';
import { Note } from '../../shared/interfaces/note';

@Pipe({
  name: 'sortNotesByDate',
  pure: true,
  standalone: true
})
export class SortNotesByDatePipe implements PipeTransform {

  transform(notes: Note[]): Note[] {
    if (!notes || notes.length === 0) return [];

    return notes.sort((a, b) => {
      const dateA = a.updatedAt ? a.updatedAt : a.createdAt;
      const dateB = b.updatedAt ? b.updatedAt : b.createdAt;

      return dateB.getTime() - dateA.getTime();
    });
  }
}