import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import pluginDefine from '../../src';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('should render page as expected', async ({ page }) => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [pluginDefine()],
      server: {
        port: 6969,
      },
    },
  });

  const { server, urls } = await rsbuild.startDevServer();

  await page.goto(urls[0]);
  expect(await page.evaluate('window.test')).toBe(1);

  await server.close();
});

test('should build succeed', async ({ page }) => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [pluginDefine()],
    },
  });

  await rsbuild.build();
  const { server, urls } = await rsbuild.preview();

  await page.goto(urls[0]);
  expect(await page.evaluate('window.test')).toBe(1);

  await server.close();
});