# Dial — Daily Cryptex Word Puzzle

Started 2026-09-23. Replaces **Sift** (a logic-grid deduction game) as
the new NoodleGame — Sift got built, verified working end-to-end, then
rejected on sight ("I don't like Sift") and deleted along with every
reference to it in the hub and sibling repos' Share All rosters. Picked
from the same shortlist that produced Sift: Loop Draw, Word Ladder
Chain, Weave Pairs, Pic Reveal, Fold, Split, Dial, Compass Path, Balance
— Dial won on the second pass.

Same starting constraints as before: **Tandem** and **Pathways** are the
suite's favorites (fast, tactile, one guaranteed clean answer, no
trivia, no guess-anxiety); **Sprout**, **Mirror**, and **Odd One Out**
are the least-loved (scope creep, a brutal difficulty/fail-state tuning
saga, and fuzzy trivia-flavored judgement calls). Dial leans harder into
Tandem's word-based charm than Sift did — Sift's pure logic-grid feel
may well be *why* it got rejected, worth remembering if a future pitch
gets the same reaction.

## Core loop

A cryptex: N side-by-side wheels (N = word length, 4→6 across the week),
each wheel a small vertical ring of **candidate letters** (not the full
alphabet — just 4-6 letters per wheel, one of which is correct). Rotate
a wheel with the up/down arrows (or drag) to cycle through only its own
candidates. The word forms live in a strip above the wheels as you spin.

- No clue list, no separate rules text to read — unlike Sift, the
  puzzle *is* the wheels. What's physically on each ring is the only
  information given, which is deliberately different in shape from
  Sift's clue-panel-plus-grid layout.
- Solving is vocabulary pattern-matching against a small constrained
  letter pool per position — the same kind of intuition that makes
  Wordle, Tandem, and Knot satisfying, not a formal deduction chain.
  This is a deliberate bet that word-based genuinely tests better with
  this audience than pure logic did.
- Win check runs continuously: the instant every wheel's current letter
  matches the (generator-verified-unique) solution, it's a win. No
  submit button, same convention as every other NoodleGame.
- No fail state, no guess penalty — there's nothing to "guess" in the
  risk sense, you're just spinning wheels. Scoring is solve time only,
  same as Realm/Pathways/Sift.

## Why this is solvable and not just "spin until it clicks"

With N wheels of K candidates each, the total combination space is K^N
(as low as 256, as high as ~47,000) — nobody's expected to brute-force
that by clicking. The generator guarantees **exactly one** combination
across all wheels spells a real dictionary word, so the puzzle is
"figure out which real word this could be, given these letter options
per position" — a letter-bank/constrained-anagram puzzle, a known and
well-liked genre in its own right (distinct from a plain anagram since
position is fixed per wheel, only the letter choice per position is
open).

## Generation approach

1. Pick a target word for the day (seeded per dateKey, same PRNG
   convention as every generator in the suite) from a curated
   length-bucketed word bank (`scripts/words.mjs`) — this bank is the
   pool *targets* are drawn from, so answers stay guessable common
   words, not obscure ones.
2. For each letter position, build a candidate ring: the correct letter
   plus K-1 decoy letters (distinct, excluding the correct one).
3. Brute-force enumerate the full K^N combination space (every ring is
   exactly N letters, so only the N-letter bucket can ever collide) and
   check every combination against **a real ~33k-word dictionary**
   (`scripts/dictionary.json`, filtered from the system dictionary and
   bundled into the repo so generation doesn't depend on any one
   machine having it, unioned with the curated bank so the target word
   itself is always recognized). Never ship unless exactly one
   combination matches.

   **This used to check uniqueness only against the curated word bank**,
   reasoned at the time to be "the right practical scope, not a gap."
   That was wrong, caught immediately by real testing: the very first
   live puzzle (ALONE) also spelled **ALTAR** from the same rings — a
   genuine second solution, since ALTAR was never a candidate *target*
   so it was never checked against. A decoy set that only avoids
   colliding with ~190 curated words per length is nowhere near "avoids
   colliding with any real word a player would recognize." Fixed by
   checking against the real dictionary instead.

   That fix broke the original "reroll everything and hope" search —
   against a ~33k-word collision set, random rerolls essentially never
   converged (confirmed empirically: it ran clean through 179 of 180
   days and then hung on one). Replaced with targeted repair: find one
   spurious real word the rings still spell, and mutate the *specific*
   decoy letter that word depends on, rather than re-rolling every ring
   from scratch. Converges in a handful of iterations instead of
   thousands, same "fix the specific thing that's wrong" spirit as
   Sift's clue-reduction pass.
4. Ship only the ring contents and the solution's per-wheel indices —
   no dictionary needs to reach the client at runtime, the uniqueness
   proof already happened offline (same pattern as Realm: the client
   never needs to re-derive what the generator already proved).

## Difficulty (day of week, same convention as every other game)

| Day | N (word length) | K (ring size) |
|-----|------------------|----------------|
| Mon | 4 | 4 |
| Tue | 4 | 5 |
| Wed | 5 | 4 |
| Thu | 5 | 5 |
| Fri | 5 | 6 |
| Sat | 6 | 5 |
| Sun | 6 | 6 |

Tune after playtesting, like every other game's first-cut curve.

## Word bank

`scripts/words.mjs` — curated common English words, no proper nouns, no
obscure entries, grouped by length (4/5/6 letters), large enough that
180 days of target words draws with minimal repeats. Unlike Sift's
theme bank (which could reuse a theme endlessly since the underlying
puzzle regenerates fresh), a *repeated target word* would feel flatter
here, so bank size was sized generously against actual need per weekday
slot rather than left to chance — see the generator's startup log for
the exact per-length counts checked in.

## Visual identity

- Accent: sky blue `#0ea5e9` / bright `#38bdf8` — inherited from the
  deleted Sift (never shipped, so the hue was never actually used
  anywhere live; free to reuse here).
- Logo mark: three overlapping dial rings.
- Share emoji: 🔐 — `Dial #N 🔐 MM:SS`.

## Shared conventions (same as every NoodleGame)

`getTodayKey()` via `America/New_York`, EPOCH-based puzzle numbering,
localStorage keys `dial-game-state` / `dial-stats` with a content
fingerprint guard (the Mirror lesson), CSS Modules, Fredoka display
font / Inter body font, shared footer with Share All support
(`src/utils/shareAll.js`, byte-for-byte, roster updated in the same
pass across all repos), How-to-Play modal on first visit, stats modal
with streak tracking, `vite build && gh-pages -d dist` deploy.

## Explicitly out of scope for v1

- Any hint/reveal-a-letter mechanic beyond the ring constraints
  themselves — the rings ARE the hints, adding more risks turning this
  into Sift-with-extra-steps.
- Drag-to-rotate physics/momentum — up/down tap arrows are enough for
  v1, revisit only if tap-cycling feels bad in practice.
- Multi-word phrases — single dictionary words only, same reasoning as
  Sift's "2 categories, not 3+" scope discipline.
