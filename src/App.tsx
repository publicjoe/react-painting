import { useMemo, useRef } from 'react';
import { usePaintingLog } from './hooks/usePaintingLog';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { SidebarProjects } from './components/SidebarProjects';
import { UnitTable } from './components/UnitTable';

export default function App() {
  const { state, dispatch } = usePaintingLog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Project
  const activeProject = useMemo(() => {
    return state.projects.find((p) => p.id === state.activeProjectId) || state.projects[0];
  }, [state.projects, state.activeProjectId]);

  // Active Project Units
  const activeUnits = useMemo(() => {
    if (!activeProject) return [];
    return state.units.filter((u) => u.projectId === activeProject.id);
  }, [state.units, activeProject]);

  // Calculate Statistics
  const stats = useMemo(() => {
    const totalPoints = activeUnits.reduce((acc, u) => acc + (u.points || 0), 0);
    const totalModels = activeUnits.reduce((acc, u) => acc + (u.count || 0), 0);

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
