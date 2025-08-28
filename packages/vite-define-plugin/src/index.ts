import { Plugin } from "vite"
import core, { CoreOptions } from '@computerwwwizards/define-core'
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export interface CreatePluginOptions extends Partial<CoreOptions<{}>>{
  initialValuesFile?: string;
  initialValuesByMode?: {
    [key: string]: string;
  },
  merge?: boolean;
}

function stringifyEachValue(pojo: Record<string, unknown>, keyPrefix = ''){
  const result: Record<string, unknown> = {};
  for(const key in pojo){
    result[`${keyPrefix}.${key}`] = JSON.stringify(pojo[key])
  }
  return result;
}

export default  function createPlugin({
  initialValuesFile, 
  initialValuesByMode = {},
  keyPrefix = 'import.meta.env',
  merge, 
  ...options
}: CreatePluginOptions = {}): Plugin {
  return {
    name: 'computerwwwizards-defin-vite-plugin',
    async config(config, env){
      
      const isDev = env.mode === 'development';

      const configPath = initialValuesByMode[env.mode] ?? initialValuesFile ?? 
        join(config.root ?? process.cwd(), isDev ? 'client-config.dev.json': 'client-config.json')
      
      const initialValues = options.initialValues 
        ?? JSON.parse(await readFile(configPath, {
            encoding: 'utf-8'
          }))

      const newEnvs = isDev? stringifyEachValue(initialValues, keyPrefix): core({
          ...options,
          keyPrefix,
          initialValues
        })

      console.log(newEnvs)

      return {
        define: newEnvs
      }
    }
  }
}
