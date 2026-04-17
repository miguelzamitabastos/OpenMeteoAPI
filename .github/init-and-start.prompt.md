# 🚀 Init Prompt — Context Setup

## Usage

Run this prompt **first**, before any agent or development task.
Its purpose is to load all project context into the AI's working memory.

---

## Prompt: `/init`

```
Read and internalize the following files in this exact order.
After reading each one, confirm with a single line summary of what it contains.
Do not generate any code yet.

1. .github/instructions/project.instructions.md
   → Project architecture, tech stack, coding standards, testing requirements, CI/CD rules.

2. .github/skills/openmeteo-api.skill.md
   → Open Meteo API reference: endpoints, parameters, WMO codes, Zod schemas, MSW mock handlers.

3. .github/agents/weather-portal-builder.agent.md
   → Agent persona, execution phases, constraints, commit conventions.

4. .github/prompts/weather-portal.prompt.md
   → Development prompts for each feature: current weather, forecast, alerts, CI/CD.

Once all files are read and confirmed, output a structured project summary:
- Tech stack (bullets)
- Architecture overview (1 paragraph)
- Execution phases (numbered list from the agent file)
- Testing strategy (3 types and what each covers)
- Key constraints (top 5 from the agent constraints list)

End with: "✅ Context loaded. Ready to begin Phase 0.
Type 'start' to initialize the project, or specify a phase to jump to."
```

---

# 🤖 Agent Start Prompt — Begin Execution

## Usage

Run this prompt after `/init` to start autonomous development.
The agent will follow the phased plan defined in `weather-portal-builder.agent.md`.

---

## Prompt: Agent Start

```
You are now acting as the WeatherBot Dev Agent defined in
.github/agents/weather-portal-builder.agent.md.

All context has been loaded via /init. Begin autonomous execution starting at Phase 0.

For Phase 0 — Project Initialization, perform ALL of the following steps:

STEP 1 — Scaffold
Generate the complete file and folder structure for the Weather Portal as defined
in project.instructions.md. Output a tree view of every file to be created.

STEP 2 — Configuration Files
Generate the complete content for these configuration files:
- package.json (with all dependencies from the agent file)
- tsconfig.json (strict mode, Next.js compatible paths)
- tailwind.config.ts (dark mode: 'class', custom colors for weather severity)
- jest.config.ts (separate projects for unit, integration, mock; jsdom environment;
  coverage thresholds; junit reporter)
- jest.setup.ts (import @testing-library/jest-dom; MSW server setup)
- .eslintrc.json (Next.js + TypeScript rules)
- .prettierrc (2 spaces, single quotes, trailing commas)
- .env.example (NEXT_PUBLIC_DEFAULT_LAT=40.4168, NEXT_PUBLIC_DEFAULT_LON=-3.7038)
- next.config.js (enable experimental features if needed)

STEP 3 — Base Library Files
Generate the complete content for:
- app/lib/openmeteo.ts (fetchOpenMeteo generic client function)
- app/lib/schemas/openmeteo.schema.ts (all Zod schemas)
- app/lib/formatters.ts (WMO_CODES lookup map + helper functions:
  formatTemperature, formatWindDirection, formatDateTime, getWeatherSeverity)
- app/lib/alerts.ts (ALERT_THRESHOLDS constants + deriveAlerts function)

STEP 4 — Mock Infrastructure
Generate the complete content for:
- __tests__/mocks/server.ts (MSW setup/teardown for Jest)
- __tests__/mocks/handlers.ts (all handlers: success, error, network error)
- __tests__/mocks/fixtures/current-weather.fixture.ts
- __tests__/mocks/fixtures/hourly-forecast.fixture.ts
- __tests__/mocks/fixtures/alerts-derived.fixture.ts

STEP 5 — First Commit
Generate the git commands to initialize the repo and make the first commit:
  git init
  git add .
  git commit -m "chore: project initialization — scaffold, config, base libraries, mock infrastructure"

After completing Phase 0, report:
✅ Completed: Phase 0 — Project Initialization
🔄 In progress: —
⏭️ Next: Phase 1 — Data Layer (BFF API routes)

Then ask: "Phase 0 complete. Proceed to Phase 1 (Data Layer)? Type 'yes' to continue
or specify adjustments."
```
