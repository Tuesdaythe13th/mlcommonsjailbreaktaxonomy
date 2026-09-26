'use client';

import React, { useState, useMemo } from 'react';
import { ATTACK_CATALOG, CatalogAttack } from '@/lib/taxonomyData';
import { Search, Filter, X, ArrowUpRight, Copy, Check, Terminal, ExternalLink, BookOpen, Sparkles } from 'lucide-react';

interface AttackCatalogViewerProps {
  selectedLeafFilter: string | null;
  onClearLeafFilter: () => void;
}

export function AttackCatalogViewer({
  selectedLeafFilter,
  onClearLeafFilter,
}: AttackCatalogViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState<string>('all');
  const [venueFilter, setVenueFilter] = useState<string>('all');
  const [selectedAttack, setSelectedAttack] = useState<CatalogAttack | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  // Extract unique venues
  const allVenues = useMemo(() => {
    const set = new Set<string>();
    ATTACK_CATALOG.forEach((a) => {
      const v = a.venue.split(' ')[0].replace(/['\d]/g, '');
      if (v) set.add(v);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered Attacks
  const filteredAttacks = useMemo(() => {
    return ATTACK_CATALOG.filter((atk) => {
      if (familyFilter !== 'all' && atk.family !== familyFilter) return false;
      if (selectedLeafFilter && atk.leaf !== selectedLeafFilter) return false;
      if (venueFilter !== 'all' && !atk.venue.includes(venueFilter)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = atk.name.toLowerCase().includes(q);
        const inVenue = atk.venue.toLowerCase().includes(q);
        const inLeaf = atk.leaf.toLowerCase().includes(q);
        const inCategory = atk.category.toLowerCase().includes(q);
        const inModels = (atk.modelsTested || '').toLowerCase().includes(q);
        const inYear = atk.year.toString().includes(q);
        if (!inName && !inVenue && !inLeaf && !inCategory && !inModels && !inYear) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, familyFilter, selectedLeafFilter, venueFilter]);

  const handleCopyBibtex = (atk: CatalogAttack) => {
    const bibtex = `@inproceedings{${atk.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}${atk.year},
  title = {${atk.name}},
  booktitle = {${atk.venue}},
  year = {${atk.year}},
  note = {MLCommons AIRR Jailbreak Taxonomy: ${atk.family} / ${atk.category} / ${atk.leaf}}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <section id="catalog" className="w-full hairline-b bg-black/90 relative">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[SUBSYSTEM 03]</span>
          <span>ATTACK REPOSITORY &amp; CITATION DATABASE</span>
          <span className="text-zinc-700">/</span>
          <span className="text-[#ef233c] font-mono">
            MATCHING: {filteredAttacks.length} / 113
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">PEER-REVIEWED &amp; PREPRINT ARCHIVE</span>
          <span>YEARS: 2017–2025</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 hairline-b">
          <div>
            <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
              EXHAUSTIVE ATTACK CATALOG
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[-0.04em]">
              113 CATALOGED <span className="text-[#ef233c]">ATTACKS</span>
            </h2>
          </div>

          {/* Active Leaf Filter Badge */}
          {selectedLeafFilter && (
            <div className="flex items-center gap-2 bg-[#ef233c] text-white px-4 py-2 text-xs font-mono rounded-full shadow-[0_0_15px_rgba(239,35,60,0.4)]">
              <span>LEAF FILTER: {selectedLeafFilter.toUpperCase()}</span>
              <button
                onClick={onClearLeafFilter}
                className="hover:text-black cursor-pointer ml-1"
                title="Clear Leaf Filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Instant Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#ef233c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH BY ATTACK NAME, VENUE, YEAR, OR MODEL (e.g. GCG, GPT-4, ICLR)..."
              className="w-full bg-zinc-950/90 text-xs font-mono text-white pl-11 pr-10 py-3 rounded-full border border-white/10 focus:outline-none focus:border-[#ef233c] focus:shadow-[0_0_15px_rgba(239,35,60,0.25)] transition-all placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Family Segmented Buttons */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-2 justify-start md:justify-end">
            {[
              { id: 'all', label: 'ALL (113)' },
              { id: 'Perturbation', label: 'PERTURBATION (40)' },
              { id: 'Composition & Ordering', label: 'COMPOSITION (29)' },
              { id: 'Encoding Abuse', label: 'ENCODING (23)' },
              { id: 'Overt Carriers', label: 'OVERT (21)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFamilyFilter(f.id)}
                className={`px-3.5 py-1.5 text-[11px] font-mono rounded-full border transition-all cursor-pointer ${
                  familyFilter === f.id
                    ? 'bg-[#ef233c] text-white border-[#ef233c] font-bold shadow-[0_0_15px_rgba(239,35,60,0.35)]'
                    : 'bg-zinc-950/80 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attacks Data Table */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/90 overflow-x-auto shadow-2xl">
          <table className="w-full text-left border-collapse font-inter text-xs">
            <thead>
              <tr className="bg-zinc-900/90 border-b border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">ID</th>
                <th className="py-3.5 px-4 font-semibold">ATTACK NAME</th>
                <th className="py-3.5 px-4 font-semibold">FAMILY</th>
                <th className="py-3.5 px-4 font-semibold">ATOMIC LEAF MECHANISM</th>
                <th className="py-3.5 px-4 font-semibold">VENUE</th>
                <th className="py-3.5 px-4 font-semibold">YEAR</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAttacks.length > 0 ? (
                filteredAttacks.map((atk) => (
                  <tr
                    key={atk.id}
                    onClick={() => setSelectedAttack(atk)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#ef233c] font-bold">
                      {atk.id.toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white group-hover:text-[#ef233c] transition-colors block text-sm">
                        {atk.name}
                      </span>
                      {atk.mechanismSnippet && (
                        <span className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-inter">
                          {atk.mechanismSnippet}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-300">
                      {atk.family}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-200 font-medium">
                      {atk.leaf}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                      {atk.venue}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-white font-bold">
                      {atk.year}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAttack(atk);
                        }}
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-[#ef233c] hover:underline"
                      >
                        <span>INSPECT</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-mono text-zinc-500">
                    ZERO ATTACKS MATCH SPECIFIED QUERY &ldquo;{searchQuery}&rdquo;. TRY CLEARING FILTERS.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal / Slide-over Drawer */}
        {selectedAttack && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedAttack(null)}
          >
            <div
              className="bg-zinc-950 border border-white/15 text-white max-w-2xl w-full p-6 sm:p-8 rounded-2xl shadow-[0_0_50px_rgba(239,35,60,0.25)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAttack(null)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 transition-colors cursor-pointer rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Top Metadata */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 pb-3 border-b border-white/10">
                <span className="text-[#ef233c] font-bold">CATALOG ID: {selectedAttack.id.toUpperCase()}</span>
                <span>/</span>
                <span>YEAR: {selectedAttack.year}</span>
                <span>/</span>
                <span className="text-white">{selectedAttack.venue}</span>
              </div>

              {/* Title */}
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight mt-4 leading-tight">
                {selectedAttack.name}
              </h3>

              {/* Hierarchy Breadcrumb */}
              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-400">
                <span>{selectedAttack.family}</span>
                <span className="text-zinc-600">→</span>
                <span>{selectedAttack.category}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-[#ef233c] font-bold">{selectedAttack.leaf}</span>
              </div>

              {/* Mechanism Description */}
              {selectedAttack.mechanismSnippet && (
                <div className="mt-5 p-4 rounded-xl bg-black border border-white/10 font-inter text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  <span className="font-mono text-[10px] text-[#ef233c] font-bold block mb-1">
                    EMPIRICAL BYPASS MECHANISM:
                  </span>
                  {selectedAttack.mechanismSnippet}
                </div>
              )}

              {/* Tested Target LLMs */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 block mb-1">
                  SYSTEMS UNDER TEST (SUT) IN EXPERIMENTAL EVALUATION:
                </span>
                <div className="font-mono text-xs text-zinc-300 bg-black/60 p-3 rounded-lg border border-white/5 leading-relaxed">
                  {selectedAttack.modelsTested ||
                    'Empirical evaluation spans standard open and commercial frontier instruction-tuned models.'}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleCopyBibtex(selectedAttack)}
                  className="rounded-full px-5 py-2.5 text-xs font-mono font-bold bg-[#ef233c] text-white hover:bg-red-700 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,35,60,0.35)]"
                >
                  {copiedBibtex ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>BIBTEX COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY BIBTEX ENTRY</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(
                    selectedAttack.name + ' ' + selectedAttack.venue
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-[#ef233c] transition-colors"
                >
                  <span>SEARCH GOOGLE SCHOLAR</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#ef233c]" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
