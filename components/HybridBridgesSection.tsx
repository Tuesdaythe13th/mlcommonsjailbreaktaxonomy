'use client';

import React, { useState } from 'react';
import { HYBRID_BRIDGES, HybridBridge } from '@/lib/taxonomyData';
import { GitMerge, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface HybridBridgesSectionProps {
  onSelectLeaf: (leafName: string) => void;
}

export function HybridBridgesSection({ onSelectLeaf }: HybridBridgesSectionProps) {
  const [activeBridge, setActiveBridge] = useState<HybridBridge>(HYBRID_BRIDGES[0]);

  return (
    <section id="bridges" className="w-full hairline-b bg-black/80 relative">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[SUBSYSTEM 05]</span>
          <span>CROSS-FAMILY MULTI-VECTOR BRIDGES</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">INTER-FAMILY COMPOSITE MECHANISMS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#ef233c] font-bold">7 BRIDGES CATALOGED</span>
          <span className="hidden sm:inline">MULTI-DISCIPLINARY BYPASS</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-12">
        {/* Section Header */}
        <div className="pb-8 hairline-b">
          <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
            RELATIONAL ATTACK COMPOSITIONS
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[-0.04em]">
            HYBRID <span className="text-[#ef233c]">VECTOR BRIDGES</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl font-inter leading-relaxed">
            While the taxonomy enforces a strict one-to-one mapping for atomic classification, state-of-the-art
            adversaries combine orthogonal vectors (e.g. gradient tokens + conversational tree search) to
            penetrate multi-layer frontier guardrails.
          </p>
        </div>

        {/* 7 Bridge Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {HYBRID_BRIDGES.map((bridge) => {
            const isSelected = activeBridge.id === bridge.id;
            return (
              <div
                key={bridge.id}
                onClick={() => setActiveBridge(bridge)}
                className={`p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-zinc-900 border-[#ef233c] shadow-[0_0_25px_rgba(239,35,60,0.2)]'
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top right red glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(239,35,60,0.12),transparent_70%)]" />

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <GitMerge className="w-3.5 h-3.5 text-[#ef233c]" />
                    HYBRID VECTOR
                  </span>
                  {isSelected && (
                    <span className="text-[#ef233c] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c] animate-pulse" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight group-hover:text-[#ef233c] transition-colors">
                  {bridge.name}
                </h3>

                {/* Vector Connection Path */}
                <div className="mt-3 p-3 rounded-lg bg-black border border-white/5 font-mono text-[10px] text-zinc-300 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">{bridge.familyA}:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLeaf(bridge.leafA);
                      }}
                      className="font-bold text-white hover:text-[#ef233c] transition-colors truncate max-w-[180px]"
                    >
                      {bridge.leafA}
                    </button>
                  </div>
                  <div className="text-center text-[#ef233c] font-bold leading-none py-0.5">⇅</div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">{bridge.familyB}:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLeaf(bridge.leafB);
                      }}
                      className="font-bold text-white hover:text-[#ef233c] transition-colors truncate max-w-[180px]"
                    >
                      {bridge.leafB}
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs text-zinc-400 font-inter leading-relaxed line-clamp-3">
                  {bridge.description}
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-500 truncate">
                  {bridge.citation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Bridge Deep Dive Blueprint */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="font-mono text-[10px] text-[#ef233c] font-bold block">
                COMPOSITE ATTACK BLUEPRINT // DETAILED SCHEMATIC
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
                {activeBridge.name}
              </h3>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-zinc-400">
              <span>PEER EVIDENCE: {activeBridge.citation}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-3">
              <span className="font-mono text-[11px] text-zinc-400 block">
                SYNERGISTIC BYPASS MECHANICS:
              </span>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-inter bg-black/60 p-4 rounded-xl border border-white/5">
                {activeBridge.description}
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[11px] text-zinc-400 block">
                ATOMIC LEAF COMBINATION:
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div
                  onClick={() => onSelectLeaf(activeBridge.leafA)}
                  className="p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-[#ef233c] transition-colors cursor-pointer group"
                >
                  <span className="text-[10px] text-zinc-500 block truncate">VECTOR 1 ({activeBridge.familyA})</span>
                  <span className="font-bold text-white block mt-1 group-hover:text-[#ef233c] transition-colors">{activeBridge.leafA}</span>
                  <span className="text-[10px] text-[#ef233c] block mt-2 font-semibold">FILTER REPO ➔</span>
                </div>
                <div
                  onClick={() => onSelectLeaf(activeBridge.leafB)}
                  className="p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-[#ef233c] transition-colors cursor-pointer group"
                >
                  <span className="text-[10px] text-zinc-500 block truncate">VECTOR 2 ({activeBridge.familyB})</span>
                  <span className="font-bold text-white block mt-1 group-hover:text-[#ef233c] transition-colors">{activeBridge.leafB}</span>
                  <span className="text-[10px] text-[#ef233c] block mt-2 font-semibold">FILTER REPO ➔</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
