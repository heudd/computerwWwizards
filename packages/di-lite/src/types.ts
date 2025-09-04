export type PlainObject = { [key: string | symbol]: any };

export interface IContainer<ResolutionMap extends PlainObject> {
  get<T extends keyof ResolutionMap>(identifier: T): ResolutionMap[T];
  bindTo<T extends keyof ResolutionMap>(
    identifier: T,
    provider: (context: this) => ResolutionMap[T],
  ): IContainer<ResolutionMap>;
}
