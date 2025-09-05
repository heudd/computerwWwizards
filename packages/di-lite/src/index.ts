export type PlainObject = { [key: string | symbol]: any };

export interface IContainer<ResolutionMap extends PlainObject> {
  get<T extends keyof ResolutionMap>(identifier: T): ResolutionMap[T];
  bindTo<T extends keyof ResolutionMap>(
    identifier: T,
    provider: (context: this) => ResolutionMap[T],
  ): IContainer<ResolutionMap>;
}

export class Container<ResolutionMap extends PlainObject>
  implements IContainer<ResolutionMap>
{
  private providers: Map<
    keyof ResolutionMap,
    (context: this) => ResolutionMap[keyof ResolutionMap]
  > = new Map();
  private resolved: Map<keyof ResolutionMap, ResolutionMap[keyof ResolutionMap]> =
    new Map();

  public get<T extends keyof ResolutionMap>(identifier: T): ResolutionMap[T] {
    if (this.resolved.has(identifier)) {
      return this.resolved.get(identifier) as ResolutionMap[T];
    }

    const provider = this.providers.get(identifier);
    if (!provider) {
      throw new Error(`No provider bound for identifier: ${String(identifier)}`);
    }

    const instance = provider(this);
    this.resolved.set(identifier, instance);
    return instance;
  }

  public bindTo<T extends keyof ResolutionMap>(
    identifier: T,
    provider: (context: this) => ResolutionMap[T],
  ): IContainer<ResolutionMap> {
    this.providers.set(identifier, provider);
    return this;
  }
}
