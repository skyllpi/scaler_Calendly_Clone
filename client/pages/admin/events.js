import { useEffect, useState } from 'react';
import { Link as LinkIcon, Share2 } from 'lucide-react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import api from '../../lib/api';
import { useAdminCreate } from '../../context/AdminCreateContext';

const emptyForm = { name: '', duration: 30, slug: '', description: '' };

export default function EventsPage() {
  const [eventTypes, setEventTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('');
  const { openCreateModal, setOpenCreateModal } = useAdminCreate();

  const loadEventTypes = async () => {
    const res = await api.get('/event-types');
    setEventTypes(res.data);
  };

  useEffect(() => {
    loadEventTypes();
  }, []);

  useEffect(() => {
    if (openCreateModal) {
      openCreate();
      setOpenCreateModal(false);
    }
  }, [openCreateModal]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      name: event.name,
      duration: event.duration,
      slug: event.slug,
      description: event.description || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) {
      await api.put(`/event-types/${editing.id}`, form);
    } else {
      await api.post('/event-types', form);
    }
    setShowModal(false);
    await loadEventTypes();
  };

  const handleDelete = async (event) => {
    await api.delete(`/event-types/${event.id}`);
    await loadEventTypes();
  };

  const copyLink = async (slug) => {
    const link = `${window.location.origin}/book/${slug}`;
    await navigator.clipboard.writeText(link);
    setStatus('Link copied');
    setTimeout(() => setStatus(''), 2000);
  };

  const shareLink = async (slug) => {
    const link = `${window.location.origin}/book/${slug}`;
    if (navigator.share) {
      await navigator.share({ title: 'Cal_Sky Event', url: link });
    } else {
      await navigator.clipboard.writeText(link);
      setStatus('Link copied');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Event Types</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-white">Create and manage your booking types.</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-[#006bff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          Create Event Type
        </button>
      </div>

      {status && <div className="mt-4 text-sm text-slate-500 dark:text-white">{status}</div>}

      <div className="mt-8 grid gap-4">
        {eventTypes.map((event) => (
          <div key={event.id} className="relative flex items-center justify-between gap-6 card-surface px-6 py-5">
            <div className="card-accent" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{event.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-white">{event.duration} minutes</p>
              <div className="mt-3 text-xs text-slate-500 dark:text-white">/book/{event.slug}</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => copyLink(event.slug)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:border-[#1a1a1a] dark:hover:bg-[#111111]"
              >
                <LinkIcon size={14} />
                Copy link
              </button>
              <button
                onClick={() => shareLink(event.slug)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:border-[#1a1a1a] dark:hover:bg-[#111111]"
              >
                <Share2 size={14} />
                Share
              </button>
              <button
                onClick={() => openEdit(event)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:border-[#1a1a1a] dark:hover:bg-[#111111]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Event Type' : 'Create Event Type'} onClose={() => setShowModal(false)}>
          <div className="grid gap-4">
            <label className="text-sm font-medium text-slate-600 dark:text-white">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-[#1a1a1a] dark:bg-[#111111]"
                placeholder="30 Minute Meeting"
              />
            </label>
            <label className="text-sm font-medium text-slate-600 dark:text-white">
              Duration (minutes)
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-[#1a1a1a] dark:bg-[#111111]"
              />
            </label>
            <label className="text-sm font-medium text-slate-600 dark:text-white">
              URL Slug
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-[#1a1a1a] dark:bg-[#111111]"
                placeholder="30-min-meeting"
              />
            </label>
            <label className="text-sm font-medium text-slate-600 dark:text-white">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-[#1a1a1a] dark:bg-[#111111]"
                rows={3}
              />
            </label>
            <button
              onClick={handleSave}
              className="rounded-xl bg-[#006bff] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}



