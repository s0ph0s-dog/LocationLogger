type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
type FixedLengthArray<T extends any[]> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator< ArrayItems<T> > }

export type Coordinate = FixedLengthArray<[number, number]>;
export type Polygon = Coordinate[];

export interface GJPolygon {
  type: "Polygon",
  coordinates: Polygon[],
}
export interface GJMultiPolygon {
  type: "MultiPolygon",
  coordinates: Polygon[][],
}
export interface FeatureProps {
  GID_0: string,
  NAME_1: string|null,
  COUNTRY: string,
}
export interface Feature {
  type: string,
  properties: FeatureProps,
  geometry: GJPolygon|GJMultiPolygon,
}
export interface FeatureCollection {
  type: string,
  name: string,
  crs: any,
  features: Feature[],
}
