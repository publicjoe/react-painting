import React, { useState } from 'react';
import type { Model, StatusField } from '../types';

interface ModelTableProps {
  projectId: string;
  models: Model[];
  onAddModel: (projectId: string, name: string) => void;
  onUpdateModel: (model: Model) => void;
  onDeleteModel: (id: string) => void;
  onToggleStatus: (id: string, field: StatusField) => void;
}

interface StatusCheckboxProps {
  model: Model;
  field: StatusField;
  label: string;
  onToggle: (id: string, field: StatusField) => void;
}

const StatusCheckbox: React.FC<StatusCheckboxProps> = ({ model, field, label, onToggle }) => (
  <label className="flex items-center justify-center p-2 cursor-pointer group">
    <input
      type="checkbox"
      className="peer sr-only"
      checked={model[field]}
      onChange={() => onToggle(model.id, field)}
    />
    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 ${
      model[field]
        ? 'bg-blue-500 border-blue-500 text-white'
        : 'border-zinc-500 group-hover:border-blue-400 bg-zinc-800'
    }`}>
      {model[field] && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className="sr-only">{`${label} - ${model.name}`}</span>
  </label>
);

export const ModelTable: React.FC<ModelTableProps> = ({
  projectId,
  models,
  onAddModel,
  onUpdateModel,
  onDeleteModel,
  onToggleStatus,
}) => {
  const [newModelName, setNewModelName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newModelName.trim()) {
      onAddModel(projectId, newModelName.trim());
      setNewModelName('');
    }
  };

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-zinc-800/80 text-zinc-300">
            <tr>
              <th className="px-4 py-3 font-medium">Model Name</th>
              <th className="px-4 py-3 font-medium text-center w-16">Count</th>
              <th className="px-4 py-3 font-medium text-center w-20">Built</th>
              <th className="px-4 py-3 font-medium text-center w-20">Primed</th>
              <th className="px-4 py-3 font-medium text-center w-20">Painted</th>
              <th className="px-4 py-3 font-medium text-center w-20">Based</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map(model => (
              <tr key={model.id} className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors">
                <td className="px-4 py-2 font-medium text-zinc-100">
                  <input 
                    type="text" 
                    aria-label="Model name"
                    className="bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-blue-500 focus:outline-none w-full"
                    value={model.name}
                    onChange={(e) => onUpdateModel({ ...model, name: e.target.value })}
                    onBlur={(e) => {
                      if (!e.target.value.trim()) onUpdateModel({ ...model, name: 'Untitled model' });
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center flex-col items-center">
                    <input 
                      type="number" 
                      min="1"
                      aria-label="Count"
                      className="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 w-16 text-center text-zinc-100 focus:border-blue-500 focus:outline-none"
                      value={model.count}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        if (!Number.isNaN(n)) onUpdateModel({ ...model, count: Math.max(1, n) });
                      }}
                    />
                  </div>
                </td>
                <td className="p-2"><StatusCheckbox model={model} onToggle={onToggleStatus} field="built" label="Built" /></td>
                <td className="p-2"><StatusCheckbox model={model} onToggle={onToggleStatus} field="primed" label="Primed" /></td>
                <td className="p-2"><StatusCheckbox model={model} onToggle={onToggleStatus} field="painted" label="Painted" /></td>
                <td className="p-2"><StatusCheckbox model={model} onToggle={onToggleStatus} field="based" label="Based" /></td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => {
                      if (confirm(`Delete model "${model.name}"?`)) onDeleteModel(model.id);
                    }}
                    aria-label={`Delete model ${model.name}`}
                    className="text-zinc-500 hover:text-red-400 p-2 transition-colors rounded-full hover:bg-zinc-700"
                    title="Delete Model"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {models.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 italic">
                  No models in this project yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add New Model Form */}
      <form onSubmit={handleAdd} className="mt-4 flex gap-3 px-4">
        <input
          type="text"
          className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          placeholder="New model name..."
          value={newModelName}
          onChange={(e) => setNewModelName(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newModelName.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-lg shadow-blue-500/20"
        >
          Add Model
        </button>
      </form>
    </div>
  );
};
