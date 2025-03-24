"use client";

import { useEffect, useState } from 'react';
import { ScenarioForm } from '@/components/ScenarioForm';
import { BoardView } from '@/components/Board';
import { StatsDisplay } from '@/components/Stats';
import { FlowMetricsChart, CumulativeFlowChart } from '@/components/Charts';
import { parseInput } from '@/lib/models/scenario';
import { ScenarioConfig, ScenarioInput, Stats, WorkList } from '@/lib/models/types';
import { StatsTracker } from '@/lib/models/stats';
import { events } from '@/lib/models/core';

export default function Home() {
  const [scenario, setScenario] = useState<ScenarioConfig | null>(null);
  const [columns, setColumns] = useState<WorkList[]>([]);
  const [stats, setStats] = useState<Stats>({
    throughput: 0,
    leadTime: 0,
    wip: 0,
    timeWorked: 0,
    workers: {}
  });
  const [statsHistory, setStatsHistory] = useState<Stats[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // S'abonner aux événements du tableau
    const boardReadySub = events.boardReady.subscribe(({ columns }) => {
      setColumns(columns);
    });

    // Nettoyer les abonnements lors du démontage
    return () => {
      boardReadySub.unsubscribe();
    };
  }, []);

  const handleScenarioSubmit = (input: ScenarioInput) => {
    try {
      // Réinitialiser l'état
      setIsRunning(true);
      setStatsHistory([]);
      
      // Créer et exécuter le scénario
      const newScenario = parseInput(input);
      setScenario(newScenario);
      
      // Exécuter le scénario
      const board = newScenario.run();
      
      // Configurer le suivi des statistiques
      const statsTracker = new StatsTracker();
      statsTracker.onStatsUpdated((newStats) => {
        setStats(newStats);
        setStatsHistory(prev => [...prev, newStats]);
      });
      
      // Démarrer l'intervalle de mise à jour des statistiques
      const interval = setInterval(() => {
        const currentStats = statsTracker.getStats();
        setStats(currentStats);
        setStatsHistory(prev => [...prev, currentStats]);
        
        // Vérifier si le scénario est terminé
        if (board.done()) {
          clearInterval(interval);
          setIsRunning(false);
        }
      }, 1000);
      
      // Nettoyer l'intervalle lors du démontage
      return () => {
        clearInterval(interval);
      };
    } catch (error) {
      console.error('Erreur lors de l\'exécution du scénario:', error);
      setIsRunning(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Simulation de flux</h1>
        
        <ScenarioForm onSubmit={handleScenarioSubmit} />
        
        {isRunning && (
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-center mt-2">Simulation en cours...</p>
          </div>
        )}
        
        {columns.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Tableau</h2>
            <BoardView columns={columns} />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <StatsDisplay stats={stats} />
          
          {statsHistory.length > 1 && (
            <FlowMetricsChart stats={statsHistory} />
          )}
        </div>
        
        {statsHistory.length > 1 && (
          <div className="mb-6">
            <CumulativeFlowChart stats={statsHistory} />
          </div>
        )}
      </div>
    </main>
  );
}
