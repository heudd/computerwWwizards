import type { IContainer, PlainObject } from './types';

export class BasicContainer<ResolutionMap extends PlainObject = PlainObject>
  implements IContainer<ResolutionMap>
{
  private bindings = new Map<keyof ResolutionMap, (context: this) => any>();

  bindTo<T extends keyof ResolutionMap>(
    identifier: T,
    provider: (context: this) => ResolutionMap[T],
  ): IContainer<ResolutionMap> {
    this.bindings.set(identifier, provider);
    return this;
  }

  get<T extends keyof ResolutionMap>(identifier: T): ResolutionMap[T] {
    const provider = this.bindings.get(identifier);

    if (!provider) {
      throw new Error(`No binding found for identifier: ${String(identifier)}`);
    }

    return provider(this);
  }
}

export * from './types';
