import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma-client";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log('JWT Callback - User:', user);
      console.log('JWT Callback - Token:', token);
      
      if (user) {
        // Get fresh user data
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });
        
        console.log('JWT Callback - DB User:', dbUser);
        
        token.id = dbUser?.id;
        token.role = dbUser?.role;
      }
      return token;
    },
    async session({ token, session }) {
      console.log('Session Callback - Token:', token);
      console.log('Session Callback - Before:', session);
      
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      
      console.log('Session Callback - After:', session);
      return session;
    },
  },
};
