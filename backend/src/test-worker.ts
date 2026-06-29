import { PrismaClient } from '@prisma/client';
import { EventBus } from './services/event-bus.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../config/env/.env') });

const prisma = new PrismaClient();

async function testWorker() {
  console.log('🧪 Simulating incoming email for worker test...');

  // 1. Fetch or create a test User
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'user@inboxos.dev',
        passwordHash: '$2b$10$dummyhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
    });
  }

  // 2. Fetch or create a test Thread
  let thread = await prisma.thread.findFirst();
  if (!thread) {
    thread = await prisma.thread.create({
      data: {
        summary: 'Test Thread',
      },
    });
  }

  // 3. Insert an unclassified email with financial invoice signals
  const email = await prisma.email.create({
    data: {
      messageId: `msg-${Date.now()}`,
      sender: 'billing@company.com',
      recipient: user.email,
      subject: 'Invoice #1024 for cloud services',
      body: 'Hi, please find attached your monthly invoice of $120.00 for active computing resources. The billing will be executed on the 5th of next month.',
      status: 'UNREAD',
      userId: user.id,
      threadId: thread.id,
    },
  });

  console.log(`📩 Created unclassified email in DB: ID = ${email.id}, Subject = "${email.subject}"`);

  // 4. Publish the event to the Redis event bus
  console.log(`📤 Publishing 'email.received' event to Redis...`);
  await EventBus.publish('email.received', { emailId: email.id });
  console.log(`✅ Event published successfully!`);

  // Disconnect Redis publisher
  await EventBus.disconnect();
}

testWorker()
  .catch((err) => {
    console.error('❌ Test simulation failed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
