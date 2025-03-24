import { ScenarioConfig, ScenarioInput, WorkerConfig } from './types';
import { BoardImpl } from './board';
import { WorkerImpl, WorkItemImpl } from './core';
import { generateWorkItems, poissonDistribution } from './generator';

let counter = 1;

export function parseInput(input: ScenarioInput): ScenarioConfig {
  // Parse workers
  const workerNames = input.workers.split(',').map(name => name.trim());
  const workers: WorkerConfig[] = workerNames.map(name => ({
    skills: [name]
  }));

  // Parse workload
  const workloadParts = input.workload.split(',').map(part => part.trim());
  const work: Record<string, number> = {};
  
  workloadParts.forEach(part => {
    const [skill, valueStr] = part.split(':').map(s => s.trim());
    const value = parseFloat(valueStr);
    if (!isNaN(value)) {
      work[skill] = value;
    }
  });

  // Parse number of stories
  const numberOfStories = input.numberOfStories ? parseInt(input.numberOfStories, 10) : 50;

  // Parse WIP limit
  const wipLimit = input.wipLimit && input.wipLimit !== 'none' 
    ? parseInt(input.wipLimit, 10) 
    : numberOfStories;

  // Create scenario config
  const scenarioConfig: ScenarioConfig = {
    id: counter++,
    title: input.workload,
    workers,
    stories: {
      amount: numberOfStories,
      work
    },
    wipLimit,
    distribution: input.random ? poissonDistribution(1) : (value) => value,
    run: () => {
      return {} as any; // Will be replaced
    }
  };

  // Add run function
  scenarioConfig.run = () => {
    const columnNames = Object.keys(scenarioConfig.stories.work);
    const board = new BoardImpl(columnNames);
    
    // Add workers
    board.addWorkers(
      ...scenarioConfig.workers.map(workerDetails => {
        const skills: Record<string, number> = {};
        workerDetails.skills.forEach(skillName => skills[skillName] = 1);
        return new WorkerImpl(skills);
      })
    );
    
    // Generate stories
    const generateStory = () => {
      const story: Record<string, number> = {};
      const distribute = scenarioConfig.distribution || ((identity: number) => identity);
      
      columnNames.forEach(key => {
        const givenValue = scenarioConfig.stories.work[key];
        story[key] = distribute(givenValue);
      });
      
      return story;
    };
    
    // Add work items
    board.addWorkItems(...generateWorkItems(generateStory, scenarioConfig.stories.amount));
    
    return board;
  };

  return scenarioConfig;
}

// Stratégie pour limiter le WIP
export function LimitBoardWip() {
  let wipLimit = Infinity;
  let currentWip = 0;
  
  return {
    initialize: (limit?: number) => {
      wipLimit = limit || Infinity;
    },
    
    workItemStarted: () => {
      currentWip++;
      if (currentWip >= wipLimit) {
        // Deny new work
      }
    },
    
    workItemFinished: () => {
      currentWip--;
      if (currentWip < wipLimit) {
        // Allow new work
      }
    }
  };
}
