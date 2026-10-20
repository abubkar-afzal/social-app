// packages/ui/src/utils/appDownloads.js

export const APP_DOWNLOADS = [
  {
    id: 'android-apk',
    name: 'AR Media for Android',
    filename: 'ar-media.apk',
    fileId: '13NWXf7aKVfIvopJYtQ2gz3-3xXPoSwfO',
    type: 'apk',
    platform: 'Android',
    version: '1.0.0',
    size: '~95 MB',
    description: 'Install the mobile app directly on your Android device.',
    requires: 'Android 8.0 or newer',
  },
  {
    id: 'desktop-zip',
    name: 'AR Media for Desktop',
    filename: 'ar-media-desktop.zip',
    fileId: '1tcm-hOEBZWGiQi9smg0vIvMnv_Jtbr6v',
    type: 'zip',
    platform: 'Desktop',
    version: '1.0.0',
    size: '~120 MB',
    description: 'Unzip and run the desktop application on Windows, macOS, or Linux.',
    requires: 'Windows 10+, macOS 11+, or Linux',
  },
];

export function getDriveDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}