import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Note } from '../shared/models/note';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  filter: { query: string };
};

const initialState: NotesState = {
  notes: JSON.parse(localStorage.getItem('notes') || '[]'), // Load notes from local storage
  isLoading: false,
  filter: { query: '' },
};

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ notes, filter }) => ({
    notesCount: computed(() => notes().length),
    filteredNotes: computed(() => {
      if (!filter.query()) {
        return notes();
      }
      return notes().filter((note) =>
        note.title?.toLowerCase().includes(filter.query().toLowerCase()),
      );
    }),
  })),
  withMethods((store) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    getNoteById: (noteId: string): Note | undefined => {
      return store.notes().find(note => note.id === noteId);
    },
    addNote: (note: Note) => {
      patchState(store, (state) => {
        const updatedNotes = [...state.notes, note];

        // Save updated notes to local storage
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        return {
          ...state,
          notes: updatedNotes,
        };
      });
    },
    deleteNote: (noteId: string) => {
      patchState(store, (state) => {
        const updatedNotes = state.notes.filter((note) => note.id !== noteId);

        // Update local storage
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        return {
          ...state,
          notes: updatedNotes,
        };
      });
    },
    updateNote: (note: Note) => {
      patchState(store, (state) => {
        const updatedNotes = state.notes.map((n) => (n.id === note.id ? note : n));

        // Update local storage
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        return {
          ...state,
          notes: updatedNotes,
        };
      });
    },
  })),
);
