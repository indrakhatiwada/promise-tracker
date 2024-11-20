import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Get Session Result:', session);
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  console.log('Get Current User - Session:', session);
  console.log('Get Current User - User:', session?.user);
  return session?.user ?? null;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  console.log('Is Admin Check - User:', user);
  console.log('Is Admin Check - Role:', user?.role);
  return user?.role === 'ADMIN';
}

export async function requireAdmin() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
}
