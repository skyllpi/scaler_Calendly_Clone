import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Calendar from '../../components/Calendar';
import TimeSlots from '../../components/TimeSlots';
import api from '../../lib/api';

export default function BookingPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [inviteeName, setInviteeName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!slug) return;
    const loadEvent = async () => {
      const res = await api.get('/event-types');
      const found = res.data.find((e) => e.slug === slug);
      setEventType(found || null);
    };
    loadEvent();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const loadSlots = async () => {
      const res = await api.get(`/slots/${slug}`, {
        params: { date: selectedDate.format('YYYY-MM-DD') }
      });
      setSlots(res.data.slots);
      setSelectedSlot(null);
    };
    loadSlots();
  }, [slug, selectedDate]);

  const bookMeeting = async () => {
    if (!selectedSlot) {
      setStatus('Please choose a time.');
      return;
    }
    setStatus('Booking...');
    try {
      const res = await api.post('/book', {
        eventSlug: slug,
        date: selectedDate.format('YYYY-MM-DD'),
        time: selectedSlot.label,
        inviteeName,
        inviteeEmail
      });
      router.push(`/confirm?meetingId=${res.data.id}`);
    } catch (err) {
      setStatus('Time just got booked. Please choose another slot.');
    }
  };

  if (!eventType) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16 dark:bg-black">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-card dark:bg-black dark:border dark:border-[#1a1a1a]">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Loading event...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 dark:bg-black">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-8 shadow-card dark:bg-black dark:border dark:border-[#1a1a1a]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="text-sm text-slate-900 dark:text-white">{eventType.name}</div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Select a time</h1>
              <div className="mt-2 text-sm text-slate-900 dark:text-white">{eventType.duration} min - {eventType.description}</div>

              <div className="mt-6">
                <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-slate-200 p-6 dark:border-[#1a1a1a]">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedDate.format('dddd, MMM D')}
                </div>
                <div className="mt-4">
                  <TimeSlots slots={slots} selectedTime={selectedSlot} onSelect={setSelectedSlot} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 p-6 dark:border-[#1a1a1a]">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Your details</div>
                <div className="mt-4 grid gap-3">
                  <input
                    value={inviteeName}
                    onChange={(e) => setInviteeName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-[#1a1a1a] dark:bg-[#111111] dark:text-white"
                    placeholder="Full name"
                  />
                  <input
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-[#1a1a1a] dark:bg-[#111111] dark:text-white"
                    placeholder="Email address"
                  />
                  <button
                    onClick={bookMeeting}
                    className="rounded-xl bg-[#006bff] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Confirm Booking
                  </button>
                  {status && <div className="text-sm text-slate-900 dark:text-white">{status}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
