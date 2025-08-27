import { Plugin } from "vite"
import core, { CoreOptions } from 'define-core'
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export interface CreatePluginOptions extends Partial<CoreOptions<{}>>{
  initialValuesFile?: string;
  initialValuesByMode?: {
    [key: string]: string;
  }
}

export default  function createPlugin({
  initialValuesFile, 
  initialValuesByMode = {},
  keyPrefix = 'import.meta.env', 
  ...options
}: CreatePluginOptions = {}): Plugin {
  return {
    name: 'computerwwwizards-defin-vite-plugin',
    async config(config, env){
      
      const isDev = env.mode === 'development';
      const configPath = initialValuesByMode[env.mode] ?? initialValuesFile ?? 
        join(config.root ?? process.cwd(), isDev ? 'client-config.dev.json': 'client-config.json')
      
      const newEnvs = core({
          ...options,
          keyPrefix,
          initialValues: options.initialValues ?? JSON.parse(await readFile(configPath, {
            encoding: 'utf-8'
          }))
        })

      return {
        define: newEnvs
      }
    }
  }
}
