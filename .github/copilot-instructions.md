# Project Guidelines

## Code Style

- Use TypeScript strict mode in all implementation files. Do not use any.
- Add explicit return types to functions and exported helpers.
- Use named exports for components and utilities. Use default exports only for Next.js page files.
- Keep React components focused and small (target 150 lines or less when practical).
- Use Tailwind classes for styling. Avoid inline styles.
- Validate external API responses with Zod before transformation or UI usage.

See full standards in [.github/instructions/project.instructions.md](./instructions/project.instructions.md).

## Architecture

- Build with Next.js 14 App Router using a BFF pattern:
  - UI pages and hooks call internal API routes under /api.
  - API routes call Open Meteo and return validated, transformed data.
- Do not call Open Meteo directly from React components.
- Centralize weather API access in app/lib/openmeteo.ts.
- Keep alert derivation logic on the server/data layer (not in presentational components).

See architecture and folder expectations in [.github/instructions/project.instructions.md](./instructions/project.instructions.md).
See Open Meteo integration details in [.github/skills/openmeteo-api.skill.md](./skills/openmeteo-api.skill.md).

## Build and Test

When the app scaffold is present, run these checks before completing work:

- Install dependencies: npm install
- Lint: npm run lint
- Type check: npm run typecheck
- Unit tests: npm run test -- --testPathPattern=unit
- Integration tests: npm run test -- --testPathPattern=integration
- Mock tests: npm run test -- --testPathPattern=mocks
- Build: npm run build

If scripts differ from the above, prefer package.json scripts as the source of truth and update this file.

## Conventions

- Every feature should include three test layers: unit, integration, and mock/network-behavior coverage.
- API routes should return typed error states and avoid exposing raw upstream payloads.
- Accessibility is required: aria-label for interactive controls, descriptive alt text, and non-color severity indicators.
- Use Conventional Commits for commit messages.

See phased implementation and constraints in [.github/agents/weather-portal-builder.agent.md](./agents/weather-portal-builder.agent.md).
See feature prompt catalog in [.github/prompts/weather-portal.prompt.md](./prompts/weather-portal.prompt.md).
See context bootstrap flow in [.github/init-and-start.prompt.md](./init-and-start.prompt.md).
