import { verifyToken } from '../../../lib/jwt';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const payload = verifyToken(token);
  if (!payload?.userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, avatarUrl: true, bio: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
}