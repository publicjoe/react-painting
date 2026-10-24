import { useMemo, useState } from 'react';
import { isAppState, usePaintingLog } from './hooks/usePaintingLog';
import { Sidebar } from './components/Sidebar';
import { ProjectList } from './components/ProjectList';
import type { Model, StatusField } from './types';

function App() {
  const { state, dispatch } = usePaintingLog();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fall back to the first category when nothing (or a deleted category) is selected
  const selectedCategory =
    state.categories.find(c => c.id === selectedCategoryId) ?? state.categories[0];

  const modelsByProject = useMemo(() => {
    const grouped: Record<string, Model[]> = {};
    for (const m of state.models) (grouped[m.projectId] ??= []).push(m);
    return grouped;
  }, [state.models]);

  const handleAddCategory = (name: string) => {
    const id = crypto.randomUUID();
    dispatch({ type: 'ADD_CATEGORY', payload: { id, name } });
    setSelectedCategoryId(id);
  };

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

  const handleAddProject = (categoryId: string, name: string) => {
    dispatch({
      type: 'ADD_PROJECT',
      payload: { id: crypto.randomUUID(), categoryId, name }
    });
  };

  const handleAddModel = (projectId: string, name: string) => {
    dispatch({
      type: 'ADD_MODEL',
      payload: {
        id: crypto.randomUUID(),
        projectId,
        name,
        count: 1,
        built: false,
        primed: false,
        painted: false,
        based: false,
      }
    });
  };

  return (
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
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
