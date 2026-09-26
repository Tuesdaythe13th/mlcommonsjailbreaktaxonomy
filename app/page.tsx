'use client';

import React, { useState } from 'react';
import { TopHeader } from '@/components/TopHeader';
import { PosterHero } from '@/components/PosterHero';
import { TaxonomyFamilyBreakdown } from '@/components/TaxonomyFamilyBreakdown';
import { SunburstSankeyVisualizer } from '@/components/SunburstSankeyVisualizer';
import { Spatial3DAtlas } from '@/components/Spatial3DAtlas';
import { VolumetricThreatManifold } from '@/components/VolumetricThreatManifold';
import { Cell6LatentSpatialTopology } from '@/components/Cell6LatentSpatialTopology';
import { AttackCatalogViewer } from '@/components/AttackCatalogViewer';
import { PolarThreatRadar } from '@/components/PolarThreatRadar';
import { HybridBridgesSection } from '@/components/HybridBridgesSection';
import { VulnerabilityHeatmap } from '@/components/VulnerabilityHeatmap';
import { MethodologySpec } from '@/components/MethodologySpec';
import { FooterSection } from '@/components/FooterSection';
import { ExportModal } from '@/components/ExportModal';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('taxonomy');
  const [selectedLeafFilter, setSelectedLeafFilter] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Smooth Navigation Handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When a leaf is clicked in 3D Atlas or Family breakdown, scroll to Catalog and apply filter
  const handleSelectLeaf = (leafName: string) => {
    setSelectedLeafFilter(leafName);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Family Gateway selection from Hero
  const handleSelectFamily = (famId: string) => {
    const taxEl = document.getElementById('taxonomy');
    if (taxEl) {
      taxEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-inter relative overflow-x-hidden selection:bg-[#ef233c] selection:text-white">
      {/* Global Red Noir Dynamic Cosmos Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle dark red to pitch black gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#160404] via-black to-black" />
        
        {/* Parallax Star Particles */}
        <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_60s_linear_infinite] opacity-60" />
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_90s_linear_infinite] opacity-40" />

        {/* Ambient Red Nebula Blur Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/6 rounded-full blur-[140px]" />
        <div className="absolute top-3/4 left-1/3 w-[600px] h-[600px] bg-[#ef233c]/4 rounded-full blur-[160px]" />

        {/* Cybernetic Precision Matrix Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black_45%,transparent_85%)]" />
      </div>

      {/* Atmospheric Top Gradient Blur */}
      <div className="gradient-blur" />

      {/* Floating Red Noir Top Navigation Bar */}
      <TopHeader
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <main className="flex-1 w-full relative z-10 pt-20">
        {/* Poster Scale Typography Hero in Red Noir Style */}
        <PosterHero
          onExplore={() => handleNavigate('atlas3d')}
          onSelectFamily={handleSelectFamily}
        />

        {/* The 4 Families, 8 Categories, and 18 Atomic Leaves */}
        <TaxonomyFamilyBreakdown onSelectLeaf={handleSelectLeaf} />

        {/* Master Sunburst & Sankey Flow Visualizer */}
        <SunburstSankeyVisualizer onSelectLeaf={handleSelectLeaf} />

        {/* 3D Spatial Atlas Viewport (Topology, Manifold, Multi-Vector Network) */}
        <Spatial3DAtlas onSelectLeaf={handleSelectLeaf} />

        {/* 3D THREAT MANIFOLD & VOLUMETRIC VECTOR SPACE (Stealth X × Automation Y × Distortion Z) */}
        <VolumetricThreatManifold />

        {/* CELL 6: Interactive 3D Latent Spatial Topology Map (PCA 384D to 3D, Plotly & Red Noir Spec) */}
        <Cell6LatentSpatialTopology />

        {/* 113 Cataloged Attacks Repository */}
        <AttackCatalogViewer
          selectedLeafFilter={selectedLeafFilter}
          onClearLeafFilter={() => setSelectedLeafFilter(null)}
        />

        {/* 6-Axis Polar Threat Radar */}
        <PolarThreatRadar />

        {/* Cross-Family Multi-Vector Hybrid Bridges */}
        <HybridBridgesSection onSelectLeaf={handleSelectLeaf} />

        {/* Target LLM Vulnerability & Exposure Heatmap Matrix */}
        <VulnerabilityHeatmap />

        {/* AIRR v0.7.0 Methodology Specification */}
        <MethodologySpec />
      </main>

      {/* Technical Red Noir Footer */}
      <FooterSection onBackToTop={handleBackToTop} />

      {/* Research Data Export Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
