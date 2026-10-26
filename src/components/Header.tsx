import React, { useState } from 'react';
import { PileLogo } from './Icons';

interface HeaderProps {
  onResetDefaults: () => void;
  onExportData: () => void;
  onImportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetDefaults,
  onExportData,
  onImportData,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#191b1f] border-b border-[#121316] h-14 px-4 flex items-center justify-between select-none relative z-50">
      {/* Left: Hamburger Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-white hover:text-amber-400 font-heading font-bold text-sm tracking-wider uppercase px-2 py-1.5 rounded transition-colors"
          title="Open Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>MENU</span>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute left-0 top-full mt-2 w-64 bg-[#1f2227] border border-[#333a44] rounded-lg shadow-2xl py-2 z-50 text-sm">
              <div className="py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onResetDefaults();
                  }}
                  className="w-full text-left px-4 py-2 text-zinc-200 hover:bg-[#2c323c] hover:text-amber-300 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset to Demo Data</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onExportData();
                  }}
                  className="w-full text-left px-4 py-2 text-zinc-200 hover:bg-[#2c323c] flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export Backup (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onImportData();
                  }}
                  className="w-full text-left px-4 py-2 text-zinc-200 hover:bg-[#2c323c] flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Import Data (JSON)</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Center: Pile of Potential Logo */}
      <div className="flex items-center">
        <PileLogo />
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center gap-2.5"></div>
    </header>
  );
};
