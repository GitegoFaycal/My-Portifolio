import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Award, FolderGit2, Inbox, Wrench, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { PageHeader } from './ui';

export default function Overview() {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.getPortfolio().then(setData).catch(() => {});
    api.getMessages().then(setMessages).catch(() => {});
  }, []);

  const unread = messages.filter((m) => !m.read).length;

  const stats = data && [
    { label: 'Skill groups', value: data.skills?.length || 0, icon: Wrench, to: '/admin/skills' },
    { label: 'Experience', value: data.experience?.length || 0, icon: Briefcase, to: '/admin/experience' },
    { label: 'Education', value: data.education?.length || 0, icon: GraduationCap, to: '/admin/education' },
    { label: 'Certifications', value: data.certifications?.length || 0, icon: Award, to: '/admin/certifications' },
    { label: 'Projects', value: data.projects?.length || 0, icon: FolderGit2, to: '/admin/projects' },
    { label: 'Unread messages', value: unread, icon: Inbox, to: '/admin/messages', highlight: unread > 0 },
  ];

  return (
    <>
      <PageHeader title={`Welcome back${data?.profile?.name ? `, ${data.profile.name.split(' ')[0]}` : ''}`} description="Pick a section from the sidebar to update your website. Changes go live as soon as you save." />
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, to, highlight }) => (
            <Link key={label} to={to} className={`card group flex items-center gap-4 transition hover:border-brand-300 ${highlight ? 'border-amber-300 bg-amber-50' : ''}`}>
              <div className={`rounded-xl p-3 text-white ${highlight ? 'bg-amber-500' : 'bg-brand-600'}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 transition group-hover:text-brand-600" />
            </Link>
          ))}
        </div>
      )}
      <div className="card mt-6">
        <h2 className="font-bold text-slate-900">Quick tips</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Each section has its own page with a <strong>Save changes</strong> button at the bottom.</li>
          <li>Use the arrows on each item to change the order it appears on the website.</li>
          <li>Upload a new profile photo or CV from the <Link to="/admin/profile" className="text-brand-600 underline">Profile</Link> page.</li>
          <li>Change your login password under <Link to="/admin/settings" className="text-brand-600 underline">Settings</Link>.</li>
        </ul>
      </div>
    </>
  );
}
