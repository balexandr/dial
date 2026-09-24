import styles from './DialCryptex.module.css';

export default function DialCryptex({ puzzle, selections, onRotate, gameStatus }) {
  const { rings } = puzzle;
  const disabled = gameStatus !== 'playing';
  const solved = gameStatus === 'won';

  return (
    <div className={styles.cryptex}>
      {rings.map((ring, pos) => (
        <div key={pos} className={styles.wheel}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => onRotate(pos, 1)}
            disabled={disabled}
            aria-label={`Wheel ${pos + 1}: next letter`}
          >
            ▲
          </button>

          <div
            className={`${styles.letterWindow} ${solved ? styles.letterWindowSolved : ''}`}
            style={solved ? { animationDelay: `${pos * 80}ms` } : undefined}
          >
            <span key={selections[pos]} className={styles.letter}>
              {ring[selections[pos]]}
            </span>
          </div>

          <button
            type="button"
            className={styles.arrow}
            onClick={() => onRotate(pos, -1)}
            disabled={disabled}
            aria-label={`Wheel ${pos + 1}: previous letter`}
          >
            ▼
          </button>
        </div>
      ))}
    </div>
  );
}
