import React, { useState } from 'react';

interface StatsBarProps {
  username: string;
  projectId: string;
  totalPoints: number;
  totalModels: number;
  pointsCompleteCount: number;
  pointsCompletePercent: number;
  modelsCompleteCount: number;
  modelsCompletePercent: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalModels,
  modelsCompleteCount,
  modelsCompletePercent,
}) => {
  return (
    <div className="bg-[#24282e] border-b border-[#1b1d22] px-4 sm:px-6 py-4">
      <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        
        {/* Left Column: Title & Quick Share */}
        <div className="flex flex-col gap-2.5">&nbsp;</div>

        {/* Right Column: 2 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 self-start xl:self-end">

          {/* Card 2: TOTAL MODELS */}
          <div className="flex flex-col items-center">
            <span className="font-heading text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
              TOTAL MODELS
            </span>
            <div className="w-28 sm:w-32 h-11 bg-[#0e7580] rounded flex items-center justify-center shadow-md border border-[#0b5c65]">
              <span className="font-heading text-2xl font-bold text-white tracking-wide">
                {totalModels}
              </span>
            </div>
          </div>

          {/* Card 4: MODELS COMPLETE */}
          <div className="flex flex-col items-center">
            <span className="font-heading text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
              MODELS COMPLETE
            </span>
            <div className="w-36 sm:w-40 h-11 rounded flex shadow-md overflow-hidden border border-[#1b1e22]">
              <div className="w-1/2 bg-[#0e7580] flex items-center justify-center border-r border-[#0b5c65]">
                <span className="font-heading text-base sm:text-lg font-bold text-white">
                  {modelsCompletePercent.toFixed(2)}%
                </span>
              </div>
              <div className="w-1/2 bg-[#181a1d] flex items-center justify-center">
                <span className="font-heading text-lg sm:text-xl font-bold text-white">
                  {modelsCompleteCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
