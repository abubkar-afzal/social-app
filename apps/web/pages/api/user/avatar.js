import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';
import { uploadToGoogleDrive } from '../../../lib/googleDrive';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const jwtPayload = token ? verifyToken(token) : null;

  if (!jwtPayload?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    const fileArray = files.avatar;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) {
      return res.status(400).json({ error: 'No avatar file provided' });
    }

    const mimeType = file.mimetype || '';
    if (!mimeType.startsWith('image/')) {
      return res.status(400).json({ error: 'Avatar must be an image' });
    }

    try {
      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = `avatar_${jwtPayload.userId}_${Date.now()}_${file.originalFilename || 'image.jpg'}`;

      // 👇 Upload to the dedicated AVATAR folder (falls back to default if not set)
      const driveFile = await uploadToGoogleDrive(fileBuffer, fileName, mimeType, {
        folderId: process.env.GOOGLE_DRIVE_AVATAR_FOLDER_ID,
        skipThumbnail: false, // avatars are images — generate thumbnail
      });

      // Public image URL for <img src>
      const avatarUrl = `https://lh3.googleusercontent.com/d/${driveFile.id}`;


      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: jwtPayload.userId },
        data: { avatarUrl },
        select: { id: true, email: true, name: true, avatarUrl: true, bio: true },
      });

      try { fs.unlinkSync(file.filepath); } catch (e) {}

      return res.status(200).json({
        avatarUrl,
        user: updatedUser,
        driveFileId: driveFile.id,
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Avatar upload failed' });
      }
    }
  });
}