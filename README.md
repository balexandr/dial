# Dial: Daily Cryptex Word Puzzle

A daily cryptex puzzle: a handful of letter wheels, each with a small
set of candidate letters, one true word to spell by spinning them into
place.

Part of the [NoodleGames](https://noodlegames.co) family alongside **Tandem** and **Pathways**.

---

## How to play

Tap the arrows on a wheel to cycle it through its own small ring of
candidate letters, never the full alphabet. Only one combination
across every wheel spells a real word.

- No clue list, no rules to read beyond what's on the wheels themselves.
- No submit button: the puzzle locks in the instant every wheel shows
  the correct letter at once.
- Free retry forever. There's no fail state and no penalty for spinning
  back and forth; the whole game is pattern-matching, not risk
  management.
- Resets daily at **midnight ET**.

---

## Scoring

Solve time only, no penalty for spinning. The timer starts on your
first spin.

---

## Sharing

After a solve you can share your solve time. Once you've finished at
least one NoodleGame today, a **Share all completed** button appears in
the footer, letting you share every game you've solved today in one
message.

---

## Stack

React + Vite · CSS Modules · localStorage · GitHub Pages

---

## Puzzles

Puzzles run from **September 23, 2026** onward (180 days), stored in
`src/data/puzzles.json` keyed by date. Each entry has every wheel's
ring of candidate letters and the solution index per wheel.

Puzzles are generated, not hand-written: `scripts/generate-puzzles.mjs`
draws a target word from a curated bank (`scripts/words.mjs`, no
repeats until a whole length-bucket is exhausted), builds a small ring
of decoy letters per position, then brute-forces every combination in
the ring space to prove exactly one of them spells a word, checked
against a real ~33k-word dictionary (`scripts/dictionary.json`, bundled
into the repo, unioned with the curated bank), not just the curated
bank itself, so no puzzle ever ships with more than one valid answer.
