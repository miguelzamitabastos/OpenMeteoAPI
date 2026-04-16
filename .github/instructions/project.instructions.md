# 📋 Project Instructions — Weather Portal Full Stack

## 🎯 Project Overview
Full-stack meteorological portal that consumes the **Open Meteo API** (free, no API key required).
Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS** for the frontend/BFF layer,
and an optional **Express.js** microservice for aggregation and caching.

---

## 🏗️ Architecture

```
weather-portal/
├── app/                        # Next.js App Router (frontend + API routes)
│   ├── (pages)/
│   │   ├── page.tsx            # Home — current weather
│   │   ├── forecast/page.tsx   # 24h forecast view
│   │   └── alerts/page.tsx     # Weather alerts view
│   ├── api/
│   │   ├── weather/route.ts    # BFF route → Open Meteo current
│   │   ├── forecast/route.ts   # BFF route → Open Meteo hourly
│   │   └── alerts/route.ts     # BFF route → Open Meteo alerts
│   ├── components/
│   │   ├── WeatherCard.tsx
│   │   ├── HourlyForecast.tsx
│   │   └── AlertBanner.tsx
│   ├── hooks/
│   │   └── useWeather.ts
│   └── lib/
│       ├── openmeteo.ts        # API client wrapper
│       └── formatters.ts
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── mocks/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   ├── agents/
│   ├── instructions/
│   ├── prompts/
│   └── skills/
├── jest.config.ts
├── jest.setup.ts
└── tsconfig.json
```

---

## 🛠️ Tech Stack — Non-negotiable

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Framework   | Next.js 14 (App Router)              |
| Language    | TypeScript (strict mode)             |
| Styling     | Tailwind CSS + shadcn/ui             |
| State       | React Query (TanStack Query v5)      |
| HTTP Client | Native `fetch` with type-safe wrapper|
| Testing     | Jest + React Testing Library         |
| Mocking     | MSW (Mock Service Worker) v2         |
| CI/CD       | GitHub Actions                       |
| Linting     | ESLint + Prettier                    |
| Validation  | Zod (API response validation)        |

---

## 📐 Coding Standards

### General Rules
- **Always use TypeScript strict mode** — no `any` types allowed.
- Every function must have explicit return types.
- Use **named exports** for components and utilities; default exports only for Next.js pages.
- Keep components under **150 lines**; extract sub-components if larger.
- Every API response **must be validated with Zod** before use.
- No inline styles — use Tailwind utility classes only.
- All async functions must handle errors with `try/catch` and return typed error states.

### Naming Conventions
- Components: `PascalCase` (e.g., `WeatherCard.tsx`)
- Hooks: `camelCase` prefixed with `use` (e.g., `useWeather.ts`)
- API routes: `kebab-case` directories (e.g., `api/weather-alerts/`)
- Constants: `SCREAMING_SNAKE_CASE`
- Types/Interfaces: `PascalCase` prefixed with `T` or `I` (e.g., `TWeatherData`)

### Component Structure
```tsx
// 1. Imports (external → internal → types)
// 2. Types/Interfaces
// 3. Constants
// 4. Component function
// 5. Helper functions (if small and tightly coupled)
// 6. Export
```

### API Client Pattern
All Open Meteo calls must go through `lib/openmeteo.ts`. Never call the API directly from components.
Use the BFF (Backend-for-Frontend) pattern — pages call `/api/*` routes, which call Open Meteo.

---

## 🧪 Testing Requirements

Every feature must include **three test layers**:

### 1. Unit Tests (`__tests__/unit/`)
- Test pure functions: formatters, validators, transformers.
- Test custom hooks in isolation using `renderHook`.
- Test components in isolation — mock all API calls.
- Coverage target: **≥ 90%** for `lib/` and `hooks/`.

### 2. Integration Tests (`__tests__/integration/`)
- Test Next.js API routes end-to-end using `node-mocks-http` or `next-test-api-route-handler`.
- Test full component → hook → API route flow.
- Use a real (or stubbed) Open Meteo response fixture.
- Coverage target: **≥ 75%** for API routes.

### 3. Mock Tests (`__tests__/mocks/`)
- Use **MSW v2** to intercept `fetch` calls at the network level.
- Define handlers in `__tests__/mocks/handlers.ts`.
- Test error states: network failure, 500, malformed JSON, timeout.
- Test loading and skeleton states in UI.

### Test File Naming
```
ComponentName.unit.test.tsx
apiRouteName.integration.test.ts
featureName.mock.test.tsx
```

---

## 🔄 CI/CD — GitHub Actions

The workflow (`ci.yml`) must run on every PR and push to `main`:

```
Lint → Type Check → Unit Tests → Integration Tests → Mock Tests → Build
```

All steps must pass before merge. Use **matrix strategy** to run on Node 18 and 20.

---

## 🌍 Open Meteo API — Usage Rules

- Base URL: `https://api.open-meteo.com/v1/`
- Always request: `latitude`, `longitude`, `timezone=auto`
- Current weather endpoint: `/forecast?current=temperature_2m,weathercode,...`
- Hourly endpoint: `/forecast?hourly=temperature_2m,precipitation_probability,...&forecast_days=2`
- **Cache responses** for 10 minutes using `next: { revalidate: 600 }` in fetch options.
- Never expose raw API responses to the frontend — always transform and validate with Zod first.

---

## ♿ Accessibility & UX
- All interactive elements must have `aria-label`.
- Weather icons must use descriptive `alt` text.
- Color must not be the only indicator of weather severity (use icons + text).
- Support dark mode via Tailwind `dark:` variants.
- Responsive: mobile-first, breakpoints at `sm`, `md`, `lg`.
