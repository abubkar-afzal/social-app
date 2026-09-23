import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/jwt';

export default async function handler(req, res) {
  const { id: mediaId } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  // Only logged-in users count as a unique view
  if (!payload?.userId) {
    return res.status(200).json({ counted: false, reason: 'Guest views not counted' });
  }

  try {
    const existing = await prisma.view.findUnique({
      where: { userId_mediaId: { userId: payload.userId, mediaId } },
    });

    if (existing) {
      return res.status(200).json({ counted: false, reason: 'Already viewed' });
    }

    await prisma.$transaction([
      prisma.view.create({ data: { userId: payload.userId, mediaId } }),
      prisma.media.update({
        where: { id: mediaId },
        data: { viewsCount: { increment: 1 } },
      }),
    ]);

    return res.status(201).json({ counted: true });
  } catch (error) {
    console.error('View error:', error);
    return res.status(500).json({ error: 'Failed to record view' });
  }
}