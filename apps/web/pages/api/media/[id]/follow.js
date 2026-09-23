import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/jwt';

export default async function handler(req, res) {
  const { id: targetUserId } = req.query;

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' });

  if (payload.userId === targetUserId) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: payload.userId,
          followingId: targetUserId,
        },
      },
    });

    if (req.method === 'POST') {
      if (existing) return res.status(200).json({ following: true });
      await prisma.follow.create({
        data: { followerId: payload.userId, followingId: targetUserId },
      });
      return res.status(201).json({ following: true });
    }

    if (req.method === 'DELETE') {
      if (!existing) return res.status(200).json({ following: false });
      await prisma.follow.delete({ where: { id: existing.id } });
      return res.status(200).json({ following: false });
    }
  } catch (error) {
    console.error('Follow error:', error);
    return res.status(500).json({ error: 'Follow failed' });
  }
}