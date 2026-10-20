import React, { useState } from 'react';
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon as DownloadIcon,
} from '@heroicons/react/24/outline';
import {
  APP_DOWNLOADS,
  getDriveDownloadUrl,
} from '../../utils/appDownloads';

/**
 * Pick a real SVG icon for a given file type.
 * Falls back to ArchiveBoxIcon if nothing matches.
 */
function FileTypeIcon({ type, className = 'h-7 w-7' }) {
  const t = (type || '').toLowerCase();

  if (t === 'apk') return <DevicePhoneMobileIcon className={className} />;
  if (t === 'zip') return <ArchiveBoxIcon className={className} />;
  if (t === 'exe' || t === 'dmg' || t === 'pkg') return <ComputerDesktopIcon className={className} />;
  return <ArchiveBoxIcon className={className} />;
}

export default function AppsPage() {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = (app) => {
    setDownloadingId(app.id);
    const url = getDriveDownloadUrl(app.fileId);

    const a = document.createElement('a');
    a.href = url;
    a.download = app.filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setDownloadingId(null), 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">Download AR Media</h1>
      <p className="text-base sm:text-lg text-text-secondary mb-8">
        Get the native apps for Android and desktop. Downloads are hosted on Google Drive.
      </p>

      <div className="space-y-4">
        {APP_DOWNLOADS.map((app) => {
          const isDownloading = downloadingId === app.id;
          return (
            <div
              key={app.id}
              className="bg-surface rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* SVG icon replaces emoji */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileTypeIcon type={app.type} className="h-7 w-7" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-text truncate">{app.name}</h2>
                    <span className="text-xs bg-background text-text-secondary px-2 py-0.5 rounded-full shrink-0">
                      v{app.version}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-2">{app.description}</p>

                  <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                    <span className="bg-background px-2 py-1 rounded">{app.platform}</span>
                    <span className="bg-background px-2 py-1 rounded">{app.size}</span>
                    <span className="bg-background px-2 py-1 rounded">{app.filename}</span>
                  </div>

                  <p className="text-xs text-text-secondary mt-2">Requires: {app.requires}</p>
                </div>

                <button
                  onClick={() => handleDownload(app)}
                  disabled={isDownloading}
                  className="bg-primary text-onPrimary px-5 py-3 rounded-full font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <DownloadIcon className="h-5 w-5" />
                  <span>{isDownloading ? 'Starting...' : 'Download'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-surface rounded-2xl shadow-md p-5 text-sm text-text-secondary">
        <h2 className="font-semibold text-text mb-2">Installation notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Android APK:</strong> After downloading, enable “Install from unknown sources”
            for your browser, then tap the file to install.
          </li>
          <li>
            <strong>Desktop ZIP:</strong> Unzip to a folder and run the executable inside. On
            macOS, right-click the app → Open the first time.
          </li>
          <li>
            Large files may show a Google Drive virus-scan warning — click <em>Download anyway</em>{' '}
            to continue.
          </li>
        </ul>
      </div>
    </div>
  );
}