# Behavioral Contracts Triage Report
**Repository:** calebcgates/recoupable--chat
**Branch:** main @ 2cb059e6
**Scan ID:** cmnhxg9bu00f3heyravdcee1a → cmnhxlcvp00v3heyrdcpb7lek
**Date:** 2026-04-02

---

## Summary

| Package | Violations | Verdict | Action |
|---------|-----------|---------|--------|
| `@tanstack/react-query` | 4 | ❌ FALSE POSITIVE | Suppressed via `.bc-suppressions.json` |
| `react-hook-form` | 2 | ❌ FALSE POSITIVE | Suppressed via `.bc-suppressions.json` |
| **Total active** | **6** | All FP | 0 actionable |

**Cumulative across all sessions:**
- 23 true positives fixed in prior sessions (committed, resolved on dashboard)
- 6 confirmed false positives — all labeled on dashboard and suppressed via `.bc-suppressions.json`
- 0 actionable violations remain

---

## @tanstack/react-query — 4 FALSE POSITIVES

### What the scanner found
`query-error-unhandled` fired on 4 `useQuery()` call sites, citing "No try-catch block found."

### Why these are false positives
React Query's error model does not use try-catch. Errors thrown from `queryFn` are caught internally by React Query and surfaced through the `error` and `isError` return values. Wrapping `useQuery()` in a try-catch is neither idiomatic nor correct — it would never catch an error because React Query manages the async execution internally.

All 4 sites either:
- Destructure `error` (available for downstream consumption)
- Destructure `isError` + `error` and handle explicitly in a `useEffect` (app/access/page.tsx)
- Return a fallback value (`[]`) instead of throwing on failure (FileInfoDialog.tsx)

### Affected files

| File | Line | Error handling present |
|------|------|----------------------|
| `components/Agents/AgentCreator.tsx` | 21 | `error` destructured |
| `app/access/page.tsx` | 28 | `isError` + `error` destructured; useEffect calls `toast.error()` + `console.error()` |
| `components/TasksPage/TasksList.tsx` | 30 | `error` destructured |
| `components/Files/FileInfoDialog.tsx` | 41 | `queryFn` returns `[]` on failure; `error` destructured |

### Scanner/corpus issue
The `@tanstack/react-query` corpus contract applies a `try-catch` postcondition to `useQuery`. This is incorrect for React Query: the idiomatic error boundary is the `error` return value, not a wrapping try-catch. The contract should either:
1. Recognize `error`/`isError` destructuring as satisfying `query-error-unhandled`
2. Not apply `missing-try-catch` semantics to React Query hooks at all

---

## react-hook-form — 2 FALSE POSITIVES

### What the scanner found
`missing-form-provider` fired on 2 `useFormContext()` call sites, citing risk of TypeError when called outside a `<FormProvider>`.

### Why these are false positives
`useFormContext()` **must** be called unconditionally per React's Rules of Hooks — conditional hook calls are a hard error. Both components are intentionally designed to work with or without a `<FormProvider>`:

```tsx
// ArtistInstructionTextArea.tsx:34 and Input.tsx:38 — identical pattern
const formContext = useFormContext();
const isFullyHooked = name && hookToForm && formContext; // null guard

// All usage gated:
if (name && hookToForm && formContext) {
  formContext.setValue(name, value);
}
```

`hookToForm` defaults to `false`, so in the common case `formContext` is never accessed even if `null`. No crash path exists.

### Scanner/corpus issue
The `react-hook-form` corpus contract should recognize the pattern of calling `useFormContext()` unconditionally (required by Rules of Hooks) followed by null-guarding all usage. The contract currently flags the unconditional call without tracing whether the result is actually accessed unsafely.

---

## Suppression audit trail

All 6 violations are recorded in `.bc-suppressions.json` at the repo root with full fingerprints and reasons. This file is commit-tracked and visible in PR diffs. The 6 violations are also labeled `false_positive` on the dashboard.

---

## Scanner/Corpus Improvement Opportunities

| Issue | Package | Occurrences |
|-------|---------|-------------|
| `query-error-unhandled` fires on `useQuery`/`useMutation`; contract should recognize `error`/`isError` return values as the error boundary | `@tanstack/react-query` | 4 |
| verify-cli does not trace `error` state usage from useQuery destructuring into downstream useEffect callbacks | `@tanstack/react-query` | 1 (app/access/page.tsx) |
| `missing-form-provider` fires on unconditional `useFormContext()` call even when all usage is null-guarded | `react-hook-form` | 2 |

---

## What Was Sent to the Dashboard

| Action | Count | Package |
|--------|-------|---------|
| `FALSE_POSITIVE` label | 6 | @tanstack/react-query (4), react-hook-form (2) |
| `add_violation_note` (scanner improvement notes) | 6 | All violations |

---

## Session history across all runs

| Session | Commits | TPs fixed | FPs identified | Remaining |
|---------|---------|-----------|---------------|-----------|
| Session 1 | a891b689 | ~20 (ai pkg + react-query mutations) | 0 | ~14 |
| Session 2 | 98d421c5 | 3 (supporting useQuery calls) | 6 | 8 |
| Session 3 (this) | 2cb059e6 | 0 (all remaining were FP) | 6 | 0 active |

---

*Generated by Behavioral Contracts bc-fix workflow · Scan cmnhxg9bu00f3heyravdcee1a → cmnhxlcvp00v3heyrdcpb7lek*
