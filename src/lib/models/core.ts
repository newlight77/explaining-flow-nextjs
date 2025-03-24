import { WorkList, Worker, WorkItem } from './types';
import { Colors } from './generator';
import { Subject } from 'rxjs';

// Événements pour la communication entre composants
export const events = {
  workerCreated: new Subject<Worker>(),
  workerWorking: new Subject<Worker>(),
  workerIdle: new Subject<Worker>(),
  workItemAdded: new Subject<{item: WorkItem, column: WorkList}>(),
  workItemRemoved: new Subject<{item: WorkItem, column: WorkList}>(),
  workItemStarted: new Subject<WorkItem>(),
  workItemFinished: new Subject<WorkItem>(),
  boardReady: new Subject<{columns: WorkList[]}>(),
  boardDone: new Subject<{board: any}>(),
  boardAllowNewWork: new Subject<void>(),
  boardDenyNewWork: new Subject<void>()
};

// Multiplicateur de temps pour accélérer ou ralentir la simulation
let timeMultiplicator = 1;

export const TimeAdjustments = {
  speedUpBy: (factor: number) => {
    timeMultiplicator = 1 / factor;
  },
  multiplicator: () => timeMultiplicator
};

// Classe Worker
export class WorkerImpl implements Worker {
  private static counter = 1;
  private idle = true;
  public id: number;

  constructor(public skills: Record<string, number> = { dev: 1 }) {
    this.id = WorkerImpl.counter++;
    events.workerCreated.next(this);
  }

  canWorkOn(skill: string): number {
    if (!this.idle) return 0;
    return this.workSpeedFor(skill);
  }

  startWorkingOn(inbox: WorkList, inProgress: WorkList, outbox: WorkList): void {
    const item = inbox.peek();
    if (item) {
      this.idle = false;
      events.workerWorking.next(this);
      const skill = inProgress.necessarySkill;
      inbox.move(inProgress, item);
      const timeout = this.calculateTimeoutFor(item, skill);
      setTimeout(() => {
        this.idle = true;
        inProgress.move(outbox, item);
        events.workerIdle.next(this);
      }, timeout);
    }
  }

  get name(): string {
    return Object.keys(this.skills).map(skill => `${skill}`).join(', ');
  }

  private workSpeedFor(skill: string): number {
    return this.skills[skill] || 
           this.skills['all'] || 
           this.skills['rest'] || 
           this.skills['fs'] || 
           this.skills['fullstack'] || 
           0;
  }

  private calculateTimeoutFor(workItem: WorkItem, skill: string): number {
    return 1000 * TimeAdjustments.multiplicator() * workItem.work[skill] / this.workSpeedFor(skill);
  }
}

// Classe WorkItem
export class WorkItemImpl implements WorkItem {
  private static counter = 1;
  public id: number;
  public startTime?: number;
  public endTime?: number;
  public duration?: number;

  constructor(public work: Record<string, number>, public color: string = Colors.anyCardColor()) {
    this.id = WorkItemImpl.counter++;
  }
}

// Classe WorkList
export class WorkListImpl implements WorkList {
  private static counter = 1;
  private work: WorkItem[] = [];
  public id: number;

  constructor(public name: string, public necessarySkill: string = "dev") {
    this.id = WorkListImpl.counter++;
  }

  size(): number {
    return this.work.length;
  }

  hasWork(): boolean {
    return this.size() > 0;
  }

  items(): WorkItem[] {
    return [...this.work];
  }

  peek(): WorkItem | undefined {
    return this.work[0];
  }

  add(item: WorkItem): void {
    this.work.push(item);
    events.workItemAdded.next({ item, column: this });
  }

  move(to: WorkList, item: WorkItem): WorkItem {
    this.remove(item);
    to.add(item);
    return item;
  }

  private remove(item: WorkItem): void {
    const index = this.work.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.work.splice(index, 1);
      events.workItemRemoved.next({ item, column: this });
    }
  }
}
