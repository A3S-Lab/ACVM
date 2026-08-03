import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import { recmaCodeHike, remarkCodeHike, type CodeHikeConfig } from 'codehike/mdx';

const codeHikeConfig: CodeHikeConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: { theme: 'github-dark' },
};

const mdxOptions = {
  remarkPlugins: [[remarkCodeHike, codeHikeConfig]],
  recmaPlugins: [[recmaCodeHike, codeHikeConfig]],
  // Code Hike injects highlighted token data that has no source location.
  // The production build does not emit source maps, so keep MDX generation aligned.
  SourceMapGenerator: undefined,
} as Parameters<typeof mdx>[0] & { SourceMapGenerator: undefined };

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx(mdxOptions),
    },
    react({ include: /\.(?:js|jsx|md|mdx|ts|tsx)$/ }),
  ],
  base: './',
  server: {
    host: '127.0.0.1',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/@remotion/') || id.includes('/node_modules/remotion/')) return 'remotion';
          if (id.includes('/node_modules/codehike/') || id.includes('/node_modules/@code-hike/')) return 'code-hike';
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) return 'react';
          return undefined;
        },
      },
    },
  },
});
