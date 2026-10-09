const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onOAuthToken: (handler) => {
    ipcRenderer.on('oauth-token', (event, token) => handler(token));
  },
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
});

// IPC handler for opening URLs in the system browser
const { ipcMain } = require('electron');
ipcMain.handle('open-external', async (event, url) => {
  const { shell } = require('electron');
  await shell.openExternal(url);
  return true;
});