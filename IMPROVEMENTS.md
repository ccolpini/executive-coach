# Recommended Improvements

## 1. Security

### XSS via `dangerouslySetInnerHTML` (Critical)
`components/ChatInterface.js` uses `dangerouslySetInnerHTML` with a custom `escapeHtml` + regex-based markdown renderer. This is fragile and could allow script injection through malformed markdown edge cases.

**Fix**: Replace with `react-markdown` + `rehype-sanitize` for safe rendering.

### No Input Validation on API Route (Critical)
`app/api/coach/route.js` passes `conversationHistory` directly to the Claude API without validating its shape, role values, or content length. A malicious client could craft payloads to manipulate the conversation.

**Fix**: Validate that each history entry has a valid `role` (`"user"` or `"assistant"`), `content` is a string, and total length is bounded.

### No Rate Limiting
The `/api/coach` endpoint accepts unlimited requests with no throttling.

**Fix**: Add rate limiting middleware (e.g., Vercel KV-based `@upstash/ratelimit`).

### No Input Length Constraint
The textarea in `ChatInterface.js` accepts unbounded input, which could lead to large API payloads.

**Fix**: Add a `maxLength` attribute or validation before submission.

---

## 2. Accessibility

### Missing ARIA Labels
Multiple icon-only buttons lack `aria-label` attributes, making them invisible to screen readers:
- Hamburger menu button (`app/page.js`)
- Send button (`components/ChatInterface.js`)
- Voice input toggle (`components/VoiceInput.js`)

### Color-Only Rating Indicators
`components/SessionStats.js` uses colored pills to distinguish Strong/Decent/Needs Work ratings. Color-blind users cannot distinguish them without text labels.

**Fix**: Add visible text labels alongside color indicators.

### Missing Form Labels
The response textarea has a placeholder but no associated `<label>` element or `aria-label`.

### Color Contrast
Several muted text colors (e.g., `#5a6578`, `#6B6B8A`) on dark backgrounds may not meet WCAG AA contrast ratios.

---

## 3. Error Handling & Robustness

### No Retry Logic for API Calls
`ChatInterface.js` makes API calls without retry logic. Transient network or server errors cause immediate failure.

**Fix**: Add exponential backoff retry for 5xx errors.

### Silent Failures
- `VoiceInput.js`: `recognition.onerror` silently sets `listening = false` with no user feedback.
- `page.js`: `localStorage` try/catch blocks swallow errors silently.
- `VoiceInput.js`: Empty `catch {}` block when stopping recognition.

**Fix**: Surface user-visible error notifications; log errors in development.

### Tool Output Assumption
In `route.js` (line ~61), the code assumes Claude's response will always contain a `tool_use` block. If Claude responds without using the tool, this returns `undefined`.

**Fix**: Add a fallback that extracts text content when no tool block is found.

---

## 4. Race Conditions & Bugs

### Scenario Loading Race Condition
Rapidly clicking different scenarios in `ChatInterface.js` can cause `conversationHistoryRef` to mix content from multiple scenarios, since requests are not aborted on new selections.

**Fix**: Use `AbortController` to cancel pending requests when a new scenario is loaded.

### Stale Conversation History on Error
If an API call fails, the conversation history ref is not reset, so the next call appends to potentially corrupted state.

### Hardcoded Model Version
`claude-sonnet-4-20250514` is hardcoded in two places in `route.js`. When this model version is deprecated, the app breaks.

**Fix**: Move the model identifier to an environment variable or shared config constant.

---

## 5. Performance

### No Memoization
- `SessionStats` recalculates percentages on every render.
- All messages re-render when any new message is added.

**Fix**: Wrap `SessionStats` in `React.memo`; use `useMemo` for computed values.

### No Message Virtualization
Long conversations render all messages in the DOM simultaneously.

**Fix**: Add `react-window` or similar virtualization for conversations exceeding ~50 messages.

### Textarea Layout Thrashing
Auto-resizing the textarea reads `scrollHeight` on every keystroke, triggering layout recalculation.

---

## 6. Code Quality

### Hardcoded Colors Throughout
50+ instances of hex colors (`#7B2FFF`, `#00D4FF`, `#FF4D8D`, etc.) appear as inline styles across components, bypassing the Tailwind theme defined in `tailwind.config.js`.

**Fix**: Add these colors to the `brand` palette in `tailwind.config.js` and use Tailwind classes.

### Inline Style Event Handlers
`page.js` uses `onMouseEnter`/`onMouseLeave` to set `style.color` directly, mixing CSS concerns with JavaScript.

**Fix**: Use Tailwind `hover:` variants or CSS classes.

### No Prop Validation
No components use PropTypes or TypeScript. Invalid props are silently accepted.

**Fix**: Add PropTypes as a lightweight option, or migrate to TypeScript for full type safety.

### Duplicated API Endpoint
The string `/api/coach` appears in multiple places in `ChatInterface.js`.

**Fix**: Define as a constant in `lib/constants.js`.

---

## 7. Missing Features for Production Readiness

| Feature | Impact | Effort |
|---------|--------|--------|
| Error boundaries | Prevents full-app crashes from component errors | Low |
| Persistent storage (DB) | Stats survive beyond browser localStorage | Medium |
| User authentication | Multi-device support, personalized progress | Medium |
| Coaching session history | Users can review past feedback | Medium |
| Analytics/telemetry | Understand usage patterns and drop-off | Low |
| Test suite | Confidence in changes; regression prevention | Medium |
| CI/CD pipeline | Automated linting, building, deployment | Low |

---

## Priority Order

1. **Immediate**: XSS fix, input validation, ARIA labels
2. **Short-term**: Error handling improvements, race condition fixes, rate limiting
3. **Medium-term**: Hardcoded colors cleanup, memoization, prop validation
4. **Long-term**: Database persistence, authentication, test suite, CI/CD
