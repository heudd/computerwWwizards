import { expect, it } from 'vitest'
import { withDefineConfig } from '.'
import loadConfig from 'next/dist/server/config'
import { PHASE_DEVELOPMENT_SERVER } from 'next/dist/shared/lib/constants'

it('should load config', async ()=>{
  const customConfig = await withDefineConfig({
    compiler: {
      define: {
        custom: "3"
      }
    }
  }, {
    globalOptions: {
      initialValues: {
        env1: 2
      }
    }
  })

  const finalConfig = await loadConfig(PHASE_DEVELOPMENT_SERVER, import.meta.dirname, {
    customConfig
  })

  expect(finalConfig.compiler.define).toStrictEqual({
    'process.env.env1': 2,
    custom: "3"
  })
})