import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      'import.meta.env.CUSTOM': [4, 5],
      'process.env.CUSTOM': [4, 5]
    }
  }
});
