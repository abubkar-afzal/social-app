const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const PROTOCOL = 'armedia';
const isDev = process.env.ELECTRON_START_URL === 'http://localhost:5173';

let mainWindow;

/* ------------------------- Protocol registration ------------------------- */
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

/* ---------------------------- Deep link handling -------------------------- */
function extractToken(url) {
  try {
    return new URL(url).searchParams.get('token');
  } catch {
    return null;
  }
}

function handleDeepLink(url) {
  const token = extractToken(url);
  if (!token) return;
  console.log('✅ Received token via deep link');
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('oauth-token', token);
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    const url = commandLine.find((arg) => arg.startsWith(`${PROTOCOL}://`));
    if (url) handleDeepLink(url);
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

/* -------------------------------- IPC ------------------------------------- */
ipcMain.handle('open-external', async (_event, url) => {
  try {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      await shell.openExternal(url);
      return true;
    }
    return false;
  } catch (e) {
    console.error('open-external failed:', e);
    return false;
  }
});

/* ------------------------------- Window ----------------------------------- */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: !app.isPackaged,
    },
  });

  const distPath = path.join(__dirname, '../dist/index.html');
  const hasDist = fs.existsSync(distPath);

  if (app.isPackaged) {
    mainWindow.loadFile(distPath);
  } else if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else if (hasDist) {
    mainWindow.loadFile(distPath);
  } else {
    console.error('No dev URL or dist available.');
    mainWindow.loadFile(distPath);
  }

  mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('Failed to load:', url, '| Code:', code, '| Reason:', desc);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

if (process.platform !== 'darwin' && process.argv.length >= 2) {
  const url = process.argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
  if (url) {
    app.once('browser-window-created', () => {
      setTimeout(() => handleDeepLink(url), 500);
    });
  }
}