<<<<<<< HEAD
import { useMemo, useRef } from 'react';
import { usePaintingLog } from './hooks/usePaintingLog';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { SidebarProjects } from './components/SidebarProjects';
import { UnitTable } from './components/UnitTable';
=======
import { useMemo, useState } from 'react';
import { isAppState, usePaintingLog } from './hooks/usePaintingLog';
import { Sidebar } from './components/Sidebar';
import { ProjectList } from './components/ProjectList';
import type { Model, StatusField } from './types';
>>>>>>> 0a25e5c4ef1959c5c87c0e0a598d475a25208035

export default function App() {
  const { state, dispatch } = usePaintingLog();
  const fileInputRef = useRef<HTMLInputElement>(null);

<<<<<<< HEAD
  // Active Project
  const activeProject = useMemo(() => {
    return state.projects.find((p) => p.id === state.activeProjectId) || state.projects[0];
  }, [state.projects, state.activeProjectId]);
=======
  // Fall back to the first category when nothing (or a deleted category) is selected
  const selectedCategory =
    state.categories.find(c => c.id === selectedCategoryId) ?? state.categories[0];

  const modelsByProject = useMemo(() => {
    const grouped: Record<string, Model[]> = {};
    for (const m of state.models) (grouped[m.projectId] ??= []).push(m);
    return grouped;
  }, [state.models]);
>>>>>>> 0a25e5c4ef1959c5c87c0e0a598d475a25208035

  // Active Project Units
  const activeUnits = useMemo(() => {
    if (!activeProject) return [];
    return state.units.filter((u) => u.projectId === activeProject.id);
  }, [state.units, activeProject]);

<<<<<<< HEAD
  // Calculate Statistics
  const stats = useMemo(() => {
    const totalPoints = activeUnits.reduce((acc, u) => acc + (u.points || 0), 0);
    const totalModels = activeUnits.reduce((acc, u) => acc + (u.count || 0), 0);
=======
  const handleDeleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
    if (selectedCategoryId === id) setSelectedCategoryId(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paintlog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isAppState(parsed)) throw new Error('Unexpected file format');
      if (!confirm('Importing replaces all current data. Continue?')) return;
      dispatch({ type: 'REPLACE_STATE', payload: parsed });
      setSelectedCategoryId(null);
    } catch {
      alert('Could not import: the file is not a valid PaintLog export.');
    }
  };
>>>>>>> 0a25e5c4ef1959c5c87c0e0a598d475a25208035

    const numCols = activeProject?.columns.length || 5;
    const completedUnits = activeUnits.filter((u) => {
      return (
        u.stages.length >= numCols &&
        activeProject.columns.every((_, idx) => u.stages[idx] === true)
      );
    });

    const modelsCompleteCount = completedUnits.reduce((acc, u) => acc + (u.count || 0), 0);
    const modelsCompletePercent = totalModels === 0 ? 0 : (modelsCompleteCount / totalModels) * 100;

    const pointsCompleteCount = completedUnits.reduce((acc, u) => acc + (u.points || 0), 0);
    const pointsCompletePercent = totalPoints === 0 ? 0 : (pointsCompleteCount / totalPoints) * 100;

    return {
      totalPoints,
      totalModels,
      pointsCompleteCount,
      pointsCompletePercent,
      modelsCompleteCount,
      modelsCompletePercent,
    };
  }, [activeUnits, activeProject]);

  // JSON Export
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pile-of-potential-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Import
  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.projects && parsed.units) {
          dispatch({ type: 'SET_STATE', payload: parsed });
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not read the JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#24282e] text-zinc-100 flex flex-col font-sans relative selection:bg-emerald-500/30">
      
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Top Navbar */}
      <Header
        username={state.username || ''}
        onResetDefaults={() => dispatch({ type: 'RESET_TO_DEFAULTS' })}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Stats Sub-Bar */}
      <StatsBar
        username={state.username || ''}
        projectId={activeProject?.id || '13493085'}
        totalPoints={stats.totalPoints}
        totalModels={stats.totalModels}
        pointsCompleteCount={stats.pointsCompleteCount}
        pointsCompletePercent={stats.pointsCompletePercent}
        modelsCompleteCount={stats.modelsCompleteCount}
        modelsCompletePercent={stats.modelsCompletePercent}
      />

      {/* Main Content: Two Columns (Left Sidebar + Right Table) */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row gap-5 relative z-10">
        
        {/* Left Column: Projects & Settings */}
        <SidebarProjects
          categories={state.categories}
          projects={state.projects}
          activeProjectId={activeProject?.id || ''}
          onSelectProject={(id) => dispatch({ type: 'SET_ACTIVE_PROJECT', payload: id })}
          onAddCategory={(name) => dispatch({ type: 'ADD_CATEGORY', payload: { name } })}
          onDeleteCategory={(id) => dispatch({ type: 'DELETE_CATEGORY', payload: id })}
          onToggleCategoryVisibility={(id) =>
            dispatch({ type: 'TOGGLE_CATEGORY_VISIBILITY', payload: id })
          }
          onToggleCategoryExpand={(id) =>
            dispatch({ type: 'TOGGLE_CATEGORY_EXPAND', payload: id })
          }
          onAddProject={(categoryId, name) =>
            dispatch({ type: 'ADD_PROJECT', payload: { categoryId, name } })
          }
          onDeleteProject={(id) => dispatch({ type: 'DELETE_PROJECT', payload: id })}
          onUpdateProjectName={(projectId, name) =>
            dispatch({ type: 'UPDATE_PROJECT_NAME', payload: { projectId, name } })
          }
          onUpdateProjectVisibility={(projectId, visibility) =>
            dispatch({ type: 'UPDATE_PROJECT_VISIBILITY', payload: { projectId, visibility } })
          }
          onUpdateProjectColumns={(projectId, columns) =>
            dispatch({ type: 'UPDATE_PROJECT_COLUMNS', payload: { projectId, columns } })
          }
        />

        {/* Right Column: Units & Stages Table */}
        {activeProject ? (
          <UnitTable
            columns={activeProject.columns}
            units={activeUnits}
            onAddUnit={(name, count, stages) =>
              dispatch({
                type: 'ADD_UNIT',
                payload: { projectId: activeProject.id, name, count, stages },
              })
            }
            onUpdateUnit={(unit) => dispatch({ type: 'UPDATE_UNIT', payload: unit })}
            onDeleteUnit={(id) => dispatch({ type: 'DELETE_UNIT', payload: id })}
            onReorderUnits={(reorderedUnits) =>
              dispatch({
                type: 'REORDER_PROJECT_UNITS',
                payload: { projectId: activeProject.id, units: reorderedUnits },
              })
            }
            onToggleUnitStage={(unitId, stageIndex) =>
              dispatch({ type: 'TOGGLE_UNIT_STAGE', payload: { unitId, stageIndex } })
            }
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-12 bg-[#1c1f24] rounded border border-zinc-800 text-zinc-400">
            Select or create a project from the left panel to begin.
=======
    <div className="flex flex-col md:flex-row h-screen bg-zinc-900 text-zinc-100 overflow-hidden font-sans selection:bg-blue-500/30">
      <Sidebar 
        categories={state.categories}
        selectedCategoryId={selectedCategory?.id ?? null}
        onSelectCategory={setSelectedCategoryId}
        onAddCategory={handleAddCategory}
        onRenameCategory={(id, name) => dispatch({ type: 'UPDATE_CATEGORY', payload: { id, name } })}
        onDeleteCategory={handleDeleteCategory}
        onExport={handleExport}
        onImport={handleImport}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {selectedCategory ? (
          <ProjectList 
            category={selectedCategory}
            projects={state.projects.filter(p => p.categoryId === selectedCategory.id)}
            modelsByProject={modelsByProject}
            onAddProject={handleAddProject}
            onUpdateProject={(p) => dispatch({ type: 'UPDATE_PROJECT', payload: p })}
            onDeleteProject={(id) => dispatch({ type: 'DELETE_PROJECT', payload: id })}
            
            onAddModel={handleAddModel}
            onUpdateModel={(m) => dispatch({ type: 'UPDATE_MODEL', payload: m })}
            onDeleteModel={(id) => dispatch({ type: 'DELETE_MODEL', payload: id })}
            onToggleStatus={(id: string, field: StatusField) => dispatch({ type: 'TOGGLE_MODEL_STATUS', payload: { id, field } })}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-zinc-900">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-6">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">Welcome to PaintLog</h2>
              <p className="text-zinc-400 mb-8">
                The ultimate companion for tracking your tabletop miniatures painting progress. 
                Keep track of what's built, primed, painted, and ready for the table.
              </p>
              
              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50 text-left">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Getting Started</h3>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</span>
                    <span>Create a <strong>Category</strong> in the sidebar (e.g. Warhammer 40k, D&D).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</span>
                    <span>Add <strong>Projects</strong> within your category (e.g. Space Marines Army).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">3</span>
                    <span>Add your <strong>Models</strong> to the project and track their status!</span>
                  </li>
                </ul>
              </div>
            </div>
>>>>>>> 0a25e5c4ef1959c5c87c0e0a598d475a25208035
          </div>
        )}
      </main>

      {/* Subtle wargame mascot watermark background */}
      <div className="fixed bottom-0 left-0 pointer-events-none select-none opacity-[0.035] z-0">
        <svg viewBox="0 0 500 500" className="w-[500px] h-[500px] text-white" fill="currentColor">
          <circle cx="250" cy="250" r="220" />
          <path d="M150 180c0-50 40-90 100-90s100 40 100 90v40h-200v-40z" fill="#000" />
          <circle cx="210" cy="220" r="20" fill="#fff" />
          <circle cx="290" cy="220" r="20" fill="#fff" />
          <path d="M200 320c20 30 80 30 100 0" stroke="#fff" strokeWidth="15" strokeLinecap="round" />
        </svg>
      </div>

    </div>
  );
}
