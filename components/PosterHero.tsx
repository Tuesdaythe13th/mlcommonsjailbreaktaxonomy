'use client';

import React from 'react';
import { ArrowDown, CornerDownRight, Scan, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { TaxonomyMechanismRefractor } from '@/components/TaxonomyMechanismRefractor';

interface PosterHeroProps {
  onExplore: () => void;
  onSelectFamily: (famId: string) => void;
}

export function PosterHero({ onExplore, onSelectFamily }: PosterHeroProps) {
  return (
    <section id="hero" className="relative w-full hairline-b bg-black/60 overflow-hidden pb-12 sm:pb-20">
      {/* Corner Registration Markers */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 font-mono text-[10px] text-zinc-600 select-none pointer-events-none">
        <span className="text-[#ef233c] font-bold">[REF. 00-AIRR]</span> LAT: 37.422° N // LON: 122.084° W
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 font-mono text-[10px] text-zinc-600 text-right select-none pointer-events-none">
        DEFENSE SPECTRUM // SPEC: v0.7.0 INFERENCE-TIME
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-8 sm:pt-16">
        {/* Top Live Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]" />
          </span>
          <span className="text-xs font-mono font-medium text-red-100/90 tracking-wide">
            MLCOMMONS AI RISK &amp; RELIABILITY · EMPIRICAL ATLAS
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono text-zinc-400">113 ATTACKS · 4 FAMILIES · 18 LEAVES</span>
        </div>

        {/* Asymmetrical Grid: Typography Hero vs Mechanism Refractor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Main Poster Typography (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] xl:text-[8rem] tracking-[-0.05em] leading-[0.84] uppercase">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                JAILBREAK
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                <span className="text-[#ef233c] inline-block relative">
                  TAXONOMY
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#ef233c] opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="mt-8 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl font-inter">
              The first comprehensive, mechanism-first classification framework cataloging prompt
              manipulation vectors observable at inference time. Designed by MLCommons AIRR to decouple
              empirical threat vectors from speculative hazard definitions.
            </p>

            {/* Metric Spine Bento Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 hairline-t">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-[#ef233c]/30 transition-colors">
                <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">TOTAL ATTACKS</span>
                <span className="font-display text-4xl font-extrabold text-white tracking-tight">113</span>
                <span className="block font-mono text-[10px] text-[#ef233c] font-semibold mt-0.5">CATALOGED PAPERS</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-[#ef233c]/30 transition-colors">
                <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">PRIMARY FAMILIES</span>
                <span className="font-display text-4xl font-extrabold text-white tracking-tight">04</span>
                <span className="block font-mono text-[10px] text-zinc-400 mt-0.5">CORE PILLARS</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-[#ef233c]/30 transition-colors">
                <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">CATEGORIES</span>
                <span className="font-display text-4xl font-extrabold text-white tracking-tight">08</span>
                <span className="block font-mono text-[10px] text-zinc-400 mt-0.5">SPLIT AXES</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-[#ef233c]/30 transition-colors">
                <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">ATOMIC LEAVES</span>
                <span className="font-display text-4xl font-extrabold text-white tracking-tight">18</span>
                <span className="block font-mono text-[10px] text-zinc-300 font-semibold mt-0.5">RUNNABLE UNITS</span>
              </div>
            </div>

            {/* Red Noir CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              {/* Shiny CTA Button */}
              <button
                onClick={onExplore}
                id="hero-explore-cta"
                className="shiny-cta group flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider text-white"
              >
                <span>EXPLORE 3D SPATIAL ATLAS</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#ef233c] group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-6 py-3 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-mono text-xs font-semibold hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#ef233c] transition-colors" />
                <span>QUERY 113 ATTACK PAPERS</span>
              </button>
            </div>
          </div>

          {/* Right Cutout Subject & Spatial Annotations (5 Cols) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Red Noir Refractor Stage */}
            <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900/60 via-black to-zinc-950/90 border border-white/10 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl group">
              {/* Ambient radial red light */}
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(239,35,60,0.15),transparent_65%)] pointer-events-none" />

              {/* Ticks */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-3 pb-2 border-b border-white/5">
                <span className="text-[#ef233c]">SEC-01 // FIG. 01-A</span>
                <span>OPTICAL REFRACTOR</span>
              </div>

              {/* Animated Mechanism Refractor */}
              <TaxonomyMechanismRefractor />

              {/* Technical annotations below */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <Scan className="w-3.5 h-3.5 text-[#ef233c]" />
                  <span>CALIBRATED SPECTRUM INSTRUMENT</span>
                </div>
                <span className="text-zinc-500">RES: 8192 × 8192 PX</span>
              </div>

              <div className="mt-2 text-[10px] font-mono text-zinc-500 leading-normal">
                MECHANISM-FIRST PRINCIPLE: CLASSIFY OBSERVED PROMPT BYPASS INDEPENDENT OF HAZARD LABEL OR HARMFUL OUTCOME.
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Family Gateway Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {[
            {
              id: 'perturbation',
              code: 'FAM-01',
              name: 'PERTURBATION',
              share: '36.28%',
              attacks: 40,
              desc: 'Modifies surface tokens & characters while preserving core semantic intent.',
              accent: '#ef233c',
            },
            {
              id: 'composition',
              code: 'FAM-02',
              name: 'COMPOSITION & ORDERING',
              share: '23.89%',
              attacks: 29,
              desc: 'Rearranges global context framing, sequencing, and multi-turn search trees.',
              accent: '#d90429',
            },
            {
              id: 'encoding',
              code: 'FAM-03',
              name: 'ENCODING ABUSE',
              share: '20.35%',
              attacks: 23,
              desc: 'Exploits decoding, Base64/Unicode parsing, and structured JSON/code schemas.',
              accent: '#ff4d6d',
            },
            {
              id: 'overt',
              code: 'FAM-04',
              name: 'OVERT CARRIERS',
              share: '19.47%',
              attacks: 21,
              desc: 'Applies direct imperative authority override commands and persona role-play.',
              accent: '#ef233c',
            },
          ].map((fam) => (
            <button
              key={fam.id}
              onClick={() => onSelectFamily(fam.id)}
              className="text-left p-6 rounded-xl bg-gradient-to-b from-zinc-900/60 to-black/90 border border-white/10 hover:border-[#ef233c]/50 transition-all group relative overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(239,35,60,0.15)]"
            >
              {/* Subtle top right red gradient glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(239,35,60,0.15),transparent_70%)]" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                  <span>{fam.code}</span>
                  <span className="text-[#ef233c] font-bold group-hover:scale-105 transition-transform">
                    {fam.share}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white tracking-tight uppercase group-hover:text-[#ef233c] transition-colors">
                  {fam.name}
                </h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-inter line-clamp-2">
                  {fam.desc}
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>{fam.attacks} CATALOGED ATTACKS</span>
                  <CornerDownRight className="w-3.5 h-3.5 text-[#ef233c] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
