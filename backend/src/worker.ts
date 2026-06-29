import { EventBus } from './services/event-bus.service';
import { PrismaClient } from '@prisma/client';
import { AIService } from './services/ai.service';

const prisma = new PrismaClient();

async function main() {
  console.log('Worker starting...');

  // Subscribe to 'email.received' topic
  await EventBus.subscribe('email.received', async (payload: { emailId: string }) => {
    const { emailId } = payload;
    console.log(`[Worker] Received email.received event! emailId: ${emailId}`);

    try {
      // 1. Fetch the email from database
      const email = await prisma.email.findUnique({
        where: { id: emailId },
      });

      if (!email) {
        console.error(`[Worker] Email with ID ${emailId} not found in database.`);
        return;
      }

      console.log(`[Worker] Processing email classification for: "${email.subject}"`);

      // 2. Classify email using AIService
      const result = await AIService.classifyEmail(email.subject, email.body);
      console.log(`[Worker] Classification result for "${email.subject}": category = ${result.category}, confidence = ${result.confidence}`);

      // 3. Update the email with the category
      await prisma.email.update({
        where: { id: email.id },
        data: {
          category: result.category,
        },
      });

      console.log(`[Worker] Email updated successfully!`);

    } catch (error: any) {
      console.error(`[Worker] Classification failed for emailId ${emailId}:`, error.message || error);
      
      // Mark email status as 'FAILED'
      try {
        await prisma.email.update({
          where: { id: emailId },
          data: {
            status: 'FAILED',
          },
        });
        console.log(`[Worker] Updated email ${emailId} status to 'FAILED'.`);
      } catch (dbError) {
        console.error(`[Worker] Failed to update email ${emailId} status to 'FAILED':`, dbError);
      }
    }
  });

  console.log('Worker is listening for email.received events...');
}

main().catch((error) => {
  console.error('Worker failed to start:', error);
  process.exit(1);
});
