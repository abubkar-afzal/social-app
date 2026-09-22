import { prisma } from '../../../lib/prisma';
import { uploadToGoogleDrive } from '../../../lib/googleDrive';
import { verifyToken } from '../../../lib/jwt';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    const fileArray = files.file;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    try {
      // Determine user from JWT or fallback to demo user
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const jwtPayload = token ? verifyToken(token) : null;

        if (!jwtPayload?.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  const userId = jwtPayload.userId;

      const fileBuffer = fs.readFileSync(file.filepath);
      const mimeType = file.mimetype || 'application/octet-stream';
      const fileName = file.originalFilename || 'upload';

      const driveFile = await uploadToGoogleDrive(fileBuffer, fileName, mimeType, {
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID, // media folder
  skipThumbnail: !mimeType.startsWith('image/') && !mimeType.startsWith('video/'),
});

      const media = await prisma.media.create({
        data: {
          title: String(title),
          description: description ? String(description) : null,
          type: String(type).toUpperCase(),
          googleDriveFileId: driveFile.id,
          googleDriveUrl: driveFile.webViewLink || null,
          thumbnailUrl: driveFile.thumbnailLink || null,
          size: file.size || 0,
          mimeType,
          userId,
        },
      });

      // Clean up temp file
      try { fs.unlinkSync(file.filepath); } catch (e) {}

      return res.status(201).json(media);
    } catch (error) {
      console.error('Upload error:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Upload failed' });
      }
    }
  });
}