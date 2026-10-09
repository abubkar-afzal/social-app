const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const PROTOCOL = 'armedia';
const isDev = process.env.ELECTRON_START_URL === 'http://localhost:5173';

let mainWindow;

/* -------------------------------------------------------------------------- */
/*                    REGISTER CUSTOM PROTOCOL (must be early)                 */
/* -------------------------------------------------------------------------- */

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

/* -------------------------------------------------------------------------- */
/*                           DEEP LINK HANDLING                                */
/* -------------------------------------------------------------------------- */

function extractToken(url) {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('token');
  } catch (e) {
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
  app.on('second-instance', (event, commandLine) => {
    const url = commandLine.find((arg) => arg.startsWith(`${PROTOCOL}://`));
    if (url) handleDeepLink(url);
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

/* -------------------------------------------------------------------------- */
/*                                 WINDOW                                      */
/* -------------------------------------------------------------------------- */

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

  // Decision logic:
  // 1. If packaged → always load from dist
  // 2. If dev mode explicitly requested (ELECTRON_START_URL) → load from Vite
  // 3. If dist exists → load from dist (production preview without packaging)
  // 4. Otherwise → warn and load dist path anyway (will show error page)
  if (app.isPackaged) {
    console.log('📦 Packaged mode: loading dist/index.html');
    mainWindow.loadFile(distPath);
  } else if (isDev) {
    console.log('🛠️  Dev mode: loading http://localhost:5173');
    mainWindow.loadURL('http://localhost:5173');
  } else if (hasDist) {
    console.log('📂 Production preview: loading dist/index.html');
    mainWindow.loadFile(distPath);
  } else {
    console.error('❌ Neither dev URL nor dist/index.html available.');
    console.error('   Run "npm run build" first, or start Vite and set ELECTRON_START_URL.');
    mainWindow.loadFile(distPath); // will show error page, but at least it opens
  }

  mainWindow.webContents.on('did-fail-load', (e, code, desc, url) => {
    console.error('❌ Failed to load:', url, '| Code:', code, '| Reason:', desc);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Page loaded successfully');
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

// Windows/Linux: cold-start deep link
if (process.platform !== 'darwin' && process.argv.length >= 2) {
  const url = process.argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
  if (url) {
    app.once('browser-window-created', () => {
      setTimeout(() => handleDeepLink(url), 500);
    });
  }
}