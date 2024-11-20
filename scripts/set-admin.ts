import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Sets a user as an admin based on their email address.
 * 
 * @param {string} email - The email address of the user to set as admin.
 */
async function setUserAsAdmin(email: string) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Update the user's role to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN },
    });

    // Log success message
    console.log(`Successfully set user ${updatedUser.email} as admin`);
  } catch (error) {
    // Log error message
    console.error('Error setting user as admin:', error);
    process.exit(1);
  } finally {
    // Disconnect from Prisma
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

// Check if email is provided
if (!email) {
  console.error('Please provide an email address');
  console.log('Usage: npx ts-node scripts/set-admin.ts user@example.com');
  process.exit(1);
}

// Call the function to set user as admin
setUserAsAdmin(email);
