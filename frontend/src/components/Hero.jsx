import { Github, Linkedin, Mail, MapPin, FileDown, ArrowRight } from 'lucide-react';
import { assetUrl } from '../lib/api';

export default function Hero({ profile }) {
  return (
    <section id="home" className="bg-white pt-28 pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          {profile.availableForWork && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Available for new opportunities
            </span>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Hi, I&apos;m <span className="text-brand-600">{profile.name}</span>
          </h1>
          <p className="mt-4 text-lg font-semibold text-slate-700">{profile.title}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">{profile.tagline}</p>

          {profile.location && (
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} /> {profile.location}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary px-5 py-3">
              Get in touch <ArrowRight size={16} />
            </a>
            {profile.resumeUrl && (
              <a href={assetUrl(profile.resumeUrl)} target="_blank" rel="noreferrer" className="btn-secondary px-5 py-3">
                <FileDown size={16} /> Download CV
              </a>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-brand-600">
                <Github size={18} />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-brand-600">
                <Linkedin size={18} />
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} aria-label="Email" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-brand-600">
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl">
              {profile.photo ? (
                <img src={assetUrl(profile.photo)} alt={profile.name} className="aspect-[4/5] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-brand-100 text-6xl font-extrabold text-brand-600">
                  {profile.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
