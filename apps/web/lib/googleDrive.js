import { google } from 'googleapis';
import { Readable } from 'stream';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  process.env.GOOGLE_DRIVE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Simple delay helper
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the thumbnailLink for a file, retrying a few times if it's not yet available.
 * Only makes sense for image/video files — audio has no thumbnail.
 */
async function getThumbnailLink(fileId, retries = 3, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    await wait(delayMs);
    try {
      const file = await drive.files.get({
        fileId,
        fields: 'thumbnailLink',
      });
      if (file.data.thumbnailLink) {
        return file.data.thumbnailLink;
      }
    } catch (e) {
      // Ignore transient errors and retry
    }
  }
  return null;
}

/**
 * Uploads a buffer to Google Drive.
 *
 * @param {Buffer} fileBuffer     - The file's content as a Buffer
 * @param {string} fileName       - The name to assign in Drive
 * @param {string} mimeType       - The MIME type (e.g., 'image/jpeg')
 * @param {object} [options]      - Optional settings
 * @param {string} [options.folderId]   - Override the default folder (useful for avatars)
 * @param {boolean} [options.skipThumbnail] - Skip the thumbnail fetch (faster for audio)
 * @returns {Promise<{ id: string, webViewLink: string, thumbnailLink: string|null }>}
 */
export async function uploadToGoogleDrive(fileBuffer, fileName, mimeType, options = {}) {
  try {
    const stream = Readable.from(fileBuffer);

    const folderId = options.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
    const parents = folderId && folderId !== 'your-folder-id' ? [folderId] : undefined;

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType,
        parents,
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    // Make file publicly readable so <img src="..."> and <video src="..."> work
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Thumbnails are only meaningful for images and videos
    let thumbnailLink = null;
    const isMedia = mimeType.startsWith('image/') || mimeType.startsWith('video/');
    if (!options.skipThumbnail && isMedia) {
      thumbnailLink = await getThumbnailLink(response.data.id);
    }

    return {
      id: response.data.id,
      webViewLink: response.data.webViewLink,
      thumbnailLink,
    };
  } catch (error) {
    console.error('Google Drive upload failed:', error);
    throw error;
  }
}

/**
 * Returns a direct image URL that works inside <img> tags.
 * Google's thumbnail endpoint accepts a size hint and always returns an image.
 *
 * @param {string} fileId
 * @param {number} [size=400] - Square-ish size hint in pixels
 */
export function driveImageUrl(fileId, size = 400) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/**
 * Extracts a Drive file ID from any of the Google Drive URL formats.
 * Useful if you only stored the URL, not the ID.
 *
 * @param {string} url
 * @returns {string|null}
 */
export function extractDriveFileId(url) {
  if (!url) return null;
  // Matches /d/FILE_ID/... and id=FILE_ID
  const patterns = [/\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}