// Types pour l'application explaining-flow

export interface WorkItem {
  id: number;
  work: Record<string, number>;
  color: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export interface WorkList {
  id: number;
  name: string;
  necessarySkill: string;
  items: WorkItem[];
  size: () => number;
  hasWork: () => boolean;
  peek: () => WorkItem | undefined;
  add: (item: WorkItem) => void;
  move: (to: WorkList, item: WorkItem) => WorkItem;
}

export interface Worker {
  id: number;
  name: string;
  skills: Record<string, number>;
  canWorkOn: (skill: string) => number;
  startWorkingOn: (inbox: WorkList, inProgress: WorkList, outbox: WorkList) => void;
}

export interface Board {
  columns: () => WorkList[];
  items: () => WorkItem[][];
  size: () => number;
  done: () => boolean;
  addWorkers: (...workers: Worker[]) => void;
  addWorkItems: (...items: WorkItem[]) => void;
}

export interface ScenarioInput {
  title: string;
  workers: string;
  workload: string;
  wipLimit?: string;
  numberOfStories?: string;
  random: boolean;
}

export interface ScenarioConfig {
  id: number;
  title: string;
  workers: WorkerConfig[];
  stories: {
    amount: number;
    work: Record<string, number>;
  };
  distribution?: (value: number) => number;
  wipLimit?: number;
  speed?: number;
  run: () => Board;
}

export interface WorkerConfig {
  skills: string[];
}

export interface Stats {
  throughput: number;
  leadTime: number;
  wip: number;
  timeWorked: number;
  workers: Record<string, number>;
}
