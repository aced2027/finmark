'use client';
import { useState, useEffect } from 'react';
import styles from './StatusBar.module.css';

interface StatusBarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function StatusBar({ isOpen, onToggle }: StatusBarProps) {
    // Start with null to avoid hydration mismatch — render only on client
    const [timeStr, setTimeStr] = useState<string | null>(null);

    useEffect(() => {
        const fmt = () => {
            const d = new Date();
            return d.toUTCString().replace('GMT', 'UTC');
        };
        setTimeStr(fmt());
        const id = setInterval(() => setTimeStr(fmt()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={styles.bar}>
            <span className={styles.left}>
                <span className={styles.dot} />
                <span>Binance</span>
                <span className={styles.sep}>•</span>
                <span>Crypto</span>
            </span>
            <span className={styles.right}>
                {timeStr && <span className={styles.time}>{timeStr}</span>}
                <button
                    className={styles.collapseBtn}
                    onClick={onToggle}
                    title={isOpen ? 'Hide status bar' : 'Show status bar'}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        {isOpen
                            ? <polyline points="2,4 5,7 8,4" />
                            : <polyline points="2,6 5,3 8,6" />}
                    </svg>
                </button>
            </span>
        </div>
    );
}
