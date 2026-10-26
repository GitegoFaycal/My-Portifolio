import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { api } from '../../lib/api';
import { useSection, PageHeader, SaveBar, Loading, Field } from '../ui';

export default function SettingsEditor() {
  const { value: s, setValue, save, status, dirty } = useSection('settings');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState({ state: 'idle', message: '' });

  if (!s) return <Loading status={status} />;
  const set = (patch) => setValue({ ...s, ...patch });

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      setPwStatus({ state: 'error', message: 'New passwords do not match' });
      return;
    }
    setPwStatus({ state: 'saving', message: '' });
    try {
      await api.changePassword(pw.currentPassword, pw.newPassword);
      setPwStatus({ state: 'success', message: 'Password updated' });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="General website options and your login password." />
      <div className="card space-y-5">
        <h2 className="font-bold text-slate-900">Website</h2>
        <Field label="Site title" hint="Shown in the browser tab.">
          <input className="input" value={s.siteTitle || ''} onChange={(e) => set({ siteTitle: e.target.value })} />
        </Field>
        <Field label="Footer text">
          <input className="input" value={s.footerText || ''} onChange={(e) => set({ footerText: e.target.value })} />
        </Field>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input type="checkbox" className="h-4 w-4" checked={s.showMessagesForm !== false} onChange={(e) => set({ showMessagesForm: e.target.checked })} />
          Show the contact form on the website
        </label>
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />

      <form onSubmit={changePassword} className="card mt-8 space-y-4">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <KeyRound size={18} className="text-brand-600" /> Change password
        </h2>
        {pwStatus.state === 'error' && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{pwStatus.message}</div>}
        {pwStatus.state === 'success' && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{pwStatus.message}</div>}
        <Field label="Current password">
          <input type="password" className="input" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} autoComplete="current-password" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New password" hint="At least 8 characters.">
            <input type="password" className="input" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} autoComplete="new-password" minLength={8} required />
          </Field>
          <Field label="Confirm new password">
            <input type="password" className="input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" required />
          </Field>
        </div>
        <button type="submit" className="btn-primary" disabled={pwStatus.state === 'saving'}>
          {pwStatus.state === 'saving' ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </>
  );
}
