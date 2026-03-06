'use client';
import React, { useState } from 'react';
import styles from './RightPanel.module.css';

const WATCHLIST = [
    { sym: 'AAPL', label: 'Apple Inc.', change: '+2.41%', up: true },
    { sym: 'MSFT', label: 'Microsoft', change: '-1.83%', up: false },
    { sym: 'GOOGL', label: 'Alphabet', change: '+5.12%', up: true },
    { sym: 'AMZN', label: 'Amazon', change: '+0.98%', up: true },
    { sym: 'NVDA', label: 'NVIDIA', change: '-3.22%', up: false },
    { sym: 'META', label: 'Meta', change: '+1.04%', up: true },
    { sym: 'TSLA', label: 'Tesla', change: '-0.55%', up: false },
    { sym: 'NFLX', label: 'Netflix', change: '+3.77%', up: true },
    { sym: 'AMD', label: 'AMD', change: '+2.09%', up: true },
    { sym: 'INTC', label: 'Intel', change: '-1.11%', up: false },
];

type PanelTab = 'watchlist' | 'alerts' | 'ideas';

interface RightPanelProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function RightPanel({ isOpen, onToggle }: RightPanelProps) {
    const [tab, setTab] = useState<PanelTab>('watchlist');

    const handleTabClick = (t: PanelTab) => {
        if (t === tab) {
            // clicking the active tab toggles the panel
            onToggle();
        } else {
            setTab(t);
            if (!isOpen) onToggle(); // re-open if collapsed
        }
    };

    return (
        <div className={styles.panel}>
            {/* Icon rail — always visible */}
            <div className={styles.iconRail}>
                {/* Collapse arrow at top of rail */}
                <button
                    className={styles.railCollapseBtn}
                    onClick={onToggle}
                    title={isOpen ? 'Collapse panel' : 'Expand panel'}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        {isOpen
                            ? <polyline points="8,3 4,6 8,9" />
                            : <polyline points="4,3 8,6 4,9" />}
                    </svg>
                </button>

                <div className={styles.railSep} />

                <button
                    className={`${styles.railBtn} ${tab === 'watchlist' && isOpen ? styles.railActive : ''}`}
                    onClick={() => handleTabClick('watchlist')}
                    title="Watchlist"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 1.5l2 4.5 5 .7-3.5 3.5.8 5L9 13 4.7 15.2l.8-5L2 6.7 7 6z" />
                    </svg>
                </button>
                <button
                    className={`${styles.railBtn} ${tab === 'alerts' && isOpen ? styles.railActive : ''}`}
                    onClick={() => handleTabClick('alerts')}
                    title="Alerts"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 2a6 6 0 016 6v3l1.5 2.5h-15L3 11V8a6 6 0 016-6z" />
                        <path d="M7 15.5a2 2 0 004 0" />
                    </svg>
                </button>
                <button
                    className={`${styles.railBtn} ${tab === 'ideas' && isOpen ? styles.railActive : ''}`}
                    onClick={() => handleTabClick('ideas')}
                    title="Ideas"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="7.5" r="4" />
                        <path d="M7 14h4M8 16h2" />
                        <path d="M7 11.5v1a2 2 0 004 0v-1" />
                    </svg>
                </button>
                <div className={styles.railSep} />
                <button className={styles.railBtn} title="Settings">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="9" r="2.5" />
                        <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.6 3.6l1.4 1.4M13 13l1.4 1.4M3.6 14.4l1.4-1.4M13 5l1.4-1.4" />
                    </svg>
                </button>
            </div>

            {/* Content pane — collapses with smooth width transition */}
            <div
                className={styles.content}
                style={{
                    width: isOpen ? 200 : 0,
                    minWidth: 0,
                    overflow: 'hidden',
                    transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                {tab === 'watchlist' && (
                    <>
                        <div className={styles.panelHeader}>
                            <span>Watchlist</span>
                            <button className={styles.addBtn}>+</button>
                        </div>
                        <div className={styles.list}>
                            {WATCHLIST.map(item => (
                                <div key={item.sym} className={styles.listItem}>
                                    <div>
                                        <div className={styles.listSym}>{item.label}</div>
                                        <div className={styles.listExch}>NASDAQ</div>
                                    </div>
                                    <span className={`${styles.listChg} ${item.up ? styles.chgUp : styles.chgDn}`}>
                                        {item.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {tab === 'alerts' && (
                    <div className={styles.empty}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a7 7 0 017 7v4l1.5 3H3.5L5 13V9a7 7 0 017-7z" />
                            <path d="M10 18a2 2 0 004 0" />
                        </svg>
                        <p>No active alerts</p>
                        <button className={styles.emptyBtn}>Create alert</button>
                    </div>
                )}
                {tab === 'ideas' && (
                    <div className={styles.empty}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="10" r="5" />
                            <path d="M9 18h6M10 21h4" />
                        </svg>
                        <p>No published ideas</p>
                        <button className={styles.emptyBtn}>Browse ideas</button>
                    </div>
                )}
            </div>
        </div>
    );
}
