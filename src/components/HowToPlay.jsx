import { useState } from 'react';
import styles from './HowToPlay.module.css';

// A tiny illustrative 4-letter example — purely for teaching the mechanic,
// not pulled from a real generated puzzle.
const EX_RINGS = [
  ['B', 'D', 'R', 'S'],
  ['A', 'E', 'O', 'U'],
  ['K', 'T', 'N', 'M'],
  ['E', 'Y', 'O', 'S'],
];
const EX_SOLUTION = [0, 0, 0, 0]; // spells BAKE

export default function HowToPlay({ onClose }) {
  const [exSel, setExSel] = useState([1, 1, 1, 1]);
  const exSolved = exSel.every((v, i) => v === EX_SOLUTION[i]);

  const spin = (pos, dir) => {
    setExSel((prev) => {
      const next = [...prev];
      const size = EX_RINGS[pos].length;
      next[pos] = ((next[pos] + dir) % size + size) % size;
      return next;
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>How to Play</h2>
        <p className={styles.intro}>
          Each wheel only has a few letters on it. Spin them until they
          spell the one real word hidden in today's cryptex.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepIcon}>🔄</span>
            <div>
              <p className={styles.stepTitle}>Spin each wheel</p>
              <p className={styles.stepDesc}>Tap the arrows to cycle a wheel through its own small set of candidate letters — never the whole alphabet.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>🧠</span>
            <div>
              <p className={styles.stepTitle}>Think in words, not letters</p>
              <p className={styles.stepDesc}>Only one combination across every wheel spells a real word. Try plausible combinations until one clicks.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>🔐</span>
            <div>
              <p className={styles.stepTitle}>It solves itself</p>
              <p className={styles.stepDesc}>The puzzle locks in the instant every wheel shows the correct letter at once — no submit button, spin as much as you like.</p>
            </div>
          </div>
        </div>

        <div className={styles.example}>
          <p className={styles.exampleLabel}>Try it — spin to BAKE</p>
          <div className={styles.exCryptex}>
            {EX_RINGS.map((ring, pos) => (
              <div key={pos} className={styles.exWheel}>
                <button type="button" className={styles.exArrow} onClick={() => spin(pos, 1)}>▲</button>
                <div className={`${styles.exWindow} ${exSel[pos] === EX_SOLUTION[pos] ? styles.exWindowCorrect : ''}`}>
                  {ring[exSel[pos]]}
                </div>
                <button type="button" className={styles.exArrow} onClick={() => spin(pos, -1)}>▼</button>
              </div>
            ))}
          </div>
          <p className={styles.exampleCaption}>
            {exSolved ? 'That\'s it — every real puzzle locks in exactly the same way.' : 'Spin each wheel — only one letter per wheel is correct.'}
          </p>
        </div>

        <button className={styles.playButton} onClick={onClose}>
          Start playing
        </button>
      </div>
    </div>
  );
}
