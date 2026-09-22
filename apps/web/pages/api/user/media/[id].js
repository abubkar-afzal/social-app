import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/jwt';

export default async function handler(req, res) {
  const { id } = req.query;

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  if (!payload?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Ensure the media belongs to the user
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing || existing.userId !== payload.userId) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.media.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Delete failed' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const { title, description } = req.body || {};
    try {
      const updated = await prisma.media.update({
        where: { id },
        data: {
          title: title !== undefined ? String(title) : undefined,
          description: description !== undefined ? String(description) : undefined,
        },
      });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Update failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}