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
  win.loadURL('http://localhost:8080/');
};

app.whenReady().then(createWindow);
