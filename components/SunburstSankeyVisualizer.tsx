'use client';

import React, { useState } from 'react';
import { FAMILIES, CATEGORIES, LEAVES } from '@/lib/taxonomyData';
import { Network, ZoomIn, ZoomOut, RotateCcw, Filter, ExternalLink, Sparkles } from 'lucide-react';

interface SunburstSankeyVisualizerProps {
  onSelectLeaf: (leafName: string) => void;
}

// Pre-computed static geometry angles for 113 attacks
const TOTAL_ATTACKS = 113;

const PRECOMPUTED_FAMILY_RINGS = FAMILIES.reduce<
  (typeof FAMILIES[number] & { startAngle: number; endAngle: number })[]
>((acc, fam) => {
  const prevEnd = acc.length > 0 ? acc[acc.length - 1].endAngle : -Math.PI / 2;
  const sweep = (fam.attackCount / TOTAL_ATTACKS) * 2 * Math.PI;
  acc.push({
    ...fam,
    startAngle: Math.round(prevEnd * 100000) / 100000,
    endAngle: Math.round((prevEnd + sweep) * 100000) / 100000,
  });
  return acc;
}, []);

const PRECOMPUTED_CATEGORY_RINGS = CATEGORIES.reduce<
  (typeof CATEGORIES[number] & { startAngle: number; endAngle: number; familyId: string })[]
>((acc, cat) => {
  const prevEnd = acc.length > 0 ? acc[acc.length - 1].endAngle : -Math.PI / 2;
  const sweep = (cat.attackCount / TOTAL_ATTACKS) * 2 * Math.PI;
  const fam = FAMILIES.find((f) => f.name === cat.family);
  acc.push({
    ...cat,
    startAngle: Math.round(prevEnd * 100000) / 100000,
    endAngle: Math.round((prevEnd + sweep) * 100000) / 100000,
    familyId: fam?.id || 'perturbation',
  });
  return acc;
}, []);

const PRECOMPUTED_LEAF_RINGS = LEAVES.reduce<
  (typeof LEAVES[number] & { startAngle: number; endAngle: number })[]
>((acc, leaf) => {
  const prevEnd = acc.length > 0 ? acc[acc.length - 1].endAngle : -Math.PI / 2;
  const sweep = (leaf.attackCount / TOTAL_ATTACKS) * 2 * Math.PI;
  acc.push({
    ...leaf,
    startAngle: Math.round(prevEnd * 100000) / 100000,
    endAngle: Math.round((prevEnd + sweep) * 100000) / 100000,
  });
  return acc;
}, []);

const emptySubscribe = () => () => {};

export function SunburstSankeyVisualizer({ onSelectLeaf }: SunburstSankeyVisualizerProps) {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [activeTab, setActiveTab] = useState<'sunburst' | 'sankey'>('sunburst');
  const [hoveredItem, setHoveredItem] = useState<{
    tier: string;
    name: string;
    prevalence: string | number;
    count: number;
    details?: string;
  } | null>(null);

  const size = 560;
  const center = size / 2;
  const familyRings = PRECOMPUTED_FAMILY_RINGS;
  const categoryRings = PRECOMPUTED_CATEGORY_RINGS;
  const leafRings = PRECOMPUTED_LEAF_RINGS;

  // SVG Arc generator with deterministic 2-decimal precision
  const createArc = (
    rInner: number,
    rOuter: number,
    startAngle: number,
    endAngle: number
  ) => {
    const safeEnd = endAngle - 0.001 < startAngle ? startAngle + 0.001 : endAngle;
    const x1 = (center + rOuter * Math.cos(startAngle)).toFixed(2);
    const y1 = (center + rOuter * Math.sin(startAngle)).toFixed(2);
    const x2 = (center + rOuter * Math.cos(safeEnd)).toFixed(2);
    const y2 = (center + rOuter * Math.sin(safeEnd)).toFixed(2);
    const x3 = (center + rInner * Math.cos(safeEnd)).toFixed(2);
    const y3 = (center + rInner * Math.sin(safeEnd)).toFixed(2);
    const x4 = (center + rInner * Math.cos(startAngle)).toFixed(2);
    const y4 = (center + rInner * Math.sin(startAngle)).toFixed(2);

    const largeArc = safeEnd - startAngle > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const familyColors: Record<string, string> = {
    perturbation: '#ef233c',
    composition: '#d90429',
    encoding: '#c1121f',
    overt: '#780000',
  };

  return (
    <section id="visual-analysis" className="w-full hairline-b bg-black/80 relative">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[SUBSYSTEM 08]</span>
          <span>EMPIRICAL THREAT PIPELINE VISUALIZATION</span>
          <span className="text-zinc-700">/</span>
          <span className="text-white">{activeTab.toUpperCase()} PIPELINE MAP</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">113 ATTACKS · 4 FAMILIES · 8 CATEGORIES · 18 LEAVES</span>
          <span className="text-[#ef233c] font-bold">100.0% RECONCILED</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 hairline-b">
          <div>
            <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
              EXACT SCIENTIFIC FLOW PROJECTION
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[-0.04em]">
              HIERARCHY &amp; <span className="text-[#ef233c]">FLOW MAPS</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-400 max-w-2xl font-inter leading-relaxed">
              Reconciles the notebook’s multi-tiered Sunburst hierarchy and Sankey threat flow
              pipeline in pure SVG with Red Noir hairline precision.
            </p>
          </div>

          {/* Toggle pill buttons */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setActiveTab('sunburst')}
              className={`rounded-full px-5 py-2 text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'sunburst'
                  ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_15px_rgba(239,35,60,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3-TIER SUNBURST
            </button>
            <button
              onClick={() => setActiveTab('sankey')}
              className={`rounded-full px-5 py-2 text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'sankey'
                  ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_15px_rgba(239,35,60,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              SANKEY PIPELINE (113)
            </button>
          </div>
        </div>

        {/* Viewport Canvas Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mt-8 rounded-2xl border border-white/10 bg-zinc-950/90 overflow-hidden shadow-2xl">
          {/* Main Visualizer Area (8 Cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-white/10 bg-black/60 min-h-[580px]">
            {!mounted ? (
              <div className="w-full max-w-[540px] h-[540px] flex flex-col items-center justify-center text-xs font-mono text-zinc-500 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#ef233c] border-t-transparent animate-spin" />
                <span>INITIALIZING VECTOR SUNBURST GEOMETRY...</span>
              </div>
            ) : activeTab === 'sunburst' ? (
              /* TAB 1: 3-TIER INTERACTIVE SUNBURST IN RED NOIR */
              <div className="w-full max-w-[540px] flex items-center justify-center relative" suppressHydrationWarning>
                {/* Ambient Center Glow */}
                <div className="absolute w-[240px] h-[240px] bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />

                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto select-none relative z-10" suppressHydrationWarning>
                  {/* Center Root Disc */}
                  <circle
                    cx={center}
                    cy={center}
                    r={45}
                    fill="#000000"
                    stroke="#ef233c"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-105"
                    onMouseEnter={() =>
                      setHoveredItem({
                        tier: 'ROOT',
                        name: 'MLCOMMONS AIRR ROOT',
                        prevalence: '100.0%',
                        count: 113,
                        details: 'Single-Turn Inference-Time Prompt Attack Taxonomy (v0.7.0)',
                      })
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                  />
                  <text
                    x={center}
                    y={center - 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="0.1em"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    AIRR
                  </text>
                  <text
                    x={center}
                    y={center + 11}
                    textAnchor="middle"
                    fill="#ef233c"
                    fontSize="8"
                    fontFamily="monospace"
                    letterSpacing="0.08em"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    113 ATK
                  </text>

                  {/* Tier 1 Ring: 4 Primary Families (Radius 52 to 105) */}
                  {familyRings.map((fam) => {
                    const d = createArc(52, 105, fam.startAngle, fam.endAngle);
                    const color = familyColors[fam.id] || '#ef233c';

                    return (
                      <g key={fam.id}>
                        <path
                          d={d}
                          suppressHydrationWarning
                          fill={color}
                          stroke="#000000"
                          strokeWidth="2"
                          className="hover:opacity-90 transition-opacity cursor-pointer"
                          onMouseEnter={() =>
                            setHoveredItem({
                              tier: 'FAMILY PILLAR',
                              name: fam.name,
                              prevalence: `${fam.prevalence}%`,
                              count: fam.attackCount,
                              details: fam.strategy,
                            })
                          }
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                      </g>
                    );
                  })}

                  {/* Tier 2 Ring: 8 Categories (Radius 110 to 165) */}
                  {categoryRings.map((cat, i) => {
                    const d = createArc(110, 165, cat.startAngle, cat.endAngle);
                    const catFill = i % 2 === 0 ? 'rgba(239, 35, 60, 0.45)' : 'rgba(217, 4, 41, 0.35)';
                    return (
                      <path
                        key={cat.id}
                        d={d}
                        suppressHydrationWarning
                        fill={catFill}
                        stroke="#000000"
                        strokeWidth="1.5"
                        className="hover:opacity-90 hover:fill-[#ef233c] transition-all cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredItem({
                            tier: 'CATEGORY SPLIT AXIS',
                            name: cat.name,
                            prevalence: `${((cat.attackCount / 113) * 100).toFixed(2)}%`,
                            count: cat.attackCount,
                            details: `Family: ${cat.family} // ${cat.leafCount} Atomic Leaves`,
                          })
                        }
                        onMouseLeave={() => setHoveredItem(null)}
                      />
                    );
                  })}

                  {/* Tier 3 Ring: 18 Atomic Leaves (Radius 170 to 225) */}
                  {leafRings.map((leaf, idx) => {
                    const d = createArc(170, 225, leaf.startAngle, leaf.endAngle);
                    const leafFill = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(239, 35, 60, 0.2)';
                    return (
                      <path
                        key={leaf.id}
                        d={d}
                        suppressHydrationWarning
                        fill={leafFill}
                        stroke="#000000"
                        strokeWidth="1.2"
                        className="hover:fill-[#ef233c] transition-colors cursor-pointer"
                        onClick={() => onSelectLeaf(leaf.name)}
                        onMouseEnter={() =>
                          setHoveredItem({
                            tier: 'ATOMIC LEAF MECHANISM',
                            name: leaf.name,
                            prevalence: `${leaf.prevalence}%`,
                            count: leaf.attackCount,
                            details: `${leaf.summary} (Click to filter catalog)`,
                          })
                        }
                        onMouseLeave={() => setHoveredItem(null)}
                      />
                    );
                  })}
                </svg>

                {/* Subtitle watermark */}
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-zinc-500">
                  RADIAL: ROOT ➔ FAMILY ➔ CATEGORY ➔ LEAF
                </div>
              </div>
            ) : (
              /* TAB 2: SANKEY THREAT FLOW PIPELINE IN RED NOIR */
              <div className="w-full h-full flex flex-col justify-between py-2">
                <div className="text-[10px] font-mono text-zinc-500 mb-3 flex items-center justify-between">
                  <span>TIER 0: 4 FAMILIES (LEFT)</span>
                  <span>TIER 1: 8 CATEGORIES (MIDDLE)</span>
                  <span>TIER 2: 18 LEAVES (RIGHT)</span>
                </div>

                {/* Flow Streams */}
                <div className="flex-1 flex gap-4 text-xs font-mono">
                  {/* Column 1: Families */}
                  <div className="flex-1 flex flex-col justify-between gap-2">
                    {FAMILIES.map((fam) => (
                      <div
                        key={fam.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          fam.id === 'perturbation'
                            ? 'bg-zinc-900 border-[#ef233c] text-white shadow-[0_0_15px_rgba(239,35,60,0.2)]'
                            : 'bg-zinc-950/70 border-white/10 text-zinc-300 hover:border-white/20'
                        }`}
                        onMouseEnter={() =>
                          setHoveredItem({
                            tier: 'FAMILY PILLAR',
                            name: fam.name,
                            prevalence: `${fam.prevalence}%`,
                            count: fam.attackCount,
                            details: fam.strategy,
                          })
                        }
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="text-[9px] font-bold text-[#ef233c]">{fam.code}</div>
                        <div className="font-display font-bold text-sm tracking-tight truncate text-white">
                          {fam.name}
                        </div>
                        <div className="text-[10px] font-mono mt-1 flex justify-between text-zinc-400">
                          <span>{fam.attackCount} ATKS</span>
                          <span className="text-[#ef233c] font-bold">{fam.prevalence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Flow Connector Trace Column */}
                  <div className="w-10 flex flex-col justify-around py-4 items-center">
                    <div className="w-[1px] h-full bg-white/10 flex flex-col justify-between items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <div className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c] animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    </div>
                  </div>

                  {/* Column 2: Categories */}
                  <div className="flex-1 flex flex-col justify-between gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-2 rounded bg-zinc-950/80 border border-white/5 hover:border-[#ef233c]/50 hover:bg-zinc-900/60 transition-colors cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredItem({
                            tier: 'CATEGORY NODE',
                            name: cat.name,
                            prevalence: `${((cat.attackCount / 113) * 100).toFixed(2)}%`,
                            count: cat.attackCount,
                            details: `Split Axis for ${cat.family}`,
                          })
                        }
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="font-bold text-[11px] text-zinc-200 truncate">{cat.name}</div>
                        <div className="text-[9px] text-zinc-500 flex justify-between mt-0.5">
                          <span>{cat.family.split(' ')[0]}</span>
                          <span className="font-bold text-[#ef233c]">{cat.attackCount} ATKS</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Flow Connector Trace Column */}
                  <div className="w-10 flex flex-col justify-around py-4 items-center">
                    <div className="w-[1px] h-full bg-white/10 flex flex-col justify-between items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <div className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c] animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    </div>
                  </div>

                  {/* Column 3: 18 Atomic Leaves */}
                  <div className="flex-1 flex flex-col justify-between gap-1 max-h-[500px] overflow-y-auto pr-1">
                    {LEAVES.map((leaf) => (
                      <div
                        key={leaf.id}
                        onClick={() => onSelectLeaf(leaf.name)}
                        className="p-1.5 rounded bg-zinc-950/80 border border-white/5 hover:border-[#ef233c] hover:bg-zinc-900/80 transition-colors cursor-pointer text-[10px]"
                        onMouseEnter={() =>
                          setHoveredItem({
                            tier: 'ATOMIC LEAF',
                            name: leaf.name,
                            prevalence: `${leaf.prevalence}%`,
                            count: leaf.attackCount,
                            details: `${leaf.summary} (Click to inspect papers)`,
                          })
                        }
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="font-medium text-zinc-300 truncate">{leaf.name}</div>
                        <div className="text-[8px] text-zinc-500 flex justify-between">
                          <span>{leaf.attackCount} PAPERS</span>
                          <span className="text-[#ef233c] font-bold">{leaf.prevalence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Inspection Telemetry Sidebar (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-zinc-950">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-3 border-b border-white/10">
                <span>FLOW TELEMETRY INSPECTOR</span>
                <span className="text-[#ef233c] font-bold">AIRR SPEC</span>
              </div>

              {hoveredItem ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <span className="font-mono text-[10px] text-[#ef233c] block font-bold">
                      {hoveredItem.tier}
                    </span>
                    <h3 className="font-display font-extrabold text-2xl text-white uppercase tracking-tight mt-1 leading-tight">
                      {hoveredItem.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-[11px]">
                    <div className="p-3 rounded-lg bg-zinc-900 border border-white/5">
                      <span className="text-zinc-500 block text-[9px]">ATTACK VOLUME</span>
                      <span className="font-display text-2xl font-bold text-white">
                        {hoveredItem.count}
                      </span>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">CATALOGED PAPERS</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-white/5">
                      <span className="text-zinc-500 block text-[9px]">TAXONOMY SHARE</span>
                      <span className="font-display text-2xl font-bold text-[#ef233c]">
                        {hoveredItem.prevalence}
                      </span>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">EMPIRICAL DENSITY</span>
                    </div>
                  </div>

                  {hoveredItem.details && (
                    <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-white/5 text-xs font-inter text-zinc-300 leading-relaxed">
                      {hoveredItem.details}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-8 text-xs font-mono text-zinc-500 leading-relaxed">
                  HOVER OVER ANY SEGMENT IN THE SUNBURST RING OR SANKEY PIPELINE TO INSPECT ITS EXACT
                  VOLUME, PREVALENCE SHARE, AND MECHANISTIC PATHWAY.
                </div>
              )}
            </div>

            {/* Prevalence Distribution Summary Table */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <span className="font-mono text-[10px] text-zinc-500 block mb-2">
                FOUR PILLARS PROPORTIONAL WEIGHT:
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {FAMILIES.map((fam) => (
                  <div key={fam.id} className="flex items-center justify-between text-zinc-300">
                    <span className="truncate max-w-[190px]">{fam.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-[10px]">{fam.attackCount} atk</span>
                      <span className="font-bold text-[#ef233c]">
                        {fam.prevalence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
