import { Plus } from 'lucide-react';
import { useSection, PageHeader, SaveBar, Loading, Field, ItemCard, listHelpers, StringListEditor } from '../ui';
import { newId } from '../../lib/usePortfolio';

export default function ExperienceEditor() {
  const { value: items, setValue, save, status, dirty } = useSection('experience');
  if (!items) return <Loading status={status} />;
  const h = listHelpers(items, setValue);

  return (
    <>
      <PageHeader title="Experience" description="Your work history, newest first.">
        <button className="btn-primary" onClick={() => setValue([{ id: newId('exp'), role: '', company: '', location: '', start: '', end: '', current: false, bullets: [] }, ...items])}>
          <Plus size={16} /> Add position
        </button>
      </PageHeader>
      <div className="space-y-4">
        {items.map((job, i) => (
          <ItemCard key={job.id} title={[job.role, job.company].filter(Boolean).join(' · ')} index={i} total={items.length} onMove={h.move} onRemove={() => h.remove(i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role / job title">
                <input className="input" value={job.role || ''} onChange={(e) => h.update(i, { role: e.target.value })} />
              </Field>
              <Field label="Company / organisation">
                <input className="input" value={job.company || ''} onChange={(e) => h.update(i, { company: e.target.value })} />
              </Field>
              <Field label="Location">
                <input className="input" value={job.location || ''} onChange={(e) => h.update(i, { location: e.target.value })} />
              </Field>
              <Field label="Start">
                <input className="input" value={job.start || ''} onChange={(e) => h.update(i, { start: e.target.value })} placeholder="e.g. April 2025" />
              </Field>
              <Field label="End">
                <input className="input" value={job.end || ''} onChange={(e) => h.update(i, { end: e.target.value })} placeholder="e.g. June 2025" disabled={job.current} />
              </Field>
              <label className="flex items-center gap-3 self-end pb-2 text-sm font-medium text-slate-700">
                <input type="checkbox" className="h-4 w-4" checked={!!job.current} onChange={(e) => h.update(i, { current: e.target.checked })} />
                I currently work here
              </label>
            </div>
            <Field label="Responsibilities / achievements">
              <StringListEditor items={job.bullets || []} onChange={(bullets) => h.update(i, { bullets })} addLabel="Add bullet" />
            </Field>
          </ItemCard>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No positions yet.</p>}
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />
    </>
  );
}
