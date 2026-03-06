'use client';
import { useState } from 'react';
import { ChartProvider } from '@/lib/chart/chartContext';
import TopBar from '@/components/layout/TopBar';
import ChartToolbar from '@/components/chart/ChartToolbar';
import DrawingSidebar from '@/components/chart/DrawingSidebar';
import MultiLayout from '@/components/chart/MultiLayout';
import RightPanel from '@/components/layout/RightPanel';
import StatusBar from '@/components/layout/StatusBar';
import styles from './page.module.css';

export default function ChartPage() {
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);
    const [bottomOpen, setBottomOpen] = useState(true);

    return (
        <ChartProvider>
            <div className={styles.workspace}>
                {/* Top navigation bar */}
                <TopBar />

                {/* Second toolbar: symbol / timeframe / chart type */}
                <ChartToolbar />

                {/* Main body: left sidebar + chart + right panel */}
                <div className={styles.body}>
                    <DrawingSidebar isOpen={leftOpen} onToggle={() => setLeftOpen(v => !v)} />

                    <div className={styles.chartWrap}>
                        {/* Left re-open handle (shown when sidebar is collapsed) */}
                        {!leftOpen && (
                            <button
                                className={styles.collapseHandleLeft}
                                onClick={() => setLeftOpen(true)}
                                title="Show drawing tools"
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                                    <polyline points="3,2 7,5 3,8" />
                                </svg>
                            </button>
                        )}

                        <MultiLayout />

                        {/* Bottom status bar — collapsible */}
                        <div
                            className={styles.bottomPanel}
                            style={{ height: bottomOpen ? undefined : 0 }}
                        >
                            <StatusBar onToggle={() => setBottomOpen(v => !v)} isOpen={bottomOpen} />
                        </div>

                        {/* Bottom re-open handle */}
                        {!bottomOpen && (
                            <button
                                className={styles.collapseHandleBottom}
                                onClick={() => setBottomOpen(true)}
                                title="Show status bar"
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                                    <polyline points="2,6 5,3 8,6" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <RightPanel isOpen={rightOpen} onToggle={() => setRightOpen(v => !v)} />
                </div>
            </div>
        </ChartProvider>
    );
}
