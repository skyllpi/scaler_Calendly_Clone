import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const meetings = await prisma.meeting.findMany({
    include: { eventType: true },
    orderBy: { startTime: 'desc' }
  });
  res.json(meetings);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.meeting.update({
    where: { id },
    data: { status: 'CANCELLED' }
  });
  res.json(updated);
});

export default router;
