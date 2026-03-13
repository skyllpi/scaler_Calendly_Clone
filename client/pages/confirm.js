import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import api from '../lib/api';

export default function ConfirmPage() {
  const router = useRouter();
  const { meetingId } = router.query;
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    if (!meetingId) return;
    const loadMeeting = async () => {
      const res = await api.get('/meetings');
      const found = res.data.find((m) => String(m.id) === String(meetingId));
      setMeeting(found || null);
    };
    loadMeeting();
  }, [meetingId]);

  if (!meeting) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16 dark:bg-black">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-card dark:bg-black dark:border dark:border-[#1a1a1a]">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Loading confirmation...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 dark:bg-black">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-card dark:bg-black dark:border dark:border-[#1a1a1a]">
        <div className="badge">Booking Confirmed</div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">You are scheduled!</h1>
        <div className="mt-6 space-y-2 text-slate-900 dark:text-white">
          <div className="text-sm">Event: {meeting.eventType?.name}</div>
          <div className="text-sm">Date: {dayjs(meeting.startTime).format('MMMM D, YYYY')}</div>
          <div className="text-sm">Time: {dayjs(meeting.startTime).format('hh:mm A')}</div>
          <div className="text-sm">Invitee: {meeting.inviteeName} ({meeting.inviteeEmail})</div>
        </div>
        <button
          onClick={() => router.push(`/book/${meeting.eventType?.slug}`)}
          className="mt-8 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:border-[#1a1a1a] dark:hover:bg-[#111111]"
        >
          Book another time
        </button>
      </div>
    </div>
  );
}
