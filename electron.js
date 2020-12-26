const { app, BrowserWindow } = require('electron'); // eslint-disable-line

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
    },
    fullscreen: true,
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  win.setBackgroundColor('#000');
  win.loadURL('http://localhost:9100/');
};

app.whenReady().then(createWindow);
