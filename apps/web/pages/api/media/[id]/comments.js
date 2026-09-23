import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/jwt';

export default async function handler(req, res) {
  const { id: mediaId } = req.query;

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  // GET comments (public)
  if (req.method === 'GET') {
    const comments = await prisma.comment.findMany({
      where: { mediaId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    return res.status(200).json({ comments });
  }

  if (req.method === 'POST') {
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' });
    const { text } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });

    const comment = await prisma.comment.create({
      data: { text: text.trim(), userId: payload.userId, mediaId },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    await prisma.media.update({
      where: { id: mediaId },
      data: { commentsCount: { increment: 1 } },
    });

    return res.status(201).json(comment);
  }

  if (req.method === 'DELETE') {
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' });
    const { commentId } = req.body || {};
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.userId !== payload.userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    await prisma.$transaction([
      prisma.comment.delete({ where: { id: commentId } }),
      prisma.media.update({
        where: { id: mediaId },
        data: { commentsCount: { decrement: 1 } },
      }),
    ]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}