# 🌦️ Prompt — Weather Portal Full Stack Development

## Prompt ID
`weather-portal-main`

## Context Files Required
- `.github/instructions/project.instructions.md`
- `.github/skills/openmeteo-api.skill.md`
- `.github/agents/weather-portal-builder.agent.md`

---

## 🎯 Prompt: Full Stack Implementation

```
You are a senior full-stack TypeScript engineer working on the Weather Portal project.

Read and strictly follow:
- .github/instructions/project.instructions.md (architecture, standards, conventions)
- .github/skills/openmeteo-api.skill.md (API knowledge, schemas, mock handlers)

Implement the following feature end-to-end:

[REPLACE WITH FEATURE — e.g., "Current Weather Display"]

Requirements for this feature:
1. Backend (BFF API route in app/api/):
   - Create a typed Next.js API route that fetches data from Open Meteo
   - Validate the response with the appropriate Zod schema
   - Return a transformed, clean response (no raw API data to the client)
   - Handle errors with proper HTTP status codes (400, 503) and error messages

2. Frontend (Component + Hook):
   - Create a React component that displays the data
   - Create a custom hook using TanStack Query to fetch from the BFF route
   - Handle loading, error, and empty states
   - Use Tailwind CSS classes only — no inline styles
   - Add proper ARIA attributes for accessibility
   - Support dark mode with Tailwind dark: variants

3. Tests (all three types are mandatory):
   a) Unit tests: test formatters, pure functions, and component in isolation
   b) Integration test: test the full API route end-to-end
   c) Mock test: test component with MSW handlers — cover success, loading, error, and network failure

After each file, briefly confirm what was implemented and what test covers it.
```

---

## 🎯 Prompt: Current Weather Page

```
Using the project instructions and OpenMeteo skill, implement the Current Weather page.

Page: app/(pages)/page.tsx
API Route: app/api/weather/route.ts
Component: app/components/WeatherCard.tsx
Hook: app/hooks/useWeather.ts

The WeatherCard must display:
- Current temperature (°C) — large, prominent
- Feels-like temperature
- Weather description + icon (decoded from WMO weathercode)
- Wind speed and direction (with compass direction label: N, NE, E, etc.)
- Humidity (%)
- Atmospheric pressure (hPa)
- Last updated timestamp (formatted as "HH:mm, DD MMM")
- Day/night indicator (different background gradient)

Location handling:
- On mount, request browser geolocation
- While waiting: show a skeleton loader (full card skeleton)
- If denied: show LocationSearch component for manual city entry
- Store coordinates in localStorage key "weather_location"

Implement all required tests in __tests__/ following the three-test strategy.
```

---

## 🎯 Prompt: 24h Forecast Page

```
Using the project instructions and OpenMeteo skill, implement the 24-Hour Forecast page.

Page: app/(pages)/forecast/page.tsx
API Route: app/api/forecast/route.ts
Component: app/components/HourlyForecast.tsx
Hook: app/hooks/useForecast.ts

The HourlyForecast component must display:
- A scrollable horizontal list of 24 hour cards
- Each card contains: time (HH:mm), weather icon, temperature, precipitation probability (%)
- Highlight the current hour card with an accent border
- Show a temperature trend bar at the bottom (min to max scale)
- Color-code precipitation probability: <30% grey, 30-60% blue, >60% dark blue

Data requirements:
- Fetch next 24 hours from current time (not from midnight)
- Filter hourly array to start at current hour index
- Display UV Index peak for the day prominently at the top of the page
- Show sunrise/sunset times if available

Implement all required tests in __tests__/ following the three-test strategy.
```

---

## 🎯 Prompt: Weather Alerts Page

```
Using the project instructions and OpenMeteo skill, implement the Weather Alerts page.

Page: app/(pages)/alerts/page.tsx  
API Route: app/api/alerts/route.ts
Component: app/components/AlertBanner.tsx
Hook: app/hooks/useAlerts.ts
Library: app/lib/alerts.ts (alert derivation logic)

Alert derivation rules (implement in lib/alerts.ts):
- STORM: weathercode in [95, 96, 99] in next 24h
- HEAVY_RAIN: precipitation_probability > 80% AND precipitation > 10mm in any hour
- STRONG_WIND: windspeed_10m > 50 km/h in any hour
- EXTREME_UV: uv_index >= 8 in any hour
- LOW_VISIBILITY: visibility < 1000m in any hour
- FROST: temperature_2m <= 2°C in any hour

AlertBanner component requirements:
- Each alert has a severity level: LOW (blue), MEDIUM (amber), HIGH (red)
- Icon + title + description + time range affected
- Collapsible detail section (click to expand)
- "No active alerts" empty state with a green checkmark
- Alerts sorted by severity (HIGH first)
- Dismiss button that hides alert for current session (store in sessionStorage)

The /api/alerts route must:
- Fetch hourly data from Open Meteo
- Run the alert derivation logic server-side
- Return array of TAlert objects with: id, type, severity, title, description, validFrom, validUntil

Implement all required tests including edge cases:
- No alerts scenario
- Multiple simultaneous alerts
- Alert threshold boundary values (exactly at threshold)
- All error states
```

---

## 🎯 Prompt: CI/CD GitHub Actions Pipeline

```
Create the complete GitHub Actions CI/CD pipeline for the Weather Portal.

File: .github/workflows/ci.yml

Requirements:
- Trigger: on push and pull_request to main and develop branches
- Node.js matrix strategy: versions 18.x and 20.x
- Cache: npm dependencies using actions/cache

Jobs (in order, each must pass for next to run):
1. lint: Run ESLint and check for Prettier formatting issues
2. typecheck: Run tsc --noEmit
3. test-unit: Run jest --testPathPattern=unit --coverage
4. test-integration: Run jest --testPathPattern=integration --coverage
5. test-mocks: Run jest --testPathPattern=mocks --coverage
6. coverage-report: Merge coverage reports and upload as artifact
7. build: Run next build — only on Node 20

Additional requirements:
- Upload test results as artifacts (junit XML format) for GitHub Actions test summary
- Add status badges to README.md
- Set minimum coverage thresholds: lines 80%, branches 75%, functions 85%
- Fail the pipeline if coverage drops below thresholds
- Comment coverage summary on PRs using a coverage action

Generate the complete ci.yml file and update jest.config.ts to output junit XML reporter.
```
