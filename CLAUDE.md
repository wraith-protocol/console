# Wraith Console — Developer Dashboard

You are building the Wraith Console — the developer dashboard for the Wraith Protocol platform. React + Vite frontend that talks to the Gateway API.

## Reference Docs

Read `reference/docs/console/01-architecture.md` for the full spec: pages, components, auth flow, design system, and API communication.

Also read `reference/docs/gateway/05-api-endpoints.md` to understand every endpoint the console calls.

## Design System

Dark monochrome theme matching the Wraith Protocol brand:

| Token              | Hex       | Usage                   |
| ------------------ | --------- | ----------------------- |
| surface            | `#0e0e0e` | Page backgrounds        |
| surface-container  | `#141414` | Cards, panels           |
| surface-bright     | `#1a1a1a` | Hover states            |
| primary            | `#c6c6c7` | Primary text, buttons   |
| on-surface         | `#e6e1e5` | Headings                |
| on-surface-variant | `#c4c7c5` | Body text               |
| outline            | `#767575` | Borders, secondary text |
| outline-variant    | `#444444` | Subtle borders          |
| error              | `#ee7d77` | Errors                  |
| tertiary           | `#22c55e` | Success, active states  |

Fonts: `Space Grotesk` (headings), `Inter` (body), `JetBrains Mono` (code).

No border radius — sharp corners everywhere.

## Implementation Steps

Commit after each step. Push after each step.

### Step 1 — Scaffold

- Vite + React + TypeScript
- Tailwind CSS with the design system colors
- React Router
- TanStack Query (React Query)
- Prettier, husky, commitlint
- `.github/workflows/ci.yml` (build check)
- `index.html` with Google Fonts
- README.md

Verify: `pnpm build` succeeds, dev server shows empty page.

### Step 2 — Layout & Routing

- `Sidebar` component: navigation links, team selector, Wraith logo
- `Header` component: current page title, profile dropdown
- `PageLayout` wrapper
- React Router setup with all routes from `01-architecture.md`
- Protected route wrapper (redirects to `/login` if no token)

Verify: navigation works, sidebar highlights current page.

### Step 3 — Auth Pages

- `/login` — email/password form + Google OAuth button + GitHub OAuth button
- `/register` — same form with name field
- `/forgot-password` — email input
- `/reset-password` — new password form
- API client with JWT refresh logic from `01-architecture.md`
- Auth context/hook: `useAuth()` → `{ developer, login, logout, isLoading }`

Verify: register → login → see dashboard → logout → redirected to login.

### Step 4 — Overview Page

- Stats cards: requests today, active agents, current plan, API keys
- Recent activity feed (last 10 API calls)
- Quick action buttons: create agent, create API key, view docs

Verify: overview shows real data from gateway.

### Step 5 — API Keys Page

- Table: name, prefix, environment, last used, created date, actions
- Create key modal: name input, environment select (live/test) → shows full key ONCE with copy button
- Revoke key with confirmation
- Warning: "This key will only be shown once"

Verify: create key → copy → use in curl → revoke → key stops working.

### Step 6 — Usage Page

- Line chart: requests over time (daily/weekly/monthly toggle)
- Bar chart: requests by endpoint
- Table: per API key breakdown
- Token usage chart (AI tokens consumed)
- Date range picker
- Usage vs plan limit progress bar

Verify: usage data renders, charts update with date range.

### Step 7 — Billing Page

- Current plan card with features and limits
- Plan comparison: free vs pro vs enterprise
- Upgrade button → Stripe Checkout redirect
- Manage subscription → Stripe Customer Portal redirect
- Payment history from Stripe
- Usage meter showing % of plan consumed

Verify: upgrade flow works with Stripe test mode.

### Step 8 — Team Page

- Member list with roles (owner, admin, member)
- Invite modal: email input, role select
- Edit role dropdown
- Remove member with confirmation
- Team settings: name, slug

Verify: invite → member added → change role → remove.

### Step 9 — Agents & Webhooks Pages

- Agents list: name, chain, address, created date (from gateway which proxies to Spectre)
- Agent detail: info card, recent conversations, balance
- Webhooks: URL, events subscribed, active toggle, test button

Verify: agents list populated, webhook test delivers.

### Step 10 — Settings Page

- Profile: name, email, avatar
- Password change (current + new)
- Connected accounts (Google, GitHub — link/unlink)
- Danger zone: delete account

Verify: profile update persists, password change works.

## Final Structure

```
console/
  package.json
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
  postcss.config.js
  index.html
  .prettierrc
  .prettierignore
  commitlint.config.js
  .github/workflows/ci.yml
  README.md
  src/
    main.tsx
    App.tsx
    config.ts
    index.css
    api/
      client.ts
      auth.ts
      teams.ts
      keys.ts
      billing.ts
      usage.ts
      webhooks.ts
      agents.ts
    hooks/
      useAuth.ts
      useTeam.ts
      useUsage.ts
    components/
      layout/Sidebar.tsx
      layout/Header.tsx
      layout/PageLayout.tsx
      layout/ProtectedRoute.tsx
      auth/LoginForm.tsx
      auth/RegisterForm.tsx
      auth/OAuthButtons.tsx
      dashboard/StatsCard.tsx
      dashboard/UsageChart.tsx
      dashboard/RecentActivity.tsx
      keys/KeyList.tsx
      keys/CreateKeyModal.tsx
      billing/PlanCard.tsx
      billing/UsageMeter.tsx
      team/MemberList.tsx
      team/InviteModal.tsx
    pages/
      Overview.tsx
      Agents.tsx
      AgentDetail.tsx
      ApiKeys.tsx
      Usage.tsx
      Billing.tsx
      Team.tsx
      Webhooks.tsx
      Settings.tsx
      Login.tsx
      Register.tsx
      ForgotPassword.tsx
      ResetPassword.tsx
  reference/              # DO NOT MODIFY
```

## Rules

- NEVER add Co-Authored-By lines to commits
- NEVER commit, modify, or delete anything in the reference/ folder — it is gitignored and read-only
- NEVER add numbered step comments in code
- All commit messages MUST follow conventional commits format
- Commit and push after each completed step
- Use the exact design system colors — no other colors
- All API calls go through the gateway — never talk to Spectre directly
- Access tokens in memory only — never localStorage
- Show API keys in full ONLY on creation, then mask to prefix
