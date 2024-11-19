# Promise Tracker

A web application for tracking and verifying political promises. Hold politicians accountable by monitoring their commitments and tracking their fulfillment status.

## Features

- 🔒 Secure authentication with NextAuth
- 👥 Role-based access control (User & Admin)
- 📝 Submit and track political promises
- ✅ Admin approval workflow
- 🔍 Search and filter promises
- 📊 Status tracking and updates
- 🌐 Social media sharing

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- Docker

## Prerequisites

- Node.js 18+
- Docker
- PostgreSQL (via Docker)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/promise-tracker.git
cd promise-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Update the `.env` file with your configuration.

4. Start the PostgreSQL database:
```bash
docker run -d --name promise-tracker-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=promise_tracker \
  -p 5432:5432 \
  postgres:15
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses the following main models:
- User: Authentication and role management
- Promise: Political promises with tracking
- Account/Session: NextAuth.js authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
