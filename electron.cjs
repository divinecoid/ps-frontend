const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { getToken, saveToken, getRefreshToken, saveRefreshToken, deleteToken, deleteRefreshToken } = require(path.join(__dirname, "keytar.js"));

let win = null;
let printWin = null;

function createWindow() {
  win = new BrowserWindow({
    title: "PS Frontend",
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      autoplayPolicy: "no-user-gesture-required",
      disableBlinkFeatures: "Autofill,PasswordManager"
    }
  });
  const isDev = process.argv.includes("--dev");
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  win.on("enter-full-screen", () => {
    win.webContents.send("fullscreen-change", true);
  });

  win.on("leave-full-screen", () => {
    win.webContents.send("fullscreen-change", false);
  });
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

ipcMain.handle("save-token", async (_, token) => {
  await saveToken(token);
  return true;
});

ipcMain.handle("get-refresh-token", async () => {
  const token = await getRefreshToken();
  return token || null;
});

ipcMain.handle("save-refresh-token", async (_, refreshToken) => {
  await saveRefreshToken(refreshToken);
  return true;
});

ipcMain.handle("delete-token", async () => {
  const token = await deleteToken();
  return token || null;
});

ipcMain.handle("delete-refresh-token", async () => {
  const token = await deleteRefreshToken();
  return token || null;
});

ipcMain.handle("open-oauth", async (event, url, successUrl) => {
  const oauthWin = new BrowserWindow({
    width: 1110,
    height: 750,
    closable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  oauthWin.loadURL(url);

  oauthWin.webContents.on("did-finish-load", () => {
    const currentUrl = oauthWin.webContents.getURL();
    if (currentUrl.includes(successUrl)) {
      win.webContents.send("oauth-done");
      oauthWin.close();
    }
  });
});

function createPrintWindow() {
  if (printWin) return printWin;
  printWin = new BrowserWindow({
    show: true,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const isDev = process.argv.includes("--dev");
  if (isDev) {
    printWin.loadURL("http://localhost:5173/#/print");
  } else {
    printWin.loadFile(path.join(__dirname, "dist/index.html"), {
      hash: "/print",
    });
  }
  printWin.on("closed", () => {
    printWin = null;
  })
  return printWin;
}

ipcMain.handle("print-barcodes", async (_, options) => {
  const win = createPrintWindow();
  await new Promise(resolve => {
    ipcMain.once("print-ready", resolve);
  });
  win.webContents.send("set-print-data", options);
  return true;
});

ipcMain.on("start-print", () => {
  if (!printWin) return;

  printWin.webContents.print({
    silent: false,
    printBackground: true,
    margins: {
      marginType: "custom",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
});
