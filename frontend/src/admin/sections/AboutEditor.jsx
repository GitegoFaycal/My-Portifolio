import { Plus, Trash2 } from 'lucide-react';
import { useSection, PageHeader, SaveBar, Loading, Field, StringListEditor } from '../ui';
import { newId } from '../../lib/usePortfolio';

export default function AboutEditor() {
  const { value: a, setValue, save, status, dirty } = useSection('about');
  if (!a) return <Loading status={status} />;
  const set = (patch) => setValue({ ...a, ...patch });
  const languages = a.languages || [];
  const setLang = (i, patch) => set({ languages: languages.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });

  return (
    <>
      <PageHeader title="About" description="Your summary, competencies, strengths and languages." />
      <div className="space-y-6">
        <div className="card">
          <Field label="Summary">
            <textarea className="input" rows={8} value={a.summary || ''} onChange={(e) => set({ summary: e.target.value })} />
          </Field>
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-900">Core competencies</h2>
          <StringListEditor items={a.competencies || []} onChange={(competencies) => set({ competencies })} addLabel="Add competency" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-900">Professional strengths</h2>
          <StringListEditor items={a.strengths || []} onChange={(strengths) => set({ strengths })} addLabel="Add strength" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-900">Languages</h2>
          <div className="space-y-2">
            {languages.map((l, i) => (
              <div key={l.id || i} className="flex items-center gap-2">
                <input className="input" placeholder="Language" value={l.name || ''} onChange={(e) => setLang(i, { name: e.target.value })} />
                <input className="input" placeholder="Level (e.g. Native)" value={l.level || ''} onChange={(e) => setLang(i, { level: e.target.value })} />
                <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => set({ languages: languages.filter((_, idx) => idx !== i) })} aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={() => set({ languages: [...languages, { id: newId('lang'), name: '', level: '' }] })}>
              <Plus size={14} /> Add language
            </button>
          </div>
        </div>
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />
    </>
  );
}
