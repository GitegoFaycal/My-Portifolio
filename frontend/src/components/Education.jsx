import { GraduationCap, Award } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function Education({ education, certifications }) {
  if (!education?.length && !certifications?.length) return null;
  return (
    <section id="education" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Background" title="Education & certifications" />
        <div className="grid gap-10 lg:grid-cols-2">
          {education?.length > 0 && (
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900">
                <GraduationCap className="text-brand-600" /> Education
              </h3>
              <div className="space-y-4">
                {education.map((e) => (
                  <div key={e.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="font-bold text-slate-900">{e.degree}</p>
                    <p className="mt-1 text-sm font-medium text-brand-700">{e.institution}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {[e.start, e.end].filter(Boolean).join(' – ')}
                    </p>
                    {e.note && <p className="mt-2 text-sm text-slate-600">{e.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications?.length > 0 && (
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900">
                <Award className="text-brand-600" /> Certifications & training
              </h3>
              <div className="space-y-4">
                {certifications.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="font-bold text-slate-900">{c.title}</p>
                    <p className="mt-1 text-sm font-medium text-brand-700">{c.issuer}</p>
                    {c.description && <p className="mt-2 text-sm text-slate-600">{c.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
