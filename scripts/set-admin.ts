import { prisma } from '../lib/prisma-client';

async function setUserAsAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log('User updated:', user);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

setUserAsAdmin(email)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
