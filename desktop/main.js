const { app, BrowserWindow } = require('electron');

console.log("===== RUNNING MAIN.JS =====");
console.log("Electron loaded successfully!");

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('Ui.jsx');
}

// This is the line that was failing. Now 'app' is defined globally!
app.whenReady().then(createWindow);

// Optional: Quit the app when all windows are closed (standard for Windows/Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});