import { app } from 'electron';
import { readJson, writeJson } from 'fs-extra';
import path from 'path';
import { from, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

interface StorageData {
  [key: string]: string;
}

const defaultFilename = path.resolve(app.getPath('userData'), 'storage.json');

export class Storage {
  private readonly filename: string;
  private storage: StorageData | null = null;

  private readonly save$ = new Subject<void>();
  private readonly saveSubscription = Subscription.EMPTY;
  private readonly destroyed = new Subject();

  constructor(filename = defaultFilename) {
    this.filename = filename;
    this.saveSubscription = this.save$
      .asObservable()
      .pipe(
        debounceTime(50),
        takeUntil(this.destroyed),
        switchMap(() => from(this._save())),
      )
      .subscribe();
  }

  async initialize() {
    try {
      this.storage = await readJson(this.filename, { throws: true });
    } catch {
      this.storage = {};
      await this._save();
    }
  }

  async destroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.saveSubscription.unsubscribe();

    // Ensure save
    await this._save();
  }

  has(key: string) {
    return this.get(key) !== null;
  }

  get<T extends string = string>(key: string) {
    return (this.storage?.[key] as T) ?? null;
  }

  set<T extends string = string>(key: string, data: T) {
    if (this.storage !== null) {
      this.storage[key] = data;
    }
    return this;
  }

  save() {
    this.save$.next();
  }

  private async _save() {
    if (this.storage !== null) {
      await writeJson(this.filename, this.storage, { spaces: 2 });
    }
  }
}
