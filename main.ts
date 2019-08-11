import { app, BrowserWindow, IpcRenderer, IpcMain, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow, serve: boolean, ipc: IpcMain;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
ipc = ipcMain;
function createWindow() {
  const size = {
    width: 1100,
    height: 750
  }; // electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 150,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true
    },
    icon: !serve ? path.join(__dirname, 'dist/favicon.png') : undefined,

    title: 'SIMK'
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:5000');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    win.removeMenu();
  }

  // const Main = Menu.buildFromTemplate([])

  // Menu.setApplicationMenu(Main)
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);
  ipc.on('message', (e: { sender: BrowserWindow }, m) => {
    e.sender.webContents.toggleDevTools();
  });
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
