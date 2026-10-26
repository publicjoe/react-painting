import { describe, expect, it } from 'vitest';
import { paintingLogReducer as reducer, isAppState } from './usePaintingLog';
import type { AppState, Project, Unit } from '../types';

const columns = [
  { id: 'col-1', name: 'Built', icon: 'built' },
  { id: 'col-2', name: 'Primed', icon: 'primed' },
];

const project = (id: string, categoryId: string, name: string): Project => ({
  id,
  categoryId,
  name,
  columns,
});

const unit = (
  id: string,
  projectId: string,
  name: string,
  count: number,
  stages: boolean[]
): Unit => ({ id, projectId, name, count, stages });

const seeded: AppState = {
  activeProjectId: 'p1',
  categories: [
    { id: 'c1', name: 'WH40k' },
    { id: 'c2', name: 'D&D' },
  ],
  projects: [project('p1', 'c1', 'Marines'), project('p2', 'c2', 'Party')],
  units: [
    unit('u1', 'p1', 'Captain', 1, [false, false]),
    unit('u2', 'p2', 'Rogue', 2, [true, false]),
  ],
};

describe('paintingLogReducer', () => {
  it('cascades category deletion to projects and units', () => {
    const next = reducer(seeded, { type: 'DELETE_CATEGORY', payload: 'c1' });
    expect(next.categories.map((c) => c.id)).toEqual(['c2']);
    expect(next.projects.map((p) => p.id)).toEqual(['p2']);
    expect(next.units.map((u) => u.id)).toEqual(['u2']);
  });

  it('cascades project deletion to units and falls back to a remaining project', () => {
    const next = reducer(seeded, { type: 'DELETE_PROJECT', payload: 'p2' });
    expect(next.units.map((u) => u.id)).toEqual(['u1']);
    expect(next.activeProjectId).toBe('p1');

    const deletingActive = reducer(seeded, { type: 'DELETE_PROJECT', payload: 'p1' });
    expect(deletingActive.activeProjectId).toBe('p2');
  });

  it('toggles only the requested stage of the requested unit, without mutating state', () => {
    const next = reducer(seeded, {
      type: 'TOGGLE_UNIT_STAGE',
      payload: { unitId: 'u1', stageIndex: 1 },
    });
    expect(next.units[0].stages).toEqual([false, true]);
    expect(next.units[1]).toEqual(seeded.units[1]);
    expect(seeded.units[0].stages).toEqual([false, false]);
  });

  it('renames only the requested category', () => {
    const next = reducer(seeded, {
      type: 'UPDATE_CATEGORY_NAME',
      payload: { categoryId: 'c1', name: 'Warhammer' },
    });
    expect(next.categories[0].name).toBe('Warhammer');
    expect(next.categories[1].name).toBe('D&D');
  });

  it('adds a unit with one stage per project column and clamps the count to at least 1', () => {
    const next = reducer(seeded, {
      type: 'ADD_UNIT',
      payload: { projectId: 'p1', name: 'Sergeant', count: 0 },
    });
    expect(next.units).toHaveLength(seeded.units.length + 1);
    expect(next.units[0]).toMatchObject({
      projectId: 'p1',
      name: 'Sergeant',
      count: 1,
      stages: [false, false],
    });
  });

  it('replaces the whole state', () => {
    const replacement: AppState = { ...seeded, activeProjectId: 'p2' };
    expect(reducer(seeded, { type: 'SET_STATE', payload: replacement })).toEqual(replacement);
  });
});

describe('isAppState', () => {
  it('accepts a valid state', () => expect(isAppState(seeded)).toBe(true));

  it.each([
    null,
    42,
    {},
    { categories: [], projects: [] },
    { categories: [], projects: [], units: {} },
  ])('rejects %j', (value) => expect(isAppState(value)).toBe(false));
});
