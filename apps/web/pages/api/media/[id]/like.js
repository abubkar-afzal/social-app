import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/jwt';

export default async function handler(req, res) {
  const { id: mediaId } = req.query;

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const existing = await prisma.like.findUnique({
      where: { userId_mediaId: { userId: payload.userId, mediaId } },
    });

    if (req.method === 'POST') {
      if (existing) {
        return res.status(200).json({ liked: true });
      }
      await prisma.$transaction([
        prisma.like.create({ data: { userId: payload.userId, mediaId } }),
        prisma.media.update({
          where: { id: mediaId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);
      return res.status(201).json({ liked: true });
    }

    if (req.method === 'DELETE') {
      if (!existing) {
        return res.status(200).json({ liked: false });
      }
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existing.id } }),
        prisma.media.update({
          where: { id: mediaId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      return res.status(200).json({ liked: false });
    }
  } catch (error) {
    console.error('Like error:', error);
    return res.status(500).json({ error: 'Like failed' });
  }
}