import React, { useState, useEffect } from 'react';
import { DosageFormCategory } from '../types/pharmacy';
import { DOSAGE_FORM_LIST, PHARMACY_DOSSIERS } from '../data/dosageFormsData';
import { DossierCard } from './DossierCard';
import { ScanIntroSplash } from './ScanIntroSplash';
import { Reveal } from './Reveal';
import { getFormFromUrl } from '../utils/pharmaQrEncoder';
import {
  Search,
  Pill,
  Syringe,
  Eye,
  Wind,
  Layers,
  Droplet,
  ChevronRight,
  LayoutGrid,
  ScanLine
} from 'lucide-react';

const getIcon = (category: DosageFormCategory) => {
  switch (category) {
    case 'TABLETS':
    case 'CAPSULES':
      return <Pill className="w-4 h-4" />;
    case 'INJECTIONS':
    case 'PARENTERALS & MISC.':
      return <Syringe className="w-4 h-4" />;
    case 'EYE/EAR DROPS':
      return <Eye className="w-4 h-4" />;
    case 'INHALATION PRODUCTS':
      return <Wind className="w-4 h-4" />;
    case 'SYRUPS':
    case 'LIQUID DOSAGE FORMS':
      return <Droplet className="w-4 h-4" />;
    default:
      return <Layers className="w-4 h-4" />;
  }
};

export const DosageGuideSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<DosageFormCategory>('TABLETS');
  const [searchQuery, setSearchQuery] = useState('');
  const [openedFromScan, setOpenedFromScan] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // When a QR is scanned it opens this page with ?form=TABLETS — auto-navigate to it.
  useEffect(() => {
    const fromUrl = getFormFromUrl();
    if (fromUrl) {
      setActiveCategory(fromUrl);
      setOpenedFromScan(true);
      setShowSplash(true);
    }
  }, []);

  const currentDossier = PHARMACY_DOSSIERS[activeCategory];

  const filtered = DOSAGE_FORM_LIST.filter((cat) => {
    const q = searchQuery.toLowerCase();
    const d = PHARMACY_DOSSIERS[cat];
    return (
      cat.toLowerCase().includes(q) ||
      d.categoryTag.toLowerCase().includes(q) ||
      d.definition.toLowerCase().includes(q)
    );
  });

  const selectForm = (cat: DosageFormCategory) => {
    setActiveCategory(cat);
    setOpenedFromScan(false);
    // Reflect selection in URL so the page can be bookmarked / shared / matches the QR
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?form=${encodeURIComponent(cat)}`;
      window.history.replaceState(null, '', newUrl);
    }
  };

  // SCANNED VIEW — QR opened this page: show glass PharmaQR intro first,
  // then the form's full information.
  if (openedFromScan) {
    return (
      <>
        {showSplash && (
          <ScanIntroSplash
            formName={currentDossier.shortName}
            onContinue={() => setShowSplash(false)}
          />
        )}
        <div
          className={`space-y-6 transition-all duration-700 [transition-timing-function:var(--ease-out-expo)] ${
            showSplash ? 'opacity-0 scale-[0.985]' : 'opacity-100 scale-100'
          }`}
        >
          <div key={activeCategory} className="animate-card-in">
            <DossierCard dossier={currentDossier} highlightScanned showQr={false} />
          </div>

          <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
                <ScanLine className="w-3.5 h-3.5" />
              </span>
              You opened <span className="font-bold text-slate-900">{activeCategory}</span> by scanning
              its PharmaQR code.
            </p>
            <button
              onClick={() => selectForm('TABLETS')}
              className="sheen inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 hover:-translate-y-0.5 active:scale-[0.97] text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/30 transition-all duration-500 [transition-timing-function:var(--ease-spring)] cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
              Browse All 12 Dosage Forms
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div id="dosage-browser" className="space-y-6 scroll-mt-24">
      {/* ---- Glass toolbar ---- */}
      <Reveal>
        <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[11px] font-semibold uppercase tracking-[0.12em] shadow-md shadow-emerald-500/25">
              <LayoutGrid className="w-3.5 h-3.5" />
              All 12 Dosage Forms
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Pick a form below, or scan its fixed QR code to open it directly.
            </p>
          </div>
          <div className="relative w-full sm:w-80 group">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300" />
            <input
              id="dosage-search"
              type="text"
              placeholder="Search dosage forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs glass-inset rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/60 focus:bg-white/80 focus:shadow-lg focus:shadow-emerald-500/10 focus:outline-none transition-all duration-400 [transition-timing-function:var(--ease-smooth)]"
            />
          </div>
        </div>
      </Reveal>

      {/* ---- Browser layout ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Glass index — sticky */}
        <Reveal delay={80} className="lg:col-span-4">
          <div className="glass rounded-[1.5rem] p-4 lg:sticky lg:top-24">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 flex items-center justify-between">
              <span>Dosage Form Index</span>
              <span className="glass-inset rounded-full px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {filtered.length}/12
              </span>
            </div>
            <div className="space-y-1.5 mt-3 max-h-[68vh] overflow-y-auto pr-1.5">
              {filtered.map((cat, i) => {
                const active = activeCategory === cat;
                const d = PHARMACY_DOSSIERS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => selectForm(cat)}
                    style={{ transitionDelay: `${i * 12}ms` }}
                    className={`w-full p-3 rounded-2xl text-left flex items-center justify-between group cursor-pointer border transition-all duration-500 [transition-timing-function:var(--ease-spring)] active:scale-[0.97] ${
                      active
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/30 scale-[1.02]'
                        : 'glass-inset text-slate-900 hover:bg-white/75 hover:-translate-y-0.5 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 transition-colors duration-500 ${
                          active
                            ? 'bg-white/25 text-white shadow-inner'
                            : 'bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-700'
                        }`}
                      >
                        {getIcon(cat)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">{cat}</h4>
                        <p
                          className={`text-[11px] truncate mt-0.5 transition-colors duration-500 ${
                            active ? 'text-emerald-50/90' : 'text-slate-500'
                          }`}
                        >
                          {d.shortName}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-all duration-500 ${
                        active
                          ? 'text-white'
                          : 'text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1'
                      }`}
                    />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-10 text-center">
                  <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No dosage form matches your search.</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Detail — animates in on every form switch */}
        <Reveal delay={140} className="lg:col-span-8">
          <div key={activeCategory} className="animate-card-in">
            <DossierCard dossier={currentDossier} highlightScanned={openedFromScan} />
          </div>
        </Reveal>
      </div>
    </div>
  );
};
