import type { RsbuildConfig, RsbuildPlugin } from '@rsbuild/core';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import core from '@computerwwwizards/define-core'

// TODO: we must consider have a shared types for plugins
export interface PluginDefineOptions {
  initialValues?: Record<string, any>;
  initialValuesFile?: string;
  initialValuesByMode?: Record<string, string>;
  keyPrefix?: string;
  separator?: string;
  root?: string;
  isPlainObject?: (obj: unknown) => boolean;
};

// TODO: should be moved to core as helper?
function stringifyEachValue(pojo: Record<string, unknown>, keyPrefix = '') {
  const result: Record<string, unknown> = {};
  for (const key in pojo) {
    result[`${keyPrefix}.${key}`] = JSON.stringify(pojo[key])
  }
  return result;
}

const pluginDefine = (
  {
    initialValues: _initialValues,
    initialValuesByMode = {},
    initialValuesFile,
    isPlainObject,
    keyPrefix = 'import.meta.env',
    separator,
    root,
  }: PluginDefineOptions = {},
): RsbuildPlugin => ({
  name: 'plugin-define',
  setup(api) {
    api.modifyRsbuildConfig(async (config, { mergeRsbuildConfig }) => {
      const isDev = config.mode === "development"

      // TODO: moved to resolver helper
      const defaultFileName = isDev ? "client-config.dev.json" : "client-config.json"
      const defaultPath = path.join(root ?? process.cwd(), defaultFileName)

      const configPath = initialValuesByMode[config.mode!] ?? initialValuesFile ?? defaultPath
      const initialValues = _initialValues ?? JSON.parse(await readFile(configPath, { encoding: 'utf-8' }))

      const define = isDev ? stringifyEachValue(initialValues) : core({
        initialValues,
        isPlainObject,
        keyPrefix,
        separator
      })

      const extraConfig: RsbuildConfig = {
        source: {
          define
        }
      }

      return mergeRsbuildConfig(config, extraConfig)
    })
  },
});

export default pluginDefine