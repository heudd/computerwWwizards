import { describe, expect, test, vi } from 'vitest';
import createConfig from '../src/index';
import { defineConfig, resolveConfig } from 'vite'

vi.mock("node:fs/promises", ()=>({
  readFile: ()=>Promise.resolve('{"env1": "a"}')
}))

describe('resolve build config', () => {
  test('preserves existing define and injects initialValues as import.meta.env.*', async () => {
    const finalConfig = await resolveConfig(defineConfig({
      plugins: [createConfig({
        initialValues: {
          envA: 1,
        },
      })],
      define: {
        '__CUSTOM__': "'a'"
      }
    }), 'build')

    expect(finalConfig.define).toStrictEqual({
      __CUSTOM__: "'a'",
      'import.meta.env.envA': 1
    })
  });

  test('injects envs from fs when no options are provided', async () => {
    const finalConfig = await resolveConfig({
      plugins: [createConfig()]
    }, 'build')

    expect(finalConfig.define).toStrictEqual({
      'import.meta.env.env1': 'a'
    })
  })
})
