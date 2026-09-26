'use client';

import React, { useState } from 'react';
import { FAMILIES, CATEGORIES, LEAVES } from '@/lib/taxonomyData';
import { ChevronRight, ArrowUpRight, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface TaxonomyFamilyBreakdownProps {
  onSelectLeaf: (leafName: string) => void;
}

export function TaxonomyFamilyBreakdown({ onSelectLeaf }: TaxonomyFamilyBreakdownProps) {
  const [activeFamilyId, setActiveFamilyId] = useState<string>('perturbation');

  const activeFamily = FAMILIES.find((f) => f.id === activeFamilyId) || FAMILIES[0];
  const familyCategories = CATEGORIES.filter((c) => c.family === activeFamily.name);
  const familyLeaves = LEAVES.filter((l) => l.family === activeFamily.name);

  return (
    <section id="taxonomy" className="w-full hairline-b bg-black/60 relative">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[SUBSYSTEM 01]</span>
          <span>TAXONOMY STRUCTURAL HIERARCHY</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">FAMILY → CATEGORY → LEAF</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">ONE-TO-ONE DETERMINISTIC MAPPING</span>
          <span className="text-[#ef233c] font-bold">COVERAGE: 100.0%</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-14">
        {/* Section Header */}
        <div className="pb-8 hairline-b">
          <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
            FOUR PRIMARY MECHANISM FAMILIES
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[-0.04em]">
            THE FOUR <span className="text-[#ef233c]">PILLARS</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl font-inter leading-relaxed">
            Every inference-time jailbreak attack operates through one of four fundamental strategies:
            surface perturbation, prompt-level narrative composition, encoding/wrapper evasion, or
            overt authority confrontation.
          </p>
        </div>

        {/* 4 Family Segmented Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-8">
          {FAMILIES.map((fam) => {
            const isActive = activeFamilyId === fam.id;
            return (
              <button
                key={fam.id}
                onClick={() => setActiveFamilyId(fam.id)}
                className={`text-left p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-zinc-900/90 border-[#ef233c] shadow-[0_0_25px_rgba(239,35,60,0.18)]'
                    : 'bg-zinc-950/60 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#ef233c] shadow-[0_0_10px_#ef233c]" />
                )}
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-zinc-500">{fam.code}</span>
                  <span className={`font-bold ${isActive ? 'text-[#ef233c]' : 'text-zinc-300'}`}>
                    {fam.prevalence}%
                  </span>
                </div>
                <div className="font-display font-bold text-base sm:text-lg uppercase tracking-tight text-white">
                  {fam.name}
                </div>
                <div className="text-[11px] font-mono text-zinc-500 mt-2">
                  {fam.attackCount} ATTACKS · {fam.leafCount} LEAVES
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Family Deep Dive Console */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Family Definition & Strategy (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="p-6 sm:p-7 rounded-xl bg-gradient-to-b from-zinc-900/60 to-black/80 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-3 border-b border-white/10">
                <span>{`${activeFamily.code} // DOCTRINE SPECIFICATION`}</span>
                <span className="text-[#ef233c] font-bold">{activeFamily.prevalence}% SHARE</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight mt-4 leading-tight">
                {activeFamily.name}
              </h3>

              <div className="mt-4 p-4 rounded-lg bg-zinc-950/80 border border-white/5 font-mono text-xs text-zinc-200 leading-relaxed">
                <span className="text-[10px] font-mono text-[#ef233c] font-bold block mb-1">CORE STRATEGY:</span>
                &ldquo;{activeFamily.strategy}&rdquo;
              </div>

              <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-inter">
                {activeFamily.definition}
              </p>

              {/* Empirical Metrics Cards */}
              <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="p-3 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-zinc-500 block text-[9px]">ATTACK VOLUME</span>
                  <span className="font-display text-2xl font-bold text-white">
                    {activeFamily.attackCount}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-zinc-500 block text-[9px]">CATEGORIES</span>
                  <span className="font-display text-2xl font-bold text-white">
                    {activeFamily.categoryCount}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-zinc-500 block text-[9px]">ATOMIC LEAVES</span>
                  <span className="font-display text-2xl font-bold text-[#ef233c]">
                    {activeFamily.leafCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Atomic Leaves Table & Categories (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="text-[11px] font-mono text-zinc-500 mb-3 flex items-center justify-between">
              <span>CATEGORIES &amp; ATOMIC LEAF MECHANISMS</span>
              <span className="text-zinc-400">CLICK TO FILTER REPOSITORY</span>
            </div>

            <div className="space-y-6">
              {familyCategories.map((cat) => {
                const catLeaves = familyLeaves.filter((l) => l.category === cat.name);
                return (
                  <div key={cat.id} className="rounded-xl border border-white/10 bg-zinc-950/70 overflow-hidden shadow-lg">
                    {/* Category Title Banner */}
                    <div className="p-4 bg-zinc-900/60 flex items-center justify-between border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 block">
                          CATEGORY SPLIT AXIS
                        </span>
                        <h4 className="font-display font-bold text-base sm:text-lg text-white tracking-tight uppercase">
                          {cat.name}
                        </h4>
                      </div>
                      <span className="font-mono text-xs text-[#ef233c] font-bold">
                        {cat.attackCount} ATTACKS
                      </span>
                    </div>

                    {/* Leaves under this Category */}
                    <div className="divide-y divide-white/5">
                      {catLeaves.map((leaf) => (
                        <div
                          key={leaf.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                          onClick={() => onSelectLeaf(leaf.name)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-base text-zinc-200 group-hover:text-[#ef233c] transition-colors">
                                {leaf.name}
                              </span>
                              <span className="font-mono text-[11px] text-[#ef233c]">
                                {leaf.prevalence}%
                              </span>
                            </div>
                            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-inter">
                              {leaf.summary}
                            </p>
                            <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                              <span>ERA: ~{leaf.era}</span>
                              <span>·</span>
                              <span>SOPHISTICATION: {leaf.sophistication}/10</span>
                              <span>·</span>
                              <span>STEALTH: {leaf.coords.stealth}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:self-center shrink-0">
                            <span className="font-display text-lg font-bold text-white">
                              {leaf.attackCount}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">PAPERS</span>
                            <ChevronRight className="w-4 h-4 text-[#ef233c] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
