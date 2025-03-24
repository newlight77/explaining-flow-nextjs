"use client";

import React, { useEffect, useRef } from 'react';
import { Stats } from '@/lib/models/types';
import Chart from 'chart.js/auto';

interface ChartProps {
  stats: Stats[];
  updateInterval?: number;
}

export const FlowMetricsChart: React.FC<ChartProps> = ({ stats, updateInterval = 1000 }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Détruire le graphique existant s'il existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Préparer les données pour le graphique
    const labels = Array.from({ length: stats.length }, (_, i) => i.toString());
    const throughputData = stats.map(stat => stat.throughput);
    const leadTimeData = stats.map(stat => stat.leadTime);
    const wipData = stats.map(stat => stat.wip);

    // Créer le graphique
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Débit',
            data: throughputData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Temps de cycle',
            data: leadTimeData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'WIP',
            data: wipData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Débit / Temps de cycle'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'WIP'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    });

    // Nettoyer le graphique lors du démontage du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Métriques de flux</h2>
      <div className="w-full h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export const CumulativeFlowChart: React.FC<ChartProps> = ({ stats, updateInterval = 1000 }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Détruire le graphique existant s'il existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Préparer les données pour le graphique
    const labels = Array.from({ length: stats.length }, (_, i) => i.toString());
    
    // Simuler des données cumulatives pour la démonstration
    // Dans une implémentation réelle, ces données viendraient du modèle
    const backlogData = stats.map((_, i) => Math.max(0, 50 - i * 0.5));
    const inProgressData = stats.map((stat) => stat.wip);
    const doneData = stats.map((_, i) => Math.min(50, i * 0.5));

    // Créer le graphique
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Backlog',
            data: backlogData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'En cours',
            data: inProgressData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Terminé',
            data: doneData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Nombre d\'histoires'
            }
          }
        }
      }
    });

    // Nettoyer le graphique lors du démontage du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Diagramme de flux cumulatif</h2>
      <div className="w-full h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};
