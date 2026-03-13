import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import prisma from '../prisma.js';
import { buildSlots } from '../utils/slots.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const router = express.Router();

router.post('/', async (req, res) => {
  const { eventSlug, date, time, inviteeName, inviteeEmail } = req.body;

  if (!eventSlug || !date || !time || !inviteeName || !inviteeEmail) {
    return res.status(400).json({ message: 'eventSlug, date, time, inviteeName, inviteeEmail are required.' });
  }

  const eventType = await prisma.eventType.findUnique({ where: { slug: eventSlug } });
  if (!eventType) {
    return res.status(404).json({ message: 'Event type not found.' });
  }

  const availabilityBlocks = await prisma.availability.findMany({
    where: { eventTypeId: eventType.id }
  });

  if (availabilityBlocks.length === 0) {
    return res.status(400).json({ message: 'No availability configured for this event type.' });
  }

  const timezoneName = availabilityBlocks[0].timezone;
  const startOfDay = dayjs.tz(date, timezoneName).startOf('day');
  const endOfDay = dayjs.tz(date, timezoneName).endOf('day');

  const meetings = await prisma.meeting.findMany({
    where: {
      eventTypeId: eventType.id,
      status: 'SCHEDULED',
      startTime: { gte: startOfDay.toDate(), lte: endOfDay.toDate() }
    }
  });

  const dayOfWeek = dayjs.tz(date, timezoneName).day();
  const todaysBlocks = availabilityBlocks.filter((b) => b.dayOfWeek === dayOfWeek);

  const slots = buildSlots({
    date,
    availabilityBlocks: todaysBlocks,
    duration: eventType.duration,
    timezoneName,
    meetings
  });

  const selected = slots.find((slot) => slot.label === time);
  if (!selected) {
    return res.status(409).json({ message: 'Selected time is no longer available.' });
  }

  const meeting = await prisma.meeting.create({
    data: {
      eventTypeId: eventType.id,
      inviteeName,
      inviteeEmail,
      startTime: new Date(selected.start),
      endTime: new Date(selected.end),
      timezone: timezoneName
    },
    include: {
      eventType: true
    }
  });

  res.status(201).json(meeting);
});

export default router;
