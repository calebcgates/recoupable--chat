# Behavioral Contracts Triage Report

**Date:** 2026-04-02
**Baseline Scan:** `cmnhoeh9z013miglmzfs768xt`
**Repo:** `cmnhn5av1000higlm9v98pqru`
**Branch:** `main`
**Baseline violations:** 238 (194 errors, 44 warnings)

---

## Triage Summary

| Label | Count |
|-------|-------|
| FALSE POSITIVES | 48 |
| BORDERLINE | 6 |
| TRUE POSITIVES (fixed) | 23 |

---

## Fixes Applied

### BATCH 1 — `ai` package (10 violations)

Wrapped `execute` bodies and `generateObject`/`generateText` calls in try-catch.

| File | Violation | Fix |
|------|-----------|-----|
| `lib/tools/artistDeepResearch.ts` | tool-execution-error | Wrapped execute in try-catch, returns `{ success: false, status: "error", message }` |
| `lib/tools/getVideoGameCampaignPlays.ts` | tool-execution-error | Wrapped execute in try-catch |
| `lib/tools/generateMermaidDiagram.ts` | tool-execution-error + api-error-rate-limit | Wrapped generateText in try-catch, returns `{ content: [{ type: "text", text: errorMessage }], isError: true }` |
| `lib/tools/scrapeInstagramComments.ts` | tool-execution-error | Wrapped execute in try-catch |
| `lib/tools/scrapeInstagramProfile.ts` | tool-execution-error | Wrapped execute in try-catch |
| `lib/tools/createSegments.ts` | tool-execution-error | Wrapped execute in try-catch |
| `app/api/prompts/suggestions/route.ts` | schema-validation-error | Wrapped generateObject in try-catch, returns `NextResponse.json({ error }, { status: 500 })` |
| `lib/catalog/analyzeCatalogBatch.ts` | schema-validation-error | Wrapped generateObject in try-catch, returns `[]` on error |
| `lib/ai/generateArray.ts` | schema-validation-error | Wrapped generateObject in try-catch, rethrows |

**Commit:** `1205238d` — `fix(bc): wrap ai package execute/generateObject calls in try-catch`

### BATCH 2 — `@tanstack/react-query` package (13 violations)

Added `error` fields to hook return values and `onError` handlers to mutations.

| File | Violation | Fix |
|------|-----------|-----|
| `hooks/useArtistSocials.ts` | missing error in return | Added `error` to return object |
| `hooks/usePulseToggle.ts` | missing error in return | Added `queryError` to return object |
| `components/Agents/useAgentData.ts` | missing error in return | Added `error` to return object |
| `hooks/useArtistFromRoom.ts` | missing error handling | Added useEffect to log query errors |
| `hooks/useFilesManager.ts` (query) | missing error in return | Added `error` to return object |
| `hooks/useApiKey.ts` | missing queryError in return | Added `queryError` to return object and interface |
| `hooks/useConversations.tsx` | missing error in return | Added `error` to return object |
| `hooks/useDeleteChat.ts` | missing onError + error | Added `onError: console.error`, exposed `error` in return |
| `components/.../YoutubeLogoutButton.tsx` | missing onError | Added `onError: () => toast.error("Failed to disconnect YouTube")`, imported toast |
| `components/Agents/CreateAgentDialog.tsx` | missing onError | Added `onError: (error) => toast.error(...)`, imported toast |
| `components/Agents/AgentEditDialog.tsx` | missing onError | Added `onError: (error) => toast.error(...)`, imported toast |
| `components/Agents/AgentDeleteButton.tsx` | missing onError | Added `onError: () => toast.error("Failed to delete agent")`, imported toast |
| `hooks/useFilesManager.ts` (mutation) | missing onError | Added `onError: console.error`, exposed `createFolderIsError`/`createFolderError` in return |

**Commit:** `236a5b21` — `fix(bc): add error handling to react-query hooks and mutations`

---

## Labels Pushed to Dashboard

All 77 violations (48 false positives + 6 borderline + 23 true positives) were labeled during triage (prior session) before this fix session began.

### Dashboard Violation IDs — BATCH 1
- `cmnhoes3w014liglmloxrslrw` — artistDeepResearch
- `cmnhoes3x0152iglm1q5bdn3x` — getVideoGameCampaignPlays
- `cmnhoes3w014piglmyvkgo4i2` — generateMermaidDiagram (tool-execution-error)
- `cmnhoes3w014qiglmak3hh57b` — generateMermaidDiagram (api-error-rate-limit)
- `cmnhoes3x0151iglmpxnt9hdc` — scrapeInstagramComments
- `cmnhoes3x0150iglm42t3ijix` — scrapeInstagramProfile
- `cmnhoes3w014niglm05ha7bt1` — createSegments
- `cmnhoes3w013piglmzat3sosp` — prompts/suggestions route
- `cmnhoes3w014kiglmq2a7xpj0` — analyzeCatalogBatch
- `cmnhoes3w013qiglmc29wdg3m` — generateArray

### Dashboard Violation IDs — BATCH 2
- `cmnhoes3w0143iglmva6mu1fu` — useArtistSocials
- `cmnhoes3w014ciglm1vhxqkxq` — usePulseToggle
- `cmnhoes3w013riglmjkgjwnde` — useAgentData
- `cmnhoes3w013yiglm8evwsejm` — useArtistFromRoom
- `cmnhoes3w013wiglm51w2sv2w` — useFilesManager (query)
- `cmnhoes3w013tiglm6wh8u7vc` — useApiKey
- `cmnhoes3x015siglm644oemkq` — useConversations
- `cmnhoes3w0149iglmc9z7ty0f` — useDeleteChat
- `cmnhoes3x015piglmu96z5h69` — YoutubeLogoutButton
- `cmnhoes3x015oiglmkhn9p7wo` — CreateAgentDialog
- `cmnhoes3x015niglmjm71btpm` — AgentEditDialog
- `cmnhoes3x015miglmsukq3pd5` — AgentDeleteButton
- `cmnhoes3w013xiglm0mxtrkt3` — useFilesManager (mutation)

---

## Notes

- The dev server at `localhost:3000` was not running during this session, so cloud scan triggering and `resolve_violation` API calls could not be completed automatically. Run these manually once the server is up:
  1. `POST /api/mcp` with `trigger_scan` to kick off a verification scan
  2. `POST /api/mcp` with `resolve_violation` for each violation ID above, with appropriate `resolutionDetail`
