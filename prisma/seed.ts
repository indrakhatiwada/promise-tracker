import { PrismaClient, Role } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'warn', 'error'],
  })
  
  try {
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: Role.ADMIN,
      },
    })

    // Create regular user
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Regular User',
        role: Role.USER,
      },
    })

    // Create some sample promises
    await prisma.promise.createMany({
      data: [
        {
          promiserName: 'Pushpa Kamal Dahal',
          description: 'Promise to build 10,000 new homes in earthquake-affected areas',
          party: 'Communist Party of Nepal (Maoist Centre)',
          articleLink: 'https://example.com/article1',
          promisedDate: new Date('2023-01-15'),
          userId: user.id,
        },
        {
          promiserName: 'Sher Bahadur Deuba',
          description: 'Promise to create 500,000 new jobs',
          party: 'Nepali Congress',
          articleLink: 'https://example.com/article2',
          promisedDate: new Date('2023-02-20'),
          userId: admin.id,
        },
      ],
    })

    console.log('Database has been seeded.')
  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
