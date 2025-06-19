import { Injectable, Signal, signal, computed } from '@angular/core';
import { LogEntry } from './logentry';

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

@Injectable({
  providedIn: 'root'
})
export class LogDatabaseService {
  logEntries = signal([] as LogEntry[]);

  constructor() { }

  getAllEntries(): Signal<LogEntry[]> {
    console.log(this.logEntries());
    return this.logEntries;
  }

  getEntryById(id: string): Signal<LogEntry | undefined> {
    return computed(() => this.logEntries().filter((le) => le.id === id)[0]);
  }

  addEntry(date: Date, lat: number, lon: number, country: string) {
    const entry = {
      id: crypto.randomUUID(),
      date: date,
      country: country,
      coords: {
        lat: lat,
        lon: lon,
      },
    };
    this.logEntries.update((currentValue) => ([...currentValue, entry]));
    console.log(this.logEntries());
  }
}
