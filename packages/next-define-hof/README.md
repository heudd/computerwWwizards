# @computerwwwizards/next-define-hof

A Next.js Higher-Order Function (HOF) for enhancing Next.js configurations with compile-time environment variable definitions using the `@computerwwwizards/define-core` library.

## Overview

This library provides a seamless way to inject environment variables and custom values at compile time in Next.js applications. It extends Next.js's built-in `compiler.define` functionality with advanced features like nested object support, custom key prefixes, and separate server/client definitions.

## Installation

```bash
npm install @computerwwwizards/next-define-hof
# or
pnpm add @computerwwwizards/next-define-hof
# or
yarn add @computerwwwizards/next-define-hof
```

## Simple Configuration

```ts
// next.config.ts
import { NextConfig } from "next";
import { withDefineConfig } from '@computerwwwizards/next-define-hof';

const nextConfig: () => Promise<NextConfig> = () => withDefineConfig({
  // Your existing Next.js config
  }, 
  {
    globalOptions: {
      initialValues: {
        API_URL: 'https://api.example.com',
        VERSION: '1.0.0',
        FEATURE_FLAGS: {
          enableNewUI: true,
          enableBetaFeatures: false
        }
    }
    }
  }
);

export default nextConfig;
```

## Using External Configuration File

Create a JSON file with your values:

```json
// config/defines.json
{
  "global": {
    "API_ENDPOINT": "https://api.production.com",
    "ANALYTICS": {
      "trackingId": "GA-123456789",
      "enabled": true
    }
  },
  "server": {
    "DB_HOST": "localhost"
  }
}
```

Then use it in your Next.js config:

```typescript
// next.config.ts
import { NextConfig } from "next";
import { withDefineConfig } from '@computerwwwizards/next-define-hof';

const nextConfig: () => Promise<NextConfig> = () => withDefineConfig({
  // Your Next.js config
}, {
  initialValuesPath: './config/defines.json'
});

export default nextConfig;
```


## API Reference

### `withDefineConfig(config, options)`

The main function that wraps your Next.js configuration with enhanced define capabilities.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `NextConfig` | Your Next.js configuration object |
| `options` | `WithDefineHOFConfigOptions` | Configuration options for the define functionality |

#### `WithDefineHOFConfigOptions`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `globalOptions` | `Partial<CoreOptions<{}>>` | `{}` | Options for client-side definitions |
| `serverOptions` | `Partial<CoreOptions<{}>>` | `{}` | Options for server-side definitions |
| `initialValuesPath` | `string` | `undefined` | Path to JSON file containing initial values |

#### `CoreOptions<T>`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `keyPrefix` | `string` | `'process.env'` | Prefix for generated keys |
| `initialValues` | `T` | Required | Object containing values to be defined |
| `separator` | `string` | `'.'` | Separator for nested object keys |
| `isPlainObject` | `function` | Built-in function | Function to determine if a value is a plain object |

## Basic Usage

### Advanced Configuration with Server Options

```typescript
// next.config.ts
import { NextConfig } from "next";
import { withDefineConfig } from '@computerwwwizards/next-define-hof';

const nextConfig: () => Promise<NextConfig> = () => withDefineConfig({
  compiler: {
    define: {
      'process.env.CUSTOM_VAR': '"existing-value"'
    }
  }
}, {
  globalOptions: {
    initialValues: {
      CLIENT_API_URL: 'https://api.example.com',
      BUILD_TIME: Date.now()
    },
    keyPrefix: 'process.env'
  },
  serverOptions: {
    initialValues: {
      DATABASE_URL: 'postgresql://localhost:5432/db'
    },
    keyPrefix: 'process.env'
  }
});

export default nextConfig;
```

## Usage in Components

Once configured, you can use the defined values in your React components:

```tsx
// src/app/page.tsx
import React from 'react';

export default function HomePage() {
  // These values are replaced at compile time
  console.log('API URL:', process.env.API_ENDPOINT);
  console.log('Feature enabled:', process.env.ANALYTICS.enabled);
  console.log('Build time:', process.env.BUILD_TIME);

  return (
    <div>
      <h1>My App v{process.env.VERSION}</h1>
      <p>API: {process.env.API_ENDPOINT}</p>
      {process.env.FEATURE_FLAGS.enableNewUI && (
        <div>New UI is enabled!</div>
      )}
    </div>
  );
}
```

## Examples from Sandbox

Based on the `sandboxes/next-app` implementation:

```typescript
// next.config.ts (from sandbox)
import { NextConfig } from "next";
import { withDefineConfig } from '@computerwwwizards/next-define-hof';

const nextConfig: () => Promise<NextConfig> = () => withDefineConfig({
  compiler: {
    define: {
      'process.env.custom': '1',  // Existing define
    }
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}, {
  globalOptions: {
    initialValues: {
      env2: 3  // Will become process.env.env2
    }
  }
});

export default nextConfig;
```

Usage in component:
```tsx
// src/app/page.tsx (from sandbox)
export default function Home() {
  console.log(process.env.env2);    // Logs: 3
  console.log(process.env.custom);  // Logs: "1"
  console.log(typeof process.env.env2); // Logs: "number"
  
  return (
    <div>
      <p>{typeof process.env.env2}</p>  {/* Renders: number */}
      {/* Rest of component */}
    </div>
  );
}
```

## Features

- **🔧 Compile-time replacement**: Values are replaced during build, not runtime
- **🌳 Nested object support**: Define complex nested structures
- **🔀 Separate client/server configs**: Different values for client and server builds
- **📁 External config files**: Load definitions from JSON files
- **🎯 Custom key prefixes**: Customize how keys are generated
- **🔄 Merge with existing**: Works alongside existing `compiler.define` settings
- **⚡ Zero runtime overhead**: All replacements happen at build time

## TypeScript Support

The library is fully typed with TypeScript. All interfaces and options have proper type definitions for better developer experience.

## Requirements

- Next.js >= 15
- Node.js >= 18



## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] Change API names
- [ ] Include codegen
- [ ] Export utils
- [ ] Suppoort merge with external files