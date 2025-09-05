import { describe, it, expect } from 'vitest';
import { Container } from '../src/index';

interface ResolutionMap {
  apiKey: string;
  apiClient: { get: () => string };
  config: { endpoint: string };
}

describe('Container', () => {
  it('should bind and get a simple value', () => {
    const container = new Container<ResolutionMap>();
    const apiKey = 'test-api-key';

    container.bindTo('apiKey', () => apiKey);
    const resolvedApiKey = container.get('apiKey');

    expect(resolvedApiKey).toBe(apiKey);
  });

  it('should bind and get a dependent value', () => {
    const container = new Container<ResolutionMap>();
    const apiKey = 'test-api-key';

    container.bindTo('apiKey', () => apiKey);
    container.bindTo('apiClient', (ctx) => ({
      get: () => `key:${ctx.get('apiKey')}`,
    }));

    const apiClient = container.get('apiClient');
    expect(apiClient.get()).toBe(`key:${apiKey}`);
  });

  it('should return the same instance every time', () => {
    const container = new Container<ResolutionMap>();
    container.bindTo('config', () => ({ endpoint: 'http://localhost' }));

    const config1 = container.get('config');
    const config2 = container.get('config');

    expect(config1).toBe(config2);
  });

  it('should throw an error for unbound identifiers', () => {
    const container = new Container<ResolutionMap>();
    expect(() => container.get('apiKey')).toThrow(
      'No provider bound for identifier: apiKey',
    );
  });
});
