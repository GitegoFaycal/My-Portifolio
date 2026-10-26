import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, Wrench, Briefcase, GraduationCap, Award, FolderGit2, Inbox, Settings, LogOut, ExternalLink, Menu, X,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/about', label: 'About', icon: FileText },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/certifications', label: 'Certifications', icon: Award },
  { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <Icon size={17} /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-slate-900 p-4 lg:flex">
        <div className="mb-6 px-2">
          <p className="text-lg font-extrabold text-white">Portfolio</p>
          <p className="text-xs text-slate-400">Admin dashboard</p>
        </div>
        {nav}
        <div className="mt-6 border-t border-slate-800 pt-4">
          <Link to="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
            <ExternalLink size={17} /> View website
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex w-64 flex-col bg-slate-900 p-4">
            <div className="mb-6 flex items-center justify-between px-2">
              <p className="text-lg font-extrabold text-white">Portfolio</p>
              <button onClick={() => setOpen(false)} className="text-slate-300"><X size={20} /></button>
            </div>
            {nav}
            <button onClick={logout} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
              <LogOut size={17} /> Sign out
            </button>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-semibold text-slate-800">{user?.username}</span>
          </p>
          <Link to="/" target="_blank" className="btn-secondary px-3 py-1.5 text-xs">
            <ExternalLink size={14} /> View site
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
