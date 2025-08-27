# Codewwwizards Vite Define Plugin

Flatten a JSON or plain JavaScript config object into Vite's define map under `import.meta.env.*` so you can read structured client-side config at build time without stringifying everything yourself.

Given a JSON like:

```json
{
  "myCustomConfig": {
    "envName": "value"
  }
}
```

You can access it as:

```ts
// prints "value"
console.log(import.meta.env.myCustomConfig.envName)
```

Important: this plugin uses Vite's `define` replacement. It's a compile-time text substitution, so destructuring or reading whole objects at runtime won't work:

```ts
const { myCustomConfig } = import.meta.env
// prints undefined
console.log(myCustomConfig?.envName)

// also prints undefined
console.log(import.meta.env.myCustomConfig)
```

Why? Because these aren't real reads; Vite replaces occurrences with hardcoded values during build. This is intended for client-side configuration, separate from `.env` files.

## Motivation

`.env` files are great, but everything becomes strings. Many apps need arrays, booleans, numbers, and nested shapes for client configuration. A JSON (or JS object) is a natural fit. This plugin lets you keep using the familiar `import.meta.env.*` access pattern while sourcing values from a structured config.

## Quick start

`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import addConfigToEnv from '@computerwwwizards/vite-define-plugin'

export default defineConfig({
  plugins: [addConfigToEnv()]
})
```

By default, the plugin looks for:

- `client-config.dev.json` in development mode
- `client-config.json` in other modes

…relative to Vite's `root` (or `process.cwd()` if `root` isn't set).

Example `client-config.dev.json`:

```json
{
  "someConfig": [5]
}
```

Usage in source code:

```ts
// will print [5]
console.log(import.meta.env.someConfig)
```

Vite will replace that with:

```js
console.log([5])
```

## Options API

The plugin accepts the following options. Types are shown for reference.

| Option              | Type                               | Default                 | Description |
|---------------------|------------------------------------|-------------------------|-------------|
| `initialValuesFile` | `string`                           | auto-detected file path | Absolute or relative path to a JSON file with initial values. Used when `initialValues` is not provided. |
| `initialValuesByMode` | `Record<string, string>`          | `{}`                     | Select a different JSON file per Vite `mode` (e.g., `{ development: 'client-config.dev.json', production: 'client-config.json' }`). Overrides `initialValuesFile` when the key matches the active mode. |
| `initialValues`     | `object`                           | read from file          | Provide a plain object to use directly. When set, the plugin does not read any file. |
| `keyPrefix`         | `string`                           | `'import.meta.env'`     | Prefix used for generated keys. Change if you need a different root than `import.meta.env`. |
| `separator`         | `string`                           | `'.'`                   | Key separator used when flattening nested objects. |
| `isPlainObject`     | `(obj: unknown) => boolean`        | internal default        | Custom plain-object check, if you need to support different prototypes. |

File resolution, when `initialValues` is not provided:

1. `initialValuesByMode[env.mode]` if present
2. Else `initialValuesFile` if provided
3. Else `${root || process.cwd()}/client-config.dev.json` in development, or `${root || process.cwd()}/client-config.json` otherwise

## Examples

### 1) Custom config path (single file)

```ts
import { defineConfig } from 'vite'
import addConfigToEnv from '@computerwwwizards/vite-define-plugin'

export default defineConfig({
  plugins: [
    addConfigToEnv({
      initialValuesFile: 'config/app-config.json'
    })
  ]
})
```

### 2) Custom path by mode

```ts
import { defineConfig } from 'vite'
import addConfigToEnv from '@computerwwwizards/vite-define-plugin'

export default defineConfig({
  plugins: [
    addConfigToEnv({
      initialValuesByMode: {
        development: 'config/app-config.dev.json',
        staging: 'config/app-config.staging.json',
        production: 'config/app-config.prod.json'
      }
    })
  ]
})
```

### 3) In-memory plain JS object (from a custom file)

You can provide values directly using `initialValues`. When set, no file is read.

`config/appConfig.ts`

```ts
export const appConfig = {
  featureFlags: {
    newNav: true
  },
  api: {
    baseUrl: 'https://api.example.com'
  }
}
```

`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import addConfigToEnv from '@computerwwwizards/vite-define-plugin'
import { appConfig } from './config/appConfig'

export default defineConfig({
  plugins: [
    addConfigToEnv({
      initialValues: appConfig
    })
  ]
})
```

Or inline:

```ts
addConfigToEnv({
  initialValues: {
    someConfig: [5],
    flags: { a: true }
  }
})
```

## Notes

- Values are embedded at build time via `define`. Avoid placing secrets here.
- Non-string types (numbers, booleans, arrays, objects) are supported and preserved.
- To change where keys are generated, set `keyPrefix` (e.g., `keyPrefix: 'process.env'`).


