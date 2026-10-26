import React, { useRef, useState } from 'react';
import type { Category, Project } from '../types';
import { EyeIcon, TrashIcon, EditPencilIcon, DragGripIcon } from './Icons';

interface ProjectMoveRequest {
  projectId: string;
  categoryId: string;
  /** Project to insert next to, or null to append to the category. */
  targetProjectId: string | null;
  position: 'before' | 'after';
}

interface SidebarProjectsProps {
  categories: Category[];
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCategoryName: (id: string, name: string) => void;
  onToggleCategoryVisibility: (id: string) => void;
  onToggleCategoryExpand: (id: string) => void;
  onAddProject: (categoryId: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProjectName: (projectId: string, name: string) => void;
  /** Reorders a project, or moves it into another category. */
  onMoveProject: (request: ProjectMoveRequest) => void;
  /** Project currently under a dragged unit, highlighted as a drop target. */
  dropProjectId?: string | null;
}

export const SidebarProjects: React.FC<SidebarProjectsProps> = ({
  categories,
  projects,
  activeProjectId,
  onSelectProject,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategoryName,
  onToggleCategoryVisibility,
  onToggleCategoryExpand,
  onAddProject,
  onDeleteProject,
  onUpdateProjectName,
  onMoveProject,
  dropProjectId = null,
}) => {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);

  // New Category / Project prompt states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [targetCategoryId, setTargetCategoryId] = useState('');

  // Editing category name state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editedCatName, setEditedCatName] = useState('');

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Project drag state. The drop target is either a project row, which fixes
  // both the destination category and the position in it, or a category bar,
  // which appends to that category.
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [projectDropTarget, setProjectDropTarget] = useState<{
    id: string;
    position: 'before' | 'after';
  } | null>(null);
  const [dropCategoryId, setDropCategoryId] = useState<string | null>(null);
  // Kept in refs so pointermove, which fires constantly, only acts on changes.
  const hoveredCategoryRef = useRef<string | null>(null);
  const draggedProjectMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleProjectPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    projectId: string
  ) => {
    if (e.button !== 0) return; // Only primary left-click
    e.preventDefault();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore: pointer capture may be unavailable */
    }

    draggedProjectMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDraggedProjectId(projectId);
  };

  const handleProjectPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedProjectId) return;

    if (
      Math.abs(e.clientX - dragStartRef.current.x) > 3 ||
      Math.abs(e.clientY - dragStartRef.current.y) > 3
    ) {
      draggedProjectMovedRef.current = true;
    }

    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // A project row is the precise target: it decides the destination category
    // as well as the position within it.
    const rowEl = elements.find((el) =>
      el.hasAttribute('data-project-id')
    ) as HTMLElement | undefined;
    const rowId = rowEl?.getAttribute('data-project-id') ?? null;

    if (rowEl && rowId && rowId !== draggedProjectId) {
      const rect = rowEl.getBoundingClientRect();
      const position: 'before' | 'after' =
        e.clientY - rect.top < rect.height / 2 ? 'before' : 'after';
      setProjectDropTarget({ id: rowId, position });
      setDropCategoryId(null);
      hoveredCategoryRef.current = null;
      return;
    }

    setProjectDropTarget(null);

    // Otherwise the category bar takes the drop and the project goes to the end
    // of that category, which is the only way into a collapsed one.
    const categoryEl = elements.find((el) =>
      el.hasAttribute('data-category-id')
    ) as HTMLElement | undefined;
    const categoryId = categoryEl?.getAttribute('data-category-id') ?? null;
    setDropCategoryId(categoryId);

    // Expand on hover so a position inside a collapsed category can be chosen.
    if (categoryId && categoryId !== hoveredCategoryRef.current) {
      hoveredCategoryRef.current = categoryId;
      const hovered = categories.find((c) => c.id === categoryId);
      if (hovered && hovered.isExpanded === false) onToggleCategoryExpand(categoryId);
    } else if (!categoryId) {
      hoveredCategoryRef.current = null;
    }
  };

  const handleProjectPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedProjectId) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore: pointer capture may be unavailable */
    }

    if (projectDropTarget && projectDropTarget.id !== draggedProjectId) {
      const target = projects.find((p) => p.id === projectDropTarget.id);
      if (target) {
        onMoveProject({
          projectId: draggedProjectId,
          categoryId: target.categoryId,
          targetProjectId: target.id,
          position: projectDropTarget.position,
        });
      }
    } else if (dropCategoryId) {
      onMoveProject({
        projectId: draggedProjectId,
        categoryId: dropCategoryId,
        targetProjectId: null,
        position: 'after',
      });
    }

    hoveredCategoryRef.current = null;
    setDraggedProjectId(null);
    setProjectDropTarget(null);
    setDropCategoryId(null);
  };

  const renderProjectGrip = (projectId: string, iconClassName: string) => (
    <div
      onPointerDown={(e) => handleProjectPointerDown(e, projectId)}
      onPointerMove={handleProjectPointerMove}
      onPointerUp={handleProjectPointerUp}
      onClick={(e) => {
        // Dragging a project must not also select it.
        if (draggedProjectMovedRef.current) e.stopPropagation();
      }}
      className="flex items-center justify-center flex-shrink-0 cursor-grab active:cursor-grabbing text-zinc-500 hover:text-[#3dbfb5] touch-none select-none"
      title="Click and drag to reorder or move this project"
    >
      <DragGripIcon className={`${iconClassName} pointer-events-none`} />
    </div>
  );

  const renderProjectDropLines = (projectId: string) => (
    <>
      {projectDropTarget?.id === projectId && projectDropTarget.position === 'before' && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-[#3dbfb5] rounded-full shadow-[0_0_6px_#3dbfb5] z-30 pointer-events-none" />
      )}
      {projectDropTarget?.id === projectId && projectDropTarget.position === 'after' && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3dbfb5] rounded-full shadow-[0_0_6px_#3dbfb5] z-30 pointer-events-none" />
      )}
    </>
  );

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const catId = targetCategoryId || categories[0]?.id || 'cat-uncategorised';
      onAddProject(catId, newProjectName.trim());
      setNewProjectName('');
      setIsAddingProject(false);
    }
  };

  const uncategorisedCategory = categories.find((c) => c.isUncategorised);
  const regularCategories = categories.filter((c) => !c.isUncategorised);

  return (
    <aside className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-4">
      
      {/* 1. PROJECTS COLLAPSIBLE CONTAINER */}
      <div className="bg-[#1c1f24] border border-[#2b313b] rounded-md overflow-hidden shadow-lg">
        
        {/* Header */}
        <div
          onClick={() => setProjectsExpanded(!projectsExpanded)}
          className="flex items-center justify-between px-3.5 py-2.5 bg-[#17191d] border-b border-[#252a33] cursor-pointer hover:bg-[#1f2329] transition-colors select-none"
        >
          <span className="font-heading text-sm font-bold tracking-wider text-[#3dbfb5] uppercase">
            PROJECTS
          </span>
          <span className="text-[#3dbfb5] text-xs font-bold transform transition-transform duration-200">
            {projectsExpanded ? '▲' : '▼'}
          </span>
        </div>

        {projectsExpanded && (
          <div className="p-3 space-y-3">
            
            {/* Action Buttons: ADD PROJECT & ADD CATEGORY */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setTargetCategoryId(categories[0]?.id || '');
                  setIsAddingProject(true);
                }}
                className="bg-[#216b3f] hover:bg-[#287d4a] active:bg-[#1b5733] text-white font-heading text-xs font-bold tracking-wider uppercase py-2 px-3 rounded border border-[#185331] shadow transition-colors text-center"
              >
                ADD PROJECT
              </button>
              
              <button
                onClick={() => setIsAddingCategory(true)}
                className="bg-[#1b5a4a] hover:bg-[#226e5a] active:bg-[#14473a] text-white font-heading text-xs font-bold tracking-wider uppercase py-2 px-3 rounded border border-[#134437] shadow transition-colors text-center"
              >
                ADD CATEGORY
              </button>
            </div>

            {/* Inline Add Category Form */}
            {isAddingCategory && (
              <form onSubmit={handleAddCategorySubmit} className="bg-[#23272e] p-2 rounded border border-zinc-700 space-y-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="New Category Name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full bg-[#17191d] text-white text-xs px-2.5 py-1.5 rounded border border-zinc-600 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-2 py-1 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-heading text-xs font-bold rounded uppercase"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {/* Inline Add Project Form */}
            {isAddingProject && (
              <form onSubmit={handleAddProjectSubmit} className="bg-[#23272e] p-2 rounded border border-zinc-700 space-y-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="New Project Name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-[#17191d] text-white text-xs px-2.5 py-1.5 rounded border border-zinc-600 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={targetCategoryId}
                  onChange={(e) => setTargetCategoryId(e.target.value)}
                  className="w-full bg-[#17191d] text-white text-xs px-2.5 py-1.5 rounded border border-zinc-600 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      Category: {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingProject(false)}
                    className="px-2 py-1 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-heading text-xs font-bold rounded uppercase"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            )}

            {/* Categories & Projects List */}
            <div className="space-y-1.5 pt-1">
              {regularCategories.map((cat) => {
                const catProjects = projects.filter((p) => p.categoryId === cat.id);
                const isSelected = catProjects.some((p) => p.id === activeProjectId);

                const isExpanded = cat.isExpanded !== false;

                return (
                  <div key={cat.id} className="space-y-0.5">
                    {/* Category Pill Bar (Forest Green styling as in screenshot) */}
                    <div
                      data-category-id={cat.id}
                      onClick={() => onToggleCategoryExpand(cat.id)}
                      className={`group flex items-center justify-between px-3 py-1.5 rounded bg-[#1e5e3a] hover:bg-[#236e45] border border-[#164b2d] cursor-pointer text-white shadow-xs transition-all ${
                        isSelected ? 'ring-1 ring-emerald-400/80 bg-[#247547]' : ''
                      } ${
                        dropCategoryId === cat.id ? 'ring-2 ring-[#3dbfb5]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCategoryVisibility(cat.id);
                          }}
                          className="text-white/80 hover:text-white transition-opacity"
                          title="Toggle visibility"
                        >
                          <EyeIcon className="w-3.5 h-3.5 text-emerald-300" />
                        </button>
                        
                        <span className="font-heading text-xs font-bold tracking-wider uppercase truncate">
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCategoryExpand(cat.id);
                          }}
                          className="hover:text-white p-0.5 text-zinc-300 font-bold"
                          title={isExpanded ? "Collapse Category" : "Expand Category"}
                        >
                          <span className="text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCatId(editingCatId === cat.id ? null : cat.id);
                            setEditedCatName(cat.name);
                          }}
                          className="hover:text-amber-300 p-0.5"
                          title="Edit Category Name"
                        >
                          <EditPencilIcon className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete category "${cat.name}" and all its projects?`)) {
                              onDeleteCategory(cat.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 p-0.5"
                          title="Delete Category"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sub-projects list when category is expanded */}
                    {isExpanded && catProjects.length > 0 && (
                      <div className="space-y-0.5 pl-1.5 pt-0.5 pb-1">
                        {catProjects.map((p) => {
                          const isProjActive = p.id === activeProjectId;
                          return (
                            <div
                              key={p.id}
                              data-project-id={p.id}
                              onClick={() => onSelectProject(p.id)}
                              className={`group/proj relative flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                                p.id === draggedProjectId ? 'opacity-40' : ''
                              } ${
                                p.id === dropProjectId
                                  ? 'bg-[#3dbfb5]/20 text-white ring-1 ring-inset ring-[#3dbfb5]'
                                  : isProjActive
                                    ? 'bg-[#181b20] text-white font-bold'
                                    : 'hover:bg-[#181b20]/60 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {renderProjectDropLines(p.id)}
                              <div className="flex items-center gap-2 truncate">
                                {renderProjectGrip(p.id, 'w-3 h-3')}
                                <EyeIcon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <span
                                  className={`text-xs truncate tracking-wide ${
                                    isProjActive
                                      ? 'font-bold text-white'
                                      : 'font-normal text-zinc-300'
                                  }`}
                                >
                                  {p.name}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete project "${p.name}"?`)) {
                                    onDeleteProject(p.id);
                                  }
                                }}
                                className="text-zinc-500 hover:text-red-400 p-0.5 opacity-0 group-hover/proj:opacity-100 transition-opacity"
                                title="Delete project"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Category rename inline */}
                    {editingCatId === cat.id && (
                      <div className="px-2 py-1 bg-[#17191d] rounded border border-zinc-700 flex gap-2">
                        <input
                          type="text"
                          value={editedCatName}
                          onChange={(e) => setEditedCatName(e.target.value)}
                          className="flex-1 bg-transparent text-white text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const name = editedCatName.trim();
                            if (name) onUpdateCategoryName(cat.id, name);
                            setEditingCatId(null);
                          }}
                          className="text-xs text-emerald-400 font-bold"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Uncategorised Section (Maroon red banner matching screenshot) */}
              {uncategorisedCategory && (
                <div className="pt-2 space-y-1">
                  {/* Maroon Header Bar */}
                  <div
                    data-category-id={uncategorisedCategory.id}
                    className={`px-3 py-1.5 rounded bg-[#6e2028] border border-[#52161c] text-white ${
                      dropCategoryId === uncategorisedCategory.id ? 'ring-2 ring-[#3dbfb5]' : ''
                    }`}
                  >
                    <span className="font-heading text-xs font-bold tracking-wider uppercase">
                      Uncategorised
                    </span>
                  </div>

                  {/* Child Items: Unallocated & Unallocated Primaris */}
                  <div className="space-y-1 pl-1">
                    {projects
                      .filter((p) => p.categoryId === uncategorisedCategory.id)
                      .map((p) => {
                        const isProjActive = p.id === activeProjectId;
                        return (
                          <div
                            key={p.id}
                            data-project-id={p.id}
                            onClick={() => onSelectProject(p.id)}
                            className={`relative flex items-center justify-between px-2.5 py-1 rounded cursor-pointer transition-colors ${
                              p.id === draggedProjectId ? 'opacity-40' : ''
                            } ${
                              isProjActive
                                ? 'bg-zinc-700/80 text-white font-medium'
                                : 'hover:bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {renderProjectDropLines(p.id)}
                            <div className="flex items-center gap-2 truncate">
                              {renderProjectGrip(p.id, 'w-3.5 h-3.5')}
                              <EyeIcon className="w-3 h-3 text-zinc-400" />
                              <span className="text-xs truncate">{p.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete project "${p.name}"?`)) {
                                  onDeleteProject(p.id);
                                }
                              }}
                              className="text-zinc-500 hover:text-red-400 p-0.5 opacity-0 hover:opacity-100"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* 2. PROJECT SETTINGS CONTAINER */}
      <div className="bg-[#1c1f24] border border-[#2b313b] rounded-md overflow-hidden shadow-lg">
        
        {/* Header */}
        <div
          onClick={() => setSettingsExpanded(!settingsExpanded)}
          className="flex items-center justify-between px-3.5 py-2.5 bg-[#17191d] border-b border-[#252a33] cursor-pointer hover:bg-[#1f2329] transition-colors select-none"
        >
          <span className="font-heading text-sm font-bold tracking-wider text-[#3dbfb5] uppercase">
            PROJECT SETTINGS
          </span>
          <span className="text-[#3dbfb5] text-xs font-bold transform transition-transform duration-200">
            {settingsExpanded ? '▲' : '▼'}
          </span>
        </div>

        {settingsExpanded && activeProject && (
          <div className="p-3.5 space-y-4">
            
            {/* Field 1: PROJECT NAME */}
            <div className="space-y-1.5">
              <label className="block font-heading text-xs font-bold text-white uppercase tracking-wider">
                PROJECT NAME
              </label>
              <input
                type="text"
                value={activeProject.name}
                onChange={(e) => onUpdateProjectName(activeProject.id, e.target.value)}
                className="w-full bg-white text-zinc-900 font-medium text-xs px-3 py-1.5 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>

          </div>
        )}
      </div>

    </aside>
  );
};
