import type { MetadataRoute } from 'next';

// Native App Router manifest route. Next auto-links this at /manifest.webmanifest
// and injects <link rel="manifest" href="/manifest.webmanifest"> into the head.
//
// Intentionally minimal / PWA-ready metadata only: no service worker, no offline
// caching, no install-prompt handling. See the PR description for scope.
//
// Colors are pulled from the existing design system in layout.tsx (the app shell),
// NOT invented: theme_color is the sticky nav/header navy, background_color is the
// site body background. (The brand icon art is teal — a known, intentional contrast
// with the navy chrome; see PR notes.)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FreeCalcs — Free Online Calculators',
    short_name: 'FreeCalcs',
    description:
      'Free online calculators for mortgage, salary, BMI, taxes, compound interest and more. Fast, accurate, no sign-up required.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    theme_color: '#1e3a5f', // nav/header background (layout.tsx)
    background_color: '#f8fafc', // site body background (layout.tsx)
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
