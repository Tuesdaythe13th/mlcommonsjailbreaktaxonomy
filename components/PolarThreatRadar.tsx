'use client';

import React, { useState } from 'react';
import { FAMILIES, RADAR_AXES } from '@/lib/taxonomyData';
import { Crosshair, HelpCircle, Sparkles } from 'lucide-react';

export function PolarThreatRadar() {
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([
    'perturbation',
    'composition',
  ]);
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  const toggleFamily = (id: string) => {
    setSelectedFamilies((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((f) => f !== id)
          : prev
        : [...prev, id]
    );
  };

  // SVG Radar Geometry calculation
  const size = 520;
  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = RADAR_AXES.length;

  // Polar coordinate helper
  const getCoordinates = (axisIndex: number, scoreValue: number) => {
    const angle = (Math.PI * 2 * axisIndex) / totalAxes - Math.PI / 2;
    const r = (scoreValue / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // SVG Polygon paths in Red Noir colors
  const familyColors: Record<
    string,
    { stroke: string; fill: string; strokeWidth: number; dash?: string; dot: string }
  > = {
    perturbation: { stroke: '#ef233c', fill: 'rgba(239, 35, 60, 0.18)', strokeWidth: 2, dot: '#ef233c' },
    composition: { stroke: '#d90429', fill: 'rgba(217, 4, 41, 0.14)', strokeWidth: 2, dot: '#d90429' },
    encoding: { stroke: '#ff4d6d', fill: 'rgba(255, 77, 109, 0.12)', strokeWidth: 1.5, dash: '4,2', dot: '#ff4d6d' },
    overt: { stroke: '#FFFFFF', fill: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1.5, dash: '2,2', dot: '#FFFFFF' },
  };

  return (
    <section id="radar" className="w-full hairline-b bg-black/90 relative">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[SUBSYSTEM 04]</span>
          <span>6-AXIS OPERATIONAL THREAT RADAR</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">STANDARDIZED EMPIRICAL METRICS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">SCALE: 0.0 – 100.0</span>
          <span className="text-[#ef233c] font-bold">CALIBRATED</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 hairline-b">
          <div>
            <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
              MULTI-AXIS OPERATIONAL EVALUATION
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[-0.04em]">
              THREAT FINGERPRINT <span className="text-[#ef233c]">MATRIX</span>
            </h2>
          </div>

          {/* Family Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-1.5 rounded-full border border-white/10">
            {FAMILIES.map((fam) => {
              const active = selectedFamilies.includes(fam.id);
              const col = familyColors[fam.id]?.stroke || '#ef233c';
              return (
                <button
                  key={fam.id}
                  onClick={() => toggleFamily(fam.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all cursor-pointer flex items-center gap-2 border ${
                    active
                      ? 'bg-zinc-900 border-[#ef233c] text-white shadow-[0_0_12px_rgba(239,35,60,0.3)]'
                      : 'bg-transparent text-zinc-500 border-transparent hover:text-white'
                  }`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: col }}
                  />
                  <span>{fam.name.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Split Grid: Radar Canvas vs Telemetry Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mt-8 rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
          {/* Radar Graphic Area (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-white/10 bg-black/70">
            {/* Ambient center glow */}
            <div className="absolute w-[220px] h-[220px] bg-red-600/10 rounded-full blur-[70px] pointer-events-none" />

            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-w-[500px] h-auto select-none relative z-10"
            >
              {/* Concentric Grid Rings */}
              {[20, 40, 60, 80, 100].map((ringPercent) => {
                const points = RADAR_AXES.map((_, i) => {
                  const pt = getCoordinates(i, ringPercent);
                  return `${pt.x},${pt.y}`;
                }).join(' ');

                return (
                  <g key={ringPercent}>
                    <polygon
                      points={points}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                    {/* Ring label */}
                    <text
                      x={center + 4}
                      y={center - (ringPercent / 100) * radius + 10}
                      fill="#71717A"
                      fontSize="8"
                      fontFamily="monospace"
                      letterSpacing="0.1em"
                    >
                      {ringPercent}
                    </text>
                  </g>
                );
              })}

              {/* Radial Axis Lines */}
              {RADAR_AXES.map((axis, i) => {
                const pt = getCoordinates(i, 100);
                const isHovered = hoveredAxis === i;

                return (
                  <g key={axis} onMouseEnter={() => setHoveredAxis(i)} onMouseLeave={() => setHoveredAxis(null)}>
                    <line
                      x1={center}
                      y1={center}
                      x2={pt.x}
                      y2={pt.y}
                      stroke={isHovered ? '#ef233c' : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isHovered ? '1.5' : '1'}
                    />
                  </g>
                );
              })}

              {/* Radar Polygons for Active Families */}
              {FAMILIES.filter((f) => selectedFamilies.includes(f.id)).map((fam) => {
                const cfg = familyColors[fam.id];
                const points = fam.radarScores
                  .map((score, i) => {
                    const pt = getCoordinates(i, score);
                    return `${pt.x},${pt.y}`;
                  })
                  .join(' ');

                return (
                  <g key={fam.id}>
                    <polygon
                      points={points}
                      fill={cfg.fill}
                      stroke={cfg.stroke}
                      strokeWidth={cfg.strokeWidth}
                      strokeDasharray={cfg.dash || 'none'}
                    />
                    {/* Vertices */}
                    {fam.radarScores.map((score, i) => {
                      const pt = getCoordinates(i, score);
                      return (
                        <circle
                          key={i}
                          cx={pt.x}
                          cy={pt.y}
                          r={3.5}
                          fill={cfg.dot}
                          stroke="#000000"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Axis Titles (Outer Polar Ring) */}
              {RADAR_AXES.map((axis, i) => {
                const labelPt = getCoordinates(i, 118);
                const isHovered = hoveredAxis === i;

                return (
                  <text
                    key={axis}
                    x={labelPt.x}
                    y={labelPt.y + 4}
                    textAnchor={
                      Math.abs(labelPt.x - center) < 15
                        ? 'middle'
                        : labelPt.x > center
                        ? 'start'
                        : 'end'
                    }
                    fill={isHovered ? '#ef233c' : '#FFFFFF'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    letterSpacing="0.1em"
                    className="transition-colors uppercase select-none"
                  >
                    {axis}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Telemetry & Comparative Scores (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-zinc-950">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-3 border-b border-white/10">
                <span>OPERATIONAL AXIS BREAKDOWN</span>
                <span className="text-[#ef233c] font-bold">6 DIMENSIONS</span>
              </div>

              <div className="mt-6 space-y-3">
                {RADAR_AXES.map((axis, i) => {
                  const isHovered = hoveredAxis === i;
                  return (
                    <div
                      key={axis}
                      onMouseEnter={() => setHoveredAxis(i)}
                      onMouseLeave={() => setHoveredAxis(null)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-zinc-900 border-[#ef233c] shadow-[0_0_15px_rgba(239,35,60,0.2)]'
                          : 'bg-zinc-950/80 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-white">
                        <span className="font-bold flex items-center gap-1.5">
                          {isHovered && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
                          )}
                          {axis}
                        </span>
                        <span className="text-zinc-500 text-[10px]">DIM 0{i + 1}</span>
                      </div>

                      {/* Scores for selected families */}
                      <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                        {FAMILIES.filter((f) => selectedFamilies.includes(f.id)).map((fam) => (
                          <div key={fam.id} className="p-1.5 rounded bg-zinc-900/90 border border-white/5">
                            <span className="text-zinc-500 block truncate">
                              {fam.name.split(' ')[0]}
                            </span>
                            <span
                              className={`font-bold ${
                                fam.id === 'perturbation'
                                  ? 'text-[#ef233c]'
                                  : fam.id === 'composition'
                                  ? 'text-[#d90429]'
                                  : 'text-white'
                              }`}
                            >
                              {fam.radarScores[i].toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanatory Footnote */}
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-500 leading-relaxed">
              *Perturbation achieves highest automation (95.0) and transferability (90.0) via gradient
              triggers, while Encoding Abuse excels in evasion stealth (90.0) and resistance to alignment
              (95.0) by bypassing subword tokenization.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
