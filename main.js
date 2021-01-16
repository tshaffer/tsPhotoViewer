console.log('hello nodeOnBsPlayground');
const electron = require('electron');
const { session } = require('electron');

// Module to control application life.
const { app } = electron;

// Module to create native browser window.
const { BrowserWindow } = electron;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow(
    {
      width: 1400,
      height: 1100,
      webPreferences: {
        // This following windows parameters should be considered before 
        // deploying this electron to production
        // see https://electronjs.org/docs/tutorial/security.
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        webSecurity: false
      }
    });

  console.log('__dirname=', __dirname);

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // session.defaultSession.loadExtension('/Users/tedshaffer/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0').then(({ id }) => {
  //   console.log('redux extension id');
  //   console.log(id);

  //   // Open the DevTools.
  //   win.webContents.openDevTools();
  // });

  // Open the DevTools.
  // win.webContents.openDevTools();


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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
