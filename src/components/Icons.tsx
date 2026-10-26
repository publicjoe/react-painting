import React from 'react';

// Assembly / Sprue / Built stage icon
export const BuiltIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Stylized sprue frame and miniature pieces */}
    <path fillRule="evenodd" clipRule="evenodd" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v6h6V5H5zm8 0v6h6V5h-6zm6 8h-6v6h6v-6zm-8 6v-6H5v6h6z" opacity="0.4" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <path d="M14 7h4v2h-4zM6 14h2v4H6zm8 1l2-2 2 2v3h-4z" fill="currentColor" />
  </svg>
);

// Spray Can / Primer stage icon
export const PrimedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    {/* Can body */}
    <rect x="5" y="8" width="8" height="13" rx="1.5" fill="currentColor" fillOpacity="0.2" />
    {/* Can top & nozzle */}
    <path d="M7 8V6a1 1 0 011-1h2a1 1 0 011 1v2" />
    <rect x="8" y="3" width="2" height="2" fill="currentColor" />
    {/* Spray mist particles */}
    <path strokeLinecap="round" d="M14 4l3-1.5M15 6l4-0.5M14 8l5 1M16 11l3 2" />
  </svg>
);

// Paintbrush / Basecoat stage icon
export const PaintedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Angled hobby brush handle, ferrule, and tip */}
    <path d="M18.8 3.2a2 2 0 00-2.8 0L9.5 9.7l3.8 3.8 6.5-6.5a2 2 0 000-2.8z" opacity="0.85" />
    <path d="M8.5 10.7l-2.4 2.4c-.6.6-.9 1.4-1 2.2l-.6 4.2c-.1.7.5 1.3 1.2 1.2l4.2-.6c.8-.1 1.6-.4 2.2-1l2.4-2.4-6-6z" />
  </svg>
);

// Scenic Round Base / Completed Miniature stage icon
export const BasedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Miniature soldier silhouette */}
    <circle cx="12" cy="5" r="2" />
    <path d="M10 8h4l1.5 5h-1.8l-.7-3h-2l-.7 3H8.5L10 8z" />
    {/* Scenic wargame base */}
    <ellipse cx="12" cy="19" rx="8" ry="2.5" fill="currentColor" opacity="0.9" />
    <ellipse cx="12" cy="18" rx="8" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 17.5l2-1.5 2 1.5M13 18l1.5-1 1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
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
