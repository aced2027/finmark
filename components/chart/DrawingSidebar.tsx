'use client';
import React, { useState, useRef } from 'react';
import { useChart } from '@/lib/chart/chartContext';
import type { DrawingToolType, CursorMode } from '@/lib/chart/chartContext';
import styles from './DrawingSidebar.module.css';

// ── Cursor mode (pointer group) ────────────────────────────────────────────────
// CursorMode type is imported from context

interface CursorDef {
    id: CursorMode;
    label: string;
    starred?: boolean;
    icon: React.ReactNode;
}

const CURSOR_MODES: CursorDef[] = [
    {
        id: 'cross',
        label: 'Cross',
        starred: true,
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="8" y1="1" x2="8" y2="15" />
                <line x1="1" y1="8" x2="15" y2="8" />
            </svg>
        ),
    },
    {
        id: 'dot',
        label: 'Dot',
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3" />
            </svg>
        ),
    },
    {
        id: 'arrow',
        label: 'Arrow',
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2l10 6-5 1.5-3 5z" stroke="currentColor" strokeWidth="0.4" />
            </svg>
        ),
    },
    {
        id: 'demo',
        label: 'Demonstration',
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6" />
                <polygon points="6,5 12,8 6,11" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        id: 'eraser',
        label: 'Eraser',
        starred: true,
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 13h12" />
                <path d="M4 13l-1.5-4 7-5 3 4-5 5H4z" />
            </svg>
        ),
    },
];

// ── Drawing tool groups ────────────────────────────────────────────────────────
interface ToolDef { type: DrawingToolType; label: string }

const TOOL_GROUPS: { id: string; icon: React.ReactNode; tools: ToolDef[] }[] = [
    {
        id: 'trend',
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="2" y1="14" x2="16" y2="2" />
                <circle cx="16" cy="2" r="1.5" fill="currentColor" stroke="none" />
            </svg>
        ),
        tools: [
            { type: 'trendline', label: 'Trend Line' },
            { type: 'ray', label: 'Ray' },
            { type: 'extended', label: 'Extended Line' },
            { type: 'horizontal', label: 'Horizontal Line' },
            { type: 'vertical', label: 'Vertical Line' },
            { type: 'channel', label: 'Parallel Channel' },
            { type: 'regression', label: 'Regression Channel' },
        ],
    },
    {
        id: 'fibonacci',
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="4" x2="16" y2="4" />
                <line x1="2" y1="8" x2="16" y2="8" />
                <line x1="2" y1="12" x2="16" y2="12" />
                <line x1="2" y1="15" x2="16" y2="15" />
                <line x1="2" y1="4" x2="2" y2="15" strokeWidth="1.5" />
            </svg>
        ),
        tools: [
            { type: 'fibonacci', label: 'Fib Retracement' },
            { type: 'fibextension', label: 'Fib Extension' },
            { type: 'fibfan', label: 'Fib Fan' },
            { type: 'fibtimezone', label: 'Fib Time Zone' },
        ],
    },
    {
        id: 'patterns',
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="12" height="8" rx="1" />
            </svg>
        ),
        tools: [
            { type: 'rectangle', label: 'Rectangle' },
            { type: 'triangle', label: 'Triangle' },
            { type: 'flag', label: 'Flag' },
            { type: 'headshoulders', label: 'Head & Shoulders' },
            { type: 'abcd', label: 'ABCD Pattern' },
        ],
    },
    {
        id: 'annotate',
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 14l2-2 8-8 2 2-8 8-2 2z" />
                <path d="M11 4l3 3" />
            </svg>
        ),
        tools: [
            { type: 'text', label: 'Text' },
            { type: 'arrow', label: 'Arrow' },
            { type: 'callout', label: 'Callout' },
            { type: 'brush', label: 'Brush' },
            { type: 'highlighter', label: 'Highlighter' },
            { type: 'emoji', label: 'Emoji' },
        ],
    },
];

// ── Bottom tools ───────────────────────────────────────────────────────────────
const BOTTOM_TOOLS = [
    {
        id: 'measure',
        label: 'Measure',
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 9h12M9 3v12" />
            </svg>
        ),
    },
    {
        id: 'zoom',
        label: 'Zoom In',
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="5" />
                <line x1="12" y1="12" x2="16" y2="16" />
                <line x1="6" y1="8" x2="10" y2="8" />
                <line x1="8" y1="6" x2="8" y2="10" />
            </svg>
        ),
    },
    {
        id: 'trash',
        label: 'Clear All Drawings',
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 5h12M6 5V3h6v2M7 8v6M11 8v6M4 5l1 10h8l1-10" />
            </svg>
        ),
    },
];

// ── Component ──────────────────────────────────────────────────────────────────
interface DrawingSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function DrawingSidebar({ isOpen, onToggle }: DrawingSidebarProps) {
    const { activeTool, setActiveTool, cursorMode, setCursorMode } = useChart();

    const [flyout, setFlyout] = useState<string | null>(null);
    const [tooltipOnPress, setTooltipOnPress] = useState(true);
    const closeTimer = useRef<NodeJS.Timeout | null>(null);

    const openFlyout = (id: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setFlyout(id);
    };

    const closeFlyout = () => {
        closeTimer.current = setTimeout(() => setFlyout(null), 140);
    };

    const keepOpen = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };

    // Current cursor icon (changes based on selected mode)
    const currentCursor = CURSOR_MODES.find(c => c.id === cursorMode) || CURSOR_MODES[0];

    const isPointerActive = activeTool === 'none';

    return (
        <div
            className={styles.sidebar}
            style={{
                width: isOpen ? 44 : 0,
                minWidth: isOpen ? 44 : 0,
                overflow: 'hidden',
                transition: 'width 200ms cubic-bezier(0.4,0,0.2,1), min-width 200ms cubic-bezier(0.4,0,0.2,1)',
            }}
        >
            {/* ── Collapse toggle button ── */}
            <button
                className={styles.collapseBtn}
                onClick={onToggle}
                title={isOpen ? 'Hide drawing tools' : 'Show drawing tools'}
            >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    {isOpen
                        ? <polyline points="7,2 3,5 7,8" />
                        : <polyline points="3,2 7,5 3,8" />}
                </svg>
            </button>

            {/* ── Pointer group (Cross / Dot / Arrow / Demo / Eraser) ── */}
            <div
                className={styles.groupWrap}
                onMouseEnter={() => openFlyout('pointer')}
                onMouseLeave={closeFlyout}
            >
                <button
                    className={`${styles.iconBtn} ${isPointerActive ? styles.active : ''}`}
                    onClick={() => setActiveTool('none')}
                    title={currentCursor.label}
                >
                    {currentCursor.icon}
                    <span className={styles.arrow}>▸</span>
                </button>

                {flyout === 'pointer' && (
                    <div
                        className={styles.flyout}
                        onMouseEnter={keepOpen}
                        onMouseLeave={closeFlyout}
                    >
                        {CURSOR_MODES.map((cm) => (
                            <button
                                key={cm.id}
                                className={`${styles.flyoutItemRow} ${cursorMode === cm.id ? styles.flyoutActive : ''}`}
                                onClick={() => {
                                    setCursorMode(cm.id);
                                    setActiveTool('none');
                                    setFlyout(null);
                                }}
                            >
                                <span className={styles.flyoutItemIcon}>{cm.icon}</span>
                                <span className={styles.flyoutItemLabel}>{cm.label}</span>
                                {cm.starred && (
                                    <span className={styles.star}>★</span>
                                )}
                            </button>
                        ))}

                        {/* Divider */}
                        <div className={styles.flyoutDivider} />

                        {/* Values tooltip toggle */}
                        <div className={styles.flyoutToggleRow}>
                            <span className={styles.flyoutToggleLabel}>Values tooltip on long press</span>
                            <button
                                className={`${styles.toggle} ${tooltipOnPress ? styles.toggleOn : ''}`}
                                onClick={() => setTooltipOnPress(v => !v)}
                                aria-label="Toggle values tooltip"
                            >
                                <span className={styles.toggleThumb} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.sep} />

            {/* ── Drawing tool groups ── */}
            {TOOL_GROUPS.map((group) => {
                const isGroupActive = group.tools.some(t => t.type === activeTool);
                const activeLabel = group.tools.find(t => t.type === activeTool)?.label || group.tools[0].label;

                return (
                    <div
                        key={group.id}
                        className={styles.groupWrap}
                        onMouseEnter={() => openFlyout(group.id)}
                        onMouseLeave={closeFlyout}
                    >
                        <button
                            className={`${styles.iconBtn} ${isGroupActive ? styles.active : ''}`}
                            title={activeLabel}
                        >
                            {group.icon}
                            <span className={styles.arrow}>▸</span>
                        </button>

                        {flyout === group.id && (
                            <div
                                className={styles.flyout}
                                onMouseEnter={keepOpen}
                                onMouseLeave={closeFlyout}
                            >
                                <div className={styles.flyoutTitle}>
                                    {group.id.charAt(0).toUpperCase() + group.id.slice(1)}
                                </div>
                                {group.tools.map((tool) => (
                                    <button
                                        key={tool.type}
                                        className={`${styles.flyoutItem} ${activeTool === tool.type ? styles.flyoutActive : ''}`}
                                        onClick={() => { setActiveTool(tool.type); setFlyout(null); }}
                                    >
                                        {tool.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            <div className={styles.sep} />

            {/* ── Bottom utility tools ── */}
            {BOTTOM_TOOLS.map((bt) => (
                <button
                    key={bt.id}
                    className={styles.iconBtn}
                    title={bt.label}
                >
                    {bt.icon}
                </button>
            ))}

            {/* Spacer */}
            <div className={styles.spacer} />

            {/* Lock */}
            <button className={styles.iconBtn} title="Lock tools">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="8" width="10" height="8" rx="1.5" />
                    <path d="M6 8V6a3 3 0 016 0v2" />
                </svg>
            </button>
        </div>
    );
}
