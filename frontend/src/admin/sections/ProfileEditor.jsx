import { useSection, PageHeader, SaveBar, Loading, Field, FileUpload } from '../ui';

export default function ProfileEditor() {
  const { value: p, setValue, save, status, dirty } = useSection('profile');
  if (!p) return <Loading status={status} />;
  const set = (patch) => setValue({ ...p, ...patch });

  return (
    <>
      <PageHeader title="Profile" description="Your name, headline, contact details and photo shown in the hero section." />
      <div className="card space-y-5">
        <Field label="Profile photo">
          <FileUpload value={p.photo} onChange={(photo) => set({ photo })} label="Upload photo" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input className="input" value={p.name || ''} onChange={(e) => set({ name: e.target.value })} />
          </Field>
          <Field label="Headline / title">
            <input className="input" value={p.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="Educator | Developer" />
          </Field>
        </div>
        <Field label="Tagline" hint="One or two sentences shown under your name.">
          <textarea className="input" rows={3} value={p.tagline || ''} onChange={(e) => set({ tagline: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location">
            <input className="input" value={p.location || ''} onChange={(e) => set({ location: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input className="input" value={p.phone || ''} onChange={(e) => set({ phone: e.target.value })} />
          </Field>
          <Field label="Email">
            <input className="input" type="email" value={p.email || ''} onChange={(e) => set({ email: e.target.value })} />
          </Field>
          <Field label="GitHub URL">
            <input className="input" value={p.github || ''} onChange={(e) => set({ github: e.target.value })} />
          </Field>
          <Field label="LinkedIn URL">
            <input className="input" value={p.linkedin || ''} onChange={(e) => set({ linkedin: e.target.value })} />
          </Field>
        </div>
        <Field label="CV / résumé (PDF)" hint="Shown as a “Download CV” button when set.">
          <FileUpload value={p.resumeUrl} onChange={(resumeUrl) => set({ resumeUrl })} accept="application/pdf" label="Upload PDF" preview={false} />
        </Field>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" checked={!!p.availableForWork} onChange={(e) => set({ availableForWork: e.target.checked })} />
          Show “Available for new opportunities” badge
        </label>
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />
    </>
  );
}
