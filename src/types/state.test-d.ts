import { describe, expectTypeOf, it } from 'vitest';
import { defaultState } from '../data/defaultData';
import type { AppState, Unit } from './index';

/**
 * Type-level tests, checked by `tsc` during `npm test` (see vite.config.ts).
 *
 * These exist because a missing property on a data object is invisible to a
 * runtime test: the seed data is annotated `AppState`, so a field deleted from
 * the type but still expected by the data (or the reverse) only surfaces when
 * the compiler reads both. Pinning the field lists here means the contract
 * cannot drift by accident.
 */
describe('state contract', () => {
  it('keeps the seed data assignable to AppState', () => {
    expectTypeOf(defaultState).toMatchTypeOf<AppState>();
    expectTypeOf(defaultState.units).toMatchTypeOf<Unit[]>();
  });

  it('keeps every AppState field accounted for', () => {
    expectTypeOf<keyof AppState>().toEqualTypeOf<
      'activeProjectId' | 'categories' | 'projects' | 'units'
    >();
  });

  it('keeps every Unit field accounted for', () => {
    expectTypeOf<keyof Unit>().toEqualTypeOf<
      'id' | 'projectId' | 'name' | 'count' | 'stages'
    >();
  });
});
