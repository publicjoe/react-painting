import React, { useState } from 'react';
import type { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
      setIsAdding(false);
    }
  };

  return (
    <aside className="w-full md:w-64 bg-zinc-800 border-b md:border-b-0 md:border-r border-zinc-700 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          PaintLog
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
          Categories
        </h2>
        
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              selectedCategoryId === cat.id
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-zinc-700/50 text-zinc-300'
            }`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="truncate">{cat.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this category and all its projects/models?')) {
                  onDeleteCategory(cat.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
              title="Delete Category"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 w-full p-2 rounded-lg transition-colors mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Category</span>
          </button>
        ) : (
          <form onSubmit={handleAdd} className="mt-2">
            <input
              type="text"
              autoFocus
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              placeholder="Category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onBlur={() => {
                if (!newCatName.trim()) setIsAdding(false);
              }}
            />
          </form>
        )}
      </div>
    </aside>
  );
};
