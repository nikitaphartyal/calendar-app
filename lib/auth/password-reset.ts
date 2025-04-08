// lib/auth/password-reset.ts
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function createPasswordResetToken(userId: number): Promise<string> {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');

  // Calculate expiration (1 hour from now)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Store the token in the database
  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function validatePasswordResetToken(token: string) {
  // Find and validate the token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { 
      token,
      expiresAt: { gt: new Date() } 
    },
    include: { user: true }
  });

  return resetToken;
}

export async function invalidatePasswordResetToken(token: string) {
  // Remove the used token
  await prisma.passwordResetToken.deleteMany({
    where: { token }
  });
}