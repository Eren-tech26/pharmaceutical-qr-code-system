import { DosageGuideSection } from './components/DosageGuideSection';
import { DeveloperInfoCard } from './components/DeveloperInfoCard';
import { AuroraBackground } from './components/AuroraBackground';
import { Reveal } from './components/Reveal';
import { getFormFromUrl } from './utils/pharmaQrEncoder';
import { DEVELOPER_INFO } from './data/developerInfo';
import { GraduationCap, ScanLine, Sparkles, LayoutGrid, ShieldCheck } from 'lucide-react';

export function App() {
  // If the page was opened by scanning a form QR (?form=...), skip the intro banner
  // and let the guide render that form's information immediately (after the splash).
  const scannedForm = getFormFromUrl();

  const startBrowsing = () => {
    document.getElementById('dosage-search')?.focus({ preventScroll: true });
    document.getElementById('dosage-browser')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <AuroraBackground />

      {/* ---- Frosted glass header ---- */}
      <header className="sticky top-0 z-40 glass-deep border-x-0 border-t-0 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-16 sm:h-[72px]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="glass-inset p-1.5 rounded-2xl shrink-0">
                <img
                  src="/logo.svg"
                  alt="PharmaQR"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-sm shrink-0"
                />
              </div>
              <div className="min-w-0">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight block">
                  Pharma<span className="text-gradient">QR</span> Student Guide
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Pharmaceutical Dosage Forms — Scan &amp; Study
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 glass-inset rounded-full px-4 py-2 shrink-0">
              <ScanLine className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-600">
                Scan any QR to jump to its form
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ---- Body ---- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!scannedForm && (
          <Reveal className="mb-10">
            <section className="glass rounded-[2rem] p-7 sm:p-12 relative overflow-hidden">
              {/* Inner glow accents */}
              <div className="pointer-events-none absolute -top-32 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-300/45 via-teal-200/30 to-sky-200/25 blur-3xl animate-glow-pulse" />
              <div className="pointer-events-none absolute -bottom-40 -left-28 w-80 h-80 rounded-full bg-gradient-to-tr from-sky-200/40 to-violet-200/20 blur-3xl" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 glass-inset rounded-full px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Pharmaceutical Dosage Forms · Scan &amp; Study
                </span>

                <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tighter leading-[1.05] text-slate-900">
                  Every dosage form,
                  <br className="hidden sm:block" />{' '}
                  <span className="text-gradient">one scan away.</span>
                </h1>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  Browse all twelve dosage categories — or scan a product's fixed PharmaQR code to open
                  its full study guide instantly. Definitions, excipients, pharmacopeial QC tests and
                  dispensing tips, beautifully organized.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    onClick={startBrowsing}
                    className="sheen inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-500 [transition-timing-function:var(--ease-spring)] cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Start Browsing
                  </button>
                  <a
                    href="#developer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-inset text-sm font-semibold text-slate-700 hover:bg-white/70 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-500 [transition-timing-function:var(--ease-spring)] cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    About the Developer
                  </a>
                </div>

                {/* Stat chips */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  {[
                    { icon: LayoutGrid, label: '12 dosage forms', sub: 'Solid · Liquid · Semi-solid · Sterile' },
                    { icon: ScanLine, label: 'Fixed QR per form', sub: 'Scan → instant deep-link' },
                    { icon: ShieldCheck, label: 'USP / BP QC tests', sub: 'Pharmacopeial standards' }
                  ].map(({ icon: Icon, label, sub }) => (
                    <div
                      key={label}
                      className="glass-inset rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-white/70 transition-colors duration-500"
                    >
                      <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{label}</p>
                        <p className="text-[11px] text-slate-500 truncate">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        )}

        <div className="space-y-8">
          <DosageGuideSection />

          {/* Developer credit */}
          <DeveloperInfoCard />
        </div>
      </main>

      {/* ---- Footer ---- */}
      <footer className="mt-auto glass-deep border-x-0 border-b-0 py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              <span className="font-bold text-gradient">PharmaQR</span>
              <span className="text-slate-600"> · Pharmacy Student Dosage Form Guide</span>
            </span>
            <span>12 Forms · Tablets, Capsules, Syrups, Injections, Ointments, Drops &amp; more</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 pt-3 border-t border-white/60">
            <span className="font-semibold text-slate-700">Developed by {DEVELOPER_INFO.name}</span>
            <span>{DEVELOPER_INFO.footerCredit}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
