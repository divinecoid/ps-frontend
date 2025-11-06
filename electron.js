const { app, BrowserWindow, Menu } = require('electron');

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
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
        click: () => win.webContents.executeJavaScript(`alert('PS Frontend');`)
      }
    ]
  }
]

app.whenReady().then(() => {
  createWindow();

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

});

