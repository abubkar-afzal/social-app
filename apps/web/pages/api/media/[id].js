import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  try {
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
            email: true,
          },
        },
      },
    });

    if (!media) return res.status(404).json({ error: 'Not found' });

    // Add counts separately to avoid Prisma _count issues
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: media.userId } }),
      prisma.follow.count({ where: { followerId: media.userId } }),
    ]);

    let liked = false;
    let favorited = false;
    let following = false;

    if (payload?.userId) {
      const [likeRow, favRow, followRow] = await Promise.all([
        prisma.like.findUnique({
          where: { userId_mediaId: { userId: payload.userId, mediaId: id } },
        }),
        prisma.favorite.findUnique({
          where: { userId_mediaId: { userId: payload.userId, mediaId: id } },
        }),
        prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: payload.userId,
              followingId: media.userId,
            },
          },
        }),
      ]);
      liked = !!likeRow;
      favorited = !!favRow;
      following = !!followRow;
    }

    return res.status(200).json({
      ...media,
      user: {
        ...media.user,
        followersCount,
        followingCount,
      },
      liked,
      favorited,
      following,
      isOwnPost: payload?.userId === media.userId,
    });
  } catch (error) {
    console.error('Error fetching media by id:', error);
    return res.status(500).json({ error: 'Failed to fetch media' });
  }
}