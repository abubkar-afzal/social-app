import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  if (!payload?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, avatarUrl: true, bio: true },
    });
    return res.status(200).json(user);
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const { name, bio, avatarUrl } = req.body || {};
    try {
      const updated = await prisma.user.update({
        where: { id: payload.userId },
        data: {
          name: name !== undefined ? String(name) : undefined,
          bio: bio !== undefined ? String(bio) : undefined,
          avatarUrl: avatarUrl !== undefined ? String(avatarUrl) : undefined,
        },
        select: { id: true, email: true, name: true, avatarUrl: true, bio: true },
      });
      return res.status(200).json(updated);
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ error: 'Update failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}