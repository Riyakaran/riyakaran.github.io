# Comprehensive Project Review — Riya Karan Portfolio Site

**Reviewed:** 9 August 2026
**Commit:** `b016566` ("digital twin chat"), branch `feature/AIchatDigitalTwin`
**Stack:** Next.js 16.3.0 (App Router, Turbopack) · React 19.2.8 · TypeScript 5 · Tailwind CSS 4 · OpenRouter (`poolside/laguna-s-2.1:free`)
**Scope:** Full source tree (`src/`, config, git history, build output, accessibility, security, deployment readiness)

> **No source code was modified during this review.** All checks were read-only, except `npx next build`, which regenerated the gitignored `.next/` build artifact. Every remediation below is a *proposal* with a code sketch — none of it has been applied.

---

## 1. Executive Summary

The project is in **good structural health**. It typechecks, lints, and builds cleanly with zero errors or warnings, the architecture is sensible (single typed data source feeding presentational components), and the highest-risk thing in the repo — the OpenRouter API key — was handled correctly and **never entered git history**.

The gaps are almost entirely in the transition from *"works on my laptop"* to *"safe to put on the internet."* Three findings need attention before this is deployed publicly, and one of them (the phone number) directly contradicts a decision you made earlier in the build.

### Severity summary

| Severity | Count | Findings |
|---|---|---|
| 🔴 **Critical** | 0 | — |
| 🟠 **High** | 3 | SEC-01, PRIV-01, A11Y-01 |
| 🟡 **Medium** | 15 | SEC-02/03, PRIV-03, LLM-01/02/03, REL-01/02/03, A11Y-02/03/04, SEO-01, CODE-01, TEST-01 |
| 🔵 **Low** | 14 | See §5 |
| ⚪ **Info / Verify** | 2 | SEC-05, INFO-01 |

### Verified-healthy baseline

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ exit 0, no errors |
| ESLint | `npx eslint .` | ✅ exit 0, no warnings |
| Production build | `npx next build` | ✅ compiled in 2.1s, 5/5 static pages generated |
| Secret in git history | `git log --all -- .env`, `git grep sk-or-v1 $(git rev-list --all)` | ✅ **zero matches — key never committed** |
| `.env` tracked? | `git ls-files --error-unmatch .env` | ✅ untracked, correctly gitignored |
| Route topology | build output | ✅ `/` static (○), `/api/chat` dynamic (ƒ) — correct |

---

## 2. High-Severity Findings

### 🟠 SEC-01 — `/api/chat` is an unauthenticated, unmetered LLM proxy

**Location:** `src/app/api/chat/route.ts:31`

Anyone who discovers the endpoint can POST to it without limit. There is no rate limit, no origin check, no bot protection, and no per-session budget. Each request costs a call to OpenRouter under **your** API key.

The payload validation that *does* exist is good — `MAX_HISTORY = 20` and `MAX_MESSAGE_LENGTH = 4000` cap the size of any *single* request. What's missing is a cap on the *number* of requests.

**Why it matters:** Today the model is free-tier, so the immediate financial exposure is zero. But free tiers carry per-account quotas — a trivial script hitting this endpoint in a loop would exhaust your quota and take the chat down for real visitors. If the model is ever swapped for a paid one (a one-line change at `route.ts:7`), the same script becomes a direct bill.

**Remedial action — add an origin check and a per-IP rate limit:**

```ts
// PROPOSED — not applied. Sketch for src/app/api/chat/route.ts

// 1. Reject cross-origin abuse cheaply, before any upstream call
const origin = req.headers.get("origin");
const allowed = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
if (origin && origin !== allowed) {
  return Response.json({ error: "Forbidden." }, { status: 403 });
}

// 2. Simple in-memory token bucket (fine for a single instance;
//    use Upstash Redis / Vercel KV if you deploy to serverless with many instances)
const BUCKET = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 15;            // requests
const WINDOW_MS = 60_000;    // per minute

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = BUCKET.get(ip);
  if (!entry || now > entry.resetAt) {
    BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
if (!rateLimit(ip)) {
  return Response.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
}
```

> ⚠️ An in-memory `Map` resets on every cold start and isn't shared across serverless instances. On Vercel, prefer `@upstash/ratelimit` backed by Redis. The in-memory version is still far better than nothing.

---

### 🟠 PRIV-01 — Your phone number is publicly downloadable, contradicting an explicit earlier decision

**Location:** `public/riya-karan-resume.pdf`, linked from `Nav.tsx:43`, `Nav.tsx:80`, `Contact.tsx:42`

Earlier in this build you were asked whether to display your phone number on the site and chose **"Email + LinkedIn only"** — and the rendered HTML honours that correctly. However, the resume PDF served at `/riya-karan-resume.pdf` contains the full contact block from your original resume, including `Contact: 9531503964`. It is linked from three places and is one click from any visitor.

**Verification note:** Automated text extraction returned false negatives here because the PDF encodes all text as hex-encoded glyph IDs from subset fonts (5,417 hex `Tj` operators, 0 plaintext string operators), so `grep`-style searching cannot see it. The number's presence is confirmed by the resume's own contact block as read at the start of this project. **Please eyeball the PDF yourself to confirm before acting.**

The same file is also committed to git *twice* — at `public/riya-karan-resume.pdf` and `Riya_Karan_TPM_Resume.pdf` — so if the GitHub repo is public, the number is exposed there independently of the website.

**Remedial options (pick one):**

1. **Publish a redacted PDF** *(recommended)* — export a web variant of your resume with the phone line removed, and keep the full version for direct applications:
   ```
   public/riya-karan-resume.pdf   ← web version, phone removed
   ```
2. **Gate the download** — swap the direct link for a "request resume" mailto or form.
3. **Accept it** — many people do list a phone on a public resume. This is a legitimate choice; the finding is only that it's currently *inconsistent* with the choice you made.

Regardless of which you pick, also remove the duplicate at the repo root (see CODE-05).

---

### 🟠 A11Y-01 — The Digital Twin chat is unusable with a screen reader

**Location:** `src/components/DigitalTwinChat.tsx:121-215`

The flagship feature has no accessibility semantics:

| Missing | Consequence |
|---|---|
| `role="dialog"` / `aria-modal="true"` | Assistive tech doesn't announce that a dialog opened |
| Focus trap | Tab key escapes the open panel into the page behind it |
| Focus restoration on close | Focus is lost to `<body>`; keyboard users must tab from the top again |
| `aria-live` region | **Streaming responses are never announced** — a screen-reader user gets silence |
| `aria-hidden` on `✕` glyph | Read aloud as "multiplication x" |

Credit where due: `Escape`-to-close **is** implemented (`DigitalTwinChat.tsx:34-40`), and the launcher button has a proper `aria-label`. The foundation is there.

**Remedial action:**

```tsx
// PROPOSED — not applied. Sketch for src/components/DigitalTwinChat.tsx

const launcherRef = useRef<HTMLButtonElement>(null);
const panelRef = useRef<HTMLDivElement>(null);

// Restore focus to the launcher when the panel closes
useEffect(() => {
  if (!open) launcherRef.current?.focus();
}, [open]);

<div
  ref={panelRef}
  role="dialog"
  aria-modal="true"
  aria-label="Chat with Riya Karan's Digital Twin"
  className="fixed inset-x-4 bottom-24 ..."
>
  {/* Announce streamed replies politely as they arrive */}
  <div ref={scrollRef} aria-live="polite" aria-atomic="false" className="flex-1 ...">
    {/* ...messages... */}
  </div>

  <button aria-label="Close chat" onClick={() => setOpen(false)}>
    <span aria-hidden="true">✕</span>
  </button>
</div>
```

For the focus trap, `focus-trap-react` is the low-effort route; a hand-rolled version needs a `keydown` handler cycling `Tab`/`Shift+Tab` across the panel's focusable children.

---

## 3. Medium-Severity Findings

### 🟡 SEC-02 — API key hygiene and rotation

**Location:** `.env`

Handled correctly for local development — gitignored, never committed (verified). Two residual concerns:

- The key has been **transmitted in plaintext through a chat session** and sits unencrypted in your working directory. Anyone who obtains the folder (backup, zip, screen share) obtains the key.
- There's no documented process for provisioning it in a deploy environment.

**Remedial action:** Rotate the key at `openrouter.ai/keys` before going to production, set a **spend limit** on the new key, and store it as an encrypted environment variable in your host (Vercel → Project Settings → Environment Variables). Never place it in `NEXT_PUBLIC_*`, which would ship it to the browser.

---

### 🟡 SEC-03 — Upstream error bodies are echoed to the client

**Location:** `src/app/api/chat/route.ts:76-82`

```ts
const errorText = await upstream.text().catch(() => "");
return Response.json(
  { error: `Digital Twin is unavailable right now (${upstream.status}).`, detail: errorText },
  { status: 502 },
);
```

`detail` forwards OpenRouter's raw error body to the browser, which can disclose account state, quota details, or internal identifiers.

**Remedial action:** Log the detail server-side; return only the friendly message.

```ts
// PROPOSED — not applied
console.error("[chat] upstream failure", upstream.status, errorText);
return Response.json(
  { error: "Digital Twin is unavailable right now. Please try again shortly." },
  { status: 502 },
);
```

---

### 🟡 PRIV-03 — No disclosure that chat messages go to a third party

**Location:** `src/components/DigitalTwinChat.tsx:128-130`

The panel header says *"AI · grounded in her real resume"*, which is honest about it being AI but doesn't say that whatever a visitor types is transmitted to OpenRouter and its upstream provider (Poolside), where it may be retained under their policies. For a public-facing site this is a reasonable expectation to set, and in some jurisdictions a required one.

**Remedial action:** Add one line of microcopy under the input, e.g. *"Messages are processed by a third-party AI provider. Don't share sensitive information."* — plus a link to a short `/privacy` page if you want to be thorough.

---

### 🟡 LLM-01 — Prompt-injection and persona-escape exposure

**Location:** `src/data/resume.ts:160-205`, `src/app/api/chat/route.ts:69-72`

The system prompt is the *only* guardrail. It's well-written (explicit grounding, boundaries, formatting rules, and an instruction never to reveal itself), but system prompts are guidance, not enforcement. A determined visitor can attempt `ignore previous instructions`, role-play framing, or encoding tricks to make the twin — which speaks in the first person **as you** — say something you didn't authorise.

**Mitigating factor:** the prompt contains nothing confidential (it's your public resume), so extraction is embarrassing rather than damaging. That's a good design property already.

**Remedial action:** Accept the residual risk but reduce blast radius — keep anything genuinely private out of the prompt (already true), and consider a lightweight output check that refuses replies matching obvious escape patterns before they render.

---

### 🟡 LLM-02 — First-person AI claims are a reputational surface

**Location:** `src/components/DigitalTwinChat.tsx:126-130`

The twin says "I" while representing a real, named professional to recruiters. A hallucinated salary expectation, availability date, or inflated metric is attributable to *you*. Grounding plus the "grounded in her real resume" label mitigates this well; there is no logging, so you'd never know if it happened.

**Remedial action:** Add minimal server-side logging of `(timestamp, question, answer)` to a file or lightweight store, so you can audit what your twin has been telling people. Pair with the privacy notice in PRIV-03.

---

### 🟡 LLM-03 / REL-03 — No upstream timeout and no model fallback

**Location:** `src/app/api/chat/route.ts:58`

```ts
const upstream = await fetch(OPENROUTER_URL, { /* no signal, no timeout */ });
```

If OpenRouter stalls, this `await` never resolves — the route hangs, the client spinner spins forever, and a serverless function burns its full execution budget. The chosen model is also a single point of failure: `:free` tiers rate-limit, queue, and are occasionally retired, with no fallback configured.

**Remedial action:**

```ts
// PROPOSED — not applied
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30_000);
try {
  const upstream = await fetch(OPENROUTER_URL, { /* ... */, signal: controller.signal });
  // ...
} finally {
  clearTimeout(timeout);
}
```

For fallback, OpenRouter accepts a `models` array and routes to the first available:

```ts
body: JSON.stringify({
  models: ["poolside/laguna-s-2.1:free", "meta-llama/llama-3.3-70b-instruct:free"],
  stream: true,
  messages: [/* ... */],
})
```

---

### 🟡 REL-01 — Client never aborts an in-flight stream

**Location:** `src/components/DigitalTwinChat.tsx:42-102`

`sendMessage` has no `AbortController`. Consequences:

- Closing the panel mid-response doesn't stop the request; tokens keep streaming into state nobody is looking at.
- If the component unmounts mid-stream, `setMessages` fires on an unmounted component.
- There is no user-facing **"stop generating"** control.

**Remedial action:**

```tsx
// PROPOSED — not applied
const abortRef = useRef<AbortController | null>(null);

async function sendMessage(text: string) {
  abortRef.current?.abort();          // cancel any previous stream
  const controller = new AbortController();
  abortRef.current = controller;

  const res = await fetch("/api/chat", { /* ... */, signal: controller.signal });
  // ...
}

// Abort on unmount
useEffect(() => () => abortRef.current?.abort(), []);
```

Then wire a "Stop" button to `abortRef.current?.abort()` while `streaming` is true, and swallow `AbortError` in the `catch` so cancellation isn't shown as a failure.

---

### 🟡 REL-02 — Server stream has no `cancel()` handler

**Location:** `src/app/api/chat/route.ts:88-124`

The `ReadableStream` implements `start()` but not `cancel()`. When a browser disconnects, the route keeps pulling from OpenRouter to completion — consuming quota for output nobody receives, and leaving the upstream reader unreleased.

**Remedial action:**

```ts
// PROPOSED — not applied
const stream = new ReadableStream<Uint8Array>({
  async start(controller) { /* ...existing loop... */ },
  async cancel(reason) {
    console.warn("[chat] client disconnected:", reason);
    await reader.cancel().catch(() => {});
  },
});
```

---

### 🟡 A11Y-02 — `text-muted` fails WCAG AA contrast

Measured against the palette in `src/app/globals.css` (WCAG 2.1 relative-luminance formula):

| Foreground | Background | Ratio | AA (4.5:1) |
|---|---|---|---|
| `--muted #75767f` | `--ink #09090b` | **4.41:1** | ❌ fail |
| `--muted #75767f` | `--ink-card #131418` | **4.08:1** | ❌ fail |
| `--muted #75767f` | `--ink-raised #0f1013` | **4.22:1** | ❌ fail |
| `--paper-dim #a8a9b3` | `--ink` | 8.52:1 | ✅ pass |
| `--paper #f3f2ec` | `--ink` | 17.74:1 | ✅ pass |
| `--accent #d6ff3f` | `--ink` | 17.28:1 | ✅ pass |

`text-muted` is used at `text-xs` — i.e. small text, where the 4.5:1 threshold applies strictly. Affected: the footer (`Contact.tsx:50`), timeline role/context lines (`Journey.tsx:44`), the chat subtitle (`DigitalTwinChat.tsx:128`), and skills/education metadata.

**Remedial action:** Lighten `--muted` from `#75767f` to approximately **`#8b8c95`** (≈5.6:1 on ink), which clears AA on all three surfaces while staying visually recessive.

---

### 🟡 A11Y-03 — Borders fail non-text contrast; focus indicator is weak

**Location:** `src/app/globals.css` (`--line-strong: #34363d`), `src/components/DigitalTwinChat.tsx:204`

`--line-strong` on `--ink` measures **1.65:1**, well under the 3:1 required by WCAG 1.4.11 for meaningful UI boundaries. This matters most on the chat input, whose focus state is `focus:outline-none` replaced by a border-colour change — so for a keyboard user the focus indicator is a low-contrast border swap.

**Remedial action:** Keep `--line-strong` for decorative dividers, but give interactive controls a real focus ring:

```tsx
// PROPOSED — not applied
className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
```

Apply to the chat input, Send button, launcher, nav links, and outline buttons. This is a bigger real-world win than the border colour itself.

---

### 🟡 A11Y-04 — Nav hamburger missing state semantics

**Location:** `src/components/Nav.tsx:52-65`

The toggle has `aria-label="Toggle menu"` but no `aria-expanded`, so assistive tech can't tell whether the menu is open. The mobile menu also has no `Escape` handler (unlike the chat panel, which does).

**Remedial action:**

```tsx
// PROPOSED — not applied
<button
  type="button"
  aria-label="Toggle menu"
  aria-expanded={open}
  aria-controls="mobile-menu"
  onClick={() => setOpen((v) => !v)}
>
```

…and give the menu container `id="mobile-menu"`.

---

### 🟡 SEO-01 — No Open Graph / Twitter metadata

**Location:** `src/app/layout.tsx:15-19`

Current metadata is a solid `title` + `description` — but there's no `metadataBase`, no `openGraph`, no `twitter` card, and no OG image. When you share this link on LinkedIn (your primary professional channel), X, or WhatsApp, it renders as a bare URL with no preview card.

For a personal-brand site this is the **highest-leverage marketing gap in the project** and among the cheapest to fix.

**Remedial action:**

```ts
// PROPOSED — not applied. src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Riya Karan — Technical Product Owner / Scrum Master",
  description: "CSPO-certified Technical Product Owner...",
  openGraph: {
    type: "profile",
    title: "Riya Karan — Technical Product Owner / Scrum Master",
    description: "Driving OKR-aligned roadmaps across B2B enterprise and BFSI platforms.",
    url: "/",
    siteName: "Riya Karan",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Riya Karan" }],
  },
  twitter: { card: "summary_large_image", title: "Riya Karan", images: ["/og.png"] },
};
```

Next.js can also generate the image at build time via `src/app/opengraph-image.tsx` if you'd rather not design a static PNG.

---

### 🟡 CODE-01 — `DigitalTwinChat.tsx` mixes three responsibilities

**Location:** `src/components/DigitalTwinChat.tsx` (218 lines)

One component owns transport (`fetch`), stream decoding (`getReader`/`TextDecoder` loop), error mapping, and all presentation. It works and is readable today, but the networking logic can't be tested or reused without rendering the UI.

**Remedial action:** Extract a `useChatStream()` hook exposing `{ messages, streaming, send, stop }`, leaving the component to render only. This also makes REL-01's abort logic and TEST-01's unit tests natural to add.

---

### 🟡 TEST-01 — Zero automated tests

No test files exist anywhere in the repo. The riskiest untested code is the **hand-rolled SSE parser** at `route.ts:88-124` — buffer splitting, partial-line carry-over (`buffer = lines.pop() ?? ""`), `[DONE]` detection, and malformed-chunk tolerance. All of that is exactly the kind of logic that breaks subtly under real network conditions, and today nothing would catch a regression.

**Remedial action:** Add Vitest and cover the pure logic first — highest value per minute spent:

```ts
// PROPOSED — not applied. Example: isValidHistory
expect(isValidHistory([{ role: "user", content: "hi" }])).toBe(true);
expect(isValidHistory([{ role: "system", content: "x" }])).toBe(false);
expect(isValidHistory([{ role: "user", content: "" }])).toBe(false);
expect(isValidHistory("not an array")).toBe(false);
```

Then extract the SSE parser into a pure function so it can be fed synthetic chunk sequences — including a chunk deliberately split mid-JSON — and assert the reassembled output.

---

## 4. Release-Gate Checklist

Before this goes to a public URL, these must be resolved:

- [ ] **SEC-01** — rate limiting live on `/api/chat`
- [ ] **SEC-02** — key rotated, spend limit set, provisioned as a host secret
- [ ] **PRIV-01** — phone decision made and PDF aligned
- [ ] **CODE-02** — `HTTP-Referer` no longer hardcoded to `localhost:3000` (`route.ts:63`)
- [ ] **REL-05** — verify streaming isn't buffered by your host's proxy (see below)
- [ ] **INFO-01** — confirm GitHub repo visibility (`gh` was not installed, so this could not be verified)
- [ ] `NEXT_PUBLIC_SITE_URL` set in the deploy environment

---

## 5. Low-Severity Findings

| ID | Location | Finding | Remedial action |
|---|---|---|---|
| **CODE-02** | `route.ts:63` | `HTTP-Referer` hardcoded to `http://localhost:3000` | Read from `process.env.NEXT_PUBLIC_SITE_URL` with a localhost fallback |
| **REL-04** | `Contact.tsx:4` | `new Date().getFullYear()` runs at **build time** (`/` is statically prerendered — confirmed in build output), so the copyright year freezes until the next rebuild | Move to a client component, or accept and rebuild annually |
| **REL-05** | `route.ts:126-131` | No `X-Accel-Buffering: no` header — some reverse proxies (nginx, certain hosts) buffer `text/plain`, silently killing the typing effect | Add the header; verify streaming on the real host after deploy |
| **REL-06** | `DigitalTwinChat.tsx:20` | Chat history lost on refresh | Persist `messages` to `sessionStorage`, restore on mount |
| **REL-07** | `DigitalTwinChat.tsx:166` | `key={i}` index keys on the message list | Benign (append-only list), but prefer a stable generated `id` |
| **LLM-04** | `route.ts:69-72` | Full resume system prompt resent on every turn — token waste that grows with conversation length | Acceptable now; revisit if you move to a paid model |
| **LLM-05** | `route.ts` | No logging of questions/answers | Pairs with LLM-02; add lightweight audit logging |
| **A11Y-05** | Multiple | Decorative glyphs (`✕ ↓ ↗ → /`) are announced by screen readers | Wrap in `<span aria-hidden="true">` |
| **A11Y-06** | `layout.tsx` | No skip-to-content link | Add a visually-hidden skip link as the first focusable element |
| **SEO-02** | `src/app/favicon.ico` | Still the default Next.js favicon (verified: 16x16/32x32 MS icon from scaffold) | Replace with a personal mark |
| **SEO-03** | — | No `robots.txt` or `sitemap.xml` | Add `src/app/robots.ts` and `src/app/sitemap.ts` |
| **SEO-04** | — | No JSON-LD `Person` structured data | Cheap win for name-search results |
| **SEC-04** | `next.config.ts` | No security headers (CSP, `X-Frame-Options`, `Referrer-Policy`) | Add a `headers()` block |
| **CODE-03** | — | No boot-time env validation; model name and limits are inline magic values | Validate `OPENROUTER_API_KEY` at startup; centralise config |
| **CODE-04** | — | No custom `error.tsx` / `not-found.tsx` | Add branded error and 404 pages |
| **TEST-02** | — | No CI workflow | Add GitHub Actions running `tsc --noEmit`, `eslint`, `next build` on push |
| **TEST-03** | `package.json` | No Prettier config or `format` script; `lint` script is bare `eslint` | Add Prettier + `eslint --max-warnings 0` |

### ⚪ Info / Verify

| ID | Finding |
|---|---|
| **SEC-05** | `.claude/settings.local.json` is committed to git. It's local tooling config (tool-permission allowlist, no secrets) and conventionally shouldn't be tracked. Add to `.gitignore` and `git rm --cached` it. |
| **INFO-01** | **Repo visibility could not be verified** — `gh` CLI is not installed. If `github.com/Riyakaran/Site` is public, everything committed (including both copies of the resume PDF) is publicly readable. Please confirm. |
| **CODE-05** | Scaffold leftovers: default `create-next-app` `README.md`, `AGENTS.md`/`CLAUDE.md`, and a duplicate resume at the repo root (`Riya_Karan_TPM_Resume.pdf`, byte-identical to the one in `public/`). Housekeeping only. |

---

## 6. What's Done Well

Worth stating explicitly, because these are the things that are easy to get wrong and were got right:

- **Secret handling.** The key is server-side only, read via `process.env` inside a route handler, never exposed to the browser, never committed. Verified across all branches and all history.
- **Correct client/server split.** Only `Nav` and `DigitalTwinChat` carry `"use client"`; everything else renders on the server. The homepage is fully static and the API route correctly dynamic — visible in the build output.
- **Single source of truth for content.** `src/data/resume.ts` feeds every component *and* the AI system prompt. Updating your resume is a one-file edit, and the twin can never drift out of sync with the visible site — a genuinely elegant design decision.
- **Input validation at the trust boundary.** `isValidHistory` is a proper type guard starting from `unknown`, with length and role checks and explicit caps. Most hobby projects skip this entirely.
- **Streaming implemented properly.** Correct incremental `TextDecoder` usage with `{ stream: true }`, partial-line buffering across chunk boundaries, and `try`/`catch` tolerance for malformed SSE frames.
- **`prefers-reduced-motion` respected.** `globals.css:104-114` disables all animations for users who ask for it — a genuinely commonly-missed accessibility courtesy.
- **Escape-to-close on the chat panel**, with listener cleanup on unmount.
- **Design system discipline.** Colours defined once as CSS custom properties, exposed through `@theme inline` as Tailwind tokens, used consistently. Retheming is a four-line change.
- **Clean toolchain.** Typecheck, lint, and build all pass with zero errors *and* zero warnings.

---

## 7. Suggested Remediation Order

**Phase 1 — before any public deployment**
1. SEC-01 rate limiting · 2. PRIV-01 phone decision · 3. SEC-02 key rotation + spend limit · 4. CODE-02 referer · 5. INFO-01 verify repo visibility

**Phase 2 — first week live**
6. A11Y-01 chat dialog semantics · 7. SEO-01 Open Graph · 8. REL-01/02/03 abort + cancel + timeout · 9. SEC-03 error disclosure · 10. PRIV-03 chat privacy notice

**Phase 3 — hardening**
11. A11Y-02/03/04 contrast + focus rings + nav semantics · 12. TEST-01/02 tests + CI · 13. CODE-01 extract `useChatStream()` · 14. LLM-03 model fallback

**Phase 4 — polish**
15. Everything remaining in §5

---

## 8. Appendix — How to Reproduce These Checks

```bash
# Health
npx tsc --noEmit && npx eslint . && npx next build

# Secret audit
git ls-files --error-unmatch .env            # expect: "did not match any file(s)"
git log --all --oneline --name-only -- .env  # expect: empty
git grep -I "sk-or-v1" $(git rev-list --all) # expect: empty

# Repo visibility (requires: brew install gh)
gh repo view Riyakaran/Site --json visibility,isPrivate

# API smoke test
curl -s -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is your job title?"}]}'

# Validation rejection test (expect HTTP 400)
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" -d '{"messages":[{"role":"system","content":"x"}]}'
```

---

*End of review. No source files were modified.*
