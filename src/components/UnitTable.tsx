import React, { useRef, useState } from 'react';
import type { Unit, StageColumn } from '../types';
import {
  BuiltIcon,
  PrimedIcon,
  PaintedIcon,
  BasedIcon,
  DragGripIcon,
  TrashIcon,
} from './Icons';

interface UnitTableProps {
  columns: StageColumn[];
  units: Unit[];
  totalModels: number;
  modelsCompleteCount: number;
  modelsCompletePercent: number;
  onAddUnit: (name: string, count: number, stages: boolean[]) => void;
  onUpdateUnit: (unit: Unit) => void;
  onDeleteUnit: (id: string) => void;
  onReorderUnits: (units: Unit[]) => void;
  onToggleUnitStage: (unitId: string, stageIndex: number) => void;
  onMoveUnitToProject: (unitId: string, projectId: string) => void;
  onDragOverProject: (projectId: string | null) => void;
}

function reorderUnitsList(
  list: Unit[],
  draggedId: string,
  targetId: string,
  position: 'before' | 'after'
): Unit[] {
  const fromIndex = list.findIndex((u) => u.id === draggedId);
  const toIndex = list.findIndex((u) => u.id === targetId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return list;

  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);

  let targetIndex = result.findIndex((u) => u.id === targetId);
  if (position === 'after') {
    targetIndex += 1;
  }
  result.splice(targetIndex, 0, removed);
  return result;
}

export const UnitTable: React.FC<UnitTableProps> = ({
  columns,
  units,
  totalModels,
  modelsCompleteCount,
  modelsCompletePercent,
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
  onReorderUnits,
  onToggleUnitStage,
  onMoveUnitToProject,
  onDragOverProject,
}) => {
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitCount, setNewUnitCount] = useState<number>(1);
  const [newUnitStages, setNewUnitStages] = useState<boolean[]>(
    new Array(columns.length).fill(false)
  );

  // Drag and Drop reordering state
  const [draggedUnit, setDraggedUnit] = useState<Unit | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    position: 'before' | 'after';
  } | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // Project highlighted as the drop target; kept in a ref so the pointermove
  // handler only notifies the parent when it actually changes.
  const hoveredProjectRef = useRef<string | null>(null);

  // Sync stage array if columns length changes
  const activeStages =
    newUnitStages.length === columns.length
      ? newUnitStages
      : new Array(columns.length).fill(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUnitName.trim()) {
      onAddUnit(newUnitName.trim(), Math.max(1, newUnitCount || 1), activeStages);
      setNewUnitName('');
      setNewUnitCount(1);
      setNewUnitStages(new Array(columns.length).fill(false));
    }
  };

  const renderStageIcon = (iconType: string) => {
    switch (iconType) {
      case 'built':
        return <BuiltIcon className="w-5 h-5 text-white" />;
      case 'primed':
        return <PrimedIcon className="w-5 h-5 text-white" />;
      case 'painted':
        return <PaintedIcon className="w-5 h-5 text-white" />;
      case 'based':
        return <BasedIcon className="w-5 h-5 text-white" />;
      default:
        return <PaintedIcon className="w-5 h-5 text-white" />;
    }
  };

  // Pointer-based Drag & Drop handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, unit: Unit) => {
    if (e.button !== 0) return; // Only primary left-click
    e.preventDefault();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore: pointer capture may be unavailable */
    }

    setDraggedUnit(unit);
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedUnit) return;
    setPointerPos({ x: e.clientX, y: e.clientY });

    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // A project in the sidebar takes precedence: dropping there moves the unit
    // to that project instead of reordering it here.
    const projectEl = elements.find((el) =>
      el.hasAttribute('data-project-id')
    ) as HTMLElement | undefined;
    const hoveredId = projectEl?.getAttribute('data-project-id') ?? null;
    const targetProjectId = hoveredId && hoveredId !== draggedUnit.projectId ? hoveredId : null;

    if (targetProjectId !== hoveredProjectRef.current) {
      hoveredProjectRef.current = targetProjectId;
      onDragOverProject(targetProjectId);
    }

    if (targetProjectId) {
      setDropTarget(null);
      return;
    }

    // Determine target row under pointer
    const rowEl = elements.find((el) => el.classList.contains('unit-row')) as HTMLElement | undefined;

    if (rowEl) {
      const targetId = rowEl.getAttribute('data-unit-id');
      if (targetId && targetId !== draggedUnit.id) {
        const rect = rowEl.getBoundingClientRect();
        const position: 'before' | 'after' =
          e.clientY - rect.top < rect.height / 2 ? 'before' : 'after';
        setDropTarget({ id: targetId, position });
        return;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedUnit) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore: pointer capture may be unavailable */
    }

    if (hoveredProjectRef.current && hoveredProjectRef.current !== draggedUnit.projectId) {
      onMoveUnitToProject(draggedUnit.id, hoveredProjectRef.current);
    } else if (dropTarget && dropTarget.id !== draggedUnit.id) {
      const updated = reorderUnitsList(units, draggedUnit.id, dropTarget.id, dropTarget.position);
      onReorderUnits(updated);
    }

    hoveredProjectRef.current = null;
    onDragOverProject(null);
    setDraggedUnit(null);
    setDropTarget(null);
  };

  return (
    <div className="flex-1 bg-[#24282e] overflow-hidden flex flex-col min-w-0">
      
      {/* Floating Drag Preview following cursor */}
      {draggedUnit && (
        <div
          style={{
            position: 'fixed',
            left: pointerPos.x + 16,
            top: pointerPos.y - 16,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="bg-[#181b20] text-white text-xs px-3 py-1.5 rounded-md shadow-2xl border border-[#3dbfb5] flex items-center gap-2 select-none ring-2 ring-[#3dbfb5]/40"
        >
          <span className="w-2 h-2 rounded-full bg-[#3dbfb5] animate-ping" />
          <span className="font-semibold text-zinc-100">{draggedUnit.name}</span>
          <span className="bg-[#b4bcc4] text-zinc-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
            {draggedUnit.count}
          </span>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <div className="min-w-[760px] pb-12">
          
          {/* HEADER 1: COLUMN LABELS & ICONS */}
          <div className="flex items-center gap-1.5 px-2 py-2 text-zinc-300 select-none">
            {/* Unit Name Header */}
            <div className="flex-1 pl-6">
              <span className="font-heading text-sm font-bold tracking-wider text-[#3dbfb5] uppercase">
                UNIT NAME
              </span>
            </div>

            {/* Models Complete (percentage complete | count complete) */}
            <div
              className="flex items-center gap-1.5 shrink-0"
              title="Models fully through every stage, and as a share of all models"
            >
              <span className="font-heading text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">
                Done
              </span>
              <div className="h-8 rounded flex shadow-md overflow-hidden border border-[#1b1e22]">
                <div className="px-2 bg-[#0e7580] flex items-center justify-center border-r border-[#0b5c65]">
                  <span className="font-heading text-base font-bold text-white leading-none">
                    {modelsCompletePercent.toFixed(0)}%
                  </span>
                </div>
                <div className="px-2 bg-[#181a1d] flex items-center justify-center">
                  <span className="font-heading text-base font-bold text-white leading-none">
                    {modelsCompleteCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Models label */}
            <span
              className="font-heading text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none shrink-0 pl-4"
              title="Total models across all units"
            >
              Total
            </span>

            {/* Total Models value — sized to the model count column so it sits directly above the per-unit counts */}
            <div className="w-14 flex items-center justify-center" title="Total models across all units">
              <span className="w-11 h-8 rounded bg-[#0e7580] border border-[#0b5c65] flex items-center justify-center shadow-md">
                <span className="font-heading text-base font-bold text-white tracking-wide leading-none">
                  {totalModels}
                </span>
              </span>
            </div>

            {/* Stage Icons */}
            <div className="flex items-center">
              {columns.map((col) => (
                <div key={col.id} className="w-14 flex items-center justify-center">
                  {/* Circle icon badge */}
                  <div
                    className="w-9 h-9 rounded-full bg-[#181b1f] border border-[#303640] flex items-center justify-center shadow-inner hover:border-zinc-400 transition-colors"
                    title={col.name}
                  >
                    {renderStageIcon(col.icon)}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Unit / Delete Spacer */}
            <div className="w-20 pr-2"></div>
          </div>

          {/* HEADER 2: ADD UNIT FORM ROW */}
          <form
            onSubmit={handleAddSubmit}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-[#1b1e23] border-y border-[#2a303a] mb-2"
          >
            {/* Drag Spacer */}
            <div className="w-4"></div>

            {/* Type your unit name Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type your unit name"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                className="w-full bg-[#39404b] text-white text-xs px-3 py-1.5 rounded border border-[#4b5563] placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:bg-[#434b58]"
              />
            </div>

            {/* Count Input */}
            <div className="w-14">
              <input
                type="number"
                min="1"
                value={newUnitCount}
                onChange={(e) => setNewUnitCount(parseInt(e.target.value) || 1)}
                className="w-full bg-[#39404b] text-white text-xs font-bold text-center py-1.5 rounded border border-[#4b5563] focus:outline-none focus:ring-1 focus:ring-emerald-400"
                title="Model count"
              />
            </div>

            {/* 5 Stage Checkboxes */}
            <div className="flex items-center">
              {columns.map((col, index) => (
                <div key={col.id} className="w-14 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={!!activeStages[index]}
                    onChange={() => {
                      const updated = [...activeStages];
                      updated[index] = !updated[index];
                      setNewUnitStages(updated);
                    }}
                    className="w-4 h-4 rounded-xs accent-blue-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Add Unit Button */}
            <div className="w-20 flex justify-end pr-2">
              <button
                type="submit"
                className="bg-[#2e8540] hover:bg-[#38a169] text-white font-sans text-xs font-semibold px-2.5 py-1 rounded transition-colors whitespace-nowrap shadow-xs"
              >
                Add Unit
              </button>
            </div>
          </form>

          {/* UNIT ROWS */}
          <div className="space-y-1 px-2">
            {units.map((unit) => {
              const isAllComplete =
                unit.stages.length >= columns.length &&
                columns.every((_, idx) => unit.stages[idx] === true);

              const isBeingDragged = draggedUnit?.id === unit.id;
              const isTargetBefore = dropTarget?.id === unit.id && dropTarget.position === 'before';
              const isTargetAfter = dropTarget?.id === unit.id && dropTarget.position === 'after';

              return (
                <div
                  key={unit.id}
                  data-unit-id={unit.id}
                  className={`unit-row relative flex items-center gap-1.5 group select-none transition-all ${
                    isBeingDragged ? 'opacity-30 scale-[0.99] border-dashed border-[#3dbfb5]/60' : ''
                  }`}
                >
                  {/* DROP LANDING INDICATOR (TOP / BEFORE) */}
                  {isTargetBefore && (
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-[#3dbfb5] rounded-full shadow-[0_0_10px_#3dbfb5] z-30 pointer-events-none flex items-center justify-between">
                      <div className="w-2.5 h-2.5 -ml-1 rounded-full bg-[#3dbfb5] shadow-md border-2 border-white" />
                      <div className="w-2.5 h-2.5 -mr-1 rounded-full bg-[#3dbfb5] shadow-md border-2 border-white" />
                    </div>
                  )}

                  {/* DROP LANDING INDICATOR (BOTTOM / AFTER) */}
                  {isTargetAfter && (
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#3dbfb5] rounded-full shadow-[0_0_10px_#3dbfb5] z-30 pointer-events-none flex items-center justify-between">
                      <div className="w-2.5 h-2.5 -ml-1 rounded-full bg-[#3dbfb5] shadow-md border-2 border-white" />
                      <div className="w-2.5 h-2.5 -mr-1 rounded-full bg-[#3dbfb5] shadow-md border-2 border-white" />
                    </div>
                  )}

                  {/* Six Dots Drag Handle (Left Click & Hold to Drag) */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, unit)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="w-4 flex items-center justify-center cursor-grab active:cursor-grabbing text-zinc-500 hover:text-[#3dbfb5] p-0.5 rounded transition-colors touch-none select-none"
                    title="Click and drag to reorder unit"
                  >
                    <DragGripIcon className="w-3.5 h-3.5 pointer-events-none" />
                  </div>

                  {/* Unit Name Input (Sage Green if all complete, Light Grey if incomplete) */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={unit.name}
                      onChange={(e) => onUpdateUnit({ ...unit, name: e.target.value })}
                      className={`w-full text-xs font-medium px-3 py-1.5 rounded border border-transparent hover:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors shadow-xs truncate ${
                        isAllComplete
                          ? 'bg-[#a3c795] text-zinc-900 font-semibold'
                          : 'bg-[#d0d4d8] text-zinc-900 font-medium'
                      }`}
                    />
                  </div>

                  {/* Model Count Pill */}
                  <div className="w-14 flex items-center justify-center">
                    <input
                      type="number"
                      min="1"
                      value={unit.count}
                      onChange={(e) =>
                        onUpdateUnit({ ...unit, count: Math.max(1, parseInt(e.target.value) || 1) })
                      }
                      className="w-11 bg-[#b4bcc4] text-zinc-900 font-bold text-xs text-center py-1 rounded border border-zinc-400/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-xs"
                      title="Model count"
                    />
                  </div>

                  {/* 5 Stage Checkbox Cells */}
                  <div className="flex items-center">
                    {columns.map((col, index) => {
                      const isChecked = !!unit.stages[index];

                      return (
                        <div
                          key={col.id}
                          onClick={() => onToggleUnitStage(unit.id, index)}
                          className={`w-14 h-8 flex items-center justify-center cursor-pointer transition-colors border-r border-[#24282e] last:border-r-0 ${
                            isChecked
                              ? 'bg-[#6ea95d] hover:bg-[#639b53]' // Lush Green when checked
                              : 'bg-[#aa6d6d] hover:bg-[#9e6363]' // Dusty Rose/Red when unchecked
                          }`}
                          title={`${col.name}: ${isChecked ? 'Completed' : 'Pending'}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-xs flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-[#2563eb] text-white shadow-xs'
                                : 'bg-white border border-zinc-300'
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delete Unit Button (Red trash can icon) */}
                  <div className="w-20 flex justify-end pr-3">
                    <button
                      type="button"
                      onClick={() => onDeleteUnit(unit.id)}
                      className="text-red-500 hover:text-red-400 p-1.5 rounded transition-colors"
                      title="Delete unit"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {units.length === 0 && (
              <div className="py-16 text-center text-zinc-500 italic bg-[#1c1f24] rounded border border-dashed border-zinc-700/60 mt-4">
                No units in this project yet. Use the "Add Unit" row above to add your first miniature!
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
