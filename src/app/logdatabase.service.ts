import { Injectable, Signal, WritableSignal, signal, computed } from '@angular/core';
import { LogEntry } from './logentry';
import { openDB, IDBPDatabase, DBSchema } from 'idb';

/*
const demoData: LogEntry[] = [
  {
    id: "50409d81-bb58-40b0-bfd6-5c1b3290e410",
    date: new Date("2025-06-18T12:00:00Z"),
    country: "Canada",
    coords: {
      lat: 43,
      lon: 79,
    }
  },
  {
    id: "c63a24d1-9fc0-4a1f-a611-98388d111a76",
    date: new Date("2025-06-17T12:00:00Z"),
    country: "United States",
    coords: {
      lat: 43,
      lon: 77,
    }
  },
  {
    id: "2480a229-5f93-4870-9349-05e94dafaaba",
    date: new Date("2025-06-16T12:00:00Z"),
    country: "United States",
    coords: {
      lat: 43,
      lon: 77,
    }
  },
];
*/

const DB_NAME = "LocationLogger";
const DB_VERSION = 1;

interface LogDatabase extends DBSchema {
  logEntries: {
    key: string;
    value: LogEntry;
    indexes: { 'byDate': Date };
  };
}

@Injectable({
  providedIn: 'root'
})
export class LogDatabaseService {
  private logEntries: WritableSignal<LogEntry[] | undefined> = signal(undefined);
  private logDb: IDBPDatabase<LogDatabase> | null = null;

  constructor() {
    if (!('indexedDB' in window)) {
      throw new Error('IndexedDB not supported in this browser.');
    }
    console.log("Initializing IndexedDB...");
    const p = openDB<LogDatabase>(DB_NAME, DB_VERSION, {
      upgrade (db) {
        if (!db.objectStoreNames.contains('logEntries')) {
          const logEntryStore = db.createObjectStore('logEntries', { keyPath: 'id' });

          logEntryStore.createIndex('byDate', 'date', { unique: false });
        }
        console.log("IndexedDB initialized.");
      }
    });
    p.then((result) => {
      this.logDb = result;
      const allEntriesP = this.getAllEntries();
      allEntriesP.then((_) => {
        console.log("Log list loaded");
      })
    });
  }

  async getAllEntries(): Promise<Signal<LogEntry[]|undefined>> {
    if (this.logDb) {
      const index = this.logDb.transaction('logEntries').store.index("byDate");
      let allEntries: LogEntry[] = [];
      // Iterate in reverse order, so that the newest log entries appear at the
      // top of the list.  This better matches user expectations about how
      // a log like this should work.
      for await(const cursor of index.iterate(null, "prev")) {
        allEntries.push(cursor.value);
      }
      console.log(allEntries);
      this.logEntries.set(allEntries);
    }
    return this.logEntries;
  }

  getEntryById(id: string): Signal<LogEntry | undefined> {
    const le: LogEntry[]|undefined = this.logEntries()
    if (le === undefined) {
      return computed(() => undefined);
    } else {
      return computed(() => le.filter((le) => le.id === id)[0]);
    }
  }

  async addEntry(date: Date, lat: number, lon: number, country: string) {
    if (!this.logDb) {
      return;
    }
    const entry = {
      id: crypto.randomUUID(),
      date: date,
      country: country,
      lat: lat,
      lon: lon,
    };
    const tx = this.logDb.transaction('logEntries', 'readwrite');
    await Promise.all([
      tx.store.add(entry),
      tx.done,
    ]);
    const newEntriesList = await this.getAllEntries();
    console.log(newEntriesList);
  }

  async deleteEntry(id: string) {
    if (!this.logDb) {
      return;
    }
    const tx = this.logDb.transaction('logEntries', 'readwrite');
    await Promise.all([
      tx.store.delete(id),
      tx.done,
    ]);
    this.logEntries.update((entries) => {
      if (entries) {
        return entries.filter((entry) => entry.id != id);
      } else {
        return undefined;
      }
    });
  }
}
