import { describe, expect, it } from 'vitest';
import { initialState, isAppState, reducer } from './usePaintingLog';
import type { AppState } from '../types';

const seeded: AppState = {
  categories: [{ id: 'c1', name: 'WH40k' }, { id: 'c2', name: 'D&D' }],
  projects: [
    { id: 'p1', categoryId: 'c1', name: 'Marines' },
    { id: 'p2', categoryId: 'c2', name: 'Party' },
  ],
  models: [
    { id: 'm1', projectId: 'p1', name: 'Captain', count: 1, built: false, primed: false, painted: false, based: false },
    { id: 'm2', projectId: 'p2', name: 'Rogue', count: 2, built: true, primed: false, painted: false, based: false },
  ],
};

describe('reducer', () => {
  it('cascades category deletion to projects and models', () => {
    const next = reducer(seeded, { type: 'DELETE_CATEGORY', payload: 'c1' });
    expect(next.categories.map(c => c.id)).toEqual(['c2']);
    expect(next.projects.map(p => p.id)).toEqual(['p2']);
    expect(next.models.map(m => m.id)).toEqual(['m2']);
  });

  it('cascades project deletion to models', () => {
    const next = reducer(seeded, { type: 'DELETE_PROJECT', payload: 'p2' });
    expect(next.models.map(m => m.id)).toEqual(['m1']);
  });

  it('toggles only the requested status field', () => {
    const next = reducer(seeded, { type: 'TOGGLE_MODEL_STATUS', payload: { id: 'm1', field: 'painted' } });
    expect(next.models[0]).toMatchObject({ painted: true, built: false, name: 'Captain' });
    expect(next.models[1]).toEqual(seeded.models[1]);
  });

  it('renames a category', () => {
    const next = reducer(seeded, { type: 'UPDATE_CATEGORY', payload: { id: 'c1', name: 'Warhammer' } });
    expect(next.categories[0].name).toBe('Warhammer');
  });

  it('replaces state', () => {
    expect(reducer(seeded, { type: 'REPLACE_STATE', payload: initialState })).toEqual(initialState);
  });
});

describe('isAppState', () => {
  it('accepts a valid state', () => expect(isAppState(seeded)).toBe(true));
  it.each([null, 42, {}, { categories: [], projects: [] }, { categories: 1, projects: [], models: [] }])(
    'rejects %j',
    (v) => expect(isAppState(v)).toBe(false),
  );
});
