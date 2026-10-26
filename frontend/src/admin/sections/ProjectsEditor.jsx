import { Plus } from 'lucide-react';
import { useSection, PageHeader, SaveBar, Loading, Field, ItemCard, listHelpers, TagsInput, FileUpload } from '../ui';
import { newId } from '../../lib/usePortfolio';

export default function ProjectsEditor() {
  const { value: items, setValue, save, status, dirty } = useSection('projects');
  if (!items) return <Loading status={status} />;
  const h = listHelpers(items, setValue);

  return (
    <>
      <PageHeader title="Projects" description="Showcase the things you have built. The Projects section is hidden on the website when this list is empty.">
        <button className="btn-primary" onClick={() => setValue([{ id: newId('proj'), title: '', description: '', image: '', tech: [], liveUrl: '', repoUrl: '', featured: false }, ...items])}>
          <Plus size={16} /> Add project
        </button>
      </PageHeader>
      <div className="space-y-4">
        {items.map((p, i) => (
          <ItemCard key={p.id} title={p.title} index={i} total={items.length} onMove={h.move} onRemove={() => h.remove(i)}>
            <Field label="Cover image">
              <FileUpload value={p.image} onChange={(image) => h.update(i, { image })} label="Upload image" />
            </Field>
            <Field label="Title">
              <input className="input" value={p.title || ''} onChange={(e) => h.update(i, { title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className="input" rows={3} value={p.description || ''} onChange={(e) => h.update(i, { description: e.target.value })} />
            </Field>
            <Field label="Technologies" hint="Comma separated, e.g. React, Node.js, MySQL">
              <TagsInput value={p.tech || []} onChange={(tech) => h.update(i, { tech })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Live URL">
                <input className="input" value={p.liveUrl || ''} onChange={(e) => h.update(i, { liveUrl: e.target.value })} placeholder="https://" />
              </Field>
              <Field label="Source code URL">
                <input className="input" value={p.repoUrl || ''} onChange={(e) => h.update(i, { repoUrl: e.target.value })} placeholder="https://github.com/…" />
              </Field>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input type="checkbox" className="h-4 w-4" checked={!!p.featured} onChange={(e) => h.update(i, { featured: e.target.checked })} />
              Mark as featured
            </label>
          </ItemCard>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No projects yet. Click “Add project” to create one.</p>}
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />
    </>
  );
}
