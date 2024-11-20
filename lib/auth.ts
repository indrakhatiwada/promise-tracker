import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";

// Logger function
const authLogger = (message: string, data?: any) => {
  console.log(`[Auth] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  authLogger('❌ Missing Google OAuth Credentials');
  throw new Error('Missing Google OAuth Credentials');
}

if (!process.env.NEXTAUTH_URL) {
  authLogger('❌ Missing NEXTAUTH_URL');
  throw new Error('Missing NEXTAUTH_URL');
}

authLogger('✅ Starting NextAuth configuration', {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
          prompt: "consent",
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USER'
        }
      },
      allowDangerousEmailAccountLinking: true
    }),
  ],
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      authLogger('🔑 Sign In Attempt', {
        email: profile?.email,
        provider: account?.provider,
        accountId: account?.providerAccountId,
      });

      if (account?.provider === "google") {
        const hasEmail = !!(profile?.email);
        if (hasEmail) {
          // Ensure user exists in database
          const dbUser = await prisma.user.upsert({
            where: { email: profile.email },
            update: {},
            create: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              role: 'USER'
            }
          });
          authLogger('✅ User upserted', { userId: dbUser.id });
        }
        authLogger(hasEmail ? '✅ Valid Google sign in' : '❌ Invalid Google sign in - no email', { profile });
        return hasEmail;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      authLogger('🔄 Redirect Callback', { url, baseUrl });
      
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const finalUrl = `${baseUrl}${url}`;
        authLogger('✅ Redirecting to relative URL', { finalUrl });
        return finalUrl;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        authLogger('✅ Redirecting to same-origin URL', { url });
        return url;
      }
      
      authLogger('⚠️ Redirecting to base URL - URL not allowed', { url });
      return baseUrl;
    },
    async session({ token, session }) {
      authLogger('🔵 Session Callback', { 
        sessionUser: session?.user,
        tokenData: {
          ...token,
          // Remove sensitive data from logs
          email: token.email ? '[REDACTED]' : null,
        }
      });

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        authLogger('✅ Session updated with user data');
      } else {
        authLogger('⚠️ No token or session user available');
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      authLogger('🔑 JWT Callback', {
        trigger,
        hasUser: !!user,
        tokenEmail: token.email ? '[REDACTED]' : null,
        sessionUpdate: trigger === 'update' ? session : null
      });

      if (trigger === "update" && session?.user) {
        authLogger('✅ JWT updated from session');
        return { ...token, ...session.user };
      }

      if (!token.email) {
        authLogger('⚠️ No email in token');
        return token;
      }

      if (user) {
        authLogger('✅ User data added to JWT');
        token.id = user.id;
        token.role = user.role;
        return token;
      }

      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: token.email,
          },
        });

        if (!dbUser) {
          authLogger('⚠️ No user found in database');
          return token;
        }

        authLogger('✅ User found in database', {
          userId: dbUser.id,
          role: dbUser.role
        });

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          picture: dbUser.image,
          role: dbUser.role,
        };
      } catch (error) {
        authLogger('❌ Error fetching user from database', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return token;
      }
    },
  },
  events: {
    async signIn(message) {
      authLogger('✨ User signed in', {
        userId: message.user.id,
        provider: message.account?.provider
      });
    },
    async signOut(message) {
      authLogger('👋 User signed out', {
        userId: message.token?.sub
      });
    },
    async createUser(message) {
      authLogger('👤 New user created', {
        userId: message.user.id
      });
    },
    async linkAccount(message) {
      authLogger('🔗 Account linked', {
        userId: message.user.id,
        provider: message.account.provider
      });
    },
    async session(message) {
      authLogger('📍 Session accessed', {
        userId: message.user?.id,
        sessionToken: message.session?.sessionToken ? '[PRESENT]' : '[MISSING]'
      });
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    authLogger('🔍 Getting current user', {
      hasSession: !!session,
      userEmail: session?.user?.email ? '[PRESENT]' : '[MISSING]'
    });

    if (!session?.user?.email) {
      authLogger('⚠️ No user email in session');
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      authLogger('⚠️ User not found in database');
      return null;
    }

    authLogger('✅ Current user retrieved', {
      userId: user.id,
      role: user.role
    });

    return {
      ...user,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    };
  } catch (error) {
    authLogger('❌ Error getting current user', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}
