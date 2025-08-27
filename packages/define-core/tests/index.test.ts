import { describe, expect, it } from 'vitest';
import core from '../src/index';

describe('core', () => {
  it('should prefix simple values', () => {
    const result = core({
      initialValues: { env: 'value' },
      keyPrefix: 'prefix'
    })

    expect(result).toStrictEqual({
      'prefix.env': 'value'
    })
  });

  it('should prefix nested values', () => {

    const result = core({
      initialValues: { scope: { env: { inner: 'value' } } },
      keyPrefix: 'prefix'
    })

    expect(result).toStrictEqual({
      'prefix.scope.env.inner': 'value'
    })
  })

  it('shoudl not fallten arrays', () => {
    const result = core<Record<string, unknown>>({
      initialValues: { scope: { env: { inner: [2, 3] } } },
      keyPrefix: 'prefix'
    })


    expect(result['prefix.scope.env.inner']).toStrictEqual([2, 3])
  })

  it('should separate by custom separator', () => {
    const result = core({
      initialValues: { scope: { env: 'value' } },
      separator: '-',
    })

    expect(result).toStrictEqual({
      'scope-env': 'value'
    })
  })
})

