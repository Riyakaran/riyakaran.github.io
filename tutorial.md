# Tutorial: How Your Portfolio Site (and Its AI Digital Twin) Was Built

This is a guided walkthrough of everything in this repository, written for someone who has never read code before. By the end you should be able to open any file in `src/`, recognize what it's doing, and make small edits yourself with confidence.

We'll go in four parts:

1. **The technology, explained** — what each tool is and why it was chosen
2. **The high-level walkthrough** — how the pieces fit together
3. **The detailed code review** — file by file, with real code samples
4. **Self-review** — five honest suggestions for how the code could be better

---

## Part 1: The Technology, Explained

### The big picture: what even *is* a website like this?

A modern website like yours is really two things glued together:

- **The frontend** — the HTML/CSS/JavaScript that runs in the visitor's browser and draws the page they see (your hero section, the timeline, the chat bubble).
- **The backend** — code that runs on a server, not in the browser, because it needs to do something the browser shouldn't be trusted with (like holding a secret API key and talking to OpenRouter).

Normally those are two separate projects. **Next.js** is a framework that lets you build both in one project, in one language (JavaScript/TypeScript), and it decides automatically which parts of your code run in the browser and which run on the server.

### The stack, piece by piece

| Technology | What it is | Why it's here |
|---|---|---|
| **Node.js** | A program that lets JavaScript run outside a browser (e.g. on a server, or on your laptop via the terminal) | Everything — `npm`, the dev server, the API route — runs on Node |
| **npm** | Node's package manager — downloads and manages code libraries other people wrote | Used to install Next.js, React, Tailwind, etc. (see `package.json`) |
| **React** | A JavaScript library for building UIs out of reusable, composable pieces called **components** | Every visual piece of your site (the nav bar, a stat card, the chat bubble) is a React component |
| **Next.js** | A framework built on top of React that adds routing, server-side rendering, and API endpoints | Provides the project structure, the dev server, and the `/api/chat` backend route |
| **TypeScript** | JavaScript with an added type system — you declare what *shape* of data a variable should hold, and the compiler catches mistakes before you ever run the code | Every `.ts`/`.tsx` file in this project is TypeScript, not plain JavaScript |
| **Tailwind CSS** | A CSS framework where you style elements by adding short utility class names (`text-sm`, `border`, `flex`) directly in your markup, instead of writing separate `.css` files | All the visual styling — colors, spacing, layout — is done this way |
| **OpenRouter** | A hosted API that gives you one consistent interface to call many different AI language models | Lets your site talk to the `poolside/laguna-s-2.1:free` model without you needing to run a model yourself |

### Key concepts you'll see everywhere in the code

**Components.** A component is just a JavaScript function that returns markup. `Hero.tsx` is a function called `Hero` that returns the HTML for your hero section. You "use" a component by writing it like an HTML tag: `<Hero />`. This is the core idea of React — you build a page by composing small functions, not by writing one giant HTML file.

**JSX.** Inside those functions you'll see something that looks like HTML mixed into JavaScript:

```tsx
function Greeting() {
  const name = "Riya";
  return <h1>Hello, {name}</h1>;
}
```

That's JSX. It's not a string — it's JavaScript that *looks* like HTML. Anything inside `{curly braces}` is regular JavaScript being evaluated and inserted.

**Props.** Components can take input, called props (short for "properties"), the same way a function takes arguments:

```tsx
function Badge({ label }: { label: string }) {
  return <span>{label}</span>;
}

<Badge label="Open to work" />
```

**Hooks (`useState`, `useEffect`, `useRef`).** These are special React functions (always starting with `use`) that let a component remember information between renders, or react to changes.

- `useState` gives a component memory. `const [open, setOpen] = useState(false)` means "remember a value called `open`, starting at `false`, and give me a function `setOpen` to change it." When you call `setOpen(true)`, React automatically re-runs the component and updates the screen.
- `useEffect` lets you run code in response to something changing (e.g. "every time `messages` changes, scroll to the bottom").
- `useRef` gives you a stable handle to a real DOM element (e.g. "grab the actual `<input>` element so I can call `.focus()` on it").

**Server components vs. Client components.** This is the one genuinely new idea in Next.js. By default, every component in this project runs **on the server** — it renders to HTML before it ever reaches the browser, and it can never use hooks like `useState` (the server doesn't have "state" the way a running browser tab does). The moment a component needs interactivity — a click handler, a text input, a hook — you add the line `"use client"` at the very top of the file, and Next.js ships that component's JavaScript to the browser so it can run there too. You'll see this line at the top of `Nav.tsx` and `DigitalTwinChat.tsx`, because both need to respond to clicks and typing.

**API routes.** A file at `src/app/api/chat/route.ts` automatically becomes a URL: `POST /api/chat`. This is server-only code — it never ships to the browser — which is exactly where your secret `OPENROUTER_API_KEY` needs to live, since anything sent to the browser can be read by anyone who opens dev tools.

**`async`/`await` and `fetch`.** Talking to another server over the network takes time, so JavaScript handles it "asynchronously" — your code keeps running instead of freezing while it waits. `fetch(url)` starts a network request and returns a `Promise` (a placeholder for a future value). Writing `await fetch(url)` pauses just that function until the response arrives, which reads almost like ordinary step-by-step code.

**Streaming.** Instead of waiting for the AI to write its entire answer and sending it all at once, the model sends its answer word-by-word as it's generated. Your server passes those words straight through to the browser as they arrive, which is why the chat widget's text appears to "type itself" live rather than popping in all at once.

---

## Part 2: The High-Level Walkthrough

### Project structure

```
Site/
├── public/
│   └── riya-karan-resume.pdf      ← served as-is at /riya-karan-resume.pdf
├── src/
│   ├── app/
│   │   ├── layout.tsx             ← wraps every page (fonts, <html>, <body>)
│   │   ├── page.tsx               ← the homepage — assembles all the sections
│   │   ├── globals.css            ← the color palette, fonts, animations
│   │   └── api/
│   │       └── chat/route.ts      ← the backend endpoint the chat widget calls
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── About.tsx
│   │   ├── Journey.tsx
│   │   ├── Skills.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Contact.tsx
│   │   └── DigitalTwinChat.tsx    ← the floating AI chat widget
│   └── data/
│       └── resume.ts              ← your resume content, as structured data
├── package.json                    ← project metadata + dependency list
└── .env                             ← OPENROUTER_API_KEY lives here (not in git)
```

### How a normal page visit works

1. You (or a visitor) request `http://localhost:3000/`.
2. Next.js runs `src/app/page.tsx` **on the server**, which imports and calls `Hero`, `About`, `Journey`, etc. Each one reads from `src/data/resume.ts` and returns JSX.
3. Next.js turns all of that into plain HTML and CSS and sends it to the browser. The page is visible almost instantly — no blank "loading" spinner.
4. The browser also downloads a small bundle of JavaScript for the *client* components only (`Nav`, `DigitalTwinChat`) so their buttons and menus become interactive.

### How the "Digital Twin" chat request works

This is the new piece we added, so it's worth tracing end to end:

1. You click **"Chat with my Digital Twin"**. This is handled entirely in the browser by `DigitalTwinChat.tsx` — it just flips a piece of state (`open`) from `false` to `true`, and React shows the panel.
2. You type a question and hit Enter. The component adds your message to its local list of `messages`, then calls `fetch("/api/chat", { method: "POST", body: ... })`, sending the whole conversation so far.
3. That request lands on your **server**, in `src/app/api/chat/route.ts`. This code:
   - Reads your secret key from `process.env.OPENROUTER_API_KEY` (from `.env` — never sent to the browser).
   - Builds a "system prompt" out of `digitalTwinSystemPrompt` (built in `resume.ts`) — a big block of text that tells the AI model "you are Riya's digital twin, here are the real facts about her career, stay in character, don't make things up."
   - Forwards the conversation to OpenRouter, asking for a **streamed** response.
   - As OpenRouter sends back chunks of the answer, the route immediately re-sends each chunk to the browser — it's a relay, not a wait-and-forward.
4. Back in the browser, `DigitalTwinChat.tsx` reads that stream chunk by chunk and updates the last message in the chat, which is what makes the text appear to type itself.
5. When the stream ends, the "typing" stops and the input box re-enables.

The key design idea: **the browser never talks to OpenRouter directly.** It only ever talks to your own server, and your server is the only place that knows the API key. This is the standard, safe pattern for using a paid/keyed API from a website.

---

## Part 3: The Detailed Code Review

### `src/app/layout.tsx` — the outer shell

Every single page goes through this file. Its job is to load fonts once and set up the `<html>`/`<body>` tags.

```tsx
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["500", "700"] });

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-paper">{children}</body>
    </html>
  );
}
```

A few things worth noticing:

- `next/font/google` downloads the fonts at build time and exposes each one as a CSS variable (`--font-geist-sans`) rather than loading them from Google's servers on every visit — faster and more private.
- `{children}` is a prop every layout receives automatically — it's "whatever page is currently being rendered," in this case `page.tsx`.
- The class names (`h-full`, `antialiased`, `bg-ink`) are Tailwind utility classes — no separate CSS file needed for this.

### `src/app/globals.css` — the design system

This file does two jobs: define your color palette as reusable variables, and a few custom animations Tailwind doesn't ship with out of the box.

```css
:root {
  --ink: #09090b;       /* near-black background */
  --paper: #f3f2ec;     /* off-white text */
  --accent: #d6ff3f;    /* the lime accent color */
  --accent-2: #5b6bff;  /* secondary blue, used in gradients */
}

@theme inline {
  --color-ink: var(--ink);
  --color-accent: var(--accent);
  --font-display: var(--font-space-grotesk);
  /* ... */
}
```

`:root { }` defines CSS **custom properties** (variables) once, globally. The `@theme inline` block (a Tailwind v4 feature) then registers those as real Tailwind color names, which is why you can write `bg-ink` or `text-accent` anywhere in the codebase and Tailwind knows what color that means — change the value in one place here, and it updates everywhere on the site.

The rest of the file defines small reusable effects, e.g.:

```css
@keyframes drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(2%, -3%, 0) scale(1.05); }
}
.animate-drift { animation: drift 18s ease-in-out infinite; }
```

That's the slow "breathing" motion on the glowing blobs behind your hero and contact sections — a CSS `@keyframes` animation given a friendly class name so any component can opt in with `className="animate-drift"`.

### `src/data/resume.ts` — the single source of truth

Rather than writing your name, job title, and bullet points directly inside each component, everything content-related lives in one typed data file, and every component imports from it. This means updating your resume means editing *one file*, not eight.

```ts
export type ExperienceEntry = {
  company: string;
  title: string;
  context: string;
  start: string;
  end: string;
  current?: boolean;       // the "?" means this field is optional
  highlights: string[];    // an array (list) of strings
};

export const experience: ExperienceEntry[] = [
  {
    company: "Infosys",
    title: "Senior Associate Consultant",
    context: "Product Owner & Scrum Master · Questionnaire Module, EY Mobility Platform",
    start: "Oct 2024",
    end: "Present",
    current: true,
    highlights: [
      "Own the Questionnaire module as PO and Scrum Master...",
      "Cut response time 83% (30s → 5s)...",
      // ...
    ],
  },
  // ...four more roles
];
```

The `type ExperienceEntry = { ... }` line is TypeScript. It's not code that runs — it's a *contract*. It says "any object claiming to be an `ExperienceEntry` must have these exact fields, with these exact types." If you later typo `compnay: "Infosys"` in one of the entries, TypeScript refuses to compile until you fix it. This is the main practical benefit of TypeScript over plain JavaScript: it turns typos and shape-mismatches into instant errors instead of silent bugs that only show up in the browser.

The most interesting part of this file is at the bottom — the function that turns all this structured data into the instructions the AI model follows:

```ts
function buildDigitalTwinSystemPrompt(): string {
  const experienceBlock = experience
    .map((role) => {
      const bullets = role.highlights.map((h) => `    - ${h}`).join("\n");
      return `  ${role.title} — ${role.company} (${role.start} to ${role.end})\n  ${role.context}\n${bullets}`;
    })
    .join("\n\n");

  return `You are the "Digital Twin" of ${profile.name}...
GROUND TRUTH — only use facts from this section...
EXPERIENCE (most recent first)
${experienceBlock}
...`;
}

export const digitalTwinSystemPrompt = buildDigitalTwinSystemPrompt();
```

`.map()` is a very common array method: "for each item in this list, transform it into something else, and give me back a new list of the results." Here it turns your five `ExperienceEntry` objects into five nicely formatted text blocks, which `.join("\n\n")` then glues together with blank lines between them. Backtick strings (`` `...${variable}...` ``) are **template literals** — a way to build a string with variables spliced directly into it, instead of `+`-concatenating pieces together.

The result — `digitalTwinSystemPrompt` — is a giant string containing your entire resume in a format the AI reads before it answers anything. This is the mechanism that keeps the chat "grounded": the model isn't guessing about your career, it's being handed the facts every single time.

### `src/components/SectionHeading.tsx` — a tiny reusable component

This is the simplest component in the project and a good example of *why* components exist:

```tsx
type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ kicker, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
        <span className="h-px w-8 bg-accent" />
        {kicker}
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-paper-dim">{description}</p> : null}
    </div>
  );
}
```

Every section on your site (About, Journey, Skills, Portfolio) starts with that small "kicker line + title" pattern. Instead of copy-pasting that markup five times, it's written once here and every section just does `<SectionHeading kicker="About" title="..." />`. `align?: "left" | "center"` is a TypeScript **union type** — it restricts the `align` prop to only ever be one of those two exact strings, so a typo like `align="centre"` fails to compile.

### `src/components/Journey.tsx` — looping over data to build UI

This is the clearest example in the project of the pattern "data in → UI out":

```tsx
<ol className="mt-16 border-l border-line">
  {experience.map((role, i) => (
    <li key={`${role.title}-${role.start}`} className="relative pb-16 pl-10 sm:pl-14">
      <span className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
        role.current ? "border-accent bg-accent" : "border-line-strong bg-ink"
      }`} />
      <h3 className="font-display text-xl font-bold text-paper sm:text-2xl">{role.title}</h3>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {role.start} — {role.end}
      </span>
      <ul className="mt-5 space-y-3">
        {role.highlights.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed text-paper-dim">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-dim" />
            {point}
          </li>
        ))}
      </ul>
    </li>
  ))}
</ol>
```

There's no "role 1, role 2, role 3..." written anywhere — the whole timeline is generated by looping over the `experience` array from `resume.ts`. If you get a new job tomorrow, you add one object to that array and the timeline updates itself; you never touch this file. Note the `key={...}` prop on every looped element — React requires a unique, stable identifier for each item in a list so it can efficiently figure out what changed between renders, rather than re-building the whole list from scratch every time.

### `src/app/api/chat/route.ts` — the backend endpoint

This is the most "backend-engineering" file in the project, so let's go through it in order.

**1. Reject the request early if misconfigured or invalid.**

```ts
export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "OPENROUTER_API_KEY is not configured on the server." }, { status: 500 });
  }
  // ...parse and validate the request body...
}
```

`export async function POST(...)` is the specific Next.js convention that makes this file handle `POST` requests to `/api/chat`. `process.env.OPENROUTER_API_KEY` reads the secret out of your `.env` file — Next.js loads `.env` automatically and makes its contents available this way, but *only* inside server-side code like this route. It is never bundled into anything sent to the browser.

**2. Validate the incoming data before trusting it.**

```ts
function isValidHistory(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every((m) =>
      m && typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_MESSAGE_LENGTH
    )
  );
}
```

`value: unknown` is TypeScript's most honest type — it means "this could be absolutely anything, I haven't checked yet," which is the correct starting assumption for data arriving from the internet. This function is what's called a **type guard**: after it returns `true`, TypeScript trusts that `value` really is a `ChatMessage[]` for the rest of the function. Combined with `MAX_HISTORY = 20` and `MAX_MESSAGE_LENGTH = 4000` (used just below this), it stops someone from sending an enormous payload that would run up your OpenRouter usage or crash the server.

**3. Call OpenRouter, asking for a streamed response.**

```ts
const upstream = await fetch(OPENROUTER_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Riya Karan - Digital Twin",
  },
  body: JSON.stringify({
    model: "poolside/laguna-s-2.1:free",
    stream: true,
    messages: [{ role: "system", content: digitalTwinSystemPrompt }, ...trimmedHistory],
  }),
});
```

This mirrors the same request format nearly every AI provider uses: a `messages` array, where `role: "system"` is the hidden instruction-giver (your resume + persona rules), and the rest is the actual back-and-forth conversation. `Authorization: Bearer <key>` is the standard way APIs check "do you have permission to call me."

**4. Relay OpenRouter's stream to the browser, chunk by chunk.**

```ts
const stream = new ReadableStream<Uint8Array>({
  async start(controller) {
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim().startsWith("data:")) continue;
        const data = line.trim().slice(5).trim();
        if (data === "[DONE]") { controller.close(); return; }
        const parsed = JSON.parse(data);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          controller.enqueue(encoder.encode(delta));
        }
      }
    }
    controller.close();
  },
});
return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
```

OpenRouter sends its response as **SSE (Server-Sent Events)** — lines of text like `data: {"choices":[{"delta":{"content":"Hello"}}]}` arriving continuously, ending in `data: [DONE]`. This loop reads the raw bytes as they arrive, splits them into lines, picks out just the bit of new text (`delta.content`) from each JSON chunk, and immediately writes *only that text* onward to whoever called this route. The `try`/`catch` around `JSON.parse` matters because network streams sometimes deliver a line half-cut-off; rather than crashing the whole response, a broken chunk is silently skipped.

The upshot: your API route re-packages "AI provider's event format" into "plain text stream," which is a much simpler contract for the browser to consume.

### `src/components/DigitalTwinChat.tsx` — the chat widget

This is a **client component** (note the `"use client"` at the very top), because it needs `useState` and click handlers, which only work in the browser.

**State: the component's memory.**

```tsx
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [streaming, setStreaming] = useState(false);
```

Four independent pieces of memory: is the panel open, what's the conversation so far, what's currently typed in the box, and is a response currently being streamed in.

**Sending a message and reading the stream:**

```tsx
async function sendMessage(text: string) {
  const nextHistory: Message[] = [...messages, { role: "user", content: text.trim() }];
  setMessages([...nextHistory, { role: "assistant", content: "" }]); // placeholder bubble
  setStreaming(true);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: nextHistory }),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let acc = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { role: "assistant", content: acc }; // replace the last bubble
      return copy;
    });
  }
  setStreaming(false);
}
```

`[...messages, newThing]` is the **spread operator** — it copies everything currently in `messages` into a brand-new array with `newThing` added at the end. This pattern (copy, then modify the copy) is deliberate: React expects you to never directly mutate old state, only ever replace it with a new value, so it can reliably detect "something changed, please re-render."

The loop is the mirror image of the server's relay loop: it reads raw text chunks off the stream and, on every single chunk, calls `setMessages` again to overwrite the last (assistant) bubble with the text accumulated *so far*. That's the entire mechanism behind the "typing" effect — there's no animation trick, the actual displayed text is genuinely growing in real time as bytes arrive from your server.

**The floating launcher button:**

```tsx
<button onClick={() => setOpen((v) => !v)} className="fixed bottom-6 right-6 z-50 ...">
  {open ? "Close" : "Chat with my Digital Twin"}
</button>
```

`setOpen((v) => !v)` is the "updater function" form of a state setter — instead of computing the new value ahead of time, you hand React a small function that says "take whatever the current value is (`v`) and flip it." `fixed bottom-6 right-6 z-50` are Tailwind classes: `fixed` takes the button out of the normal page flow and pins it relative to the browser window (so it stays in the corner no matter how far you scroll), and `z-50` makes sure it renders on top of everything else.

### `src/app/page.tsx` — the composition root

```tsx
export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Portfolio />
        <Contact />
      </main>
      <DigitalTwinChat />
    </>
  );
}
```

This is deliberately the least interesting file in the project, and that's the point — it's just a list of every section, in order. All the actual complexity lives inside each component. `<>...</>` is a **React fragment**: a way to group multiple elements together without adding an extra, meaningless `<div>` wrapper to the page.

---

## Part 4: Five Self-Review Suggestions

Being honest about the current implementation, here's what I'd improve next, roughly in priority order:

1. **The `HTTP-Referer` header in `route.ts` is hardcoded to `localhost:3000`.** The moment this site is deployed to a real domain, that header will be wrong (harmless for OpenRouter today, but it's the kind of leftover that causes confusing bugs later). It should read from an environment variable like `NEXT_PUBLIC_SITE_URL` or be derived from the incoming request, with a localhost fallback for local dev.

2. **There's no rate limiting on `/api/chat`.** Right now, anyone who finds the URL can send unlimited requests, each of which costs a call to OpenRouter. For a free model the financial risk is currently zero, but if the model ever changes to a paid one, or the site gets any real traffic, this becomes an easy way for someone to run up a bill or degrade the free-tier quota for real visitors. A simple fix would be a per-IP request counter with a short cooldown.

3. **Chat history lives only in React state, so it vanishes on refresh.** That's a reasonable choice for a first version, but if you want visitors to be able to leave and come back mid-conversation, the message list should be persisted to `localStorage` (or `sessionStorage`) and restored on mount.

4. **`DigitalTwinChat.tsx` mixes UI rendering, network fetching, and stream-parsing all in one 200-line component.** It works, but as a next step it'd be cleaner to pull `sendMessage`'s fetch/stream logic out into its own hook (e.g. `useChatStream()`), so the component itself only handles what to *display*, and the networking logic becomes independently testable and reusable.

5. **The system prompt is rebuilt from scratch on every request but never changes.** `buildDigitalTwinSystemPrompt()` runs once at module load (fine), but the *entire* resume text is resent to OpenRouter on every single message in a conversation, including ones deep into a long back-and-forth. For a longer conversation this wastes tokens (and money on a paid model) repeating information the model already has context on. A more efficient design would cache the system prompt as a single reusable message and rely on conversation-level caching if/when OpenRouter or the chosen model supports it.

---

### Where to go from here

If you want to keep learning by tinkering, some safe, low-risk experiments:
- Change a color in `globals.css` (try `--accent`) and watch it ripple across the whole site.
- Add a new bullet point to an `experience` entry in `resume.ts` and watch the timeline update.
- Add a fourth starter prompt to the `STARTERS` array in `DigitalTwinChat.tsx`.

Each of those touches exactly one file and can't break anything else — a good way to build intuition for how the pieces connect.
