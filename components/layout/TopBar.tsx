'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useChart } from '@/lib/chart/chartContext';
import type { LayoutType } from '@/lib/chart/chartContext';
import IndicatorPanel from '@/components/chart/IndicatorPanel';
import styles from './TopBar.module.css';

const LAYOUTS: { layout: LayoutType; title: string; icon: React.ReactNode }[] = [
    {
        layout: '1', title: 'Single chart',
        icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>
    },
    {
        layout: '2h', title: '2 columns',
        icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="10" y="2" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>
    },
    {
        layout: '2v', title: '2 rows',
        icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="2" y="10" width="14" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>
    },
    {
        layout: '4', title: '4 charts',
        icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>
    },
    {
        layout: '8', title: '8 charts',
        icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="2" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /><rect x="5.5" y="2" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="2" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /><rect x="14.5" y="2" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /><rect x="1" y="10" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /><rect x="5.5" y="10" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="10" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /><rect x="14.5" y="10" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" /></svg>
    },
];

export default function TopBar() {
    const { layout, setLayout } = useChart();
    const [showLayouts, setShowLayouts] = useState(false);

    return (
        <header className={styles.topbar}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="#2962ff" />
                    <path d="M5 17l4-6 3 4 2-3 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.logoText}>AntiChart</span>
            </Link>

            <div className={styles.vsep} />

            {/* Nav links */}
            <nav className={styles.nav}>
                <Link href="/chart" className={`${styles.navLink} ${styles.navActive}`}>Chart</Link>
                <Link href="/backtesting" className={styles.navLink}>Backtesting</Link>
                <Link href="/pricing" className={styles.navLink}>Pricing</Link>
            </nav>

            <div className={styles.spacer} />

            {/* Right section */}
            <div className={styles.right}>
                {/* Indicator picker */}
                <IndicatorPanel />

                <div className={styles.vsep} />

                {/* Alert button */}
                <button className={styles.iconBtn} title="Create Alert">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 1.5a5 5 0 015 5v2.5l1 2H2l1-2V6.5a5 5 0 015-5z" />
                        <path d="M6.5 13a1.5 1.5 0 003 0" />
                    </svg>
                    <span>Alert</span>
                </button>

                <div className={styles.vsep} />

                {/* Bar Replay shortcut */}
                <ReplayBtn />

                <div className={styles.vsep} />

                {/* Layout switcher */}
                <div className={styles.layoutGroup}>
                    {LAYOUTS.map((l) => (
                        <button
                            key={l.layout}
                            className={`${styles.layoutBtn} ${layout === l.layout ? styles.layoutActive : ''}`}
                            onClick={() => setLayout(l.layout)}
                            title={l.title}
                        >
                            {l.icon}
                        </button>
                    ))}
                </div>

                <div className={styles.vsep} />

                {/* User / Publish */}
                <Link href="/pricing" className={styles.publishBtn}>Publish</Link>
                <button className={styles.avatar} title="Account">U</button>
            </div>
        </header>
    );
}

function ReplayBtn() {
    const { replayMode, setReplayMode } = useChart();
    return (
        <button
            className={`${styles.iconBtn} ${replayMode ? styles.replayActive : ''}`}
            onClick={() => setReplayMode(!replayMode)}
            title="Bar Replay"
        >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M3 2l9 5-9 5z" />
            </svg>
            <span>Replay</span>
        </button>
    );
}
