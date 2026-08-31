import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    if (!media) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(media);
  }

  if (req.method === 'DELETE') {
    await prisma.media.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.status(405).end();
}