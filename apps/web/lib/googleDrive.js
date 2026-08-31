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
 */
async function getThumbnailLink(fileId, retries = 3, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    await wait(delayMs);
    const file = await drive.files.get({
      fileId,
      fields: 'thumbnailLink',
    });
    if (file.data.thumbnailLink) {
      return file.data.thumbnailLink;
    }
  }
  return null;
}

export async function uploadToGoogleDrive(fileBuffer, fileName, mimeType) {
  try {
    const stream = Readable.from(fileBuffer);

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
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

    // Make file publicly readable (for development)
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Try to get thumbnail (may not exist for audio)
    const thumbnailLink = await getThumbnailLink(response.data.id);

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