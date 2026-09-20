import React from 'react';
import { BadgeCheck, Cake, Code, GraduationCap, Hash } from 'lucide-react';
import { DEVELOPER_INFO } from '../data/developerInfo';
import { Reveal } from './Reveal';

const DETAIL_ITEMS = [
  {
    icon: GraduationCap,
    label: 'Course',
    value: `${DEVELOPER_INFO.year} ${DEVELOPER_INFO.program}`
  },
  { icon: Hash, label: 'Roll No.', value: DEVELOPER_INFO.rollNo },
  { icon: Cake, label: 'Age', value: `${DEVELOPER_INFO.age} years` },
  { icon: Code, label: 'Role', value: DEVELOPER_INFO.projectRole }
];

/**
 * Glass credit card for the developer of PharmaQR. Rendered at the bottom of
 * the guide so anyone reviewing or using the app can see who built it.
 */
export const DeveloperInfoCard: React.FC = () => {
  const initials = DEVELOPER_INFO.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('');

  return (
    <Reveal>
      <section
        id="developer"
        aria-label="Developer information"
        className="glass rounded-[1.75rem] overflow-hidden scroll-mt-24"
      >
        {/* Header strip */}
        <div className="px-5 sm:px-7 py-4 border-b border-white/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-700">
              <BadgeCheck className="w-4 h-4" />
            </span>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900">
              Developer Information
            </h3>
          </div>
          <span className="px-3 py-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] shadow-md shadow-emerald-500/25">
            Pharmacy Student Project
          </span>
        </div>

        <div className="p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Name block */}
          <div className="flex items-center gap-4 lg:w-80 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/30 shrink-0 transition-transform duration-700 [transition-timing-function:var(--ease-spring)] hover:scale-105 hover:-rotate-3">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Developed by
              </p>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-tight break-words">
                {DEVELOPER_INFO.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {DEVELOPER_INFO.footerCredit}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DETAIL_ITEMS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 glass-inset rounded-2xl px-3.5 py-3 transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:bg-white/80 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-700 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {label}
                  </p>
                  <p className="text-xs font-bold text-slate-900 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="px-5 sm:px-7 pb-6 sm:pb-7">
          <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-emerald-500/60 pl-4">
            {DEVELOPER_INFO.note}
          </p>
        </div>
      </section>
    </Reveal>
  );
};

export default DeveloperInfoCard;
