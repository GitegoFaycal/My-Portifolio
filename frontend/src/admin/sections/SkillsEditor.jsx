import { Plus } from 'lucide-react';
import { useSection, PageHeader, SaveBar, Loading, Field, ItemCard, listHelpers, TagsInput } from '../ui';
import { newId } from '../../lib/usePortfolio';

export default function SkillsEditor() {
  const { value: skills, setValue, save, status, dirty } = useSection('skills');
  if (!skills) return <Loading status={status} />;
  const h = listHelpers(skills, setValue);

  return (
    <>
      <PageHeader title="Skills" description="Group your skills by category. Separate items with commas.">
        <button className="btn-primary" onClick={() => h.add({ id: newId('skill'), category: '', items: [] })}>
          <Plus size={16} /> Add group
        </button>
      </PageHeader>
      <div className="space-y-4">
        {skills.map((g, i) => (
          <ItemCard key={g.id} title={g.category} index={i} total={skills.length} onMove={h.move} onRemove={() => h.remove(i)}>
            <Field label="Category">
              <input className="input" value={g.category || ''} onChange={(e) => h.update(i, { category: e.target.value })} placeholder="e.g. Programming" />
            </Field>
            <Field label="Skills" hint="Comma separated, e.g. Java, PHP, JavaScript">
              <TagsInput value={g.items || []} onChange={(items) => h.update(i, { items })} />
            </Field>
          </ItemCard>
        ))}
        {skills.length === 0 && <p className="text-sm text-slate-500">No skill groups yet. Click “Add group” to create one.</p>}
      </div>
      <SaveBar status={status} dirty={dirty} onSave={save} />
    </>
  );
}
