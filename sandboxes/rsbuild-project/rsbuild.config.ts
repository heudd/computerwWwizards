import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import pluginDefine from "@computerwwwizards/rsbuild-define-plugin"

export default defineConfig({
  plugins: [pluginDefine(), pluginReact()]
});
