'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChart } from '@/lib/chart/chartContext';
import type { IChartApi } from 'lightweight-charts';
import styles from './DrawingCanvas.module.css';

interface Point { x: number; y: number }

interface Drawing {
    id: string;
    type: string;
    points: Point[];
    color: string;
    lineWidth: number;
    text?: string;
    emoji?: string;
}

interface DrawingCanvasProps {
    chartRef: React.RefObject<IChartApi | null>;
}

const TOOL_COLORS: Record<string, string> = {
    trendline: '#388bfd', ray: '#388bfd', extended: '#388bfd',
    horizontal: '#f7c948', vertical: '#8b949e',
    channel: '#58a6ff', regression: '#39c5cf',
    fibonacci: '#26a69a', fibextension: '#e3b341', fibfan: '#db6d28', fibtimezone: '#8957e5',
    rectangle: '#388bfd', triangle: '#f7c948', flag: '#26a69a',
    headshoulders: '#db6d28', abcd: '#b083f0',
    text: '#e6edf3', callout: '#e6edf3', arrow: '#f85149',
    brush: '#58a6ff', highlighter: 'rgba(247,201,72,0.3)', emoji: '#f7c948',
};

const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
const FIB_COLORS = ['#26a69a', '#f7c948', '#f7c948', '#db6d28', '#db6d28', '#f85149', '#26a69a'];
const FIB_EXT_LEVELS = [1.0, 1.272, 1.618, 2.0, 2.618];
const FIB_EXT_COLORS = ['#8b949e', '#f7c948', '#26a69a', '#388bfd', '#8957e5'];

// Tools that only need 1 click
const SINGLE_CLICK_TOOLS = new Set(['horizontal', 'vertical', 'text', 'callout', 'emoji']);
// Tools that need 3+ clicks (we'll implement as 2-click for simplicity)
const THREE_POINT_TOOLS = new Set(['headshoulders', 'abcd', 'triangle', 'flag', 'channel', 'regression', 'fibextension', 'fibfan', 'fibtimezone']);

export default function DrawingCanvas({ chartRef }: DrawingCanvasProps) {
    const { activeTool, magnetMode, setActiveTool, cursorMode } = useChart();
    const canvasRef = useRef<SVGSVGElement>(null);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [activeDrawing, setActiveDrawing] = useState<Partial<Drawing> | null>(null);
    const [mousePos, setMousePos] = useState<Point | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [brushPath, setBrushPath] = useState<Point[]>([]);
    const [isBrushing, setIsBrushing] = useState(false);

    const isDrawing = activeTool !== 'none';
    const isBrushTool = activeTool === 'brush' || activeTool === 'highlighter';

    // Determine the CSS cursor for the SVG canvas
    const svgCursor = (() => {
        if (isDrawing) return 'crosshair';
        switch (cursorMode) {
            case 'cross': return 'crosshair';
            case 'dot': return 'none'; // we draw our own dot
            case 'arrow': return 'default';
            case 'demo': return 'none'; // laser pointer
            case 'eraser': return 'cell';
            default: return 'crosshair';
        }
    })();

    const getPoint = useCallback((e: React.MouseEvent): Point => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const pt = getPoint(e);
        setMousePos(pt);
        if (isDrawing && isBrushTool && isBrushing) {
            setBrushPath(prev => [...prev, pt]);
        }
    }, [isDrawing, isBrushTool, isBrushing, getPoint]);
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // Eraser mode: find nearest drawing and delete it
        if (!isDrawing && cursorMode === 'eraser') {
            const pt = getPoint(e);
            const HIT = 14; // px radius
            const hit = drawings.find(d => {
                if (d.points.length === 0) return false;
                // Check distance to each segment
                for (let i = 0; i < d.points.length; i++) {
                    const p = d.points[i];
                    const dx = pt.x - p.x, dy = pt.y - p.y;
                    if (Math.sqrt(dx * dx + dy * dy) < HIT) return true;
                    if (i > 0) {
                        // distance to segment
                        const p0 = d.points[i - 1];
                        const lx = p.x - p0.x, ly = p.y - p0.y;
                        const len2 = lx * lx + ly * ly;
                        if (len2 > 0) {
                            const t = Math.max(0, Math.min(1, ((pt.x - p0.x) * lx + (pt.y - p0.y) * ly) / len2));
                            const cx = p0.x + t * lx - pt.x;
                            const cy = p0.y + t * ly - pt.y;
                            if (Math.sqrt(cx * cx + cy * cy) < HIT) return true;
                        }
                    }
                }
                return false;
            });
            if (hit) setDrawings(prev => prev.filter(d => d.id !== hit.id));
            return;
        }

        if (!isDrawing) return;
        const pt = getPoint(e);

        if (isBrushTool) {
            setIsBrushing(true);
            setBrushPath([pt]);
            return;
        }

        if (SINGLE_CLICK_TOOLS.has(activeTool)) {
            const drawing: Drawing = {
                id: `d-${Date.now()}`,
                type: activeTool,
                points: [pt],
                color: TOOL_COLORS[activeTool] || '#388bfd',
                lineWidth: 1.5,
                emoji: activeTool === 'emoji' ? '⭐' : undefined,
            };
            setDrawings(prev => [...prev, drawing]);
            setActiveTool('none');
            return;
        }

        if (!activeDrawing) {
            setActiveDrawing({ type: activeTool, points: [pt], color: TOOL_COLORS[activeTool] || '#388bfd', lineWidth: 1.5 });
        } else {
            const points = [...(activeDrawing.points || []), pt];
            const needsMore = THREE_POINT_TOOLS.has(activeTool) && points.length < 3;
            if (needsMore) {
                setActiveDrawing({ ...activeDrawing, points });
            } else {
                const finalDrawing: Drawing = {
                    id: `d-${Date.now()}`,
                    type: activeDrawing.type!,
                    points,
                    color: activeDrawing.color || '#388bfd',
                    lineWidth: activeDrawing.lineWidth || 1.5,
                };
                setDrawings(prev => [...prev, finalDrawing]);
                setActiveDrawing(null);
                setActiveTool('none');
            }
        }
    }, [isDrawing, isBrushTool, activeTool, activeDrawing, getPoint, setActiveTool]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (!isBrushTool || !isBrushing) return;
        setIsBrushing(false);
        if (brushPath.length > 1) {
            const drawing: Drawing = {
                id: `d-${Date.now()}`,
                type: activeTool,
                points: brushPath,
                color: TOOL_COLORS[activeTool] || '#58a6ff',
                lineWidth: activeTool === 'highlighter' ? 16 : 2,
            };
            setDrawings(prev => [...prev, drawing]);
        }
        setBrushPath([]);
        setActiveTool('none');
    }, [isBrushTool, isBrushing, brushPath, activeTool, setActiveTool]);

    const renderDrawing = (d: Drawing, preview?: boolean, previewEnd?: Point) => {
        const pts = preview && previewEnd ? [...(d.points || []), previewEnd] : (d.points || []);
        if (pts.length < 1) return null;
        const color = d.color;
        const key = d.id || 'preview';

        switch (d.type) {
            case 'trendline':
            case 'extended': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                return (
                    <g key={key}>
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={d.lineWidth} />
                        {!preview && <><circle cx={p1.x} cy={p1.y} r={3} fill={color} /><circle cx={p2.x} cy={p2.y} r={3} fill={color} /></>}
                    </g>
                );
            }
            case 'ray': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                // Extend far to the right
                const dx = p2.x - p1.x, dy = p2.y - p1.y;
                const scale = dx !== 0 ? (3000 - p1.x) / dx : 0;
                const ex = p1.x + dx * scale, ey = p1.y + dy * scale;
                return <line key={key} x1={p1.x} y1={p1.y} x2={ex} y2={ey} stroke={color} strokeWidth={d.lineWidth} strokeDasharray="6 3" />;
            }
            case 'horizontal': {
                const p = pts[0];
                return <line key={key} x1={0} y1={p.y} x2="105%" y2={p.y} stroke={color} strokeWidth={d.lineWidth} strokeDasharray="5 3" />;
            }
            case 'vertical': {
                const p = pts[0];
                return <line key={key} x1={p.x} y1={0} x2={p.x} y2="105%" stroke={color} strokeWidth={d.lineWidth} strokeDasharray="5 3" />;
            }
            case 'channel':
            case 'regression': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const offset = pts.length >= 3 ? (pts[2].y - p1.y) : 45;
                return (
                    <g key={key}>
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={d.lineWidth} />
                        <line x1={p1.x} y1={p1.y + offset} x2={p2.x} y2={p2.y + offset} stroke={color} strokeWidth={d.lineWidth} strokeDasharray="5 3" />
                        <line x1={p1.x} y1={(p1.y + p1.y + offset) / 2} x2={p2.x} y2={(p2.y + p2.y + offset) / 2} stroke={color} strokeWidth={0.8} strokeDasharray="3 4" opacity={0.5} />
                        <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p2.x},${p2.y + offset} ${p1.x},${p1.y + offset}`} fill={`${color}12`} />
                        {!preview && pts.length >= 3 && pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />)}
                    </g>
                );
            }
            case 'rectangle': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                return (
                    <rect key={key}
                        x={Math.min(p1.x, p2.x)} y={Math.min(p1.y, p2.y)}
                        width={Math.abs(p2.x - p1.x)} height={Math.abs(p2.y - p1.y)}
                        fill={`${color}1a`} stroke={color} strokeWidth={d.lineWidth} />
                );
            }
            case 'triangle': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const p3 = pts[2] || previewEnd || { x: (p1.x + p2.x) / 2, y: Math.min(p1.y, p2.y) - 60 };
                return <polygon key={key} points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill={`${color}1a`} stroke={color} strokeWidth={d.lineWidth} />;
            }
            case 'flag': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const poleH = 60;
                return (
                    <g key={key}>
                        {/* Pole */}
                        <line x1={p1.x} y1={p1.y} x2={p1.x} y2={p1.y - poleH} stroke={color} strokeWidth={d.lineWidth} />
                        {/* Flag */}
                        <polygon points={`${p1.x},${p1.y - poleH} ${p2.x},${p2.y - poleH / 2} ${p1.x},${p1.y - poleH / 3}`} fill={`${color}44`} stroke={color} strokeWidth={d.lineWidth} />
                    </g>
                );
            }
            case 'fibonacci': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const totalH = p2.y - p1.y;
                const minX = Math.min(p1.x, p2.x);
                const maxX = Math.max(p1.x, p2.x);
                return (
                    <g key={key}>
                        {FIB_LEVELS.map((l, i) => {
                            const y = p1.y + totalH * l;
                            return (
                                <g key={l}>
                                    <line x1={minX} y1={y} x2={maxX} y2={y} stroke={FIB_COLORS[i]} strokeWidth={1} strokeDasharray="4 2" opacity={0.85} />
                                    <text x={maxX + 6} y={y + 4} fill={FIB_COLORS[i]} fontSize={10} fontFamily="monospace">{(l * 100).toFixed(1)}%</text>
                                </g>
                            );
                        })}
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={1} opacity={0.4} />
                    </g>
                );
            }
            case 'fibextension': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const range = p2.y - p1.y;
                const minX = Math.min(p1.x, p2.x);
                const maxX = Math.max(p1.x, p2.x);
                return (
                    <g key={key}>
                        {FIB_EXT_LEVELS.map((l, i) => {
                            const y = p2.y + range * (l - 1);
                            return (
                                <g key={l}>
                                    <line x1={minX} y1={y} x2={maxX} y2={y} stroke={FIB_EXT_COLORS[i]} strokeWidth={1} strokeDasharray="4 2" opacity={0.85} />
                                    <text x={maxX + 6} y={y + 4} fill={FIB_EXT_COLORS[i]} fontSize={10} fontFamily="monospace">{(l * 100).toFixed(1)}%</text>
                                </g>
                            );
                        })}
                    </g>
                );
            }
            case 'fibfan': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                return (
                    <g key={key}>
                        {[0.236, 0.382, 0.5, 0.618, 0.786].map((l, i) => {
                            const ey = p1.y + dy * l;
                            const scale = dx !== 0 ? (3000 - p1.x) / dx : 1;
                            const ex = p1.x + dx * scale;
                            const eyScaled = p1.y + (ey - p1.y) * scale;
                            return <line key={l} x1={p1.x} y1={p1.y} x2={ex} y2={eyScaled} stroke={FIB_COLORS[i + 1]} strokeWidth={1} strokeDasharray="5 3" opacity={0.8} />;
                        })}
                        <circle cx={p1.x} cy={p1.y} r={4} fill={color} />
                        <text x={p1.x + 6} y={p1.y - 6} fill={color} fontSize={10}>Fan</text>
                    </g>
                );
            }
            case 'fibtimezone': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const step = p2.x - p1.x;
                const fibNums = [1, 2, 3, 5, 8, 13, 21];
                return (
                    <g key={key}>
                        <line x1={p1.x} y1={0} x2={p1.x} y2="100%" stroke={color} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9} />
                        {fibNums.map((n, i) => {
                            const x = p1.x + step * n;
                            return (
                                <g key={n}>
                                    <line x1={x} y1={0} x2={x} y2="100%" stroke={FIB_COLORS[Math.min(i, FIB_COLORS.length - 1)]} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.7} />
                                    <text x={x + 3} y={16} fill={FIB_COLORS[Math.min(i, FIB_COLORS.length - 1)]} fontSize={10} fontFamily="monospace">{n}</text>
                                </g>
                            );
                        })}
                    </g>
                );
            }
            case 'headshoulders': {
                const [p1, p2] = pts;
                if (!p2) return null;
                const p3 = pts[2] || previewEnd;
                if (!p3) return (
                    <g key={key}>
                        <circle cx={p1.x} cy={p1.y} r={4} fill={color} />
                        <circle cx={p2.x} cy={p2.y} r={6} fill={color} opacity={0.8} />
                    </g>
                );
                // Left shoulder, head, right shoulder
                const neckY = Math.max(p1.y, p3.y) + 20;
                return (
                    <g key={key}>
                        <polyline points={`${p1.x - 30},${neckY} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p3.x + 30},${neckY}`} fill="none" stroke={color} strokeWidth={d.lineWidth} />
                        <line x1={p1.x - 30} y1={neckY} x2={p3.x + 30} y2={neckY} stroke="#f85149" strokeWidth={1} strokeDasharray="5 3" />
                        {['L', 'H', 'R'].map((label, i) => {
                            const lp = [p1, p2, p3][i];
                            return <text key={label} x={lp.x - 4} y={lp.y - 8} fill={color} fontSize={11} fontWeight="600">{label}</text>;
                        })}
                    </g>
                );
            }
            case 'abcd': {
                if (pts.length < 2) return null;
                const labels = ['A', 'B', 'C', 'D'];
                const allPts = [...pts, ...(previewEnd && preview ? [previewEnd] : [])];
                return (
                    <g key={key}>
                        {allPts.slice(0, -1).map((p, i) => (
                            <line key={i} x1={p.x} y1={p.y} x2={allPts[i + 1].x} y2={allPts[i + 1].y} stroke={color} strokeWidth={d.lineWidth} />
                        ))}
                        {allPts.map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r={4} fill={color} />
                                <text x={p.x + 5} y={p.y - 5} fill={color} fontSize={11} fontWeight="700">{labels[i]}</text>
                            </g>
                        ))}
                    </g>
                );
            }
            case 'text':
            case 'callout': {
                const p = pts[0];
                const label = d.text || (d.type === 'callout' ? '💬 Note' : 'Label');
                return (
                    <g key={key}>
                        {d.type === 'callout' && <line x1={p.x} y1={p.y} x2={p.x + 10} y2={p.y - 20} stroke={color} strokeWidth={1} />}
                        <rect x={p.x + (d.type === 'callout' ? 10 : 0)} y={p.y - 30} width={Math.max(label.length * 7, 60)} height={22} fill="#161b22" stroke={color} strokeWidth={1} rx={3} />
                        <text x={p.x + (d.type === 'callout' ? 16 : 6)} y={p.y - 14} fill={color} fontSize={11}>{label}</text>
                    </g>
                );
            }
            case 'arrow': {
                if (pts.length < 2) return null;
                const [p1, p2] = pts;
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                const L = 12;
                return (
                    <g key={key}>
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={d.lineWidth + 0.5} />
                        <polygon fill={color} points={`
                            ${p2.x},${p2.y}
                            ${p2.x - L * Math.cos(angle - 0.4)},${p2.y - L * Math.sin(angle - 0.4)}
                            ${p2.x - L * Math.cos(angle + 0.4)},${p2.y - L * Math.sin(angle + 0.4)}
                        `} />
                    </g>
                );
            }
            case 'brush': {
                if (pts.length < 2) return null;
                const pathData = `M ${pts.map(p => `${p.x},${p.y}`).join(' L ')}`;
                return <path key={key} d={pathData} fill="none" stroke={color} strokeWidth={d.lineWidth} strokeLinecap="round" strokeLinejoin="round" />;
            }
            case 'highlighter': {
                if (pts.length < 2) return null;
                const pathData = `M ${pts.map(p => `${p.x},${p.y}`).join(' L ')}`;
                return <path key={key} d={pathData} fill="none" stroke="rgba(247,201,72,0.25)" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />;
            }
            case 'emoji': {
                const p = pts[0];
                return <text key={key} x={p.x - 10} y={p.y + 10} fontSize={22}>{d.emoji || '⭐'}</text>;
            }
            default:
                return null;
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDrawings(prev => prev.filter(d => d.id !== id));
        setSelectedId(null);
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (!isDrawing) setSelectedId(null);
    };

    return (
        <svg
            ref={canvasRef}
            className={`${styles.canvas} ${isDrawing ? styles.drawing : ''}`}
            style={{ cursor: svgCursor, pointerEvents: (isDrawing || cursorMode !== 'cross') ? 'all' : 'none' }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setMousePos(null)}
            onClick={handleCanvasClick}
        >
            <defs>
                <style>{`
                    .drawing-selected { filter: drop-shadow(0 0 4px rgba(56,139,253,0.8)); }
                `}</style>
            </defs>

            {/* Finished drawings */}
            {drawings.map((d) => (
                <g
                    key={d.id}
                    onClick={(e) => {
                        if (cursorMode === 'eraser') {
                            setDrawings(prev => prev.filter(x => x.id !== d.id));
                            e.stopPropagation();
                            return;
                        }
                        if (!isDrawing) setSelectedId(selectedId === d.id ? null : d.id);
                    }}
                    className={selectedId === d.id ? 'drawing-selected' : ''}
                    style={{ cursor: cursorMode === 'eraser' ? 'cell' : (isDrawing ? 'crosshair' : 'pointer') }}
                >
                    {renderDrawing(d)}
                    {selectedId === d.id && (
                        <g>
                            <circle cx={(d.points[0]?.x || 0) - 12} cy={(d.points[0]?.y || 0) - 14} r={8} fill="#ef5350" opacity={0.9} style={{ cursor: 'pointer' }} />
                            <text
                                x={(d.points[0]?.x || 0) - 16} y={(d.points[0]?.y || 0) - 10}
                                fill="#fff" fontSize={11} fontWeight="700"
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                onClick={(e) => handleDelete(d.id, e)}
                            >✕</text>
                        </g>
                    )}
                </g>
            ))}

            {/* Active brush preview */}
            {isBrushTool && isBrushing && brushPath.length > 1 && (
                <path
                    d={`M ${brushPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
                    fill="none"
                    stroke={activeTool === 'highlighter' ? 'rgba(247,201,72,0.25)' : '#58a6ff'}
                    strokeWidth={activeTool === 'highlighter' ? 20 : 2}
                    strokeLinecap="round" strokeLinejoin="round"
                />
            )}

            {/* Preview of in-progress drawing */}
            {activeDrawing && mousePos && renderDrawing(activeDrawing as Drawing, true, mousePos)}

            {/* Cursor mode overlays (no pointer-events so chart remains interactive) */}

            {/* DOT mode: small dot at cursor */}
            {cursorMode === 'dot' && !isDrawing && mousePos && (
                <g pointerEvents="none">
                    <circle cx={mousePos.x} cy={mousePos.y} r={5} fill="#2962ff" />
                    <circle cx={mousePos.x} cy={mousePos.y} r={8} fill="none" stroke="#2962ff" strokeWidth={1} opacity={0.4} />
                </g>
            )}

            {/* DEMO (laser pointer) mode */}
            {cursorMode === 'demo' && !isDrawing && mousePos && (
                <g pointerEvents="none">
                    {/* Outer glow ring */}
                    <circle cx={mousePos.x} cy={mousePos.y} r={22} fill="none" stroke="#ef5350" strokeWidth={1.5} opacity={0.25} />
                    <circle cx={mousePos.x} cy={mousePos.y} r={15} fill="none" stroke="#ef5350" strokeWidth={2} opacity={0.5} />
                    {/* Core dot */}
                    <circle cx={mousePos.x} cy={mousePos.y} r={6} fill="#ef5350" opacity={0.9} />
                    <circle cx={mousePos.x} cy={mousePos.y} r={2.5} fill="#fff" />
                    {/* Cross hairs */}
                    <line x1={mousePos.x - 28} y1={mousePos.y} x2={mousePos.x - 18} y2={mousePos.y} stroke="#ef5350" strokeWidth={1.5} opacity={0.6} />
                    <line x1={mousePos.x + 18} y1={mousePos.y} x2={mousePos.x + 28} y2={mousePos.y} stroke="#ef5350" strokeWidth={1.5} opacity={0.6} />
                    <line x1={mousePos.x} y1={mousePos.y - 28} x2={mousePos.x} y2={mousePos.y - 18} stroke="#ef5350" strokeWidth={1.5} opacity={0.6} />
                    <line x1={mousePos.x} y1={mousePos.y + 18} x2={mousePos.x} y2={mousePos.y + 28} stroke="#ef5350" strokeWidth={1.5} opacity={0.6} />
                </g>
            )}

            {/* ERASER mode: show eraser circle at cursor */}
            {cursorMode === 'eraser' && !isDrawing && mousePos && (
                <g pointerEvents="none">
                    <circle cx={mousePos.x} cy={mousePos.y} r={14} fill="none" stroke="#ef5350" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.7} />
                    <circle cx={mousePos.x} cy={mousePos.y} r={2} fill="#ef5350" />
                </g>
            )}

            {/* Drawing tool cursor indicator */}
            {isDrawing && mousePos && !isBrushTool && (
                <g pointerEvents="none">
                    <circle cx={mousePos.x} cy={mousePos.y} r={5} fill="#388bfd" fillOpacity={0.5} />
                    <circle cx={mousePos.x} cy={mousePos.y} r={2} fill="#388bfd" />
                </g>
            )}

            {/* First point placed indicator */}
            {activeDrawing?.points?.[0] && (
                <circle
                    cx={activeDrawing.points[0].x}
                    cy={activeDrawing.points[0].y}
                    r={4} fill={activeDrawing.color || '#388bfd'}
                    pointerEvents="none"
                />
            )}
        </svg>
    );
}
