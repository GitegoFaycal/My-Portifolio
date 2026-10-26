import { Plus } from 'lucide-react';
import { useSection, PageHeader, SaveBar, Loading, Field, ItemCard, listHelpers } from '../ui';
import { newId } from '../../lib/usePortfolio';

export default function CertificationsEditor() {
  const { value: items, setValue, save, status, dirty } = useSection('certifications');
  if (!items) return <Loading status={status} />;
  const h = listHelpers(items, setValue);

  return (
    <>
      <PageHeader title="Certifications & training" description="Certificates, courses and professional training.">
        <button className="btn-primary" onClick={() => h.add({ id: newId('cert'), title: '', issuer: '', description: '' })}>
          <Plus size={16} /> Add certification
        </button>
      </PageHeader>
      <div className="space-y-4">
        {items.map((c, i) => (
          <ItemCard key={c.id} title={c.title} index={i} total={items.length} onMove={h.move} onRemove={() => h.remove(i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input className="input" value={c.title || ''} onChange={(e) => h.update(i, { title: e.target.value })} />
              </Field>
              <Field label="Issuer">
                <input className="input" value={c.issuer || ''} onChange={(e) => h.update(i, { issuer: e.target.value })} placeholder="e.g. ALX" />
              </Field>
            </div>
            <Field label="Description">
              <textarea className="input" rows={2} value={c.description || ''} onChange={(e) => h.update(i, { description: e.target.value })} />
            </Field>
          </ItemCard>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No certifications yet.</p>}
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />
    </>
  );
}
