import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  if (!payload?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        media: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true, email: true },
            },
          },
        },
      },
    });

    // Return the media objects (with the favorite timestamp)
    const media = favorites.map((f) => ({
      ...f.media,
      favoritedAt: f.createdAt,
    }));

    return res.status(200).json({ media, total: media.length });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}