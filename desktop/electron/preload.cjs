const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Listen for the OAuth token that arrives via the armedia:// deep link.
   * The handler receives just the token string.
   */
  onOAuthToken: (handler) => {
    ipcRenderer.removeAllListeners('oauth-token');
    ipcRenderer.on('oauth-token', (_event, token) => handler(token));
  },

  /**
   * Open a URL in the user's default browser.
   * The main process handles the actual shell.openExternal call.
   */
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
});