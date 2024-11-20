import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET");
}

// Export the handler for Next.js API routes
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
