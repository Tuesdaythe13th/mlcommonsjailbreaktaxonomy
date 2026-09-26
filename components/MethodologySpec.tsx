'use client';

import React from 'react';
import { DESIGN_REQUIREMENTS } from '@/lib/taxonomyData';
import { CheckCircle2, ShieldCheck, Scale, FileText, Lock, Globe, Sparkles } from 'lucide-react';

export function MethodologySpec() {
  return (
    <section id="methodology" className="w-full hairline-b bg-black/80 relative">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[SUBSYSTEM 07]</span>
          <span>AIRR METHODOLOGY SPECIFICATION</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">v0.7.0 ARCHITECTURAL MANDATES</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">TAXONOMY VS. BENCHMARK SEPARATION</span>
          <span className="text-[#ef233c] font-bold">DETERMINISTIC</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-12">
        {/* Section Header */}
        <div className="pb-8 hairline-b">
          <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
            RIGOROUS ARCHITECTURAL FOUNDATION
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[-0.04em]">
            DESIGN <span className="text-[#ef233c]">REQUIREMENTS</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl font-inter leading-relaxed">
            To prevent arbitrary ad-hoc classification, MLCommons AIRR established six immutable design
            criteria that govern how every published red-team paper is cataloged.
          </p>
        </div>

        {/* 6 Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {DESIGN_REQUIREMENTS.map((req) => (
            <div
              key={req.num}
              className="p-6 sm:p-7 rounded-xl bg-zinc-950/80 border border-white/10 hover:border-[#ef233c]/40 transition-all flex flex-col justify-between group relative overflow-hidden shadow-lg"
            >
              {/* Subtle top right red glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(239,35,60,0.12),transparent_70%)]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-3">
                  <span className="text-[#ef233c] font-bold">REQ. {req.num}</span>
                  <span className="text-zinc-400 text-[10px] uppercase tracking-wider">MANDATORY</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight group-hover:text-[#ef233c] transition-colors">
                  {req.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-inter leading-relaxed">
                  {req.rule}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-500 relative z-10">
                COMPLIANCE: VERIFIED ACROSS 113 PAPERS
              </div>
            </div>
          ))}
        </div>

        {/* Doctrine Callout: Taxonomy vs Benchmark Separation */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#ef233c] font-bold mb-2">
            <Scale className="w-4 h-4" />
            <span>FOUNDATIONAL EVALUATION SEPARATION DOCTRINE</span>
          </div>

          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            THE TAXONOMY VS. BENCHMARK SPLIT
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-5 sm:p-6 rounded-xl bg-black border border-white/10">
              <div className="flex items-center gap-2 font-display font-bold text-base text-white uppercase mb-2">
                <Globe className="w-4 h-4 text-[#ef233c]" />
                THE PUBLIC TAXONOMY
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-inter">
                The Taxonomy is the <strong className="text-white">public, exhaustive, evolving universe</strong> of all known
                mechanisms documented in academic literature and empirical red-teaming. It categorizes the entire
                threat surface without withholding attack vectors.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-black border border-white/10">
              <div className="flex items-center gap-2 font-display font-bold text-base text-white uppercase mb-2">
                <Lock className="w-4 h-4 text-[#ef233c]" />
                THE PRIVATE BENCHMARK
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-inter">
                The Benchmark is a <strong className="text-white">private, stratified sampling subset</strong> drawn deterministically
                from the taxonomy to test systems under test (SUT). Keeping the evaluation suite private prevents
                goodharting, gaming, and train-set contamination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
