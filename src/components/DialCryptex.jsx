import styles from './DialCryptex.module.css';

export default function DialCryptex({ puzzle, selections, onRotate, gameStatus, gimmePos }) {
  const { rings } = puzzle;
  const disabled = gameStatus !== 'playing';
  const solved = gameStatus === 'won';

  return (
    <div className={styles.cryptex}>
      {rings.map((ring, pos) => {
        const locked = pos === gimmePos;
        return (
          <div key={pos} className={styles.wheel}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => onRotate(pos, 1)}
              disabled={disabled || locked}
              aria-label={`Wheel ${pos + 1}: next letter`}
            >
              ▲
            </button>

            <div
              className={`${styles.letterWindow} ${locked && !solved ? styles.letterWindowLocked : ''} ${solved ? styles.letterWindowSolved : ''}`}
              style={solved ? { animationDelay: `${pos * 80}ms` } : undefined}
              title={locked && !solved ? 'Free letter, already correct' : undefined}
            >
              <span key={selections[pos]} className={styles.letter}>
                {ring[selections[pos]]}
              </span>
            </div>

            <button
              type="button"
              className={styles.arrow}
              onClick={() => onRotate(pos, -1)}
              disabled={disabled || locked}
              aria-label={`Wheel ${pos + 1}: previous letter`}
            >
              ▼
            </button>
          </div>
        );
      })}
    </div>
  );
}
