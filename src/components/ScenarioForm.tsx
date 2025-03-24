"use client";

import React, { useState } from 'react';
import { ScenarioInput } from '@/lib/models/types';

interface ScenarioFormProps {
  onSubmit: (input: ScenarioInput) => void;
}

export const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSubmit }) => {
  const [workload, setWorkload] = useState<string>('dev: 1');
  const [workers, setWorkers] = useState<string>('dev');
  const [wipLimit, setWipLimit] = useState<string>('');
  const [numberOfStories, setNumberOfStories] = useState<string>('50');
  const [random, setRandom] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!workload.trim()) {
      newErrors.workload = 'Le travail par histoire est requis';
    } else if (!/^[a-zA-Z]+\s*:\s*\d+(\s*,\s*[a-zA-Z]+\s*:\s*\d+)*$/.test(workload)) {
      newErrors.workload = 'Format invalide. Utilisez "dev: 1" ou "ux: 1, dev: 3, qa: 2"';
    }
    
    if (!workers.trim()) {
      newErrors.workers = 'Les travailleurs sont requis';
    }
    
    if (wipLimit && !/^\d*$/.test(wipLimit)) {
      newErrors.wipLimit = 'La limite WIP doit être un nombre';
    }
    
    if (numberOfStories && !/^\d+$/.test(numberOfStories)) {
      newErrors.numberOfStories = 'Le nombre d\'histoires doit être un nombre';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        workload,
        workers,
        wipLimit: wipLimit || 'none',
        numberOfStories: numberOfStories || '50',
        random
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-md mb-6">
      <div className="flex flex-wrap -mx-2">
        <div className="px-2 mb-4 w-full md:w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workload">
            Travail par histoire
          </label>
          <input
            id="workload"
            type="text"
            className={`shadow appearance-none border ${errors.workload ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            value={workload}
            onChange={(e) => setWorkload(e.target.value)}
            placeholder="ux: 1, dev: 3, qa: 2"
          />
          {errors.workload && <p className="text-red-500 text-xs italic">{errors.workload}</p>}
        </div>
        
        <div className="px-2 mb-4 w-full md:w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workers">
            Travailleurs
          </label>
          <input
            id="workers"
            type="text"
            className={`shadow appearance-none border ${errors.workers ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            value={workers}
            onChange={(e) => setWorkers(e.target.value)}
            placeholder="ux, dev, qa"
          />
          {errors.workers && <p className="text-red-500 text-xs italic">{errors.workers}</p>}
        </div>
        
        <div className="px-2 mb-4 w-full md:w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wipLimit">
            Limite WIP
          </label>
          <input
            id="wipLimit"
            type="text"
            className={`shadow appearance-none border ${errors.wipLimit ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            value={wipLimit}
            onChange={(e) => setWipLimit(e.target.value)}
            placeholder="none"
          />
          {errors.wipLimit && <p className="text-red-500 text-xs italic">{errors.wipLimit}</p>}
        </div>
        
        <div className="px-2 mb-4 w-full md:w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfStories">
            Nombre d'histoires
          </label>
          <input
            id="numberOfStories"
            type="text"
            className={`shadow appearance-none border ${errors.numberOfStories ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            value={numberOfStories}
            onChange={(e) => setNumberOfStories(e.target.value)}
            placeholder="50"
          />
          {errors.numberOfStories && <p className="text-red-500 text-xs italic">{errors.numberOfStories}</p>}
        </div>
        
        <div className="px-2 mb-4 w-full md:w-1/3 flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={random}
                onChange={(e) => setRandom(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full ${random ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${random ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-gray-700 font-medium">
              Travail variable
            </div>
          </label>
        </div>
        
        <div className="px-2 mb-4 w-full md:w-1/3 flex items-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Exécuter
          </button>
        </div>
      </div>
    </form>
  );
};
