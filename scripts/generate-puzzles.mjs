// Offline puzzle generator for Dial.
//
// Each puzzle is N letter wheels, each with a small ring of K candidate
// letters (the true letter plus K-1 decoys). Exactly one combination
// across all rings spells a word from the curated bank — proven by brute
// force over the full K^N space before anything ships, same "generate
// then verify" discipline as every other NoodleGame's generator. See
// GAME_DESIGN.md for the full reasoning.
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WORDS_4, WORDS_5, WORDS_6 } from './words.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const EPOCH = '2026-09-23';
const NUM_DAYS = 180;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const WORDS_BY_LENGTH = { 4: WORDS_4, 5: WORDS_5, 6: WORDS_6 };

// Difficulty follows day of week, same convention as every other game.
// Index 0 = Monday ... index 6 = Sunday.
const WEEKLY_DIFFICULTY = [
  { n: 4, k: 4 }, // Monday
  { n: 4, k: 5 }, // Tuesday
  { n: 5, k: 4 }, // Wednesday
  { n: 5, k: 5 }, // Thursday
  { n: 5, k: 6 }, // Friday
  { n: 6, k: 5 }, // Saturday
  { n: 6, k: 6 }, // Sunday
];

function difficultyForDate(dateKey) {
  const utcDay = new Date(`${dateKey}T00:00:00Z`).getUTCDay();
  const mondayIndexed = (utcDay + 6) % 7;
  return WEEKLY_DIFFICULTY[mondayIndexed];
}

// djb2 string hash -> uint32 seed
function hashSeed(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

// mulberry32 PRNG
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Deterministic "draw without replacement, reshuffle on wraparound" cycler
// per word length, seeded once from EPOCH so the sequence is stable across
// regenerations. Guarantees no repeats until a whole bucket is exhausted,
// rather than random-with-replacement clustering repeats early.
function makeWordCycler(words, seed) {
  const rng = mulberry32(seed);
  let deck = shuffle(words, rng);
  let i = 0;
  return function next() {
    if (i >= deck.length) {
      deck = shuffle(words, rng);
      i = 0;
    }
    return deck[i++];
  };
}

function countMatches(rings, wordSet, limit = 2) {
  const n = rings.length;
  let count = 0;
  const current = new Array(n);

  function backtrack(pos) {
    if (count >= limit) return;
    if (pos === n) {
      if (wordSet.has(current.join(''))) count++;
      return;
    }
    for (const letter of rings[pos]) {
      current[pos] = letter;
      backtrack(pos + 1);
      if (count >= limit) return;
    }
  }

  backtrack(0);
  return count;
}

// Builds one ring per letter position: the true letter plus k-1 random
// distinct decoys. Retries with fresh decoys (same word, same rng stream)
// until the full K^N space contains exactly one match against the bank —
// never ships an ambiguous or accidentally-multi-solution set of rings.
function buildRings(word, k, wordSet, rng, maxAttempts = 200) {
  const n = word.length;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rings = [];
    for (let pos = 0; pos < n; pos++) {
      const correct = word[pos];
      const pool = shuffle(ALPHABET.filter((c) => c !== correct), rng);
      const decoys = pool.slice(0, k - 1);
      rings.push(shuffle([correct, ...decoys], rng));
    }

    if (countMatches(rings, wordSet) === 1) return rings;
  }

  return null;
}

function generatePuzzle(dateKey, wordCyclers) {
  const rng = mulberry32(hashSeed(dateKey));
  const { n, k } = difficultyForDate(dateKey);
  const word = wordCyclers[n]();
  const wordSet = new Set(WORDS_BY_LENGTH[n]);

  const rings = buildRings(word, k, wordSet, rng);
  if (!rings) {
    throw new Error(`Failed to build a uniquely-solvable ring set for ${dateKey} (word: ${word})`);
  }

  // Belt-and-suspenders: re-verify with an independent full-space count
  // before ever writing this puzzle out.
  if (countMatches(rings, wordSet) !== 1) {
    throw new Error(`Puzzle for ${dateKey} failed final uniqueness check`);
  }

  const solution = word.split('').map((letter, pos) => rings[pos].indexOf(letter));

  return { n, k, rings, solution, word };
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function main() {
  const puzzles = {};
  const start = new Date(`${EPOCH}T00:00:00Z`);

  const wordCyclers = {
    4: makeWordCycler(WORDS_4, hashSeed(`${EPOCH}:4`)),
    5: makeWordCycler(WORDS_5, hashSeed(`${EPOCH}:5`)),
    6: makeWordCycler(WORDS_6, hashSeed(`${EPOCH}:6`)),
  };

  for (let i = 0; i < NUM_DAYS; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const dateKey = formatDateKey(d);
    puzzles[dateKey] = generatePuzzle(dateKey, wordCyclers);
  }

  const outPath = join(__dirname, '..', 'src', 'data', 'puzzles.json');
  writeFileSync(outPath, JSON.stringify(puzzles, null, 2));
  console.log(`Generated ${NUM_DAYS} puzzles -> ${outPath}`);
  console.log(`Word bank sizes: 4-letter ${WORDS_4.length}, 5-letter ${WORDS_5.length}, 6-letter ${WORDS_6.length}`);
}

main();
