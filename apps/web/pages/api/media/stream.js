import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  process.env.GOOGLE_DRIVE_REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing file id' });
  }

  try {
    const meta = await drive.files.get({
      fileId: id,
      fields: 'mimeType,size',
    });

    const mimeType = meta.data.mimeType || 'application/octet-stream';
    const size = meta.data.size;

    // Handle range requests for video/audio streaming
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', end - start + 1);
      res.setHeader('Content-Type', mimeType);

      const fileRes = await drive.files.get(
        { fileId: id, alt: 'media' },
        { responseType: 'stream', headers: { Range: `bytes=${start}-${end}` } }
      );

      fileRes.data.pipe(res);
    } else {
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      if (size) res.setHeader('Content-Length', size);

      const fileRes = await drive.files.get(
        { fileId: id, alt: 'media' },
        { responseType: 'stream' }
      );

      fileRes.data.pipe(res);
    }

    // Handle stream errors
    res.on('close', () => {
      // pipe closed
    });
  } catch (error) {
    console.error('Stream error:', error.message || error);
    return res.status(500).json({ error: 'Failed to stream file' });
  }
}