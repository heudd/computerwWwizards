import { type NextConfig } from "next";
import defineCore, { type CoreOptions } from '@computerwwwizards/define-core'
import { readFile } from "node:fs/promises";



export interface WithDefineHOFConfigOptions {
  globalOptions?: Partial<CoreOptions<{}>>;
  serverOptions?: Partial<CoreOptions<{}>>;
  initialValuesPath?: string
}
 //TODO:export also ta helper to merge defines


// TODO: consider mutating instead of cloning
export async function withDefineConfig(
  config: NextConfig, 
  {
    globalOptions = {} as CoreOptions<{}>,
    serverOptions = {} as CoreOptions<{}>,
    initialValuesPath
  }: WithDefineHOFConfigOptions = {}
): Promise<NextConfig> {
  const maybeValues: {
    global: Record<string, unknown>,
    server: Record<string, unknown>
  }= initialValuesPath? JSON.parse(await readFile(initialValuesPath, {encoding: 'utf-8'})) : {};

  const { initialValues: initialGlobalOptions } = globalOptions
  const finalGlobalInitialValues = initialGlobalOptions ?? maybeValues.global ?? {}
  const { initialValues: initialServerOptions } = serverOptions
  const finalInitialServerValues = initialServerOptions ?? maybeValues.server ?? {}

  return {
    ...config,
    compiler: {
      ...config.compiler,
      define: {
        ...config.compiler?.define,
        ...defineCore({
          ...globalOptions,
          initialValues: finalGlobalInitialValues,
          keyPrefix: globalOptions.keyPrefix ?? 'process.env'
        }) as any
      },
      defineServer: {
        ...config.compiler?.defineServer,
        ...defineCore({
          ...serverOptions,
          initialValues: finalInitialServerValues,
          keyPrefix: serverOptions.keyPrefix ?? 'process.env'
        }) as any
      }
    }
  }
}