# Promise Tracker

A web application for tracking and moderating political promises using Next.js, Prisma, and Supabase.

## Features

- [x] 🔐 Authentication with NextAuth (Google OAuth)
- [x] 👥 Role-based access control (User/Admin)
- [x] 📝 Promise submission and tracking
- [x] ✅ Admin moderation workflow
- [x] 🎯 Promise status management
- [] 🌐 Real-time updates with Supabase

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)

## Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A Google Cloud Console account (for OAuth)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/promise-tracker.git
   cd promise-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > Database
   - Copy the `Connection String` (URI with password)
   - Note both the pooled and direct connection URLs

4. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the Google+ API
   - Create OAuth credentials (Web application type)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-production-url.com/api/auth/callback/google` (production)

5. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database URLs from Supabase
   DATABASE_URL="your-pooled-connection-url"
   DIRECT_URL="your-direct-connection-url"

   # Next Auth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret" # Generate using: openssl rand -base64 32

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Supabase (Optional - for real-time features)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

6. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

7. **Run the Development Server**
   ```bash
   npm run dev
   ```

8. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main models:
- `User`: User accounts and roles
- `Promise`: Political promises and their statuses
- `Account`: OAuth account connections
- `Session`: User sessions

## Admin Access

To grant admin access to a user:
1. Sign in with Google
2. Access your Supabase database
3. Update the user's role in the `User` table:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

## Promise Statuses

Promises can have the following statuses:
- `PENDING`: Newly submitted, awaiting moderation
- `APPROVED`: Verified and publicly visible
- `REJECTED`: Not approved by moderators
- `IN_PROGRESS`: Being worked on
- `FULFILLED`: Completed as promised
- `BROKEN`: Failed to fulfill

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
