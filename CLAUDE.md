# Streamjacking Evaluator — CLAUDE.md

A Next.js labeling tool for human reviewers to validate streamjacking detection results stored in MongoDB.

## Commands

```bash
pnpm dev           # Start dev server
pnpm build         # Production build
pnpm lint          # ESLint
pnpm seed:reviewer <username> <password> [display_name]  # Create reviewer account
```

Always use `pnpm`, never `npm` or `yarn`.

## Stack

- **Next.js 16** (App Router), TypeScript, pnpm
- **Mongoose** (`strict: false`) — connects to an existing MongoDB collection, does NOT own schema
- **JWT auth** via `jose`, passwords via `bcryptjs`
- **shadcn/ui** + Tailwind CSS v4
- **SWR** for client-side data fetching
- **Sonner** for toasts — do NOT use the deprecated shadcn toast component

## Environment Variables

```
MONGODB_URI
MONGODB_DB_NAME
MONGODB_COLLECTION_NAME   # defaults to detected_videos
JWT_SECRET
JWT_EXPIRES_IN
```

## Project Structure

```
src/
  app/
    (auth)/login/         # Login page (unauthenticated)
    api/
      auth/login/         # POST — issues sj_token cookie
      auth/logout/        # POST — clears sj_token cookie
      videos/             # GET — paginated list with $facet stats
      videos/[videoId]/   # GET — single video
      videos/[videoId]/label/  # PATCH — write label + reasoning
    dashboard/            # Video list with filters/pagination (DashboardClient.tsx)
    videos/[videoId]/     # Video detail with YouTube embed, prev/next nav
  components/
    ui/                   # shadcn primitives
    shared/               # RiskBadge, LabelBadge, Header
    dashboard/            # StatsBar, FilterBar, VideoTable, PaginationControls
    video/                # VideoEmbed, LabelForm, MetadataCard
  lib/
    mongoose.ts           # Singleton connection (cached on globalThis)
    models/Video.ts       # Mongoose model, strict: false
    models/Reviewer.ts    # Reviewer accounts model
    constants.ts          # PAGE_SIZE, LABELS, RISK_CATEGORIES, color maps
    types.ts              # Shared TypeScript types
  middleware.ts           # JWT cookie check — protects /dashboard, /videos, /api/videos
  hooks/useVideos.ts      # SWR hook for paginated video list
```

## Auth

- Cookie name: `sj_token` (HttpOnly)
- JWT payload: `sub` = username, `name` = display name
- Middleware injects `x-reviewer-username` and `x-reviewer-name` headers for API routes
- Reviewer accounts live in the `reviewers` collection in the same MongoDB database

## MongoDB Document Shape

The collection (`detected_videos` by default) is externally owned — Mongoose uses `strict: false`. Key fields:

- `video_id`, `video_title`, `video_url`, `video_description`
- `channel_id`, `channel_title`, `channel_url`, `channel_description`, `channel_risk_score`, `channel_signals`
- `risk_category`: `"LOW" | "MEDIUM" | "HIGH"`
- `confidence_score`, `total_risk_score`, `video_risk_score`
- `ground_truth_label`: `"true_positive" | "false_positive" | "true_negative" | "false_negative" | null`
- `validation`: `{ label, reviewer, reviewed_at }` — written by the label API
- `validation_reasoning`, `validated_at`
- `is_live`, `is_active`, `detected_at`, `first_detected`, `search_query`, `scam_type`

## Label Values

| Value | Meaning |
|---|---|
| `true_positive` | Correctly flagged — real streamjacking |
| `false_positive` | Incorrectly flagged — not a streamjacking |
| `true_negative` | Correctly cleared — legitimate content |
| `false_negative` | Missed scam — should have been flagged |

## UI Conventions

- shadcn/slate palette, clean and minimal
- Risk badges: green (LOW), yellow (MEDIUM), red (HIGH)
- Label badges: TP=red, FP=orange, TN=green, FN=purple
- Dashboard: filter by status (unlabeled/labeled/all), risk category, sort, free-text search — all state lives in URL search params
- Video detail: YouTube iframe embed, prev/next unlabeled navigation, auto-advances after labeling
- Page size: 25 videos per page
