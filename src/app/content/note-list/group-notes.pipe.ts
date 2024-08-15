import { Pipe, PipeTransform } from '@angular/core';
import { Note } from '../../shared/interfaces/note';

@Pipe({
  name: 'groupByDate',
  pure: true,
  standalone: true
})
export class GroupNotesByDatePipe implements PipeTransform {

  transform(notes: Note[]): [string, Note[]][] {
    if (!notes || notes.length === 0) return [];

    const groupedNotes = notes.reduce((result, note) => {
      const groupKey = (note.updatedAt || note.createdAt)
        .toISOString().split('T')[0];

      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(note);
      return result;
    }, {} as Record<string, Note[]>);

    return Object.entries(groupedNotes);
  }
}