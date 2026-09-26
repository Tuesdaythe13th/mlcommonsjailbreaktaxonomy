'use client';

import React from 'react';
import { ArrowUp, ArrowUpRight, Github, ExternalLink } from 'lucide-react';

interface FooterSectionProps {
  onBackToTop: () => void;
}

export function FooterSection({ onBackToTop }: FooterSectionProps) {
  return (
    <footer className="w-full bg-black text-white border-t border-zinc-900 pt-16 pb-10 relative overflow-hidden">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 border-b border-zinc-900 bg-zinc-950/80 mb-12">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">MLCOMMONS AIRR WORKING GROUP</span>
          <span>/</span>
          <span>TAXONOMY OF JAILBREAK ATTACKS</span>
        </div>
        <div>
          <span>LICENSE: CC BY-SA 4.0</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mandate (6 Cols) */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-4 h-4 bg-[#ef233c] rounded-xs rotate-45 shadow-[0_0_12px_rgba(239,35,60,0.6)]" />
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
                MLCOMMONS <span className="text-[#ef233c]">AIRR</span>
              </h3>
            </div>
            <p className="mt-3 text-sm text-zinc-400 max-w-lg font-inter leading-relaxed">
              Standardized single-turn inference-time classification framework cataloging 113 prompt
              attack mechanisms across 4 families, 8 categories, and 18 atomic leaves. Created to
              establish empirical ground truth for model safety benchmarks.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
              <a
                href="https://github.com/mlcommons/jailbreak-taxonomy"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-[#ef233c] transition-colors"
              >
                <span>GITHUB REPOSITORY</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#ef233c]" />
              </a>
              <span className="text-zinc-700">/</span>
              <a
                href="https://mlcommons.org"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-[#ef233c] transition-colors"
              >
                <span>MLCOMMONS.ORG</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#ef233c]" />
              </a>
            </div>
          </div>

          {/* Hierarchy Breakdown Summary (3 Cols) */}
          <div className="md:col-span-3 space-y-2 font-mono text-xs">
            <span className="text-[10px] text-zinc-500 block mb-2 font-bold uppercase tracking-wider">FAMILY SPECIFICATION:</span>
            <div className="text-zinc-300 flex items-center justify-between">
              <span>FAM-01 // PERTURBATION</span>
              <span className="text-[#ef233c] font-bold">36.3%</span>
            </div>
            <div className="text-zinc-300 flex items-center justify-between">
              <span>FAM-02 // COMPOSITION</span>
              <span className="text-[#ef233c] font-bold">23.9%</span>
            </div>
            <div className="text-zinc-300 flex items-center justify-between">
              <span>FAM-03 // ENCODING ABUSE</span>
              <span className="text-[#ef233c] font-bold">20.4%</span>
            </div>
            <div className="text-zinc-300 flex items-center justify-between">
              <span>FAM-04 // OVERT CARRIERS</span>
              <span className="text-[#ef233c] font-bold">19.5%</span>
            </div>
          </div>

          {/* Quick Actions (3 Cols) */}
          <div className="md:col-span-3 flex flex-col md:items-end justify-between h-full">
            <button
              onClick={onBackToTop}
              className="rounded-full px-5 py-2.5 text-xs font-mono font-bold bg-zinc-900 border border-white/10 text-white hover:bg-[#ef233c] hover:border-[#ef233c] transition-all flex items-center gap-2 cursor-pointer self-start md:self-end shadow-lg"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5 text-white" />
            </button>

            <div className="mt-8 md:mt-0 text-left md:text-right font-mono text-[10px] text-zinc-500">
              <div>COORDINATE ATLAS v0.7.0</div>
              <div>UPDATED SEPTEMBER 2026</div>
            </div>
          </div>
        </div>

        {/* Huge Red Noir Footer Text from Reference Style */}
        <div className="flex justify-center items-center py-12 opacity-15 pointer-events-none select-none">
          <h1 className="text-[12vw] leading-none font-extrabold font-manrope tracking-tighter text-stroke select-none">
            AIRR TAXONOMY
          </h1>
        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-500">
          <div>© 2026 MLCOMMONS ASSOCIATION // AI RISK AND RELIABILITY (AIRR) WORKING GROUP</div>
          <div>PRECISION RED NOIR CYBERNETIC TAXONOMY ATLAS</div>
        </div>
      </div>
    </footer>
  );
}
