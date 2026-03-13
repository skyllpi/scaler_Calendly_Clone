import express from 'express';
import prisma from '../prisma.js';
import { slugify } from '../utils/slug.js';

const router = express.Router();
const DEFAULT_USER_EMAIL = 'admin@example.com';

async function ensureDefaultUser() {
  const existing = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      name: 'Admin User',
      email: DEFAULT_USER_EMAIL,
      timezone: 'UTC'
    }
  });
}

async function uniqueSlug(base) {
  let slug = base;
  let counter = 1;
  while (await prisma.eventType.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

router.get('/', async (req, res) => {
  const user = await ensureDefaultUser();
  const eventTypes = await prisma.eventType.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(eventTypes);
});

router.post('/', async (req, res) => {
  const { name, duration, slug, description } = req.body;
  if (!name || !duration) {
    return res.status(400).json({ message: 'Name and duration are required.' });
  }
  const user = await ensureDefaultUser();
  const baseSlug = slug ? slugify(slug) : slugify(name);
  const finalSlug = await uniqueSlug(baseSlug);

  const eventType = await prisma.eventType.create({
    data: {
      userId: user.id,
      name,
      duration: Number(duration),
      slug: finalSlug,
      description: description || null
    }
  });

  res.status(201).json(eventType);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, duration, slug, description } = req.body;

  const existing = await prisma.eventType.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Event type not found.' });
  }

  let finalSlug = existing.slug;
  if (slug || name) {
    const baseSlug = slugify(slug || name || existing.name);
    if (baseSlug !== existing.slug) {
      finalSlug = await uniqueSlug(baseSlug);
    }
  }

  const updated = await prisma.eventType.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      duration: duration ? Number(duration) : existing.duration,
      slug: finalSlug,
      description: description ?? existing.description
    }
  });

  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.eventType.delete({ where: { id } });
  res.json({ message: 'Event type deleted.' });
});

export default router;
