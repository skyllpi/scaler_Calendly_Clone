import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      timezone: 'Asia/Calcutta'
    }
  });

  const eventType = await prisma.eventType.upsert({
    where: { slug: '30-min-meeting' },
    update: {},
    create: {
      userId: user.id,
      name: '30 Minute Meeting',
      slug: '30-min-meeting',
      duration: 30,
      description: 'Quick sync meeting.'
    }
  });

  await prisma.availability.deleteMany({ where: { eventTypeId: eventType.id } });

  const weekdays = [1, 2, 3, 4, 5];
  await prisma.availability.createMany({
    data: weekdays.map((day) => ({
      eventTypeId: eventType.id,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'Asia/Calcutta'
    }))
  });

  const meetingStart = new Date();
  meetingStart.setDate(meetingStart.getDate() + 1);
  meetingStart.setHours(11, 0, 0, 0);

  const meetingEnd = new Date(meetingStart.getTime() + 30 * 60 * 1000);

  await prisma.meeting.create({
    data: {
      eventTypeId: eventType.id,
      inviteeName: 'Sample Invitee',
      inviteeEmail: 'invitee@example.com',
      startTime: meetingStart,
      endTime: meetingEnd,
      timezone: 'Asia/Calcutta'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
