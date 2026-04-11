import { useReducer, useEffect } from 'react';
import type { AppState, Category, Project, Model } from '../types';

type Action =
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string } // categoryId
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string } // projectId
  | { type: 'ADD_MODEL'; payload: Model }
  | { type: 'UPDATE_MODEL'; payload: Model }
  | { type: 'DELETE_MODEL'; payload: string } // modelId
  | { type: 'TOGGLE_MODEL_STATUS'; payload: { id: string; field: keyof Model } };

const initialState: AppState = {
  categories: [],
  projects: [],
  models: []
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
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
        // cascade delete to models not yet implemented cleanly here, 
        // a simple way is filtering out models where their project had this categoryId
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
        models: state.models.map(m => {
          if (m.id === action.payload.id) {
            return { ...m, [action.payload.field]: !m[action.payload.field] };
          }
          return m;
        })
      };

    default:
      return state;
  }
}

const STORAGE_KEY = 'painting-log-state';

export function usePaintingLog() {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load state from local storage", e);
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
