import React from 'react';
import builtStageIcon from '../assets/built.png';
import primedStageIcon from '../assets/primed.png';
import paintedStageIcon from '../assets/painted.png';
import basedStageIcon from '../assets/based.png';

// Assembly / Sprue / Built stage icon
export const BuiltIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img
    src={builtStageIcon}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`${className} object-contain`}
  />
);

// Spray Can / Primer stage icon
export const PrimedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img
    src={primedStageIcon}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`${className} object-contain`}
  />
);

// Paintbrush / Basecoat stage icon
export const PaintedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img
    src={paintedStageIcon}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`${className} object-contain`}
  />
);

// Scenic Round Base / Completed Miniature stage icon
export const BasedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img
    src={basedStageIcon}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`${className} object-contain`}
  />
);

// Pile of Potential Banner Logo
export const PileLogo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded border border-amber-500/40 shadow-inner">
      {/* Miniature pile icon */}
      <svg viewBox="0 0 32 32" className="w-6 h-6 text-amber-200" fill="currentColor">
        <path d="M16 3l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" />
        <path d="M8 22l8 7 8-7H8z" opacity="0.75" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-heading text-2xl tracking-wider text-amber-400 font-bold uppercase -mb-0.5">
        Painting Log
      </span>
    </div>
  </div>
);

// Drag handle dots
export const DragGripIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-zinc-500" }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <circle cx="5" cy="4" r="1.5" />
    <circle cx="11" cy="4" r="1.5" />
    <circle cx="5" cy="8" r="1.5" />
    <circle cx="11" cy="8" r="1.5" />
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="11" cy="12" r="1.5" />
  </svg>
);

// Eye icon for visibility
export const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Edit Pencil
export const EditPencilIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// Trash Icon
export const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

// Lock Icon
export const LockIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);
