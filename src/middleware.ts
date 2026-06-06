import { defineMiddleware } from 'astro:middleware';

// Pre-launch gate. When COMING_SOON=true at build time, every route is redirected to the
// /coming-soon/ splash — so the real site keeps building underneath but isn't served (gated
// routes become redirects, not hidden HTML). Default OFF, so local dev shows the full site.
//
//   pnpm build                    → full site (work on it)
//   COMING_SOON=true pnpm build   → public sees only the splash
//
// Runs at build time for each static route; assets aren't routes so they're unaffected.
const ARMED = process.env.COMING_SOON === 'true';
const SPLASH = '/coming-soon/';

export const onRequest = defineMiddleware((context, next) => {
  if (!ARMED) return next();
  const path = context.url.pathname;
  if (path === SPLASH || path === '/coming-soon') return next();
  return context.redirect(SPLASH);
});
