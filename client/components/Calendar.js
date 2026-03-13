import dayjs from 'dayjs';

export default function Calendar({ selectedDate, onSelect }) {
  const monthStart = dayjs(selectedDate).startOf('month');
  const monthEnd = dayjs(selectedDate).endOf('month');
  const startWeekDay = monthStart.day();
  const daysInMonth = monthEnd.date();

  const days = [];
  for (let i = 0; i < startWeekDay; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(monthStart.date(day));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600"
          onClick={() => onSelect(monthStart.subtract(1, 'month'))}
        >
          Prev
        </button>
        <div className="text-lg font-semibold text-slate-900">
          {monthStart.format('MMMM YYYY')}
        </div>
        <button
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600"
          onClick={() => onSelect(monthStart.add(1, 'month'))}
        >
          Next
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} />;
          }
          const isSelected = day.isSame(selectedDate, 'day');
          return (
            <button
              key={day.format('YYYY-MM-DD')}
              onClick={() => onSelect(day)}
              className={
                isSelected
                  ? 'calendar-day border-brand-400 bg-brand-100 text-brand-700'
                  : 'calendar-day'
              }
            >
              <div className="text-sm font-semibold">{day.date()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
