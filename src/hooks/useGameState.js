import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import puzzles from '../data/puzzles.json';

const STORAGE_KEY = 'dial-game-state';
const EPOCH = '2026-09-26';
// Longer-word days get more hints: n=4 (Mon/Tue) gets none, n=5
// (Wed-Fri) gets 1, n=6 (Sat/Sun) gets 2 — scales automatically with
// WEEKLY_DIFFICULTY in the generator instead of hardcoding days here.
const maxHintsForLength = (n) => Math.max(0, n - 4);
// A hint instantly locks a wheel instead of making the player find it
// themselves, so it has to cost something on the one scoring lever
// Dial has (solve time, lower is better — see leaderboardScore.js).
// Otherwise a stuck player could hint their way to a leaderboard time
// that looks identical to someone who solved it for real.
const HINT_PENALTY_SECONDS = 30;

function getTodayKey() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
}

// Cheap content fingerprint so a stale save from a puzzle that got edited
// after someone may have already played it can never silently carry over —
// same lesson Mirror learned the hard way (see its GAME_DESIGN.md).
function contentFingerprint(puzzle) {
  return `${puzzle.n}:${puzzle.k}:${puzzle.rings.map((r) => r.join('')).join('|')}`;
}

function loadState(dateKey, fingerprint) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.dateKey !== dateKey) return null;
    if (saved.fingerprint !== fingerprint) return null;
    return saved;
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

// One wheel per day starts already dialed to its correct letter and locked
// there, so a fresh cryptex isn't six blank guesses with no way in — the
// position is picked deterministically from the date so it's the same
// freebie for everyone playing that day.
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function gimmePosForDate(dateKey, n) {
  return hashString(dateKey) % n;
}

export function useGameState() {
  const dateKey = getTodayKey();
  const puzzle = puzzles[dateKey] || null;
  const puzzleNumber = Math.floor((new Date(dateKey) - new Date(EPOCH)) / 86400000) + 1;
  const fingerprint = puzzle ? contentFingerprint(puzzle) : null;
  const gimmePos = puzzle ? gimmePosForDate(dateKey, puzzle.n) : -1;
  const maxHints = puzzle ? maxHintsForLength(puzzle.n) : 0;

  // Index into each wheel's ring array — the wheel's current letter.
  const [selections, setSelectionsState] = useState([]);
  // Wheel positions locked via useHint (separate from the one free
  // gimmePos wheel every puzzle starts with).
  const [hintPositions, setHintPositions] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const timerRef = useRef(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsedSeconds(elapsedRef.current);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  useEffect(() => {
    if (!puzzle) { setInitialized(true); return; }

    const saved = loadState(dateKey, fingerprint);
    if (saved && saved.selections && saved.selections.length === puzzle.n) {
      const restoredHints = (saved.hintPositions || []).filter((pos) => pos !== gimmePos && pos >= 0 && pos < puzzle.n);
      const restored = [...saved.selections];
      restored[gimmePos] = puzzle.solution[gimmePos];
      restoredHints.forEach((pos) => { restored[pos] = puzzle.solution[pos]; });
      setSelectionsState(restored);
      setHintPositions(restoredHints);
      setGameStatus(saved.gameStatus || 'playing');
      elapsedRef.current = saved.elapsedSeconds || 0;
      setElapsedSeconds(elapsedRef.current);
      if ((saved.gameStatus || 'playing') === 'playing') {
        setTimerRunning(true);
      }
    } else {
      const fresh = new Array(puzzle.n).fill(0);
      fresh[gimmePos] = puzzle.solution[gimmePos];
      setSelectionsState(fresh);
      setHintPositions([]);
    }
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  useEffect(() => {
    if (!initialized || !puzzle) return;
    saveState({ dateKey, fingerprint, selections, hintPositions, gameStatus, elapsedSeconds });
  }, [selections, hintPositions, gameStatus, elapsedSeconds, initialized, dateKey, fingerprint, puzzle]);

  // Win check runs continuously, no submit button, same philosophy as
  // every other NoodleGame: the puzzle locks in the instant every wheel
  // shows the correct letter at once.
  const won = useMemo(() => {
    if (!puzzle || selections.length !== puzzle.n) return false;
    return puzzle.solution.every((idx, pos) => selections[pos] === idx);
  }, [puzzle, selections]);

  useEffect(() => {
    if (won && gameStatus === 'playing') {
      setGameStatus('won');
      setTimerRunning(false);
    }
  }, [won, gameStatus]);

  // Rotate a wheel by +1/-1, wrapping around its ring. Free retry forever,
  // no fail state, no guess penalty — same as every other NoodleGame.
  const rotateWheel = useCallback((pos, direction) => {
    if (gameStatus !== 'playing' || !puzzle || pos === gimmePos || hintPositions.includes(pos)) return;
    setTimerRunning(true);
    setSelectionsState((prev) => {
      const next = [...prev];
      const size = puzzle.rings[pos].length;
      next[pos] = ((next[pos] + direction) % size + size) % size;
      return next;
    });
  }, [gameStatus, puzzle, gimmePos, hintPositions]);

  // Spin every wheel to a random letter at once, so a fresh puzzle doesn't
  // just show four identical "first letter" windows — gives the player a
  // feel for the range of letters in play before they start solving.
  const shuffleAll = useCallback(() => {
    if (gameStatus !== 'playing' || !puzzle) return;
    setTimerRunning(true);
    setSelectionsState((prev) => prev.map((val, pos) => (
      pos === gimmePos || hintPositions.includes(pos) ? val : Math.floor(Math.random() * puzzle.rings[pos].length)
    )));
  }, [gameStatus, puzzle, gimmePos, hintPositions]);

  // Longer-word days (see maxHintsForLength) let a stuck player lock in
  // one more wheel at a time, same no-fail philosophy as the rest of the
  // suite's hint buttons — just paid for in solve time instead of a
  // separate counter, since solve time is the only thing Dial's
  // leaderboard actually ranks on.
  const useHint = useCallback(() => {
    if (!puzzle || gameStatus !== 'playing' || hintPositions.length >= maxHints) return;
    const target = puzzle.solution.findIndex((idx, pos) => (
      pos !== gimmePos && !hintPositions.includes(pos) && selections[pos] !== idx
    ));
    if (target === -1) return;
    setTimerRunning(true);
    setSelectionsState((prev) => {
      const next = [...prev];
      next[target] = puzzle.solution[target];
      return next;
    });
    setHintPositions((prev) => [...prev, target]);
    elapsedRef.current += HINT_PENALTY_SECONDS;
    setElapsedSeconds(elapsedRef.current);
  }, [puzzle, gameStatus, hintPositions, maxHints, gimmePos, selections]);

  const generateShareText = useCallback(() => {
    if (!puzzle || gameStatus !== 'won') return '';
    const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const ss = String(elapsedSeconds % 60).padStart(2, '0');
    return `Dial #${puzzleNumber} 🔐 ${mm}:${ss}`;
  }, [puzzle, gameStatus, elapsedSeconds, puzzleNumber]);

  return {
    puzzle,
    dateKey,
    puzzleNumber,
    initialized,
    selections,
    gimmePos,
    hintPositions,
    maxHints,
    useHint,
    rotateWheel,
    shuffleAll,
    gameStatus,
    elapsedSeconds,
    timerRunning,
    generateShareText,
  };
}
