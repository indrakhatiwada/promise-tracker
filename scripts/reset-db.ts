import { prisma } from '../lib/prisma-client';

async function resetConnections() {
  try {
    // Force disconnect any existing connections
    await prisma.$disconnect();
    
    // Test connection
    await prisma.$connect();
    console.log('Successfully reconnected to database');
    
    // Run a simple query to verify
    const count = await prisma.party.count();
    console.log(`Current party count: ${count}`);
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetConnections()
  .catch((e) => {
    console.error('Error resetting connections:', e);
    process.exit(1);
  });
