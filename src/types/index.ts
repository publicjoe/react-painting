export interface StageColumn {
  id: string;
  name: string;
  icon: string; // 'built' | 'primed' | 'painted' | 'based'
}

export interface Unit {
  id: string;
  projectId: string;
  name: string;
  count: number;
  stages: boolean[]; // index corresponds to project.columns index
}

export interface Project {
  id: string;
  categoryId: string;
  name: string;
  columns: StageColumn[];
}

export interface Category {
  id: string;
  name: string;
  isUncategorised?: boolean;
  isVisible?: boolean;
  isExpanded?: boolean;
}

export interface AppState {
  activeProjectId: string;
  categories: Category[];
  projects: Project[];
  units: Unit[];
}

export type StatusField = 'built' | 'primed' | 'painted' | 'based';
