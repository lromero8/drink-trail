'use server'

import { auth } from '@/auth';

/**
 * Simple utility function to get the current user ID.
 * Returns undefined if user is not authenticated.
 */
async function getCurrentUserId(): Promise<string | undefined> {
  const session = await auth();
  return session?.user?.id;
}

/**
 * Gets the user ID and throws an error if not authenticated.
 * Use this when you need to guarantee a user is logged in.
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
}
