"use client";

import { Stats } from '@/lib/models/types';
import React from 'react';

interface StatsDisplayProps {
  stats: Stats;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Statistiques</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-r pr-4">
          <div className="mb-2">
            <div className="text-sm text-gray-500">Débit (throughput)</div>
            <div className="text-lg font-semibold">{stats.throughput} histoires/jour</div>
          </div>
          <div className="mb-2">
            <div className="text-sm text-gray-500">Temps de cycle (lead time)</div>
            <div className="text-lg font-semibold">{stats.leadTime} jours/histoire</div>
          </div>
          <div className="mb-2">
            <div className="text-sm text-gray-500">Travail en cours (WIP)</div>
            <div className="text-lg font-semibold">{stats.wip} histoires</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-2">Temps travaillé</div>
          <div className="text-lg font-semibold mb-4">{stats.timeWorked} secondes</div>
          
          <div className="text-sm text-gray-500 mb-2">Travailleurs</div>
          {Object.entries(stats.workers).map(([name, percentage]) => (
            <div key={name} className="flex items-center mb-1">
              <div className="w-24 truncate">{name}:</div>
              <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="ml-2 text-sm">{percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
