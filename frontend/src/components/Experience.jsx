import { Briefcase, MapPin } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function Experience({ experience }) {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow="Experience" title="Professional experience" />
        <ol className="relative border-l-2 border-brand-200 pl-8">
          {experience.map((job) => (
            <li key={job.id} className="mb-10 last:mb-0">
              <span className="absolute -left-[13px] mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white ring-4 ring-white">
                <Briefcase size={12} />
              </span>
              <div className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{job.role}</h3>
                    <p className="font-medium text-brand-700">{job.company}</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p className="font-medium">
                      {job.start}
                      {(job.start || job.end || job.current) && ' – '}
                      {job.current ? 'Present' : job.end}
                    </p>
                    {job.location && (
                      <p className="mt-1 flex items-center justify-end gap-1">
                        <MapPin size={13} /> {job.location}
                      </p>
                    )}
                  </div>
                </div>
                {job.bullets?.length > 0 && (
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
                    {job.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
