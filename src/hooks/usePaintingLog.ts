import { useReducer, useEffect } from 'react';
import type { AppState, Unit, Project, Category, StageColumn } from '../types';
import { defaultState, defaultColumns } from '../data/defaultData';

export type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'SET_ACTIVE_PROJECT'; payload: string }
  | { type: 'UPDATE_PROJECT_NAME'; payload: { projectId: string; name: string } }
  | { type: 'UPDATE_PROJECT_VISIBILITY'; payload: { projectId: string; visibility: 'public' | 'private' } }
  | { type: 'ADD_CATEGORY'; payload: { name: string } }
  | { type: 'UPDATE_CATEGORY_NAME'; payload: { categoryId: string; name: string } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'TOGGLE_CATEGORY_VISIBILITY'; payload: string }
  | { type: 'TOGGLE_CATEGORY_EXPAND'; payload: string }
  | { type: 'ADD_PROJECT'; payload: { categoryId: string; name: string } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_UNIT'; payload: { projectId: string; name: string; count: number; stages?: boolean[] } }
  | { type: 'UPDATE_UNIT'; payload: Unit }
  | { type: 'DELETE_UNIT'; payload: string }
  | { type: 'REORDER_PROJECT_UNITS'; payload: { projectId: string; units: Unit[] } }
  | { type: 'TOGGLE_UNIT_STAGE'; payload: { unitId: string; stageIndex: number } }
  | { type: 'UPDATE_PROJECT_COLUMNS'; payload: { projectId: string; columns: StageColumn[] } };

export function paintingLogReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'RESET_TO_DEFAULTS':
      return { ...defaultState };

    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.payload };

    case 'UPDATE_PROJECT_NAME':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId ? { ...p, name: action.payload.name } : p
        ),
      };

    case 'UPDATE_PROJECT_VISIBILITY':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId ? { ...p, visibility: action.payload.visibility } : p
        ),
      };

    case 'ADD_CATEGORY': {
      const newCategory: Category = {
        id: 'cat-' + crypto.randomUUID().slice(0, 8),
        name: action.payload.name,
        isVisible: true,
      };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }

    case 'UPDATE_CATEGORY_NAME':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.categoryId ? { ...c, name: action.payload.name } : c
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
        projects: state.projects.filter((p) => p.categoryId !== action.payload),
        units: state.units.filter((u) => {
          const proj = state.projects.find((p) => p.id === u.projectId);
          return proj?.categoryId !== action.payload;
        }),
      };

    case 'TOGGLE_CATEGORY_VISIBILITY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload ? { ...c, isVisible: !c.isVisible } : c
        ),
      };

    case 'TOGGLE_CATEGORY_EXPAND':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload ? { ...c, isExpanded: !c.isExpanded } : c
        ),
      };

    case 'ADD_PROJECT': {
      const newProjId = 'proj-' + crypto.randomUUID().slice(0, 8);
      const newProject: Project = {
        id: newProjId,
        categoryId: action.payload.categoryId,
        name: action.payload.name,
        visibility: 'public',
        columns: [...defaultColumns],
      };
      return {
        ...state,
        projects: [...state.projects, newProject],
        activeProjectId: newProjId,
      };
    }

    case 'DELETE_PROJECT': {
      const remainingProjects = state.projects.filter((p) => p.id !== action.payload);
      return {
        ...state,
        projects: remainingProjects,
        units: state.units.filter((u) => u.projectId !== action.payload),
        activeProjectId:
          state.activeProjectId === action.payload
            ? remainingProjects[0]?.id || ''
            : state.activeProjectId,
      };
    }

    case 'ADD_UNIT': {
      const activeProj = state.projects.find((p) => p.id === action.payload.projectId);
      const columnCount = activeProj?.columns.length || 5;
      const initialStages = action.payload.stages || new Array(columnCount).fill(false);

      const newUnit: Unit = {
        id: 'u-' + crypto.randomUUID().slice(0, 8),
        projectId: action.payload.projectId,
        name: action.payload.name,
        count: Math.max(1, action.payload.count || 1),
        stages: initialStages,
      };

      return {
        ...state,
        units: [newUnit, ...state.units], // Add to top for quick visibility
      };
    }

    case 'UPDATE_UNIT':
      return {
        ...state,
        units: state.units.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };

    case 'DELETE_UNIT':
      return {
        ...state,
        units: state.units.filter((u) => u.id !== action.payload),
      };

    case 'REORDER_PROJECT_UNITS': {
      const otherUnits = state.units.filter((u) => u.projectId !== action.payload.projectId);
      return {
        ...state,
        units: [...action.payload.units, ...otherUnits],
      };
    }

    case 'TOGGLE_UNIT_STAGE':
      return {
        ...state,
        units: state.units.map((u) => {
          if (u.id !== action.payload.unitId) return u;
          const nextStages = [...u.stages];
          nextStages[action.payload.stageIndex] = !nextStages[action.payload.stageIndex];
          return { ...u, stages: nextStages };
        }),
      };

    case 'UPDATE_PROJECT_COLUMNS':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId ? { ...p, columns: action.payload.columns } : p
        ),
      };

    default:
      return state;
  }
}

const STORAGE_KEY = 'pile-of-potential-state-v4';

export function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.categories) && Array.isArray(v.projects) && Array.isArray(v.units);
}

export function usePaintingLog() {
  const [state, dispatch] = useReducer(paintingLogReducer, defaultState, (fallback) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validity check
        if (parsed.projects && parsed.units && parsed.categories) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not parse saved painting log state, using defaults', err);
    }
    return fallback;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save state to localStorage', err);
    }
  }, [state]);

  return { state, dispatch };
}
