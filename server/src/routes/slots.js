import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import prisma from '../prisma.js';
import { buildSlots } from '../utils/slots.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const router = express.Router();

router.get('/:eventSlug', async (req, res) => {
  const { eventSlug } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'date query param is required (YYYY-MM-DD).' });
  }

  const eventType = await prisma.eventType.findUnique({ where: { slug: eventSlug } });
  if (!eventType) {
    return res.status(404).json({ message: 'Event type not found.' });
  }

  const availabilityBlocks = await prisma.availability.findMany({
    where: { eventTypeId: eventType.id }
  });

  if (availabilityBlocks.length === 0) {
    return res.json({ date, slots: [] });
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

  res.json({ date, slots });
});

export default router;
