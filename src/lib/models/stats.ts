import { Stats } from './types';
import { events } from './core';
import { Subject } from 'rxjs';

export class StatsTracker {
  private startTime: number = 0;
  private finishedItems: number = 0;
  private totalLeadTime: number = 0;
  private maxWip: number = 0;
  private currentWip: number = 0;
  private workerStats: Record<string, number> = {};
  
  private statsUpdated = new Subject<Stats>();
  
  constructor() {
    this.startTime = Date.now();
    
    // S'abonner aux événements
    events.workItemStarted.subscribe(() => {
      this.currentWip++;
      this.maxWip = Math.max(this.maxWip, this.currentWip);
      this.updateStats();
    });
    
    events.workItemFinished.subscribe(item => {
      this.finishedItems++;
      this.currentWip--;
      if (item.duration) {
        this.totalLeadTime += item.duration;
      }
      this.updateStats();
    });
    
    events.workerCreated.subscribe(worker => {
      const name = worker.name;
      if (!this.workerStats[name]) {
        this.workerStats[name] = 0;
      }
    });
    
    events.workerWorking.subscribe(worker => {
      const name = worker.name;
      this.workerStats[name] = (this.workerStats[name] || 0) + 1;
      this.updateStats();
    });
  }
  
  onStatsUpdated(callback: (stats: Stats) => void) {
    this.statsUpdated.subscribe(callback);
  }
  
  private updateStats() {
    const elapsedTime = (Date.now() - this.startTime) / 1000; // en secondes
    const throughput = this.finishedItems / (elapsedTime / (60 * 60 * 24)); // par jour
    const leadTime = this.finishedItems > 0 ? this.totalLeadTime / this.finishedItems / (1000 * 60 * 60 * 24) : 0; // en jours
    
    // Calculer le pourcentage de temps travaillé pour chaque travailleur
    const workerPercentages: Record<string, number> = {};
    Object.keys(this.workerStats).forEach(name => {
      workerPercentages[name] = Math.round((this.workerStats[name] / elapsedTime) * 100);
    });
    
    const stats: Stats = {
      throughput: parseFloat(throughput.toFixed(2)),
      leadTime: parseFloat(leadTime.toFixed(2)),
      wip: this.currentWip,
      timeWorked: parseFloat(elapsedTime.toFixed(2)),
      workers: workerPercentages
    };
    
    this.statsUpdated.next(stats);
  }
  
  getStats(): Stats {
    const elapsedTime = (Date.now() - this.startTime) / 1000; // en secondes
    const throughput = this.finishedItems / (elapsedTime / (60 * 60 * 24)); // par jour
    const leadTime = this.finishedItems > 0 ? this.totalLeadTime / this.finishedItems / (1000 * 60 * 60 * 24) : 0; // en jours
    
    // Calculer le pourcentage de temps travaillé pour chaque travailleur
    const workerPercentages: Record<string, number> = {};
    Object.keys(this.workerStats).forEach(name => {
      workerPercentages[name] = Math.round((this.workerStats[name] / elapsedTime) * 100);
    });
    
    return {
      throughput: parseFloat(throughput.toFixed(2)),
      leadTime: parseFloat(leadTime.toFixed(2)),
      wip: this.currentWip,
      timeWorked: parseFloat(elapsedTime.toFixed(2)),
      workers: workerPercentages
    };
  }
}
