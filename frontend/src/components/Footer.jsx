import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer({ profile, settings }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 py-10 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="text-center sm:text-left">
          <p className="font-bold text-white">{profile.name}</p>
          <p className="mt-1 text-sm">
            © {new Date().getFullYear()} · {settings?.footerText || 'All rights reserved.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white">
              <Github size={18} />
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin size={18} />
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-white">
              <Mail size={18} />
            </a>
          )}
          <Link to="/admin" className="text-xs hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
