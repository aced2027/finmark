'use client';
import { useChart } from '@/lib/chart/chartContext';
import styles from './ReplayControls.module.css';

interface Props { totalBars: number }

export default function ReplayControls({ totalBars }: Props) {
    const { replayBar, replayPlaying, replaySpeed, setReplayPlaying, setReplaySpeed, setReplayMode, setReplayBar } = useChart();
    const pct = totalBars > 0 ? (replayBar / totalBars) * 100 : 0;

    return (
        <div className={styles.container}>
            <div className={styles.bar}>
                <button className={styles.exitBtn} onClick={() => setReplayMode(false)} title="Exit Replay">✕</button>
                <span className={styles.label}>BAR REPLAY</span>
                <div className={styles.progress}>
                    <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                    <input type="range" min={0} max={totalBars - 1} value={replayBar}
                        onChange={(e) => setReplayBar(Number(e.target.value))}
                        className={styles.range} />
                </div>
                <span className={styles.barCount}>{replayBar}/{totalBars}</span>
                <button className={styles.btn} onClick={() => setReplayBar(Math.max(0, replayBar - 1))} title="Step Back">◀</button>
                <button className={`${styles.btn} ${styles.playBtn}`} onClick={() => setReplayPlaying(!replayPlaying)} title={replayPlaying ? 'Pause' : 'Play'}>
                    {replayPlaying ? '⏸' : '▶'}
                </button>
                <button className={styles.btn} onClick={() => setReplayBar(Math.min(totalBars - 1, replayBar + 1))} title="Step Forward">▶</button>
                <select className={styles.speedSelect} value={replaySpeed}
                    onChange={(e) => setReplaySpeed(Number(e.target.value))}>
                    <option value={0.5}>0.5×</option>
                    <option value={1}>1×</option>
                    <option value={2}>2×</option>
                    <option value={5}>5×</option>
                    <option value={10}>10×</option>
                </select>
            </div>
        </div>
    );
}
