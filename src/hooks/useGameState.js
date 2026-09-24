import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import puzzles from '../data/puzzles.json';

const STORAGE_KEY = 'dial-game-state';
const EPOCH = '2026-09-23';

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

export function useGameState() {
  const dateKey = getTodayKey();
  const puzzle = puzzles[dateKey] || null;
  const puzzleNumber = Math.floor((new Date(dateKey) - new Date(EPOCH)) / 86400000) + 1;
  const fingerprint = puzzle ? contentFingerprint(puzzle) : null;

  // Index into each wheel's ring array — the wheel's current letter.
  const [selections, setSelectionsState] = useState([]);
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
      setSelectionsState(saved.selections);
      setGameStatus(saved.gameStatus || 'playing');
      elapsedRef.current = saved.elapsedSeconds || 0;
      setElapsedSeconds(elapsedRef.current);
      if ((saved.gameStatus || 'playing') === 'playing') {
        setTimerRunning(true);
      }
    } else {
      setSelectionsState(new Array(puzzle.n).fill(0));
    }
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  useEffect(() => {
    if (!initialized || !puzzle) return;
    saveState({ dateKey, fingerprint, selections, gameStatus, elapsedSeconds });
  }, [selections, gameStatus, elapsedSeconds, initialized, dateKey, fingerprint, puzzle]);

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
    if (gameStatus !== 'playing' || !puzzle) return;
    setTimerRunning(true);
    setSelectionsState((prev) => {
      const next = [...prev];
      const size = puzzle.rings[pos].length;
      next[pos] = ((next[pos] + direction) % size + size) % size;
      return next;
    });
  }, [gameStatus, puzzle]);

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
    rotateWheel,
    gameStatus,
    elapsedSeconds,
    timerRunning,
    generateShareText,
  };
}
