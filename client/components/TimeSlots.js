export default function TimeSlots({ slots, selectedTime, onSelect }) {
  if (!slots.length) {
    return <div className="text-sm text-slate-500">No times available.</div>;
  }

  return (
    <div className="grid gap-2">
      {slots.map((slot) => (
        <button
          key={slot.start}
          onClick={() => onSelect(slot)}
          className={
            selectedTime?.start === slot.start
              ? 'rounded-xl border border-brand-400 bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700'
              : 'rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-brand-300'
          }
        >
          {slot.label}
        </button>
      ))}
    </div>
  );
}
