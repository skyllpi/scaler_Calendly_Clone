import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

export function buildSlots({ date, availabilityBlocks, duration, timezoneName, meetings }) {
  const slots = [];

  availabilityBlocks.forEach((block) => {
    const start = dayjs.tz(`${date} ${block.startTime}`, 'YYYY-MM-DD HH:mm', timezoneName);
    const end = dayjs.tz(`${date} ${block.endTime}`, 'YYYY-MM-DD HH:mm', timezoneName);

    let cursor = start;
    while (cursor.add(duration, 'minute').isSameOrBefore(end)) {
      const slotStart = cursor;
      const slotEnd = cursor.add(duration, 'minute');

      const overlaps = meetings.some((m) => {
        const mStart = dayjs(m.startTime);
        const mEnd = dayjs(m.endTime);
        return slotStart.isBefore(mEnd) && slotEnd.isAfter(mStart);
      });

      if (!overlaps) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          label: slotStart.format('hh:mm A')
        });
      }

      cursor = cursor.add(duration, 'minute');
    }
  });

  return slots.sort((a, b) => new Date(a.start) - new Date(b.start));
}
