import { CheckCircle2, Languages, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function About({ about }) {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="About me" title="Who I am" />

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="card">
            <p className="text-lg leading-relaxed text-slate-700">{about.summary}</p>

            {about.strengths?.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                  <Sparkles size={18} className="text-brand-600" /> Professional strengths
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {about.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {about.competencies?.length > 0 && (
              <div className="card">
                <h3 className="mb-4 text-base font-bold text-slate-900">Core competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {about.competencies.map((c, i) => (
                    <span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {about.languages?.length > 0 && (
              <div className="card">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                  <Languages size={18} className="text-brand-600" /> Languages
                </h3>
                <ul className="space-y-3">
                  {about.languages.map((l) => (
                    <li key={l.id || l.name} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800">{l.name}</span>
                      <span className="text-slate-500">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
