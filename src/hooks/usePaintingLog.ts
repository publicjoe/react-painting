import { useReducer, useEffect } from 'react';
import type { AppState, Category, Project, Model, StatusField } from '../types';

type Action =
  | { type: 'REPLACE_STATE'; payload: AppState }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string } // categoryId
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string } // projectId
  | { type: 'ADD_MODEL'; payload: Model }
  | { type: 'UPDATE_MODEL'; payload: Model }
  | { type: 'DELETE_MODEL'; payload: string } // modelId
  | { type: 'TOGGLE_MODEL_STATUS'; payload: { id: string; field: StatusField } };

export const initialState: AppState = {
  categories: [],
  projects: [],
  models: []
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'REPLACE_STATE':
      return action.payload;

    // Categories
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY':
      return { 
        ...state, 
        categories: state.categories.filter(c => c.id !== action.payload),
        projects: state.projects.filter(p => p.categoryId !== action.payload),
        // cascade: drop models belonging to projects in this category
        models: state.models.filter(m => {
          const project = state.projects.find(p => p.id === m.projectId);
          return project?.categoryId !== action.payload;
        })
      };

    // Projects
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        models: state.models.filter(m => m.projectId !== action.payload),
      };

    // Models
    case 'ADD_MODEL':
      return { ...state, models: [...state.models, action.payload] };
    case 'UPDATE_MODEL':
      return { ...state, models: state.models.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_MODEL':
      return { ...state, models: state.models.filter(m => m.id !== action.payload) };
    case 'TOGGLE_MODEL_STATUS':
      return {
        ...state,
        models: state.models.map(m =>
          m.id === action.payload.id ? { ...m, [action.payload.field]: !m[action.payload.field] } : m
        )
      };

    default:
      return state;
  }
}

const STORAGE_KEY = 'painting-log-state';

export function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.categories) && Array.isArray(v.projects) && Array.isArray(v.models);
}

export function usePaintingLog() {
  const [state, dispatch] = useReducer(reducer, initialState, (initial): AppState => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isAppState(parsed)) return parsed;
        console.error("Ignoring malformed state in local storage");
      }
    } catch (e) {
      console.error("Failed to load state from local storage", e);
    }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to local storage", e);
    }
  }, [state]);

  return { state, dispatch };
}
