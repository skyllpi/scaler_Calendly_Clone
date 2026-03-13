import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import api from '../../lib/api';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);

  const loadMeetings = async () => {
    const res = await api.get('/meetings');
    setMeetings(res.data);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const cancelMeeting = async (meetingId) => {
    await api.delete(`/meetings/${meetingId}`);
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === meetingId ? { ...meeting, status: 'CANCELLED' } : meeting
      )
    );
  };

  const now = dayjs();
  const upcoming = meetings.filter((m) => dayjs(m.startTime).isAfter(now) && m.status === 'SCHEDULED');
  const past = meetings.filter((m) => dayjs(m.startTime).isBefore(now) || m.status !== 'SCHEDULED');

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Meetings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white">Track upcoming and past bookings.</p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming</h2>
        <div className="mt-4 grid gap-4">
          {upcoming.map((meeting) => (
            <div key={meeting.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-[#1a1a1a] dark:bg-black">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-900 dark:text-white">{meeting.eventType?.name}</div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">
                    {dayjs(meeting.startTime).format('MMM D, YYYY')} - {dayjs(meeting.startTime).format('hh:mm A')}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-white">Invitee: {meeting.inviteeName} ({meeting.inviteeEmail})</div>
                </div>
                <button
                  onClick={() => cancelMeeting(meeting.id)}
                  className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-500/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
          {!upcoming.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-[#1a1a1a] dark:bg-black dark:text-white">
              No upcoming meetings.
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Past & Cancelled</h2>
        <div className="mt-4 grid gap-4">
          {past.map((meeting) => (
            <div key={meeting.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#1a1a1a] dark:bg-black">
              <div className="text-sm text-slate-900 dark:text-white">{meeting.eventType?.name}</div>
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                {dayjs(meeting.startTime).format('MMM D, YYYY')} - {dayjs(meeting.startTime).format('hh:mm A')}
              </div>
              <div className="text-xs text-slate-900 dark:text-white">Status: {meeting.status}</div>
            </div>
          ))}
          {!past.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-[#1a1a1a] dark:bg-black dark:text-white">
              No past meetings.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
