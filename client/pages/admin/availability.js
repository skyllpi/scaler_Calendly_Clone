import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../lib/api';

const dayOptions = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const defaultIntervals = dayOptions.map((day) => ({
  dayOfWeek: day.value,
  intervals: day.value >= 1 && day.value <= 5
    ? [{ startTime: '09:00', endTime: '17:00' }]
    : []
}));

export default function AvailabilityPage() {
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [rows, setRows] = useState(defaultIntervals);
  const [timezone, setTimezone] = useState('Asia/Calcutta');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/event-types');
      setEventTypes(res.data);
      if (res.data.length) {
        setSelectedEventType(String(res.data[0].id));
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadAvailability = async () => {
      if (!selectedEventType) return;
      const res = await api.get('/availability', { params: { eventTypeId: selectedEventType } });
      if (!res.data.length) {
        setRows(defaultIntervals);
        return;
      }
      const grouped = dayOptions.map((day) => ({
        dayOfWeek: day.value,
        intervals: res.data
          .filter((item) => item.dayOfWeek === day.value)
          .map((item) => ({ startTime: item.startTime, endTime: item.endTime }))
      }));
      setRows(grouped);
      setTimezone(res.data[0].timezone);
    };
    loadAvailability();
  }, [selectedEventType]);

  const addInterval = (dayOfWeek) => {
    setRows((prev) =>
      prev.map((row) =>
        row.dayOfWeek === dayOfWeek
          ? { ...row, intervals: [...row.intervals, { startTime: '09:00', endTime: '17:00' }] }
          : row
      )
    );
  };

  const removeInterval = (dayOfWeek, index) => {
    setRows((prev) =>
      prev.map((row) =>
        row.dayOfWeek === dayOfWeek
          ? { ...row, intervals: row.intervals.filter((_, idx) => idx !== index) }
          : row
      )
    );
  };

  const updateInterval = (dayOfWeek, index, key, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.dayOfWeek === dayOfWeek
          ? {
              ...row,
              intervals: row.intervals.map((interval, idx) =>
                idx === index ? { ...interval, [key]: value } : interval
              )
            }
          : row
      )
    );
  };

  const saveAvailability = async () => {
    setStatus('Saving...');
    const intervals = rows.flatMap((row) =>
      row.intervals.map((interval) => ({
        dayOfWeek: row.dayOfWeek,
        startTime: interval.startTime,
        endTime: interval.endTime,
        timezone
      }))
    );

    await api.post('/availability', {
      eventTypeId: selectedEventType,
      intervals
    });

    setStatus('Saved');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Availability</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white">Set weekly hours with multiple intervals.</p>
      </div>

      <div className="mt-8 max-w-3xl card-surface p-6">
        <label className="text-sm font-medium text-slate-600 dark:text-white">
          Event Type
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-[#1a1a1a] dark:bg-[#111111]"
          >
            {eventTypes.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6 space-y-4">
          {rows.map((row) => {
            const dayLabel = dayOptions.find((day) => day.value === row.dayOfWeek)?.label;
            return (
              <div key={row.dayOfWeek} className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 last:border-b-0 dark:border-[#1a1a1a]">
                <div className="w-24 text-sm font-semibold text-slate-700 dark:text-white">{dayLabel}</div>
                <div className="flex-1 space-y-2">
                  {row.intervals.length === 0 && (
                    <div className="text-xs text-slate-400 dark:text-white">Unavailable</div>
                  )}
                  {row.intervals.map((interval, index) => (
                    <div key={`${row.dayOfWeek}-${index}`} className="flex items-center gap-3">
                      <input
                        type="time"
                        value={interval.startTime}
                        onChange={(e) => updateInterval(row.dayOfWeek, index, 'startTime', e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-[#1a1a1a] dark:bg-[#111111]"
                      />
                      <span className="text-xs text-slate-400 dark:text-white">to</span>
                      <input
                        type="time"
                        value={interval.endTime}
                        onChange={(e) => updateInterval(row.dayOfWeek, index, 'endTime', e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-[#1a1a1a] dark:bg-[#111111]"
                      />
                      <button
                        onClick={() => removeInterval(row.dayOfWeek, index)}
                        className="rounded-lg border border-slate-200 px-2 py-2 text-slate-500 dark:text-white hover:bg-slate-50 dark:border-[#1a1a1a] dark:hover:bg-[#111111]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addInterval(row.dayOfWeek)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:border-[#1a1a1a] dark:hover:bg-[#111111]"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            );
          })}
        </div>

        <label className="mt-6 block text-sm font-medium text-slate-600 dark:text-white">
          Timezone
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-[#1a1a1a] dark:bg-[#111111]"
            placeholder="Asia/Calcutta"
          />
        </label>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={saveAvailability}
            className="rounded-xl bg-[#006bff] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Save Availability
          </button>
          {status && <span className="text-sm text-slate-500 dark:text-white">{status}</span>}
        </div>
      </div>
    </Layout>
  );
}



