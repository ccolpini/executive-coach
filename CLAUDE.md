# CLAUDE.md — Executive Coach

## Project Overview

A 12-week interactive web app that trains executives to communicate clearly under pressure. Built on Next.js with Claude AI providing real-time scenario generation and coaching feedback.

Three core frameworks taught across 12 weeks:
1. **Minto Pyramid Principle** (Weeks 1-4): Structure and clarity
2. **Decker: Communicate to Influence** (Weeks 5-8): Persuasion and impact
3. **Gallo: Talk Like TED** (Weeks 9-12): Delivery and narrative

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: JavaScript (no TypeScript)
- **UI**: React 18
- **Styling**: Tailwind CSS 3.4.1 + PostCSS
- **AI**: @anthropic-ai/sdk 0.80.0 — model `claude-sonnet-4-20250514`
- **Fonts**: Playfair Display (display), DM Sans (body), DM Mono (labels)
- **Linting**: ESLint with `next/core-web-vitals`
- **Package manager**: npm
- **No test framework configured**

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm start          # Run production server
npm run lint       # ESLint
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key, set in `.env.local` |

No `.env.example` exists. Set the key manually before running.

## Project Structure

```
executive-coach/
├── app/                        # Next.js App Router
│   ├── api/coach/route.js      # POST endpoint: scenario generation + evaluation
│   ├── globals.css             # Tailwind base + scrollbar styling
│   ├── layout.js               # Root layout with font config
│   └── page.js                 # Home page — main UI orchestrator
├── components/
│   ├── ChatInterface.js        # Core conversation UI (largest component)
│   ├── Sidebar.js              # Week/curriculum navigation
│   ├── ScenarioButtons.js      # Scenario type selection
│   ├── SessionStats.js         # Performance tracking (strong/decent/needs-work)
│   └── VoiceInput.js           # Browser Web Speech API integration
├── lib/
│   ├── curriculum.js           # CURRICULUM data, SCENARIOS, getWeek()
│   └── systemPrompt.js         # buildSystemPrompt(), buildScenarioPrompt()
├── tailwind.config.js          # Brand colors & custom animations
├── next.config.mjs             # Next.js config (default/minimal)
├── jsconfig.json               # Path alias: @/* → ./
├── postcss.config.mjs          # Tailwind PostCSS setup
└── .eslintrc.json              # ESLint: next/core-web-vitals
```

## Architecture

### API Route (`/api/coach`)

Single POST endpoint handling two request types:

- **`type: "scenario"`** — Generates a scenario (2-3 sentences, max 300 tokens)
- **`type: "evaluate"`** — Evaluates user response with coaching feedback + rating (max 500 tokens)

Rating is extracted via regex: `**STRONG**`, `**NEEDS WORK**`, or defaults to `decent`.

### State Management

React hooks only — no external state library. Conversation history kept in a `useRef` to avoid re-renders.

### Key Data Flow

1. User selects week + scenario type → `loadScenario()` calls `/api/coach` with `type: "scenario"`
2. User responds → `handleSubmit()` calls `/api/coach` with `type: "evaluate"` + conversation history
3. Coach returns feedback + rating → UI updates stats
4. Auto-reloads next scenario after 900ms

## Code Conventions

- **JSX in `.js` files** (not `.jsx`) — Next.js convention
- **`"use client"`** directive on all component files
- **`@/` imports** for all paths (alias to project root)
- **camelCase** for functions/variables, **PascalCase** for components
- **Inline style objects** used alongside Tailwind classes for dynamic values
- **Minimal comments** — code is self-documenting
- Brand colors defined in `tailwind.config.js` under `brand.*` — avoid hardcoded hex

## Design System

Custom Tailwind theme with `brand.*` colors:

- **Primary/Cobalt** (`#2D4CC8`): Actions, focus states
- **Secondary/Navy** (`#0D1B6E`): Headers
- **Accent/Coral** (`#E8603C`): Submit buttons, alerts
- **Emerald** (`#1A7A4A`): "Strong" rating
- **Amber** (`#D4940A`): "Decent" rating
- **Backgrounds**: Off-white `#FAFAF7`, white surfaces
- **Text**: Dark `#1A1A2E`, secondary `#6B6B8A`

Custom animations: `fade-up` (message entry), `coral-pulse` (recording indicator).

## Common Tasks

### Add a new curriculum week
1. Add entry to `CURRICULUM` in `lib/curriculum.js`
2. Update `Sidebar.js` if week count/framework grouping changes

### Add a scenario type
1. Add to `SCENARIOS` in `lib/curriculum.js`
2. Add handler in `buildScenarioPrompt()` in `lib/systemPrompt.js`

### Modify coach behavior
- System prompt: `lib/systemPrompt.js` → `buildSystemPrompt()`
- Evaluation/rating: `app/api/coach/route.js` (regex parsing)
- UI feedback: `RATING_CONFIG` in `ChatInterface.js`

## Deployment

- **Recommended platform**: Vercel (native Next.js support)
- **Node version**: 18+
- **Required env**: `ANTHROPIC_API_KEY` in hosting platform dashboard

## Notes

- No CI/CD pipelines configured
- No test suite — manual testing via `npm run dev` + browser
- No database — all state is in-memory per session
- Voice input gracefully hides when browser doesn't support Web Speech API
- Rating extraction is regex-based (fragile) — structured output could improve reliability
