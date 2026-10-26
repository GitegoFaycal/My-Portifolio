import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Reply } from 'lucide-react';
import { api } from '../../lib/api';
import { PageHeader, Loading } from '../ui';

export default function MessagesInbox() {
  const [messages, setMessages] = useState(null);
  const [status, setStatus] = useState({ state: 'loading', message: '' });
  const [openId, setOpenId] = useState(null);

  const load = () =>
    api
      .getMessages()
      .then((m) => {
        setMessages(m);
        setStatus({ state: 'idle', message: '' });
      })
      .catch((e) => setStatus({ state: 'error', message: e.message }));

  useEffect(() => {
    load();
  }, []);

  if (!messages) return <Loading status={status} />;

  const toggle = async (m) => {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && !m.read) {
      await api.markMessage(m.id, true).catch(() => {});
      setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
    }
  };

  const markUnread = async (m) => {
    await api.markMessage(m.id, false).catch(() => {});
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, read: false } : x)));
  };

  const remove = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    await api.deleteMessage(m.id);
    setMessages((list) => list.filter((x) => x.id !== m.id));
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader title="Messages" description={`${messages.length} message${messages.length === 1 ? '' : 's'}${unread ? `, ${unread} unread` : ''} from the contact form.`} />
      {messages.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">No messages yet. Messages sent through the website contact form will appear here.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`card p-0 ${m.read ? '' : 'border-brand-300'}`}>
              <button type="button" className="flex w-full items-center gap-4 p-4 text-left" onClick={() => toggle(m)}>
                <div className={`rounded-lg p-2 ${m.read ? 'bg-slate-100 text-slate-500' : 'bg-brand-600 text-white'}`}>
                  {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate ${m.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                    {m.subject || '(No subject)'}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {m.name} · {m.email}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()}</p>
              </button>
              {openId === m.id && (
                <div className="border-t border-slate-100 p-4">
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{m.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'your message')}`} className="btn-primary px-3 py-1.5 text-xs">
                      <Reply size={14} /> Reply by email
                    </a>
                    <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => markUnread(m)}>
                      <Mail size={14} /> Mark as unread
                    </button>
                    <button className="btn-danger px-3 py-1.5 text-xs" onClick={() => remove(m)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
