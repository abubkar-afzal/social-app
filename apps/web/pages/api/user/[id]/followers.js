import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/jwt';

export default async function handler(req, res) {
  const { id: userId } = req.query;

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rows = await prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        follower: {
          select: { id: true, name: true, avatarUrl: true, email: true },
        },
      },
    });

    // Determine which of these users the current user follows
    let followingIds = [];
    if (payload?.userId) {
      const follows = await prisma.follow.findMany({
        where: {
          followerId: payload.userId,
          followingId: { in: rows.map((r) => r.follower.id) },
        },
        select: { followingId: true },
      });
      followingIds = follows.map((f) => f.followingId);
    }

    const users = rows.map((r) => ({
      ...r.follower,
      isFollowedByMe: followingIds.includes(r.follower.id),
    }));

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Followers error:', error);
    return res.status(500).json({ error: 'Failed to fetch followers' });
  }
}