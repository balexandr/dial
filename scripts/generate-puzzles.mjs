// Offline puzzle generator for Dial.
//
// Each puzzle is N letter wheels, each with a small ring of K candidate
// letters (the true letter plus K-1 decoys). Exactly one combination
// across all rings spells a word — proven by brute force over the full
// K^N space before anything ships, same "generate then verify" discipline
// as every other NoodleGame's generator. See GAME_DESIGN.md for the full
// reasoning.
//
// Uniqueness used to be checked only against the curated WORDS_N bank
// (the pool target words are drawn from). That missed real words outside
// the bank entirely: the very first live puzzle (ALONE) also spelled
// ALTAR from the same rings, a genuine second solution nobody caught
// because ALTAR was never a candidate *target* so it was never checked
// against. Fixed by checking collisions against a real ~33k-word
// dictionary (scripts/dictionary.json, filtered from the system
// dictionary and bundled so this generator doesn't depend on any one
// machine having it) unioned with the curated bank, while target words
// still only ever come from the curated bank so answers stay guessable.
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WORDS_4, WORDS_5, WORDS_6 } from './words.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const EPOCH = '2026-09-23';
const NUM_DAYS = 180;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const WORDS_BY_LENGTH = { 4: WORDS_4, 5: WORDS_5, 6: WORDS_6 };

const DICTIONARY = JSON.parse(readFileSync(join(__dirname, 'dictionary.json'), 'utf8'));
const COLLISION_SET_BY_LENGTH = {
  4: new Set([...DICTIONARY['4'], ...WORDS_4]),
  5: new Set([...DICTIONARY['5'], ...WORDS_5]),
  6: new Set([...DICTIONARY['6'], ...WORDS_6]),
};

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

// Returns every word (up to `limit`) the ring space can spell, not just a
// count — repair needs to know *which* words are colliding, not just that
// more than one exists.
function findMatches(rings, wordSet, limit = 50) {
  const n = rings.length;
  const results = [];
  const current = new Array(n);

  function backtrack(pos) {
    if (results.length >= limit) return;
    if (pos === n) {
      const w = current.join('');
      if (wordSet.has(w)) results.push(w);
      return;
    }
    for (const letter of rings[pos]) {
      current[pos] = letter;
      backtrack(pos + 1);
      if (results.length >= limit) return;
    }
  }

  backtrack(0);
  return results;
}

function countMatches(rings, wordSet) {
  return findMatches(rings, wordSet, 2).length;
}

// Builds one ring per letter position: the true letter plus k-1 random
// decoys. A pure "reroll every ring and hope" approach doesn't converge
// against a real ~33k-word dictionary — too many decoy combinations
// happen to spell some other real word, and restarting from scratch every
// attempt throws away the parts that were already collision-free. Instead:
// start random, then repeatedly find one spurious real word the rings
// still spell and mutate a single decoy letter that's part of it, leaving
// everything else in place. Local repair converges far faster than full
// restarts — same "fix the specific thing that's wrong" spirit as Sift's
// clue-reduction pass, just a mutate-and-recheck loop instead.
function buildRings(word, k, wordSet, rng, maxIterations = 20000) {
  const n = word.length;

  const rings = [];
  for (let pos = 0; pos < n; pos++) {
    const correct = word[pos];
    const pool = shuffle(ALPHABET.filter((c) => c !== correct), rng);
    const decoys = pool.slice(0, k - 1);
    rings.push(shuffle([correct, ...decoys], rng));
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    const matches = findMatches(rings, wordSet, 20);
    const spurious = matches.filter((w) => w !== word);
    if (spurious.length === 0) return rings;

    const target = spurious[Math.floor(rng() * spurious.length)];
    // Positions where target relies on a decoy rather than the shared
    // correct letter (guaranteed non-empty since target !== word means
    // they differ somewhere, and wherever they differ, target's letter
    // can only have come from that ring's decoy set).
    const decoyPositions = [];
    for (let i = 0; i < n; i++) {
      if (target[i] !== word[i]) decoyPositions.push(i);
    }
    const pos = decoyPositions[Math.floor(rng() * decoyPositions.length)];
    const ring = rings[pos];
    const replaceIdx = ring.indexOf(target[pos]);

    const used = new Set(ring);
    let fresh;
    do {
      fresh = ALPHABET[Math.floor(rng() * ALPHABET.length)];
    } while (fresh === word[pos] || used.has(fresh));
    ring[replaceIdx] = fresh;
  }

  return null;
}

function generatePuzzle(dateKey, wordCyclers) {
  const rng = mulberry32(hashSeed(dateKey));
  const { n, k } = difficultyForDate(dateKey);
  const word = wordCyclers[n]();
  const wordSet = COLLISION_SET_BY_LENGTH[n];

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
