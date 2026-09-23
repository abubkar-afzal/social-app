import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const page = Math.max(parseInt(req.query.page) || 0, 0);
  const limit = parseInt(req.query.limit) || 20;
  const type = req.query.type ? String(req.query.type).toUpperCase() : undefined;

  const skip = page * limit;
  const where = type ? { type } : {};

  try {
    const media = await prisma.media.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

  

    const total = await prisma.media.count({ where });
    return res.status(200).json({ media, total, page, limit });
  } catch (error) {
    console.error('Error fetching media:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}