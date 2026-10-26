import { ExternalLink, Github, FolderGit2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { assetUrl } from '../lib/api';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Portfolio" title="Projects" description="A selection of things I have built." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-video overflow-hidden bg-slate-100">
                {p.image ? (
                  <img src={assetUrl(p.image)} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-brand-300">
                    <FolderGit2 size={48} />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                  {p.featured && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Featured</span>}
                </div>
                <p className="mt-2 flex-1 text-sm text-slate-600">{p.description}</p>
                {p.tech?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t, i) => (
                      <span key={i} className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {(p.liveUrl || p.repoUrl) && (
                  <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 text-sm font-semibold">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-600 hover:underline">
                        <ExternalLink size={14} /> Live site
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-600 hover:underline">
                        <Github size={14} /> Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
