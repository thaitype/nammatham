/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({

  test: {
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude ?? [],
        'scripts',
        'examples',
        /**
         * Ignore tRPC plugins, it's unstable yet.
         */
        'packages/trpc-azure-functions',
      ]
    },
  },
});
