import { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { api } from '../lib/api';

export default function Contact({ profile, showForm }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', error: '' });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', error: '' });
    try {
      await api.sendMessage(form);
      setStatus({ state: 'sent', error: '' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', error: err.message });
    }
  };

  const items = [
    profile.email && { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    profile.location && { icon: MapPin, label: 'Location', value: profile.location },
    profile.github && { icon: Github, label: 'GitHub', value: profile.github.replace(/^https?:\/\//, ''), href: profile.github },
    profile.linkedin && { icon: Linkedin, label: 'LinkedIn', value: profile.linkedin.replace(/^https?:\/\//, ''), href: profile.linkedin },
  ].filter(Boolean);

  return (
    <section id="contact" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Contact" title="Let's work together" description="Have a project, a teaching opportunity or a question? Send me a message." />
        <div className={`grid gap-8 ${showForm ? 'lg:grid-cols-[1fr_1.4fr]' : 'max-w-xl mx-auto'}`}>
          <div className="space-y-4">
            {items.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="rounded-xl bg-brand-600 p-3 text-white">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block truncate text-sm font-medium text-slate-800 hover:text-brand-600">
                      {value}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium text-slate-800">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showForm && (
            <form onSubmit={submit} className="card space-y-4">
              {status.state === 'sent' && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                  <CheckCircle2 size={18} /> Thanks! Your message has been sent.
                </div>
              )}
              {status.state === 'error' && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{status.error}</div>}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input id="name" name="name" className="input" value={form.name} onChange={update} required />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" className="input" value={form.email} onChange={update} required />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="subject">Subject</label>
                <input id="subject" name="subject" className="input" value={form.subject} onChange={update} />
              </div>
              <div>
                <label className="label" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} className="input" value={form.message} onChange={update} required />
              </div>
              <button type="submit" className="btn-primary w-full py-3" disabled={status.state === 'sending'}>
                <Send size={16} /> {status.state === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
