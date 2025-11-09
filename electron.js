const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { getToken, setToken } = require(path.join(__dirname, "packages/lib/keytar.ts"));

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }
  });

  win.loadURL('http://localhost:5173');
}

const template = [
  ...(process.platform === 'darwin'
    ? [
      {
        label: 'App',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }
    ]
    : []),
  {
    label: 'File',
    submenu: [
      process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(process.platform === 'darwin'
        ? [{ role: 'pasteAndMatchStyle' }]
        : []),
      { role: 'delete' },
      { role: 'selectAll' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },

  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(process.platform === 'darwin'
        ? [{ type: 'separator' }, { role: 'front' }]
        : [{ role: 'close' }])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => {
          require('electron').shell.openExternal(
            'https://www.electronjs.org'
          );
        }
      }
    ]
  }
]

app.whenReady().then(() => {
  createWindow();

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

});

ipcMain.handle("get-token", async () => {
  const token = await getToken();
  return token || null;
});

ipcMain.handle("save-token", async () => {
  await setToken();
  return true;
});
