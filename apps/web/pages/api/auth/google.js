import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../../../lib/prisma';
import { signToken } from '../../../lib/jwt';

const webClient = new OAuth2Client(process.env.GOOGLE_OAUTH_WEB_CLIENT_ID);
const mobileClient = new OAuth2Client(process.env.GOOGLE_OAUTH_MOBILE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idToken, clientType = 'web' } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ error: 'Missing idToken' });
  }

  try {
    const client = clientType === 'mobile' ? mobileClient : webClient;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_OAUTH_WEB_CLIENT_ID,
        process.env.GOOGLE_OAUTH_MOBILE_CLIENT_ID,
      ],
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          googleId: payload.sub,
          name: payload.name || payload.email.split('@')[0],
          avatarUrl: payload.picture || null,
        },
      });
    } else if (!user.googleId) {
      // Link existing account to Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub, avatarUrl: user.avatarUrl || payload.picture },
      });
    }

    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error('Google verify failed:', err.message);
    return res.status(401).json({ error: 'Google authentication failed' });
  }
}