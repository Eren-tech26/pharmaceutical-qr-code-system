import React, { useState, useEffect } from 'react';
import { PharmacyDossier } from '../types/pharmacy';
import { TiltCard } from './TiltCard';
import {
  BookOpen,
  CheckCircle2,
  AlertOctagon,
  TestTube,
  Lightbulb,
  QrCode,
  Route,
  CheckCheck
} from 'lucide-react';
import { buildFormUrl, generateQrDataUrl } from '../utils/pharmaQrEncoder';

interface DossierCardProps {
  dossier: PharmacyDossier;
  highlightScanned?: boolean;
  showQr?: boolean;
}

/* Inner frosted section — no extra backdrop blur (the parent panel is already
   frosted), which keeps the whole page rendering at 60fps. */
const Section: React.FC<{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}> = ({ title, icon: Icon, children, className = '', titleClassName = 'text-slate-900' }) => (
  <div className={`glass-inset rounded-2xl p-5 ${className}`}>
    <h4
      className={`text-[11px] font-bold ${titleClassName} uppercase tracking-[0.14em] flex items-center gap-2 mb-4`}
    >
      <span className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-700">
        <Icon className="w-3.5 h-3.5" />
      </span>
      {title}
    </h4>
    {children}
  </div>
);

export const DossierCard: React.FC<DossierCardProps> = ({
  dossier,
  highlightScanned = false,
  showQr = true
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const formUrl = buildFormUrl(dossier.category);

  useEffect(() => {
    if (!showQr) return;
    let cancelled = false;
    generateQrDataUrl(formUrl, '#059669').then((url) => {
      if (!cancelled) setQrUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [formUrl, showQr]);

  return (
    <div className="glass rounded-[1.75rem] overflow-hidden">
      {/* ---- Header ---- */}
      <div className="relative px-6 sm:px-8 py-7 border-b border-white/70 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 w-96 h-56 rounded-full bg-gradient-to-bl from-emerald-300/35 via-teal-200/25 to-transparent blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] shadow-md shadow-emerald-500/25">
            Pharmacy Student Guide
          </span>
          <span className="px-3 py-1 glass-inset text-emerald-800 rounded-full text-[11px] font-semibold">
            {dossier.categoryTag}
          </span>
          {highlightScanned && (
            <span className="px-3 py-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/25">
              <CheckCircle2 className="w-3.5 h-3.5" /> Opened from QR Scan
            </span>
          )}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tighter">
          {dossier.category}
        </h3>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-4xl">
          {dossier.definition}
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* ---- Image (+ fixed QR only when browsing, never on a scanned view) ---- */}
        {showQr ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D-tilting visual */}
            <div className="lg:col-span-5">
              <TiltCard maxTilt={6} className="rounded-2xl">
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/15 ring-1 ring-white/60 group">
                  <img
                    src={dossier.image}
                    alt={dossier.category}
                    className="w-full h-60 object-cover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/25 via-transparent to-transparent opacity-60" />
                </div>
              </TiltCard>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                <span className="font-bold text-slate-900">Visual: </span>
                {dossier.imageCaption}
              </p>
            </div>

            {/* Fixed QR code that opens this exact form's guide — kept on solid
                white so scanners always get reliable contrast */}
            <div className="lg:col-span-7 glass-inset-emerald rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-2xl ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-900/10 shrink-0 transition-transform duration-700 [transition-timing-function:var(--ease-spring)] hover:scale-[1.04] hover:-rotate-1">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt={`Scan to open ${dossier.category} guide`}
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-slate-300 text-xs">
                    <QrCode className="w-10 h-10 animate-pulse" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-[0.14em]">
                    Fixed QR — Scan to Open This Guide
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  This is the permanent QR code for{' '}
                  <span className="font-bold text-emerald-800">{dossier.category}</span>. Scanning it on
                  any device redirects straight to this dosage form's Student Guide with all its
                  information.
                </p>
                <p className="text-[11px] text-slate-400 mt-3 glass-inset rounded-lg px-2.5 py-1.5 font-mono break-all">
                  {formUrl}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Scanned view: 3D visual only, no QR */
          <div>
            <TiltCard maxTilt={5} className="rounded-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/15 ring-1 ring-white/60 group">
                <img
                  src={dossier.image}
                  alt={dossier.category}
                  className="w-full h-60 sm:h-80 object-cover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/25 via-transparent to-transparent opacity-60" />
              </div>
            </TiltCard>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              <span className="font-bold text-slate-900">Visual: </span>
              {dossier.imageCaption}
            </p>
          </div>
        )}

        {/* ---- Classification + Routes ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Sub-Classifications" icon={BookOpen}>
            <div className="flex flex-wrap gap-2">
              {dossier.classification.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-900 ring-1 ring-emerald-500/20 rounded-full text-xs font-medium transition-all duration-400 hover:bg-emerald-500/20 hover:-translate-y-0.5 [transition-timing-function:var(--ease-spring)] cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Routes of Administration" icon={Route}>
            <div className="flex flex-wrap gap-2">
              {dossier.routesOfAdministration.map((r, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white/70 ring-1 ring-white/80 rounded-full text-xs font-mono text-slate-700 shadow-sm transition-all duration-400 hover:bg-white hover:-translate-y-0.5 [transition-timing-function:var(--ease-spring)] cursor-default"
                >
                  {r}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* ---- Excipients + QC ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Common Excipients & Formulation" icon={TestTube}>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {dossier.commonExcipients.map((ex, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mt-1.5 shrink-0 shadow-sm shadow-emerald-500/40" />
                  <span className="leading-relaxed">{ex}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Pharmacopeial Quality Control Tests" icon={BookOpen}>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {dossier.pharmaceuticalQualityTests.map((qc, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mt-1.5 shrink-0 shadow-sm shadow-emerald-500/40" />
                  <span className="leading-relaxed">{qc}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* ---- Advantages + Limitations ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section
            title="Advantages"
            icon={CheckCheck}
            titleClassName="text-emerald-900"
            className="!bg-gradient-to-br !from-emerald-500/[0.12] !to-teal-500/[0.06] !ring-1 !ring-emerald-500/20 !border-emerald-500/20"
          >
            <ul className="space-y-2 text-xs text-emerald-950">
              {dossier.keyAdvantages.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Disadvantages & Precautions"
            icon={AlertOctagon}
            titleClassName="text-slate-700"
            className="!bg-gradient-to-br !from-slate-500/[0.08] !to-slate-400/[0.04] !ring-1 !ring-slate-400/20 !border-slate-400/20"
          >
            <ul className="space-y-2 text-xs text-slate-700">
              {dossier.disadvantagesOrLimitations.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* ---- Dispensing tips ---- */}
        <div className="glass-inset-emerald rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="p-1.5 rounded-lg bg-white/60 text-emerald-700 shadow-sm">
              <Lightbulb className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900">
              Clinical Dispensing Tips for Students
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            {dossier.studentDispensingTips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/60 ring-1 ring-white/80 p-3.5 rounded-xl transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:bg-white/85 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="font-bold text-gradient font-mono text-xs shrink-0">
                  #{String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Example products ---- */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.14em] mb-4 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-700">
              <TestTube className="w-3.5 h-3.5" />
            </span>
            Real Product Examples
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.exampleProducts.map((p, i) => (
              <div
                key={i}
                className="glass-inset rounded-2xl p-5 transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:bg-white/80 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h5 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">
                    {p.productName}
                  </h5>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-sm shadow-emerald-500/30 shrink-0">
                    {p.rxType}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>
                    <span className="font-bold text-slate-900">Strength: </span>
                    {p.strength}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Route: </span>
                    {p.route}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Usage: </span>
                    {p.instructions}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Side Effects: </span>
                    {p.sideEffects}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Storage: </span>
                    {p.storage}
                  </p>
                  <p className="text-emerald-800 font-semibold pt-2.5 mt-2 border-t border-emerald-500/15">
                    ⚠ {p.warnings}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
