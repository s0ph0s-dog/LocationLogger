export interface GPSCoords {
  lat: number,
  lon: number,
}

export interface LogEntry {
  id: string,
  date: Date,
  country: string,
  coords: GPSCoords,
}
