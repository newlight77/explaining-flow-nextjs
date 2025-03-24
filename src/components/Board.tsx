"use client";

import { WorkItem, WorkList } from '@/lib/models/types';
import React from 'react';

interface PostItProps {
  item: WorkItem;
  onClick?: () => void;
}

export const PostIt: React.FC<PostItProps> = ({ item, onClick }) => {
  // Calculer une légère rotation aléatoire pour un effet plus naturel
  const rotation = Math.random() * 6 - 3; // entre -3 et 3 degrés

  return (
    <div
      className="w-24 h-24 p-2 shadow-md cursor-pointer transition-transform hover:scale-105"
      style={{
        backgroundColor: item.color,
        transform: `rotate(${rotation}deg)`,
      }}
      onClick={onClick}
    >
      <div className="text-xs text-gray-700">
        {Object.entries(item.work).map(([key, value]) => (
          <div key={key} className="mb-1">
            {key}: {value.toFixed(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ColumnProps {
  column: WorkList;
}

export const Column: React.FC<ColumnProps> = ({ column }) => {
  return (
    <div className="flex flex-col min-w-[200px] h-full border border-gray-300 rounded-md">
      <div className="bg-gray-100 p-2 font-semibold border-b border-gray-300">
        {column.name} ({column.size()})
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
            {column.items().map((item: WorkItem) => (
            <PostIt key={item.id} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

interface BoardViewProps {
  columns: WorkList[];
}

export const BoardView: React.FC<BoardViewProps> = ({ columns }) => {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 h-[400px]">
      {columns.map(column => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
};
