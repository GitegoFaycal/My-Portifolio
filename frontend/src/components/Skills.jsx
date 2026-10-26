import { Code2, Layers, Database, Wrench } from 'lucide-react';
import SectionHeading from './SectionHeading';

const ICONS = [Code2, Layers, Database, Wrench];

export default function Skills({ skills }) {
  if (!skills?.length) return null;
  return (
    <section id="skills" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Skills" title="Technical & digital skills" description="Languages, frameworks and tools I work with every day." />
        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((group, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={group.id || group.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-xl bg-brand-600 p-3 text-white">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{group.category}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items?.map((item, j) => (
                    <span key={j} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
