# Clackr — Production Readiness Audit Report

---

## 1. File Inventory

| File | Purpose | Reviewed |
|------|---------|----------|
| [layout.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/layout.tsx) | Root HTML layout, font loading, theme flash prevention script, Redux provider wrap | ✅ |
| [page.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/page.tsx) | Home page — orchestrates TypingArea, VirtualKeyboard, ResultsPanel, modals, global hotkeys | ✅ |
| [globals.css](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/globals.css) | Theme CSS variables (6 themes), keycap 3D styles, View Transition animations, scrollbar | ✅ |
| [icon.png](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/icon.png) | Favicon/logo image (441KB) | ✅ |
| [test-sound/page.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/test-sound/page.tsx) | Dev-only audio diagnostic test page | ✅ |
| [api/copy-logo/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/copy-logo/route.ts) | Temporary dev utility — copies logo from absolute Adnan-local path | ✅ |
| [api/diagnostic-report/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/diagnostic-report/route.ts) | Dev utility — writes audio diagnostic JSON to disk | ✅ |
| [api/inspect/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/inspect/route.ts) | Dev utility — returns static JSON | ✅ |
| [api/save-report/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/save-report/route.ts) | Dev utility — writes diagnostic JSON to disk | ✅ |
| [store/store.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/store/store.ts) | Redux store configuration | ✅ |
| [store/provider.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/store/provider.tsx) | Redux Provider with client-side settings/results hydration and global sound-on-click | ✅ |
| [store/testSlice.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/store/testSlice.ts) | Core typing test state (words, typed input, indices, keystroke stats, timer) | ✅ |
| [store/settingsSlice.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/store/settingsSlice.ts) | User preferences (theme, sound, keyboard, font, confetti) with localStorage | ✅ |
| [store/resultsSlice.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/store/resultsSlice.ts) | Test history & high score, capped at 50, with localStorage | ✅ |
| [hooks/useTypingEngine.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/hooks/useTypingEngine.ts) | Typing keystroke handler, timer/WPM tracker interval, test-finish result submission | ✅ |
| [lib/wordGenerator.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/wordGenerator.ts) | Generates word arrays for all modes (time/words/quote/zen/code) with punctuation/number/capital modifiers | ✅ |
| [lib/wordLists.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/wordLists.ts) | Static word pools: EASY_WORDS, HARD_WORDS, QUOTES, CODE_SNIPPETS | ✅ |
| [lib/statsCalculator.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/statsCalculator.ts) | WPM, raw WPM, accuracy, consistency, char breakdown functions | ✅ |
| [lib/confetti.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/confetti.ts) | Canvas-based confetti burst animation | ✅ |
| [lib/soundManager.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/soundManager.ts) | Web Audio API sound engine (OGG buffer, synthesis fallback, clack/bubble/error sounds) | ✅ |
| [lib/mySoundBase64.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/mySoundBase64.ts) | 2.5MB embedded base64 OGG audio data | ✅ |
| [lib/diagnostic_report.json](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/diagnostic_report.json) | Dev-only diagnostic output artifact | ✅ |
| [components/Layout/Layout.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/Layout/Layout.tsx) | App shell (header/nav/toolbar/content), theme transition fallback overlay | ✅ |
| [components/TestConfig/TestConfig.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/TestConfig/TestConfig.tsx) | Config bar (mode/difficulty/punctuation/numbers/capitals/duration/wordCount/theme toggle) | ✅ |
| [components/TypingArea/TypingArea.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/TypingArea/TypingArea.tsx) | Core typing UI — hidden input, word rendering, floating caret, live stats, focus overlay | ✅ |
| [components/Word/Word.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/Word/Word.tsx) | Individual word display with per-character coloring, error highlighting, extra chars | ✅ |
| [components/VirtualKeyboard/VirtualKeyboard.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/VirtualKeyboard/VirtualKeyboard.tsx) | Interactive 75% mechanical keyboard with highlight/pressed states, scaling | ✅ |
| [components/VirtualKeyboard/Key.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/VirtualKeyboard/Key.tsx) | Individual keycap component with 3D tactile styling | ✅ |
| [components/ResultsPanel/ResultsPanel.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/ResultsPanel.tsx) | Results screen — WPM, accuracy, chart, char breakdown, action buttons, modal launchers | ✅ |
| [components/ResultsPanel/ShareModal.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/ShareModal.tsx) | Screenshot/share card generator with canvas PNG download | ✅ |
| [components/ResultsPanel/WordReviewModal.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/WordReviewModal.tsx) | Per-word correct/wrong review with filter and download | ✅ |
| [components/ResultsPanel/PracticeModal.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/PracticeModal.tsx) | Practice mode — replay wrong words, all-time tracked words | ✅ |
| [components/ResultsPanel/OdometerCounter.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/OdometerCounter.tsx) | Split-flap odometer digit display (unused) | ✅ |
| [components/ResultsPanel/OdometerDigit.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/OdometerDigit.tsx) | Single odometer digit strip animation (unused) | ✅ |
| [components/SettingsModal/SettingsModal.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/SettingsModal/SettingsModal.tsx) | Settings panel — theme, sound type, keyboard, font, confetti, danger zone | ✅ |
| [components/HistoryModal/HistoryModal.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/HistoryModal/HistoryModal.tsx) | History log table, PB card, clear history | ✅ |
| [next.config.js](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/next.config.js) | Next.js config (strict mode, eslint + ts ignore during builds) | ✅ |
| [tailwind.config.js](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/tailwind.config.js) | Tailwind config — clackr color tokens, font families | ✅ |
| [package.json](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/package.json) | Dependencies and scripts | ✅ |
| [tsconfig.json](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/tsconfig.json) | TypeScript config — strict, bundler resolution | ✅ |
| [postcss.config.js](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/postcss.config.js) | PostCSS config (tailwind + autoprefixer) | ✅ |

**Coverage: 40/40 source files reviewed ✅**

---

## 2. Findings (grouped by severity)

### 🔴 Critical (breaks functionality / build / production)

---

#### C1. Hardcoded absolute local path in production API route — will crash on deploy

**File:** [api/copy-logo/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/copy-logo/route.ts) line 7

```typescript
const src = "C:/Users/Adnan/.gemini/antigravity-ide/brain/d0120463-0dfc-480f-bab1-a8813b08526d/clackr_name_logo_1784379311386.png";
```

This is a **dev-only utility** with a hardcoded absolute path to your local machine. On **any other machine** or in production (Vercel), this endpoint will 500-error and expose your local filesystem path in the error response.

> [!CAUTION]
> **Fix: Delete the entire `app/api/copy-logo/` directory.** It served its purpose and should not ship.

---

#### C2. Dev-only API routes write to local filesystem — will fail on serverless (Vercel)

**Files:**
- [api/diagnostic-report/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/diagnostic-report/route.ts) — writes `lib/diagnostic_report.json` to disk
- [api/save-report/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/save-report/route.ts) — writes `lib/diagnostic_report.json` to disk
- [api/inspect/route.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/api/inspect/route.ts) — returns static placeholder JSON

These are **all dev-only debugging endpoints**. On Vercel/serverless, `fs.writeFileSync` to `process.cwd()` will throw because the filesystem is read-only.

> [!CAUTION]
> **Fix: Delete all four API route directories** (`copy-logo/`, `diagnostic-report/`, `inspect/`, `save-report/`). They are debugging scaffolding that should not ship.

---

#### C3. Dev-only test page ships to production

**File:** [app/test-sound/page.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/test-sound/page.tsx)

This is a full diagnostic test page accessible at `/test-sound`. It imports the 2.5MB base64 audio file and provides raw audio analysis tools. Users should not see this.

> [!WARNING]
> **Fix: Delete the entire `app/test-sound/` directory.**

---

#### C4. Duplicate `finishTest()` dispatch — double timer race condition

**Files:**
- [useTypingEngine.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/hooks/useTypingEngine.ts) line 181
- [TypingArea.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/TypingArea/TypingArea.tsx) line 136

Both files set up independent `setInterval`s that check `elapsed >= duration` and dispatch `finishTest()`. This creates a **race condition** where:
1. `useTypingEngine` fires `finishTest()` at the exact second mark
2. `TypingArea` fires `finishTest()` at 200ms granularity

The `finishTest` reducer does check `state.status === "running"` first (safe), so it won't double-set the `endTime`. But it **dispatches the action twice** which triggers React re-renders and the `status === "finished"` effect (result submission, confetti) to evaluate twice.

> [!IMPORTANT]
> **Fix:** Remove the `finishTest()` dispatch from `TypingArea.tsx` lines 134-137. Let `useTypingEngine` be the single source of truth for timer expiration. Keep the `localTimer` display state but remove:
> ```diff
> -      // If in time mode and time runs out, dispatch finish
> -      if (mode === "time" && elapsed >= duration) {
> -        dispatch(finishTest());
> -        clearInterval(interval);
> -      }
> ```

---

#### C5. `useEffect` dependency array missing `handleNextTest` — stale closure

**File:** [page.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/page.tsx) line 28-32

```typescript
useEffect(() => {
    if (words.length === 0) {
      handleNextTest();  // ← captures stale handleNextTest from first render
    }
}, [words.length]);
```

`handleNextTest` is recreated on every render (it reads `mode`, `difficulty`, `punctuation`, `numbers`, `capitals`, `wordCount`). But `words.length` only changes on init, so in practice this only fires once on mount and works. However, it violates React exhaustive-deps and **will** be flagged by eslint.

Additionally, the **global hotkeys effect** (line 35-75) includes all config options in its dependency array, but `handleNextTest` and `handleRestart` are **not** listed — they're captured by stale closure. In practice, since the closures capture dispatch + the config values also listed in deps, it works. But it's structurally wrong.

> [!NOTE]
> **Fix:** Wrap `handleNextTest` and `handleRestart` in `useCallback`, add to dependency arrays, or use `useRef` pattern.

---

### 🟠 Major (bug, but not immediately blocking)

---

#### M1. `Escape` key toggles settings while test is running — distracting

**File:** [page.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/page.tsx) line 38

The `Escape` handler runs **unconditionally** — even when `status === "running"`. Pressing Escape mid-test opens settings, which steals focus and breaks the typing flow.

**Fix:** Add a running-state guard:
```diff
  if (e.key === "Escape") {
+   if (status === "running") return;
    e.preventDefault();
```

---

#### M2. `prevTheme` state never updates when View Transitions are supported — fallback overlay logic broken

**File:** [Layout.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/Layout/Layout.tsx) lines 33-61

```typescript
React.useEffect(() => {
    if (activeTheme !== prevTheme) {
      const hasSVT = ...;
      if (!hasSVT) {
        // ... sets overlay ...
      }
      setPrevTheme(activeTheme); // ← This is ONLY called inside the `if (activeTheme !== prevTheme)` block
    }
}, [activeTheme, prevTheme]);
```

Look at the control flow: `setPrevTheme(activeTheme)` is on line 59 — **outside** the `if (!hasSVT)` block but **inside** the `if (activeTheme !== prevTheme)` block. This is correct. ✅ On re-review this is fine.

But there's still a subtle issue: when `hasSVT` is true, `setPrevTheme(activeTheme)` is called, which re-triggers the effect (since `prevTheme` changed), creating one wasted re-render cycle.

**Fix (minor):** Move `setPrevTheme` call before the SVT check.

---

#### M3. `Word` component uses `index` as React key in a mapping that never reorders — harmless but fragile

**File:** [TypingArea.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/TypingArea/TypingArea.tsx) line 314

```tsx
{words.map((_, idx) => (
  <Word key={idx} index={idx} />
))}
```

Since words are regenerated as a completely new array (never reordered/inserted), this is technically safe. But if someone adds word insertion later, it'll cause wrong diffing. Low risk.

---

#### M4. `soundManager.playSound` fires on every mouse click globally — including within modals, download buttons

**File:** [provider.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/store/provider.tsx) line 33-40

Every click on settings toggles, modal close buttons, download buttons etc. plays a keyboard click sound. This may be intentional for "mechanical keyboard feel" but is unexpected UX on non-keyboard interactions (like clicking "Clear History" in the danger zone).

---

#### M5. ResultsPanel uses `canvas-confetti` dynamic import AND custom `confetti.ts` — duplicated confetti system

**File:** [ResultsPanel.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/ResultsPanel.tsx) lines 92-101

```typescript
import("canvas-confetti").then((module) => {
  const confetti = module.default;
  confetti({ particleCount: 80, ... });
});
```

But `useTypingEngine.ts` line 224 uses the custom `triggerConfetti()` from `lib/confetti.ts`:
```typescript
if (confettiEnabled) {
  triggerConfetti();
}
```

**Both fire when a test finishes**, resulting in **double confetti animations** overlapping each other. The `canvas-confetti` version fires when WPM ≥ 60 (inside ResultsPanel), while the custom one fires always (inside useTypingEngine).

**Fix:** Remove either the `canvas-confetti` import in ResultsPanel or the `triggerConfetti()` call in useTypingEngine. Keep one system.

---

#### M6. `soundManager` fires `fetch("/api/diagnostic-report")` on every page load in production

**File:** [soundManager.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/soundManager.ts) lines 102-116

After decoding the base64 audio buffer, the sound manager sends a POST request to `/api/diagnostic-report` with audio analysis data. In production this will either 404 (if you delete the route) or silently fail. The `.catch(() => {})` swallows the error, so it won't crash — but it's pointless network traffic.

**Fix:** Remove lines 89-118 (the diagnostic fetch block).

---

### 🟡 Minor (code quality, duplication, dead code)

---

#### m1. Unused npm dependencies — `framer-motion`, `clsx`, `tailwind-merge`

**File:** [package.json](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/package.json)

These three packages are listed as dependencies but **never imported anywhere** in the codebase:
- `framer-motion` (~200KB gzipped) — adds to bundle size for nothing
- `clsx` — never used
- `tailwind-merge` — never used

**Fix:** `npm uninstall framer-motion clsx tailwind-merge`

---

#### m2. `OdometerCounter.tsx` and `OdometerDigit.tsx` are dead code — never imported

**Files:**
- [OdometerCounter.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/OdometerCounter.tsx)
- [OdometerDigit.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/ResultsPanel/OdometerDigit.tsx)

These components exist and have corresponding CSS (`.odometer-wrapper` etc. in globals.css) but are **never imported or rendered** anywhere. Dead code.

**Fix:** Delete both files and the corresponding CSS blocks (lines 243-293 in globals.css).

---

#### m3. `lib/diagnostic_report.json` — dev artifact left in source tree

**Fix:** Delete it, add to `.gitignore`.

---

#### m4. Duplicate word pool entries in `EASY_WORDS`

**File:** [wordLists.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/wordLists.ts)

Several words appear multiple times: `"our"`, `"these"`, `"more"`, `"day"`, `"know"`, `"see"`, `"him"`, `"two"`, `"has"`, `"look"`, `"could"`, `"go"`, `"most"`, `"people"`, `"my"`, `"over"`, `"no"`, `"take"`, `"get"`, `"after"`, `"back"`, `"only"`, `"good"`, `"me"`, `"give"`, `"us"`, etc.

This inflates their selection probability vs. other words. Not a bug, but likely unintentional. 

**Fix:** Deduplicate: `export const EASY_WORDS = [...new Set([...currentList])];`

---

#### m5. `console.log` statements left in production code

**File:** [soundManager.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/soundManager.ts) lines 87, 143

Two `console.log` statements with `[Clackr] ✅` emoji messages will print to every user's console in production.

**Fix:** Remove or gate behind `process.env.NODE_ENV === "development"`.

---

#### m6. `base64ToArrayBuffer` duplicated in two files

**Files:**
- [soundManager.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/soundManager.ts) line 4-13
- [test-sound/page.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/app/test-sound/page.tsx) line 13-22

Identical function copy-pasted. If you keep the test page (you shouldn't), extract to a shared util.

---

#### m7. `eslint` / `typescript` errors are suppressed in `next.config.js`

**File:** [next.config.js](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/next.config.js) lines 5-9

```javascript
eslint: { ignoreDuringBuilds: true },
typescript: { ignoreBuildErrors: true },
```

This means the production build will **succeed even with type errors and lint violations**. This is fine for development velocity but means **you cannot rely on `npm run build` passing to validate code quality**.

---

#### m8. `any` types used in 4 places

| File | Line | Context |
|------|------|---------|
| ShareModal.tsx | 19 | `chartData: any[]` |
| test-sound/page.tsx | 11 | `useState<any>(null)` |
| test-sound/page.tsx | 67 | `catch (err: any)` |
| diagnostic-report/route.ts | 11 | `catch (error: any)` |

Low risk since these are either dev-only files or prop types that are actually correct in practice.

---

### 🟢 Performance

---

#### P1. `TypingArea` subscribes to the entire `test` slice — re-renders on every keystroke for all fields

**File:** [TypingArea.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/TypingArea/TypingArea.tsx) lines 24-37

```typescript
const { words, status, mode, duration, wordCount, startTime, currentWordIndex,
        typedWords, typedInput, wpmHistory, totalKeystrokes, correctKeystrokes
} = useSelector((state: RootState) => state.test);
```

This component pulls **12 fields** from the test slice via a single `useSelector`. Because Redux does a shallow equality check on the entire return object, **every single keystroke** (which mutates `typedInput`, `totalKeystrokes`, `correctKeystrokes`) causes this component to re-render.

Most of these fields (`mode`, `duration`, `wordCount`, `words`) change only on test configuration, not during typing. Splitting into granular selectors would reduce unnecessary re-renders during rapid typing.

**Fix:** Split into per-field or grouped selectors:
```typescript
const typedInput = useSelector((s: RootState) => s.test.typedInput);
const status = useSelector((s: RootState) => s.test.status);
// etc.
```

---

#### P2. `useTypingEngine` subscribes to entire test + settings slices

**File:** [useTypingEngine.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/hooks/useTypingEngine.ts) lines 24-46

Same issue — broad selectors cause the hook to re-evaluate on every keystroke even for fields it only needs at setup or finish time.

---

#### P3. Live stats IIFE in render path creates new closure + computations on every render

**File:** [TypingArea.tsx](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/components/TypingArea/TypingArea.tsx) lines 233-285

```typescript
{(() => {
    const liveAccuracy = totalKeystrokes > 0 ? Math.round(...) : 100;
    return ( /* JSX */ );
})()}
```

This IIFE allocates a new closure on every render. The computation is trivial (single division) so the performance impact is minimal, but the pattern is unusual and could be a simple inline expression instead.

---

#### P4. `mySoundBase64.ts` is a 2.5MB source file included in the client bundle

**File:** [mySoundBase64.ts](file:///c:/Users/Adnan/Desktop/Project%20work/Typing%20Master/lib/mySoundBase64.ts) — 2,588,217 bytes

This exports a single base64 string of the OGG audio. It's imported by `soundManager.ts` which is a client-side module. This means **2.5MB of base64 text is included in the JavaScript bundle**, significantly increasing initial page load time.

**Better approach:** Serve the OGG as a static file in `/public/` and load it via `fetch()` (which the fallback in `soundManager` already supports). This would reduce the JS bundle by ~2.5MB.

---

#### P5. `Word` component memoization is effective ✅

The `Word` component uses `React.memo` with granular `useSelector` hooks that only select the data relevant to that specific word index. This is well done — only the active word and the word being typed will re-render on each keystroke.

---

## 3. Build/Lint Results

> [!NOTE]
> Terminal sandbox blocks `npx` commands with "Access is denied" on this Windows system. Results below are from static analysis.

- **`npm run build`**: Cannot run due to sandbox restriction. However, `next.config.js` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`, so the build would pass regardless of TS/lint errors. The dev server is currently running without crashes.
- **`npm run lint`**: Cannot run. No `.eslintrc` file found in the project — lint is unconfigured.
- **`tsc --noEmit`**: Cannot run directly. Static analysis found **no `@ts-ignore` directives** and only 4 instances of `any` (3 in dev-only files). The codebase uses proper types throughout the main source files.

---

## 4. Responsiveness Check

| Breakpoint | Issues Found |
|------------|--------------|
| **360px (mobile)** | 🔴 TestConfig bar (`flex-wrap gap-3`) will stack into 4-5 rows consuming most of the screen. No mobile-specific layout or hamburger menu. Virtual keyboard hidden (`lg:flex`). Typing area `text-xl` may be cramped. Focus overlay "Click or press any key" message is keyboard-oriented — mobile users tap, not press keys. No mobile keyboard considerations at all. |
| **768px (tablet)** | 🟡 TestConfig wraps to 2 rows. Stats dashboard with `gap-12 md:gap-20` spreads well. Results chart `h-72 md:h-[280px]` works. Share modal `grid-cols-[1.5fr_3fr]` may be tight on portrait tablet. |
| **1024px (laptop)** | ✅ Virtual keyboard appears (`lg:flex`). Layout functions as designed. TestConfig stays in one row. |
| **1440px+ (desktop)** | ✅ Fully functional. `max-w-6xl` word container, `max-w-5xl` results panel are well proportioned. |
| **150% zoom** | 🟡 Virtual keyboard scaling logic (`setScale`) handles this well via `window.innerWidth` calculation. TestConfig may wrap. No overflow issues expected. |

**Key mobile issue:** The app is designed as a desktop typing test and makes **no accommodation for mobile users**. There's no way to type on mobile (hidden `<input>` relies on physical keyboard events). This is arguably intentional, but there should be a mobile fallback message saying "Desktop only" rather than showing a broken typing area.

---

## 5. Accessibility Check

| Check | Status |
|-------|--------|
| Keyboard navigation | 🟡 Modals lack focus trapping — Tab can move focus behind modal backdrop |
| Semantic buttons | ✅ All interactive elements are proper `<button>` tags |
| ARIA labels | 🔴 Theme toggle button has no `aria-label` (icon-only). Restart button has `title` but no `aria-label`. All icon-only toolbar buttons (keyboard, history, settings) have `title` only, no `aria-label`. |
| Color contrast | 🟡 `text-clackr-muted` (#948C7C) on `bg-clackr-bg` (#211F1C) = contrast ratio ~3.8:1. WCAG AA requires 4.5:1 for small text. Fails for text sizes under 18px. |
| Modal Escape to close | 🟡 Escape key toggles settings modal but doesn't close other modals (Share, WordReview, Practice). No `onKeyDown` escape handler on those modals. |

---

## 6. State Management Check

**Traced: Keystroke → Store → Render**

1. User presses key → `handleKeyDown` in `useTypingEngine` → `dispatch(typeChar(key))`
2. `typeChar` reducer mutates `typedInput`, `totalKeystrokes`, `correctKeystrokes/errorKeystrokes`
3. Immer produces new state → Redux notifies subscribers
4. `Word` component (active word) re-renders via `useSelector(state.test.typedInput)`
5. `TypingArea` re-renders (all 12 fields subscribed) → caret `useEffect` fires → `requestAnimationFrame` → reads `#active-char` position → updates `caretPos` state
6. Caret `div` re-renders at new position with CSS transition

**No state duplication found** — test state lives only in Redux, settings only in Redux + localStorage mirror.

**localStorage corruption check:** `loadSettings` and `loadResults` both use `try/catch` with `Partial<>` typing and field-by-field assignment with `undefined` checks. Corrupted or outdated JSON will not crash — missing fields keep their defaults. ✅

---

## 7. Production Hardening Check

| Check | Status |
|-------|--------|
| Error boundaries | 🔴 None. A single broken component (e.g., recharts failing to render) crashes the entire page. |
| Failed network (word lists) | ✅ Word lists are static imports — no network dependency. |
| Failed network (sounds) | ✅ Sound has synthesis fallback if OGG decode fails. `.catch(() => {})` prevents crashes. |
| Web Audio autoplay policy | ✅ `initCtx()` is called synchronously inside `handleKeyDown`/click handlers (user gesture context). `resume()` is fire-and-forget with `.catch()`. |
| SEO meta tags | 🟡 Has `title` and `description`. No OG tags, no canonical URL, no robots directives. |

---

## Final Verdict

### ❌ NOT production-ready

### Top 3 things that MUST be fixed before shipping:

1. **🔴 Delete all 4 dev-only API routes** (`copy-logo/`, `diagnostic-report/`, `inspect/`, `save-report/`) and the **test-sound page**. These contain hardcoded local filesystem paths, write to disk (impossible on serverless), and expose debugging tools to users.

2. **🔴 Remove the diagnostic `fetch()` call in `soundManager.ts`** (lines 89-118) that POSTs audio analysis data to a dev endpoint on every page load.

3. **🔴 Fix the double confetti firing** (both `canvas-confetti` in ResultsPanel AND custom `triggerConfetti()` in useTypingEngine fire on test completion) and the **double `finishTest()` dispatch** race condition between useTypingEngine and TypingArea.

### Additional recommended before ship:
- Remove unused dependencies (`framer-motion`, `clsx`, `tailwind-merge`) to reduce bundle
- Remove the 2.5MB base64 audio from the JS bundle (move to `/public/`)
- Remove dead code (OdometerCounter, OdometerDigit)
- Remove `console.log` statements from soundManager
- Add a mobile fallback message
- Add `aria-label` to icon-only buttons
