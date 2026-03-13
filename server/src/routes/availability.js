import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const eventTypeId = Number(req.query.eventTypeId);
  if (!eventTypeId) {
    return res.status(400).json({ message: 'eventTypeId is required.' });
  }

  const availability = await prisma.availability.findMany({
    where: { eventTypeId },
    orderBy: { dayOfWeek: 'asc' }
  });

  res.json(availability);
});

router.post('/', async (req, res) => {
  const { eventTypeId, days, startTime, endTime, timezone, intervals } = req.body;
  if (!eventTypeId) {
    return res.status(400).json({ message: 'eventTypeId is required.' });
  }

  await prisma.availability.deleteMany({ where: { eventTypeId: Number(eventTypeId) } });

  let data = [];

  if (Array.isArray(intervals) && intervals.length) {
    data = intervals.map((interval) => ({
      eventTypeId: Number(eventTypeId),
      dayOfWeek: Number(interval.dayOfWeek),
      startTime: interval.startTime,
      endTime: interval.endTime,
      timezone: interval.timezone
    }));
  } else if (Array.isArray(days) && startTime && endTime && timezone) {
    data = days.map((day) => ({
      eventTypeId: Number(eventTypeId),
      dayOfWeek: Number(day),
      startTime,
      endTime,
      timezone
    }));
  } else {
    return res.status(400).json({ message: 'Provide intervals or days with startTime, endTime, timezone.' });
  }

  const created = await prisma.availability.createMany({ data });
  res.status(201).json({ created: created.count });
});

export default router;
