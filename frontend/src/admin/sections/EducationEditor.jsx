import { Plus } from 'lucide-react';
import { useSection, PageHeader, SaveBar, Loading, Field, ItemCard, listHelpers } from '../ui';
import { newId } from '../../lib/usePortfolio';

export default function EducationEditor() {
  const { value: items, setValue, save, status, dirty } = useSection('education');
  if (!items) return <Loading status={status} />;
  const h = listHelpers(items, setValue);

  return (
    <>
      <PageHeader title="Education" description="Degrees and programmes, newest first.">
        <button className="btn-primary" onClick={() => setValue([{ id: newId('edu'), degree: '', institution: '', start: '', end: '', note: '' }, ...items])}>
          <Plus size={16} /> Add education
        </button>
      </PageHeader>
      <div className="space-y-4">
        {items.map((e, i) => (
          <ItemCard key={e.id} title={e.degree} index={i} total={items.length} onMove={h.move} onRemove={() => h.remove(i)}>
            <Field label="Degree / programme">
              <input className="input" value={e.degree || ''} onChange={(ev) => h.update(i, { degree: ev.target.value })} />
            </Field>
            <Field label="Institution">
              <input className="input" value={e.institution || ''} onChange={(ev) => h.update(i, { institution: ev.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start">
                <input className="input" value={e.start || ''} onChange={(ev) => h.update(i, { start: ev.target.value })} placeholder="e.g. November 2025" />
              </Field>
              <Field label="End">
                <input className="input" value={e.end || ''} onChange={(ev) => h.update(i, { end: ev.target.value })} placeholder="e.g. Present / Graduated 2025" />
              </Field>
            </div>
            <Field label="Note (optional)">
              <input className="input" value={e.note || ''} onChange={(ev) => h.update(i, { note: ev.target.value })} placeholder="Honours, thesis topic…" />
            </Field>
          </ItemCard>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No education entries yet.</p>}
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />
    </>
  );
}
