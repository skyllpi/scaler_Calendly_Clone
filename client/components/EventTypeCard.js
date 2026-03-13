export default function EventTypeCard({ event, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{event.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{event.duration} minutes</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="badge">/{event.slug}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event)}
            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
