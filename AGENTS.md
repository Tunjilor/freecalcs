<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack
This repo is a Next.js (App Router) + React + Tailwind CSS + TypeScript application, deployed on Vercel. It is NOT a CommonJS/Node CLI project — use ESM and .ts/.tsx throughout. package.json is the single source of truth for exact dependency versions; when a version matters, read it there rather than assuming from training data (per the Next.js guidance above).

## Calculator pages
All calculator pages MUST conform to docs/BUILD-STANDARD.md (page anatomy, CalculatorDefinition schema, shared components, insight engine, SEO/JSON-LD rules, monetization, and Definition of Done). Do not freestyle a calculator: fill in a definition and pass the checklist. If something you need isn't expressible in the schema, STOP and flag it for a schema change rather than inventing a one-off pattern.
