const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

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
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        accelerator: 'F1',
        click: () => win.webContents.executeJavaScript(`alert('PS Frontend');`)
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'F12',
        click: () => {
          win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools();
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

