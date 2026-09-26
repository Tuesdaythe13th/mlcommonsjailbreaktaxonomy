'use client';

import React, { useState } from 'react';
import { ATTACK_CATALOG, FAMILIES, LEAVES, HYBRID_BRIDGES } from '@/lib/taxonomyData';
import { X, Copy, Check, Download, FileCode, Database, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'json' | 'python' | 'bibtex'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonExport = JSON.stringify(
    {
      framework: 'MLCommons AIRR Single-Turn Inference-Time Prompt Attack Taxonomy',
      version: '0.7.0',
      totalAttacks: ATTACK_CATALOG.length,
      families: FAMILIES,
      leaves: LEAVES,
      hybridBridges: HYBRID_BRIDGES,
      attacks: ATTACK_CATALOG,
    },
    null,
    2
  );

  const pythonExport = `# MLCommons AIRR Jailbreak Threat Taxonomy (v0.7.0)
import pandas as pd

attacks_data = ${JSON.stringify(
    ATTACK_CATALOG.map((a) => ({
      ID: a.id,
      Name: a.name,
      Family: a.family,
      Category: a.category,
      Leaf: a.leaf,
      Venue: a.venue,
      Year: a.year,
      Models_Tested: a.modelsTested || '',
    })),
    null,
    2
  )}

df_attacks = pd.DataFrame(attacks_data)
print(f"Loaded {len(df_attacks)} attacks across {df_attacks['Family'].nunique()} families.")
print(df_attacks.groupby('Family')['Name'].count())
`;

  const bibtexExport = ATTACK_CATALOG.slice(0, 15)
    .map(
      (a) => `@inproceedings{${a.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}${a.year},
  title = {${a.name}},
  booktitle = {${a.venue}},
  year = {${a.year}},
  note = {MLCommons AIRR Taxonomy: ${a.family} / ${a.leaf}}
}`
    )
    .join('\n\n');

  const getExportText = () => {
    if (activeTab === 'json') return jsonExport;
    if (activeTab === 'python') return pythonExport;
    return bibtexExport;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getExportText();
    const ext = activeTab === 'json' ? 'json' : activeTab === 'python' ? 'py' : 'bib';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mlcommons_jailbreak_taxonomy_v0.7.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 text-white max-w-3xl w-full p-6 sm:p-8 rounded-2xl border border-white/15 shadow-[0_0_60px_rgba(239,35,60,0.25)] relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="font-mono text-[10px] text-[#ef233c] font-bold block">
              TAXONOMY ARCHIVE // RESEARCH EXPORT
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              EXPORT DATA <span className="text-[#ef233c]">MANIFEST</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap items-center gap-2 mt-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'bg-[#ef233c] text-white border-[#ef233c] font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]'
                : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            JSON MANIFEST (113 ATTACKS)
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeTab === 'python'
                ? 'bg-[#ef233c] text-white border-[#ef233c] font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]'
                : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            PYTHON PANDAS CODE
          </button>
          <button
            onClick={() => setActiveTab('bibtex')}
            className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeTab === 'bibtex'
                ? 'bg-[#ef233c] text-white border-[#ef233c] font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]'
                : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            BIBTEX CITATIONS
          </button>
        </div>

        {/* Code Content Viewport */}
        <div className="mt-4 flex-1 overflow-auto bg-black p-4 rounded-xl border border-white/10 font-mono text-[11px] text-zinc-300 whitespace-pre select-all max-h-[420px]">
          {getExportText()}
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[10px] text-zinc-500">
            SPECIFICATION v0.7.0 // MLCOMMONS AIRR REPOSITORY
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="rounded-full px-4 py-2 text-xs font-mono bg-zinc-900 border border-white/10 text-white hover:border-[#ef233c] transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#ef233c]" />
                  <span>COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#ef233c]" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-full px-5 py-2 text-xs font-mono font-bold bg-[#ef233c] text-white hover:bg-red-700 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,35,60,0.4)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD FILE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
