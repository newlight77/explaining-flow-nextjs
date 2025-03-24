import { Board, WorkList, Worker, WorkItem } from './types';
import { WorkListImpl } from './core';
import { events } from './core';

export class BoardFactory {
  createColumns(workColumnNames: string[]): WorkList[] {
    const columns: WorkList[] = [];

    // Backlog column
    const backlog = new WorkListImpl('Backlog');
    columns.push(backlog);

    // Work columns
    workColumnNames.forEach(name => {
      const column = new WorkListImpl(name, name);
      column.necessarySkill = name;
      columns.push(column);
    });

    // Done column
    const done = new WorkListImpl('Done');
    columns.push(done);

    return columns;
  }
}

export class BoardImpl implements Board {
  private _columns: WorkList[] = [];
  private workers: Worker[] = [];
  private allowNewWork = true;

  constructor(workColumnNames: string[]) {
    this.initialize(workColumnNames);

    // Subscribe to events
    events.workItemAdded.subscribe(({ item, column }) => {
      this.assignNewWorkIfPossible();

      if (column.id === this.firstWorkColumn().id) {
        item.startTime = Date.now();
        events.workItemStarted.next(item);
      }

      if (column.id === this.doneColumn().id) {
        item.endTime = Date.now();
        item.duration = item.endTime - (item.startTime || 0);
        events.workItemFinished.next(item);

        if (this.done()) {
          events.boardDone.next({ board: this });
        }
      }
    });

    events.boardAllowNewWork.subscribe(() => {
      this.allowNewWork = true;
      this.assignNewWorkIfPossible();
    });

    events.boardDenyNewWork.subscribe(() => {
      this.allowNewWork = false;
    });
  }

  columns(): WorkList[] {
    return this._columns;
  }

  items(): WorkItem[][] {
    return this._columns.map(column => column.items());
  }

  size(): number {
    return this._columns.map(column => column.size())
      .reduce((totalSize, size) => totalSize + size, 0);
  }

  done(): boolean {
    return this.doneColumn().size() === this.size();
  }

  addWorkers(...newWorkers: Worker[]): void {
    newWorkers.forEach(worker => this.workers.push(worker));
  }

  addWorkItems(...items: WorkItem[]): void {
    items.forEach(item => this.backlogColumn().add(item));
  }

  private initialize(workColumnNames: string[]): void {
    const factory = new BoardFactory();
    this._columns = factory.createColumns(workColumnNames);
    events.boardReady.next({ columns: this._columns });
  }

  private backlogColumn(): WorkList {
    return this._columns[0];
  }

  private firstWorkColumn(): WorkList {
    return this._columns[1];
  }

  private doneColumn(): WorkList {
    return this._columns[this._columns.length - 1];
  }

  private workColumns(): WorkList[] {
    return this._columns.filter((_, index) => index > 0 && index < this._columns.length - 1);
  }

  private assignNewWorkIfPossible(): void {
    const columnWithWork = this.workColumns()
      .reverse()
      .filter(column => column.hasWork())
      .filter(column => this.workers.some(worker => worker.canWorkOn(column.necessarySkill)))[0];

    if (columnWithWork) {
      if (columnWithWork === this.backlogColumn() && !this.allowNewWork) {
        return;
      }

      const availableWorker = this.workers
        .filter(worker => worker.canWorkOn(columnWithWork.necessarySkill))
        .reduce((bestCandidate, worker) => {
          if (!bestCandidate) return worker;
          const bestScore = bestCandidate.canWorkOn(columnWithWork.necessarySkill);
          const currentScore = worker.canWorkOn(columnWithWork.necessarySkill);
          return bestScore > currentScore ? bestCandidate : worker;
        }, null as Worker | null);

      if (availableWorker) {
        availableWorker.startWorkingOn(
          columnWithWork,
          columnWithWork,
          this._columns[this._columns.indexOf(columnWithWork) + 1]
        );
      }
    }
  }
}
