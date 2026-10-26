import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, assetUrl } from '../lib/api';

/** Loads one portfolio section and gives you local state + a save() function. */
export function useSection(section) {
  const [value, setValue] = useState(null);
  const [saved, setSaved] = useState(null);
  const [status, setStatus] = useState({ state: 'loading', message: '' });

  useEffect(() => {
    api
      .getSection(section)
      .then((v) => {
        setValue(v);
        setSaved(JSON.stringify(v));
        setStatus({ state: 'idle', message: '' });
      })
      .catch((e) => setStatus({ state: 'error', message: e.message }));
  }, [section]);

  const dirty = value !== null && JSON.stringify(value) !== saved;

  const save = async () => {
    setStatus({ state: 'saving', message: '' });
    try {
      const result = await api.saveSection(section, value);
      setValue(result);
      setSaved(JSON.stringify(result));
      setStatus({ state: 'success', message: 'Changes saved' });
      setTimeout(() => setStatus((s) => (s.state === 'success' ? { state: 'idle', message: '' } : s)), 2500);
    } catch (e) {
      setStatus({ state: 'error', message: e.message });
    }
  };

  return { value, setValue, save, status, dirty };
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function SaveBar({ status, dirty, onSave }) {
  return (
    <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
      <div className="text-sm">
        {status.state === 'error' && (
          <span className="flex items-center gap-1 text-red-600"><AlertCircle size={16} /> {status.message}</span>
        )}
        {status.state === 'success' && (
          <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={16} /> {status.message}</span>
        )}
        {status.state !== 'error' && status.state !== 'success' && (
          <span className="text-slate-500">{dirty ? 'You have unsaved changes' : 'All changes saved'}</span>
        )}
      </div>
      <button className="btn-primary" onClick={onSave} disabled={!dirty || status.state === 'saving'}>
        <Save size={16} /> {status.state === 'saving' ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

export function Loading({ status }) {
  if (status.state === 'error') return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{status.message}</div>;
  return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** Editable list of plain strings (bullets, tags...). */
export function StringListEditor({ items = [], onChange, placeholder = 'New item', addLabel = 'Add item' }) {
  const update = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className="input" value={item} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          <ReorderButtons onUp={() => move(i, -1)} onDown={() => move(i, 1)} upDisabled={i === 0} downDisabled={i === items.length - 1} />
          <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => remove(i)} aria-label="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={() => onChange([...items, ''])}>
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

/** Comma separated tags input that stores an array. */
export function TagsInput({ value = [], onChange, placeholder }) {
  const [text, setText] = useState(value.join(', '));
  useEffect(() => setText(value.join(', ')), [value]);
  return (
    <input
      className="input"
      value={text}
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onChange(text.split(',').map((t) => t.trim()).filter(Boolean))}
    />
  );
}

export function ReorderButtons({ onUp, onDown, upDisabled, downDisabled }) {
  return (
    <div className="flex flex-col">
      <button type="button" className="rounded p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-30" onClick={onUp} disabled={upDisabled} aria-label="Move up">
        <ChevronUp size={14} />
      </button>
      <button type="button" className="rounded p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-30" onClick={onDown} disabled={downDisabled} aria-label="Move down">
        <ChevronDown size={14} />
      </button>
    </div>
  );
}

/** Card wrapper for one item in an editable list, with reorder + delete controls. */
export function ItemCard({ title, index, total, onMove, onRemove, children }) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <p className="truncate font-semibold text-slate-800">{title || <span className="text-slate-400">Untitled</span>}</p>
        <div className="flex items-center gap-1">
          <ReorderButtons onUp={() => onMove(index, -1)} onDown={() => onMove(index, 1)} upDisabled={index === 0} downDisabled={index === total - 1} />
          <button type="button" className="btn-danger px-2.5 py-1.5 text-xs" onClick={onRemove}>
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/** Helpers for list sections */
export function listHelpers(items, setItems) {
  return {
    update: (i, patch) => setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it))),
    remove: (i) => {
      if (window.confirm('Remove this item?')) setItems(items.filter((_, idx) => idx !== i));
    },
    move: (i, dir) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const next = [...items];
      [next[i], next[j]] = [next[j], next[i]];
      setItems(next);
    },
    add: (item) => setItems([...items, item]),
  };
}

/** Upload an image (or PDF) and store the returned URL. */
export function FileUpload({ value, onChange, accept = 'image/*', label = 'Upload', preview = true }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.upload(file);
      onChange(res.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-start gap-4">
      {preview && value && accept.startsWith('image') && (
        <img src={assetUrl(value)} alt="" className="h-24 w-24 rounded-xl border border-slate-200 object-cover" />
      )}
      <div className="flex-1 space-y-2">
        <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/... or https://..." />
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onFile} />
          <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={() => inputRef.current?.click()} disabled={busy}>
            <Upload size={14} /> {busy ? 'Uploading…' : label}
          </button>
          {value && (
            <button type="button" className="text-xs text-red-600 hover:underline" onClick={() => onChange('')}>
              Clear
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
